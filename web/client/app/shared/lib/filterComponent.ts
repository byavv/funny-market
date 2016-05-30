import {EventEmitter} from '@angular/core';
export interface IFilterComponent {
    filterValue: any;
    viewValue: any;
    changed: EventEmitter<any>;
}

export abstract class FilterComponent {    
    constructor(private _controller: any) {
        var child = <any>this.constructor
        _controller.resetFilter$
            .pluck(child.filterId)
            .filter(value => !!value)
            .subscribe(value => {
                this.setValue(value);
            })
    }
    abstract setValue(value);
}