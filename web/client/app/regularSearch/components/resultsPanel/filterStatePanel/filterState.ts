import { Component, OnInit, Output, TemplateRef, ChangeDetectionStrategy, 
    ChangeDetectorRef, Query, EventEmitter, Input, ElementRef, ViewChild, 
    OnChanges, AfterViewInit, Renderer, AfterViewChecked} from '@angular/core';
import {SearchOptionsComponent} from './searchOptions/searchOptions';
import {ActiveFiltersComponent} from './activeFilters/activeFilters';
//import {AnimationBuilder} from '@angular/animate';
import {FilterController} from '../../../services';
import {Subscription, Subject, Observable} from 'rxjs';
import {FilterModel, FilterStateModel} from "../../../../shared/models";
import {isString} from '@angular/compiler/src/facade/lang';
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'filterState',
    template: require('./filterState.html'),
    directives: [
        SearchOptionsComponent,
        ActiveFiltersComponent,
        CollapseDirective,
    ],
    styles: [`       
        .fs-panel-container{           
            cursor: pointer;
            font-size: 1em;
            height: auto;   
            position: relative;       
        }  
        `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterState implements OnInit {
    private _totalCount;
    private _subscription: Subscription;
    private _sort;
    sortType: string;
    sortArow: string;
   // canCollapse: boolean = true;
    closedByUser: boolean = false;

    private requireCollapse: boolean;
    private _collapsed: boolean;
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    @Output()
    searchClick: EventEmitter<any> = new EventEmitter();
    @Input()
    set totalCount(value) {
        this._totalCount = value;
        this.updateView();
    }
    get totalCount() {
        return this._totalCount;
    }
    @Input()
    state: Observable<any>;
    @Input()
    set collapsed(value) {
        this.requireCollapse = value;
        if (!this.closedByUser) {
            this._collapsed = value;
        }
    };
    get collapsed() {
        return this._collapsed;
    }
    loading: boolean = true;
    label: string = 'updating value';
    activeFilters = [];
    limit: number;
    get sort() {
        return this._sort;
    };
    set sort(value: string) {
        if (isString(value)) {
            this._sort = value;
            // milage+ --> milage ▲  ▼
            this.sortArow = value.substr(-1).replace('-', '\u25BC').replace('+', '\u25B2');
            this.sortType = value.replace(/[+-]/, ' ');
        }
    }
    page: number;
    constructor(private element: ElementRef, private cd: ChangeDetectorRef) { }
    ngOnInit() {
        this.state
            .do(() => { this.loading = true; })
            .subscribe((values: Array<any>) => {
                this.loading = false;
                var [searchFilters, searchOptions] = values;
                this.activeFilters = searchFilters.filter(filterItem => filterItem.active);
                if (!this.collapsed || this.sort !== searchOptions.sort || this.page !== +searchOptions.page || this.limit !== +searchOptions.limit) {
                    this.limit = +searchOptions.limit;
                    this.sort = searchOptions.sort;
                    this.page = +searchOptions.page;
                    this.updateView();
                }
            })
    }

    updateView() {
        var start = (this.page - 1) * this.limit;
        var stop = start + this.limit;
        if (this.totalCount) {
            stop = stop > this.totalCount ? this.totalCount : stop;
            this.label = `${start + 1}..${stop} of ${this.totalCount}`
        } else {
            this.label = '0';
        }
        this.cd.markForCheck();
    }

    onChanged(value) {
        this.changed.next(value);
    }

    setCollapsedStateAndHold() {
        this.closedByUser = !this.closedByUser;
        this._collapsed = !this._collapsed;
    }
    showSearchPanel() { }
}