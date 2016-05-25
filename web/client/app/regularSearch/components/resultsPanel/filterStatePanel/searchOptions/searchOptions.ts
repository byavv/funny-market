import {Component, Output, Input, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {FilterController} from '../../../../services/';
import {Subscription} from "rxjs";
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import {SortPipe} from '../../../../pipes/sortType'

@Component({
    selector: 'searchOptions',
    template: require("./searchOptions.html"),
    directives: [...DROPDOWN_DIRECTIVES],
    pipes: [SortPipe],
    styles: [
        `       
        .dropdown-menu{
            min-width: 0;
            width:100%!important;
        }       
        .options > * {
             font-size: 0.9em;    
        }
        .options .dropdown-item {
            padding-left: 10px;
        }    
      
        `
    ],
    //  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchOptionsComponent {
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    @Input()
    limit: number;
    sortType: string;
    @Input()
    get sort(): string {
        var tt = this.sortType + (this.up ? '+' : '-');
        return tt;
    }
    set sort(value) {
        if (value) {
            if (value.substr(-1) == '+') {
                this.up = true;
            } else {
                this.up = false;
            }
            this.sortType = value.replace(/[+-]/, '');
        }
    }
    up: boolean;
    sortTypes: any[] = [
        'price',
        'milage',
        'year'
    ];
    limits: any[] = [
        { name: "10", value: 10 },
        { name: "20", value: 20 },
        { name: "50", value: 50 }
    ];

    constructor(private filterController: FilterController) { }


    changeSortBy() {
        this.up = !this.up;
        this.changed.next({ sort: this.sort });
    }
    changeSortType(value) {
        this.sortType = value;
        this.changed.next({ sort: this.sort });
    }

    limitChanged(value) {
        this.changed.next({ limit: value });
    }
}

/*

font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: #fff;

 */