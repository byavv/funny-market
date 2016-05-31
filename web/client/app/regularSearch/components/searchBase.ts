import {Component, OnInit} from '@angular/core';
import {Api} from '../../shared/services';
import {RouteParams, Router, OnReuse, ComponentInstruction} from '@angular/router-deprecated';
import {Subject, Observable} from "rxjs";

import {AppController} from "../../shared/services";
import {CarFilterPanelComponent} from './filterPanel/panelBase';
import {LoaderComponent} from "../../shared/components/loader/loader";
import {SEARCH_SERVICES_PROVIDERS, FilterController, TotalCounter} from '../services/';
import {CarsListComponent} from './resultsPanel/carList/carList';
import {PaginationComponent} from './resultsPanel/pageSelector/searchPagination';
import {StateFullComponent} from './resultsPanel/filterStatePanel/stateFull';
import {StateSummaryPanel} from './resultsPanel/filterStatePanel/stateSummary';
import {LastAddedComponent} from './lastAddedPanel/components/lastAdded';
import {ScrollSpy} from "../directives/scrollSpy";
import {ResizeSpy} from '../directives/resizeSpy';
import {StickyPanel} from "../directives/sticky";
import {SizeSpy} from "../directives/rectSpy"

@Component({
    selector: 'carSearch',
    template: require('./searchBase.html'),
    directives: [
        CarsListComponent,
        CarFilterPanelComponent,
        StateFullComponent,
        PaginationComponent,
        LoaderComponent,
        ScrollSpy,
        LastAddedComponent,
        StickyPanel,
        ResizeSpy,
        SizeSpy,
        StateSummaryPanel
    ],
    providers: [SEARCH_SERVICES_PROVIDERS],
    styles: [require('./component.scss')]
})
export class CarsSearchComponent implements OnReuse, OnInit {
    found$: Subject<Array<any>> = new Subject<Array<any>>();
    totalCount: number;
    loading: boolean;

    constructor(
        private apiService: Api,
        private router: Router,
        private params: RouteParams,
        private filterController: FilterController,
        private totalCounter: TotalCounter,
        private appController: AppController
    ) { }

    routerCanReuse() {
        return true;
    }
    routerOnReuse(instruction: ComponentInstruction) {
        this.appController.init$.subscribe(() => {
            this._search(this.filterController.updateStateFromRoute(instruction.params));
        })
    }
    ngOnInit() {
        this.appController.init$.subscribe(() => {
            this._search(this.filterController.updateStateFromRoute(this.params.params));
        })
    }
    private _search(filter) {
        this.loading = true;
        Observable.zip(
            this.apiService
                .searchCars(filter),
            this.apiService
                .getCarsCount(filter),
            (cars, count) => [cars, count])
            .subscribe((result: any) => {
                if (result) {
                    this.totalCount = +result[1].count;
                    this.totalCounter.next(this.totalCount);
                    this.found$.next(result[0]);
                }
            }, err => {
                console.log(err);
            })
    }

    doSearch(value) {
        if (value) {
            this.filterController.filterState = value;
            this.router.navigate(['SearchList', this.filterController.convertToRouteParams()]);
        }
    }
}
