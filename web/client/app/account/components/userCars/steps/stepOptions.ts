import {Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional} from '@angular/core';
import {Router, RouteParams, OnDeactivate} from "@angular/router-deprecated";
import {FORM_DIRECTIVES, ControlGroup, Validators, FormBuilder} from '@angular/common';
import {ShowError} from '../../../directives/showError';

import {RegExpWrapper, print, isPresent, isFunction} from '@angular/compiler/src/facade/lang';

import {UsersBackEndApi} from '../../../services/usersBackEndApi';
import {Api, AppController} from '../../../../shared/services';
import {MasterController} from '../../../services/masterController';
import {Observable} from 'rxjs';
import {Car} from '../../../../shared/models';

@Component({
    selector: 'carOptions',
    template: require("./templates/stepOptions.html"),
    directives: [FORM_DIRECTIVES, ShowError],
    styles: [require('./styles/stepInfo.css')]
})
export class StepOptionsComponent implements OnInit {

    @Output()
    next: EventEmitter<any> = new EventEmitter();
    form: ControlGroup;
    options: Array<any> = [];
    car: any = {};
    loading: boolean = false;
    submitted: boolean = false;
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private api: Api) {
        this.form = fb.group({

        });
    }

    ngOnInit() {
        this.master.error$.subscribe(value => {
            this.submitted = true;
            this.form.markAsTouched();
        });

        this.form
            .valueChanges
            .distinctUntilChanged()
            .subscribe(value => {
                this.master.options = value;
                this.master.validation['opt'] = this.form.valid;
            });
    }

    onNext() {
        this.submitted = true;
        if (this.form.valid) {
            this.next.next('prv');
        }
    }
}