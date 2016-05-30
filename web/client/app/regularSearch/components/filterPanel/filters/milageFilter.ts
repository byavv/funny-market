import {Component, EventEmitter, Input, Output, AfterViewInit, OnInit, ViewEncapsulation} from '@angular/core';
import { Control, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, FilterComponent, MilageConverter} from "../../../../shared/lib/";
import {PatternInput, DebounceInput} from "../../../../shared/directives";
import {FilterController} from '../../../services/filterController';

@Component({
    selector: 'milage-filter',
    template: ` 
    <div class='row'>
        <div class="col-md-12 col-sm-12">   
            <div><strong>Milage</strong></div> 
        </div> 
        <div class="col-md-12 col-sm-12">  
            <form [ngFormModel]="form" >    
                 <div class="row">                                 
                     <div class="col-md-6 col-sm-12 padding-shrink-right" >
                         <input-wrapper 
                            [delay]='500' 
                            css='form-control'
                            pattern="[0-9]" 
                            id='milageFrom' 
                            placeholder='From' 
                            only="[0-9]"                             
                            ngControl="milageFrom" 
                            [(ngModel)]="filterValue.milageFrom">
                         </input-wrapper>
                     </div>                  
                     <div class="col-md-6 col-sm-12 padding-shrink-left">                     
                         <input-wrapper 
                             [delay]='500' 
                             css='form-control'
                             pattern="[0-9]" 
                             id='milageUp' 
                             placeholder='Up' 
                             only="[0-9]"                             
                             ngControl="milageUp" 
                             [(ngModel)]="filterValue.milageUp">
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
    bindWith: MilageConverter
})
export class MilageFilterComponent extends FilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any = {};
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    notEmit: boolean = false;
    milageFrom: Control;
    milageUp: Control;
    form: ControlGroup;
    constructor(filterController: FilterController) {
        super(filterController)
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
            .subscribe(value => {
                this.changed.next({ filterValue: value, immidiate: true });
            })
    }
    get viewValue() {
        return this.filterValue;
    }
    setValue(value) {
        this.filterValue = value;
    }
}