import {Component, Input, Output, EventEmitter} from '@angular/core'

export interface IPage {
    label: string;
    value: any;
}

@Component({
    selector: 'tempPagination',
    template: `
    <div class='my-card'>
        <nav class='text-xs-center'>           
            <ul class="pagination pagination-sm">
                <li class="page-item" [class.disabled]="isFirstPage()" >
                    <a class="page-link" href="" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span [class.disabled]="isFirstPage()" class="sr-only" (click)="setPage(currentPage - 1 )"></span>                
                    </a>                      
                </li>
                <li class="page-item" [class.active]="currentPage === page.value" *ngFor="let page of shownPages">
                    <a class="page-link" href='' (click)="setPage(page.value)">                
                        {{ page.label }}    
                    </a>
                </li>
                <li class="page-item" [class.disabled]="isLastPage()" >
                    <a href='' class='page-link' (click)="setPage(currentPage+1)" [class.disabled]="isLastPage()">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>              
                    </a>            
                </li>
            </ul>        
        </nav>
    </div>
    `,
    directives: [],
    styles: [`
        .pagination{
            margin: 0;
        }
    `],
    host: {
        '[style.display]': 'isVisible()'
    }
})
export class PaginationControlsCmp {
    private _currentPage: number = 1;
    private _totalItems;
    private _currentMin;
    private _currentMax;
    private _itemsPerPage;
    public shownPages: IPage[] = [];
    public allPages: IPage[] = [];

    @Input() maxSize: number = 6;
    @Input()
    set totalItems(value) {
        this._totalItems = value;
        this._createPageArray();
    };
    get totalItems() {
        return this._totalItems;
    };
    @Input()
    set itemsPerPage(value) {
        this._itemsPerPage = +value;
        this._createPageArray();

    };
    get itemsPerPage() {
        return this._itemsPerPage;
    };
    @Input()
    set currentPage(value) {
        this._currentPage = value;
        this._createPageArray();
    };
    get currentPage() {
        return this._currentPage;
    };
    @Output() pageChange: EventEmitter<any> = new EventEmitter();
    constructor() {
        this._currentMax = this.maxSize;
        this._currentMin = 1;
    }
    isFirstPage(): boolean {
        return this.currentPage === 1;
    }
    isLastPage(): boolean {
        return Math.ceil(this.totalItems / this.itemsPerPage) === this.currentPage;
    }
    isVisible() {
        return this.allPages.length > 1 ? "block" : "none"
    }
    setPage(value) {
        if (this.currentPage != value) {
            this.currentPage = value;
            this.pageChange.next(value);
        }
    }
    _createPageArray() {
        this.allPages = [];
        if (!!this.totalItems && !!this.itemsPerPage) {
            let totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                this.allPages.push({
                    label: i + "",
                    value: i
                });
            }        
            if (this.currentPage > totalPages) {
                this._currentMax = totalPages;
                this._currentMin = this._currentMax - this.maxSize + 1;
                return this.setPage(totalPages);
            }        
            if (this.currentPage > this._currentMax || this.currentPage < this._currentMin) {
                this._currentMin = this.currentPage - Math.ceil(this.maxSize / 2);
                this._currentMax = this.currentPage + Math.floor(this.maxSize / 2);
                if (this._currentMax > this.allPages.length) {
                    this._currentMax = this.allPages.length;
                    this._currentMin = this._currentMax - this.maxSize;
                }
                if (this._currentMin < 1) {
                    this._currentMin = 1;
                    this._currentMax = this.maxSize;
                }
            }
            // click on the right boundary - move window to the right        
            if (this.currentPage == this._currentMax) {
                this._currentMin += Math.ceil(this.maxSize / 2);
                this._currentMax += Math.ceil(this.maxSize / 2);
                if (this._currentMax > this.allPages.length) {
                    this._currentMax = this.allPages.length;
                    this._currentMin = this._currentMax - this.maxSize + 1;
                }
            }
            // click on the left boundary - move window to the left
            if (this.currentPage == this._currentMin) {
                this._currentMin -= Math.ceil(this.maxSize / 2);
                this._currentMax -= Math.ceil(this.maxSize / 2);
                if (this._currentMin < 1) {
                    this._currentMin = 1;
                    this._currentMax = this.maxSize;
                }
            }
            this.shownPages = this.allPages.slice(this._currentMin - 1, this._currentMax);
        }
    }
}