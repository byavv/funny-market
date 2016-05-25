import {Component, Input, Output, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FilterController} from '../../../services/filterController';
//import {PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {PaginationControlsCmp} from './_tempPaginationControl'
import {Subscription} from "rxjs";

@Component({
    selector: 'searchPage',
    template: `    
         
                <!--<pagination  
                    [ngModel]= "currentPage"               
                    [itemsPerPage]="limit"
                    [totalItems]="totalPages"
                    [maxSize]="limit"
                    (pageChanged)="pageChanged($event.page)">
                </pagination>  -->
                
               <tempPagination 
                    [currentPage]="currentPage"
                    [itemsPerPage]="limit"
                    [totalItems]="totalPages"                    
                    (pageChange)="pageChanged($event)">
                </tempPagination> 
                
         
    `,
    directives: [/*PAGINATION_DIRECTIVES*/PaginationControlsCmp] //<!---- https://github.com/valor-software/ng2-bootstrap/issues/61
})
export class PaginationComponent implements OnInit, OnDestroy {
    private _subscription: Subscription;
    public limit: number;
    public currentPage: number;
    @Input()
    totalPages: number;
    @Output()
    changed: EventEmitter<any> = new EventEmitter();

    constructor(private filterController: FilterController) { }

    ngOnInit() {
        this._subscription = this.filterController
            .updateFilterState$
            .subscribe((state) => {
                this.currentPage = state.page;
                this.limit = state.limit;
            })
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    pageChanged(page) {
        this.changed.next({ page: page });
    }
}