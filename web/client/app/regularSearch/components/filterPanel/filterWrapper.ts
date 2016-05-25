import {Component, EventEmitter, Input, Output, DynamicComponentLoader, ViewContainerRef, OnInit} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import * as filters from './filters';
import {allFilters} from './filters';
import {FilterModel} from '../../../shared/models/filter';
import {IFilterComponent} from '../../../shared/lib/';
@Component({
    selector: 'filterWrapper',
    template: `
    <div class='wrapper'>
        <ng-content></ng-content>
    </div>`,
    styles: [`
        .wrapper{
            margin-bottom: 10px;
        }        
    `]
})
export class FilterWrapperComponent implements OnInit {
    private _filter: FilterModel
    @Input()
    get filter(): FilterModel {
        return this._filter;
    }
    set filter(filter: FilterModel) {
        this._filter = filter
        if (this._componentInstance) {
            this._componentInstance.filterValue = filter.value;
        }
    }
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    private _componentInstance: IFilterComponent;

    constructor(private dcl: DynamicComponentLoader, private viewContainerRef: ViewContainerRef) { }
    ngOnInit() {
        var filter = allFilters.find((key: any) => key.filterId === this.filter.id)
        if (filter)
            this.dcl
                .loadNextToLocation(filter, this.viewContainerRef)
                .then((component) => {
                    this._componentInstance = component.instance;
                    this._componentInstance.filterValue = this.filter.value;
                    this._componentInstance.changed.subscribe((value) => {
                        this.changed.next(value);
                    });
                });
    }
}