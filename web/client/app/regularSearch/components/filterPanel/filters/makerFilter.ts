import {Component, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {FORM_DIRECTIVES, Control} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Api} from '../../../../shared/services/';
import {Observable, Subscription} from 'rxjs';
import {ConverterProvider, convertToView, IFilterComponent, MakerConverter}  from '../../../../shared/lib/';
import {AppController} from '../../../../shared/services/';
import {isString, isBlank} from '@angular/compiler/src/facade/lang';
@Component({
    selector: 'makerWrapper',
    template: require("./makerFilter.html"),   
    directives: [FORM_DIRECTIVES]
})

@ConverterProvider({
    bindWith: MakerConverter
})
export class makerFilterComponent implements IFilterComponent {
    @Input()
    active: boolean;
    maker;
    model;
    _filterValue: any = {}
    @Input()
    get filterValue(): any {
        return this._filterValue;
    }
    set filterValue(value) {
        Object.assign(this._filterValue, value);
    }

    @Output()
    changed: EventEmitter<any> = new EventEmitter();

    carMakers: any[];
    models: any[];
    alreadyLoaded: boolean = false;
    makerControl: Control = new Control();
    modelControl: Control = new Control();
    loading: boolean = false;
    opened: boolean = false;
    valueView: string;
    oldValue: any;
    subscription: Subscription;

    constructor(private apiService: Api, private appController: AppController) { }

    ngOnInit() {
        this.appController.init$.subscribe(value => {
            this.carMakers = value.makers;
            this._resetView();
        })
        this.makerControl
            .valueChanges
            .distinctUntilChanged()
            .do(() => { this.loading = true })
            .switchMap((value: any) => (value && value.id) ? this.apiService.getMakerModels(value.id) : Observable.of([]))
            .subscribe((models: Array<any>) => {
                this.loading = false;
                this.models = models || [];
                this.model = this.models.find((model) => model.name == this.filterValue.model) || '';
                this.filterValue = { maker: this.maker ? this.maker.name : '' }
            })

        this.modelControl
            .valueChanges
            .distinctUntilChanged()
            .subscribe(model => {
                // model may be undefined or '', the latter is correct for 'any' value
                if (model != undefined)
                    this.filterValue = { model: this.model ? this.model.name : '' }
            })
    }

    _resetView() {
        this.maker = this.carMakers.find(maker => maker.name == this.filterValue.maker) || '';
        if (this.models) {
            let model = this.models.find((model) => model.name == this.filterValue.model) || '';
            if (model) {
                this.model = model;
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @convertToView
    get viewValue() {
        return this.filterValue;
    }

    openFilter() {
        this.opened = true;
        this.oldValue = Object.assign({}, this.filterValue);
    }

    applyFilter() {
        this.changed.next({ filterValue: this.filterValue, immidiate: true });
        this.opened = false;
    }

    closeFilter() {
        this.filterValue = this.oldValue;
        this._resetView();
        this.opened = false;
    }

    resetFilter() {
        this.filterValue.model = this.filterValue.maker = null;
        this.changed.next({ filterValue: this.filterValue, immidiate: true })
    }
}