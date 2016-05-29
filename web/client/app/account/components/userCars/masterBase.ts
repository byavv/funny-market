import {Component, OnInit, ViewChild, QueryList} from "@angular/core";
import {RouteParams, Router, RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {STEP_COMPONENTS} from "./steps";
import {MasterController} from "../../services/masterController";
import {UsersBackEndApi} from "../../services/usersBackEndApi";
import {Api, Identity} from "../../../shared/services";
import {Car} from "../../../shared/models";
import {UiTabs, UiPane} from '../../directives/uiTabs';
import {LoaderComponent} from "../../../shared/components/loader/loader";
import {isString} from "@angular/compiler/src/facade/lang";
import {Observable} from "rxjs";
@Component({
    selector: "carEdit",
    template: `
    <div class="row">
        <div class="col-md-12 col-sm-12" style="position: relative; min-height: 500px;">           
            <loader [async]='master.init$' [active]='loading' [delay]='100' (completed)='loading=false'></loader>      
            <loader [async]='master.validate$' [active]='loading' [delay]='100' (completed)='loading=false'></loader>      
            <ui-tabs #tab>
                <template ui-pane='info' title="Info" [valid]='master.validation.info'>
                    <carInfo (next)="tab.goTo($event)"></carInfo>
                </template>
                <template  ui-pane='img' title='Images' [valid]='master.validation.img'>
                    <carImages (next)="tab.goTo($event)"></carImages>
                </template>
                <template  ui-pane='opt' title='Options'>
                    <carOptions (next)="tab.goTo($event)"></carOptions>
                </template>
                <template ui-pane='prv' title='Preview'>
                    <carPreview (next)="onDone()"></carPreview>
                </template>
            </ui-tabs>
        </div>
    </div>
    `,
    directives: [
        ROUTER_DIRECTIVES,
        ...STEP_COMPONENTS,
        UiTabs,
        UiPane,
        LoaderComponent
    ],
    styles: [require('./steps/styles/master.css'),
        `
    :host >>> .loader-container {
        position: absolute;      
        left: 15px;
        right: 15px;
        top: 0;
        width: auto;
        height:auto;
        bottom: 15px;      
        background: rgba(255, 255, 255, .5);
        z-index: 999;
    }
    `],
    viewProviders: [MasterController]
})

export class MasterBaseComponent {
    @ViewChild(UiTabs) tab: UiTabs;
    id: string;
    loading: boolean = true;
    constructor(
        private router: Router,
        private params: RouteParams,
        private master: MasterController,
        private userBackEnd: UsersBackEndApi,
        private api: Api,
        private identity: Identity) {
        // new or update
        this.id = this.params.get("id");
        if (this.id) {
            this.api.getCar(this.id).subscribe((car: Car) => {
                this.master.init$.next(car);
            });
        } else {
            this.master.init$.next(new Car());
        }
    }
    ngAfterViewInit() {
        this.tab.goTo("info");
    }
    onDone() {
        this.master
            .validate$
            .do(() => { this.loading = true; })           
            .flatMap(() => this.userBackEnd.createOrUpdate(this.master.info, this.id))
            .flatMap((result) => {
                let form = new FormData();
                this.master.images.forEach((image) => {
                    let file = new File([image.blob], image.name, { type: "image/jpeg" });
                    form.append("images", file, file.name);
                });
                if (result && result.car) {
                    return this.userBackEnd.uploadImages(form, result.car.id)
                } else {
                    return Observable.throw("car creation error");
                }
            })
            .subscribe((result) => {
                console.log(result)
                this.router.navigate(['../UserCars']);
            }, (err) => {
                if (isString(err))
                    this.tab.goTo(err);
            });
    }  
}