import {Component, OnInit, OnDestroy, Output, Input, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {FilterController} from '../../../../services';
import {FilterModel, FilterStateModel} from "../../../../../shared/models";
import {AppController} from "../../../../../shared/services";
import {ConverterBase} from "../../../../../shared/lib/converters/ConverterBase";
import {Subscription} from "rxjs";
@Component({
    selector: 'activeFilters',
    template: require("./activeFilters.html"),
    directives: [],
    styles: [require('./component.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveFiltersComponent {
    private _appliedFilters: Array<any> = [];
    private _converters: Array<ConverterBase> = [];
    private _subscription: Subscription;
    @Output()
    reset: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    set filters(array: Array<any>) {
        this._appliedFilters = array.map(filter => {
            var converter = this._converters
                .find((converter) => converter.converterId == filter.id);
            return {
                id: filter.id,
                viewValue: converter ? converter.convertToView(filter.value) : "Converter not found"
            }
        })
    }
    get filters() {
        return this._appliedFilters;
    }

    constructor(private appController: AppController) {
        this._converters = appController.converters;
    }

    resetFilter(filterId) {
        var converter = this._converters.find((converter) => converter.converterId === filterId)
        this.reset.next(converter.resetValue());
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}