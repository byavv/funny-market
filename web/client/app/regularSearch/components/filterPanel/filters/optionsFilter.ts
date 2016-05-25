import {Component, EventEmitter, Input, Output, OnInit, ViewEncapsulation} from '@angular/core';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder} from '@angular/common';
import {ConverterProvider, convertToView, IFilterComponent, OptionsConverter} from '../../../../shared/lib/';
import {OptionsPickerControl} from "../../../../shared/components/controls/optionPicker/optionPicker";
import {AppController} from '../../../../shared/services/';

@Component({
    selector: 'option-filter',
    template: `      
      <div class="row">
         <div class="col-md-12  col-sm-12">
              <div><strong>Options</strong></div>
              <span>{{viewValue}}</span>
              <a href="" class="pull-right open-link" (click)="opened = !opened">change</a>
         </div>
         <div *ngIf='opened'>
              <div class="col-md-12  col-sm-12 box-content">              
                  <optionPicker
                      [options]="options"                
                      [(ngModel)]="filterValue.options"                 
                      (selected)="onOptionSelected($event)">
                  </optionPicker>
              </div> 
         </div>
    </div>
  `,
    directives: [FORM_DIRECTIVES, OptionsPickerControl],
    styles: [`
        :host >>> .control-container > div {      
            flex: 1 0 100%!important;            
        }
    `]

})

@ConverterProvider({
    bindWith: OptionsConverter
})
export class OptionsFilterComponent implements IFilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any;
    constructor(private appController: AppController) { }
    options = [];
    ngOnInit() {
        this.appController.init$.subscribe((value) => {
            this.options = [
                { name: 'op1', description: 'super-option' },
                { name: 'op2', description: 'super-option2' },
                { name: 'op2', description: 'super-option3' },
                { name: 'op2', description: 'super-option4' },
                { name: 'op2', description: 'super-option5' },
                { name: 'op2', description: 'super-option6' },
                { name: 'op2', description: 'super-option7' },
                { name: 'op2', description: 'super-option8' },
                { name: 'op2', description: 'super-option9' },
                { name: 'op2', description: 'super-option10' }                
            ]
        })
    }
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