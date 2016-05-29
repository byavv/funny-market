import {Component, OnInit, EventEmitter, Output, ViewQuery, ComponentRef, OnDestroy, QueryList, ChangeDetectorRef} from '@angular/core';
import {FilterController} from '../../services/filterController';
import {FilterWrapperComponent} from './filterWrapper'
import * as filters from './filters';
import {TotalCounter} from '../../services/totalCounter';
import {FilterModel, FilterStateModel} from "../../../shared/models";
import {LoaderComponent} from "../../../shared/components/loader/loader";
import {Subscription} from "rxjs";

@Component({
    selector: 'carFilterPanel',
    template: require("./panelBase.html"),
    directives: [FilterWrapperComponent, LoaderComponent],
    styles: [`
        .sch-button{
            width: 100%;
            color: #fff;
            outline: none;
            background-color: #337ab7;
            border-color: #006DCC #005CAB #00559E;;
            -webkit-box-shadow: 0 1px .5px 0 rgba(0,0,0,.25);
            box-shadow: 0 1px .5px 0 rgba(0,0,0,.25);
        }
        .link{
            color: #337ab7;
            text-decoration: underline;
            cursor: pointer;
            font-size:16px;
        }
       :host >>> .form-control{
           margin:3px 0;
       }    
       .opened{
           display: block!important;
       } 
    `]
})
export class CarFilterPanelComponent implements OnInit, OnDestroy {
    filters: Array<FilterModel> = [];
    alreadyLoaded: boolean = false;
    count: number;
    pendingFilterState: any = {};
    private _counterSubscr: Subscription;
    private _filterSrvSubscr: Subscription;
    opened = false; // when resize window panel should be closed by default

    @Output()
    changed: EventEmitter<any> = new EventEmitter();

    constructor(private filterController: FilterController,
        private counter: TotalCounter,
        @ViewQuery("wrapper") private wrappers: QueryList<FilterWrapperComponent>) { }

    ngOnInit() {
        this._counterSubscr = this.counter.subscribe((count: any) => {
            this.count = count;
        })
        this._filterSrvSubscr = this.filterController
            .updateFilterPanel$
            .subscribe((filters) => {
                if (!this.alreadyLoaded) {
                    this.filters = filters;
                    this.alreadyLoaded = true;
                }
            });
    }
    ngOnDestroy() {
        if (this._filterSrvSubscr)
            this._filterSrvSubscr.unsubscribe();
        if (this._counterSubscr)
            this._counterSubscr.unsubscribe();
    }

    onFilterValueChanged(newValue) {
        if (newValue.immidiate) {
            this.filterController.filterState = newValue.filterValue;
            this._doSerch();
        } else {
            this.pendingFilterState = Object.assign(this.pendingFilterState, newValue.filterValue);
        }
        this.counter.getCount(Object.assign(this.filterController.filterState, this.pendingFilterState))
    }

    _doSerch() {
        this.changed.next(this.pendingFilterState);
        this.pendingFilterState = {};
    }

    detailedSearch() {
        console.warn("This feature has not been implemented yet");
    }
    closePanel() {
        this.opened = false;
    }
    openPanel() {
        this.opened = true;
    }
}
