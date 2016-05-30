import {Component, EventEmitter, Input, Output, AfterViewInit, OnInit} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, FilterComponent, IFilterComponent, PriceConverter}  from "../../../../shared/lib/";
import {PatternInput, DebounceInput} from "../../../../shared/directives";
import {FilterController} from '../../../services/filterController';

@Component({
    selector: 'priceWrapper',
    template: ` 
    <div class='row'>
        <div class="col-md-12 col-sm-12">   
             <div><strong>Price</strong></div> 
        </div>  
        <div class="col-md-12 col-sm-12">  
            <form [ngFormModel]="form" >    
                 <div class="row">                                 
                     <div class="col-md-6 col-sm-12 padding-shrink-right">
                         <input-wrapper 
                             [delay]='500' 
                             css='form-control'
                             pattern="[0-9]"                              
                             placeholder='From' 
                             only="[0-9]"                             
                             ngControl="priceFrom" 
                             [(ngModel)]="filterValue.priceFrom">
                         </input-wrapper>
                     </div>                  
                     <div class="col-md-6 col-sm-12 padding-shrink-left">
                         <input-wrapper 
                             [delay]='500' 
                             css='form-control'
                             pattern="[0-9]"                              
                             placeholder='Up' 
                             only="[0-9]"                             
                             ngControl="priceUp" 
                             [(ngModel)]="filterValue.priceUp">
                         </input-wrapper>
                     </div>                 
                 </div>               
            </form>
        </div>                 
    </div>  
  `,
    directives: [PatternInput, DebounceInput]
})
@ConverterProvider({
    bindWith: PriceConverter
})
export class PriceFilterComponent extends FilterComponent implements IFilterComponent {
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

    constructor(filterController: FilterController) {
        super(filterController)
        this.form = new ControlGroup({
            priceFrom: this.priceFrom,
            priceUp: this.priceUp
        });
    }
    ngAfterViewInit() {
        this.form.valueChanges
            .distinctUntilChanged()           
            .subscribe(value => {
                this.changed.next({ filterValue: value, immidiate: true });
            })
    }
    viewValue() {
        return this.filterValue;
    }
    setValue(value) {
        this.filterValue = value;
    }
}