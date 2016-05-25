import {Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional} from '@angular/core';
import {Router, RouteParams, OnDeactivate} from "@angular/router-deprecated";
import {FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder} from '@angular/common';
import {ShowError} from '../../../directives/showError';

import {RegExpWrapper, print, isPresent, isFunction} from '@angular/compiler/src/facade/lang';

import {UsersBackEndApi} from '../../../services/usersBackEndApi';
import {Api, AppController} from '../../../../shared/services';
import {ColorPickerControl} from '../../../../shared/components/controls/colorPicker/colorPicker';
import {MasterController} from '../../../services/masterController';
import {Observable} from 'rxjs';
import {Car} from '../../../../shared/models';
import {UiPane} from '../../../directives/uiTabs';
@Component({
    selector: 'carInfo',
    template: require("./templates/stepInfo.html"),
    directives: [FORM_DIRECTIVES, ShowError, ColorPickerControl],
    styles: [require('./styles/stepInfo.css')]
})
export class StepInfoComponent implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    form: ControlGroup;
    makers = [];
    models = [];
    engineTypes = [];
    colors = [];
    car: any = {};
    model: any;
    maker: any;
    modelToUpdate: string;
    loading: boolean = false;
    submitted: boolean = false;
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private api: Api,
        private appController: AppController) {
        this.form = fb.group({
            "maker": ['', Validators.required],
            "model": ['', Validators.required],
            "milage": [0, Validators.required],
            "year": [0, Validators.required],
            "color": ["", Validators.required],
            "price": [0, Validators.compose([Validators.required])],
            "description": [""]
        });
    }

    ngOnInit() {
        this.master.validation['info'] = true;
        this.master.error$.subscribe(value => {
            console.log("ERROR", value)
            this.submitted = true;
            this.form.markAsTouched();
        });

        this.form
            .find("maker")
            .valueChanges
            .filter(value => value)
            .do(() => { this.loading = true })
            .switchMap(value => !!value.id ? this.api.getMakerModels(value.id) : Observable.of([]))
            .subscribe((models: Array<any>) => {
                this.loading = false;
                this.models = models;
                if (this.modelToUpdate) {
                    this.model = models.find((model) => model.id == this.modelToUpdate);
                    this.modelToUpdate = null;
                }
            });

        this.appController
            .init$
            .do(() => { this.loading = true })           
            .subscribe((defaults) => {
                this.makers = defaults.makers || [];
                this.engineTypes = defaults.engineTypes || [];
                this.master.init$.subscribe((car: Car) => {
                    this.loading = false;
                    this.car = car;
                    if (this.car.makerId && this.car.carModelId) {
                        this.modelToUpdate = this.car.carModelId;
                        this.maker = this.makers.find((maker) => maker.id == this.car.makerId);
                    }
                })
            });

        this.form
            .valueChanges
            .distinctUntilChanged()
            .subscribe(value => {
                this.master.info = value;
                this.master.validation['info'] = this.form.valid;
            });
    }

    onSubmit(form: ControlGroup) {
        this.submitted = true;
        if (form.valid) {
            this.next.next('img');
        }
    }
}