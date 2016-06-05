import {Component, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {Api} from '../../shared/services/backEndApi';
import {Observable, Subscription, Subject} from 'rxjs';
import {AppController} from '../../shared/services/';
import {convertToRoute} from '../../shared/lib/';
import {FilterStateModel} from '../../shared/models';

@Component({
    selector: 'quickSerch',
    template: require('./quickSearchBase.html'),
    directives: [FORM_DIRECTIVES],
    styles: [require('./component.css')]
})
export class QuickSearchComponent implements OnDestroy {
    carFormModel: any = {
        maker: "",
        model: "",
        year: ""
    };

    carMakers: Array<any> = [];
    carModels: Array<any> = [];
    yearFroms: Array<number> = [];
    count$: Subject<number> = new Subject<number>();
    form: ControlGroup;
    carCount: any;
    loading: boolean = true;
    appControllerSubscr: Subscription;

    yearFrom: Control = new Control();
    priceUp: Control = new Control();
    model: Control = new Control();
    maker: Control = new Control();

    constructor(private apiService: Api, private router: Router, private appController: AppController) {
        this.form = new ControlGroup({
            maker: this.maker,
            model: this.model,
            yearFrom: this.yearFrom,
            priceUp: this.priceUp
        })
    }

    ngAfterViewInit() {
        for (let i = 1980; i <= new Date().getFullYear(); i++) {
            this.yearFroms.push(i)
        }
        this.appControllerSubscr = this.appController.init$
            .do((value) => {
                this.loading = true;
                // this.carMakers = this.appController.makers;
                this.carMakers = value.makers;
            })
            .switchMap(() => this._operateCount())
            .subscribe(this.count$);

        this.form
            .find("maker")
            .valueChanges
            .do((value) => {
                this.loading = true;
                this.carFormModel.model = '';
            })
            .switchMap((value) => {
                return Observable.zip(
                    this.apiService.getMakerModels(value.id),
                    this._operateCount(),
                    (models, count) => {
                        return { models: models, count: count }
                    });
            })
            .subscribe((val: any) => {
                this.carModels = val.models;
                this.count$.next(val.count);
            });

        this.form
            .find("model")
            .valueChanges
            .do(() => { this.loading = true; })
            .switchMap((value) => this._operateCount())
            .subscribe(this.count$, (err) => {
                console.log(err);
            });

        this.form
            .find("priceUp")
            .valueChanges
            .debounceTime(500)
            .do(() => { this.loading = true; })
            .switchMap((value) => this._operateCount())
            .subscribe(this.count$);

        this.form
            .find("yearFrom")
            .valueChanges
            .do(() => { this.loading = true; })
            .switchMap((value) => this._operateCount())
            .subscribe(this.count$);
    }
    ngOnDestroy() {
        if (this.appControllerSubscr)
            this.appControllerSubscr.unsubscribe();
    }

    _operateCount(): Observable<number> {
        var query = this.form.value;
        var searchRequest = Object.assign({}, query);
        if (!!searchRequest.maker)
            searchRequest.maker = searchRequest.maker.name;
        return this.apiService.getCarsCount(searchRequest)
            .finally(() => { this.loading = false; })
            .map((count: any) => +count.count);
    }

    submit() {
        var query = this.form.value;
        let model = new FilterStateModel();
        let searchRequest = Object.assign(model, query, { maker: query.maker.name })

        let routeParams = convertToRoute(this.appController.converters, searchRequest);
        this.router.navigate(['SearchList', routeParams]);
    }
}