import {Component, EventEmitter, Input, Output, AfterViewInit, ViewEncapsulation} from '@angular/core';
import {CORE_DIRECTIVES, Control, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, IFilterComponent, MilageConverter} from "../../../../shared/lib/";

@Component({
    selector: 'milage-filter',
    template: ` 
    <div class='row'>
        <div class="col-md-12 col-sm-12">  
            <form [ngFormModel]="form" >    
                 <div class="row">
                     <div class="col-md-12 col-sm-12">   
                         <div><strong>Milage</strong></div> 
                     </div>              
                     <div class="col-md-6 col-sm-12 padding-shrink-right" >
                         <input class="form-control" 
                             type="number" min="0"
                             name="milageFrom" 
                             id="milageFrom"
                             #milageFrom="ngForm"  
                             ngControl="milageFrom" 
                             placeholder="From"
                             [(ngModel)]="filterValue.milageFrom"/> 
                     </div>                  
                     <div class="col-md-6 col-sm-12 padding-shrink-left" >
                         <input class="form-control"
                             type="number" min="0" 
                             name="milageUp" 
                             id="milageUp"
                             #milageUp="ngForm" 
                             placeholder="Up"
                             ngControl='milageUp'
                             [(ngModel)]="filterValue.milageUp"/> 
                     </div>                 
                 </div>               
            </form>
        </div>                 
    </div> 
  `,   
    directives: [CORE_DIRECTIVES]   
})
@ConverterProvider({
    bindWith: MilageConverter
})
export class MilageFilterComponent implements IFilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any = {};
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    milageFrom: Control;
    milageUp: Control;
    form: ControlGroup;   
    constructor() {
        this.milageFrom = new Control();
        this.milageUp = new Control();
        this.form = new ControlGroup({
            milageFrom: this.milageFrom,
            milageUp: this.milageUp
        });

    }
    ngAfterViewInit() {
        this.form.valueChanges
            .distinctUntilChanged()
            .debounceTime(500)
            .subscribe(value => {
                this.changed.next({ filterValue: this.filterValue, immidiate: true });
            })
    }

    viewValue() {
        return this.filterValue;
    }
}