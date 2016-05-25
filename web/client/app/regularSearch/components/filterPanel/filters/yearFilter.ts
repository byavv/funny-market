import {Component, EventEmitter, Output, Input, AfterViewInit} from '@angular/core';
import {CORE_DIRECTIVES, Control, FORM_DIRECTIVES, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, IFilterComponent, YearConverter} from "../../../../shared/lib/";

@Component({
    selector: 'yearWrapper',
    template: ` 
    <div class='row'>
        <div class="col-md-12 col-sm-12">   
            <form [ngFormModel]="form" >    
                <div class="row">            
                     <div class="col-md-12 col-sm-12">   
                         <div><strong>First registration (date)</strong></div> 
                     </div>  
                     <div class="col-md-6 col-sm-12 padding-shrink-right">
                        <select class="form-control" 
                            name="yearFrom" 
                            id="yearFrom"
                            #yearFrom="ngForm"  
                            ngControl="yearFrom" 
                            [(ngModel)]="filterValue.yearFrom">
                                <option value="">Any</option>
                                <option *ngFor="let year of yearsFrom" 
                                [class.hidden]="year > yearUp.control.value && !!yearUp.control.value"
                                [value]="year">{{year}}</option>            
                         </select> 
                     </div>                  
                     <div class="col-md-6 col-sm-12 padding-shrink-left">
                         <select class="form-control" 
                             name="yearUp" 
                             id="yearUp"
                             #yearUp="ngForm" 
                             ngControl='yearUp'
                             [(ngModel)]="filterValue.yearUp">
                             <option value="">Any</option>
                             <option *ngFor="let year of yearsUp" 
                                 [class.hidden]="year < yearFrom.control.value && !!yearFrom.control.value"
                                 [value]="year">{{year}}</option>                       
                         </select> 
                     </div>                 
                 </div>               
            </form>
        </div>                 
    </div> 
  `,
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
@ConverterProvider({
    bindWith: YearConverter
})
export class YearFilterComponent implements IFilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any;
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    yearFrom: Control;
    yearUp: Control;
    form: ControlGroup;
    yearsUp: Array<number> = [];
    yearsFrom: Array<number> = [];
    constructor() {
        this.yearFrom = new Control("");
        this.yearUp = new Control("");
        this.form = new ControlGroup({
            yearFrom: this.yearFrom,
            yearUp: this.yearUp
        });
        for (let i = 1980; i <= new Date().getFullYear(); i++) {
            this.yearsUp.push(i);
            this.yearsFrom.push(i);
        }
    }
    ngAfterViewInit() {
        this.form.valueChanges
            .distinctUntilChanged()
            .subscribe(value => {
                this.changed.next({ filterValue: value, immidiate: true });
            })
    }

    get viewValue() {
        return this.filterValue;
    }
}