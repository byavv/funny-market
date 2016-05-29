import {EventEmitter} from '@angular/core';

interface IConverterOptions {
    converterId: string;
    roteParams: Array<string>;
}
export interface IFilterComponent {
    filterValue: any;
    viewValue: any;
    changed: EventEmitter<any>;
}

export abstract class FilterComponent {
    //static filterId;
    constructor(private _controller: any) {
        var child = <any>this.constructor//<any>this["constructor"]
        _controller.resetFilter$
            .pluck(child.filterId)
            .filter(value => !!value)
            .subscribe(value => {
                this.setValue(value);
            })
    }
    abstract setValue(value);
}

export function Converter(options: IConverterOptions) {
    return (target: any) => {
        target.prototype.converterId = options.converterId;
        target.prototype.params = options.roteParams;
    }
}
