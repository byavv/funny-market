import {Component, OnInit} from '@angular/core';
import {Api} from '../../shared/services';
import {RouteParams, Router, OnReuse, ComponentInstruction} from '@angular/router-deprecated';
import {Subject} from "rxjs";

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
import {Responsive} from "../directives/responsive";
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
        Responsive,     
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
    width: number;
    top: number;
    loading: boolean;
   // init: boolean;
    toogled = false;
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
        this.apiService
            .searchCars(filter)
            .subscribe((result) => {
                this.totalCount = +result.count;
                this.found$.next(result.cars);
                this.totalCounter.next(this.totalCount);
            }, (err) => { console.error(err) })
    }
    doSearch(value) {
        if (value) {
            this.filterController.filterState = value;
        }
        this.router.navigate(['SearchList', this.filterController.convertToRouteParams()]);
    }
}
