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
export function Converter(options: IConverterOptions) {
    return (target: any) => {
        target.prototype.converterId = options.converterId;
        target.prototype.params = options.roteParams;
    }
}
