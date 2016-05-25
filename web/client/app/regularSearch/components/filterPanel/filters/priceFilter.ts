import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, IFilterComponent, PriceConverter}  from "../../../../shared/lib/";

@Component({
    selector: 'priceWrapper',
    template: ` 
    <div class='row'>
        <div class="col-md-12 col-sm-12">  
            <form [ngFormModel]="form" >    
                 <div class="row">
                     <div class="col-md-12 col-sm-12">   
                         <div><strong>Price</strong></div> 
                     </div>              
                     <div class="col-md-6 col-sm-12 padding-shrink-right">
                         <input class="form-control" 
                             type="number" min="0"
                             name="priceFrom" 
                             id="priceFrom"
                             #priceFrom="ngForm"
                             placeholder="From"  
                             ngControl="priceFrom" 
                             [(ngModel)]="filterValue.priceFrom"/> 
                     </div>                  
                     <div class="col-md-6 col-sm-12 padding-shrink-left">
                         <input class="form-control"
                             type="number" min="0" 
                             name="priceUp" 
                             id="priceUp"
                             #priceUp="ngForm"
                             placeholder="Up" 
                             ngControl='priceUp'
                             [(ngModel)]="filterValue.priceUp"/> 
                     </div>                 
                 </div>               
            </form>
        </div>                 
    </div>  
  `,
    directives: []
})
@ConverterProvider({
    bindWith: PriceConverter
})
export class PriceFilterComponent implements IFilterComponent, OnInit {
    @Input()
    active: boolean;
    @Input()
    filterValue: any = {};
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    priceFrom: Control = new Control();
    priceUp: Control = new Control();
    form: ControlGroup;
    pricesUp: Array<number> = [];
    pricesFrom: Array<number> = [];

    constructor() {
        this.form = new ControlGroup({
            priceFrom: this.priceFrom,
            priceUp: this.priceUp
        });
    }

    ngOnInit() {
        this.form.valueChanges
            .distinctUntilChanged()
            .debounceTime(500)
            .subscribe(value => {
                this.changed.next({ filterValue: value, immidiate: true });
            })
    }

    viewValue() {
        return this.filterValue;
    }
}