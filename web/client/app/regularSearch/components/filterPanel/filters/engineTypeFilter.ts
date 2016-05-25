import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder} from '@angular/common';
import {ConverterProvider, convertToView, IFilterComponent, EngineTypeConverter} from '../../../../shared/lib/';
import {OptionsPickerControl} from "../../../../shared/components/controls/optionPicker/optionPicker";
import {AppController} from '../../../../shared/services/';

@Component({
    selector: 'engine-filter',
    template: `      
      <div class="row">
         <div class="col-md-12 col-sm-12">
              <div><strong>Engine, type</strong></div>
              <span>{{viewValue}}</span>
              <a href="" class="pull-right open-link" (click)="opened = !opened">change</a>
         </div>        
         <div *ngIf='opened' class="col-md-12 col-sm-12 box-content">              
             <optionPicker
                 [options]="appController.engineTypes"                
                 [(ngModel)]="filterValue.engineTypes"                 
                 (selected)="onOptionSelected($event)">
             </optionPicker>
         </div>
    </div>
  `,
    directives: [FORM_DIRECTIVES, OptionsPickerControl],
    styles: [`
         :host >>> .control-container > div {      
            flex: 1 0 50%;            
        }
    `] 
})

@ConverterProvider({
    bindWith: EngineTypeConverter
})
export class EngineTypeFilterComponent implements IFilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any;
    constructor(private appController: AppController) { }
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    onOptionSelected(value) {
        this.changed.next({ filterValue: this.filterValue, immidiate: true });
    }
    @convertToView
    get viewValue() {
        return this.filterValue;
    }
}