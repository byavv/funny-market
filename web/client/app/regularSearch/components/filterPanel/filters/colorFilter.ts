import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FORM_DIRECTIVES, ControlGroup} from '@angular/common';
import {ConverterProvider, convertToView, FilterComponent, ColorConverter} from '../../../../shared/lib/';
import {FilterController} from '../../../services/filterController';
import {ColorPickerControl} from "../../../../shared/components/controls/colorPicker/colorPicker";

@Component({
    selector: 'color-filter',
    template: `
       <div class="row">           
            <div class="col-md-12 col-sm-12">
               <div><strong>Color (exterior)</strong></div>
               <span>{{viewValue}}</span>
               <a href="" class="pull-right open-link" (click)="opened = !opened">change</a>
            </div>          
            <div *ngIf='opened' class="col-md-12 col-sm-12">             
                <colorPicker
                    [(ngModel)]="filterValue.colors"
                    (onChange)="onColorSelected($event)">
                </colorPicker>    
            </div>                
      </div>
  `,
    directives: [FORM_DIRECTIVES, ColorPickerControl]
})

@ConverterProvider({
    bindWith: ColorConverter
})
export class ColorFilterComponent extends FilterComponent {
    @Input()
    active: boolean;
    @Input()
    filterValue: any = {};
    @Output()
    changed: EventEmitter<any> = new EventEmitter();
    constructor(filterController: FilterController) {
        super(filterController)
    }
    onColorSelected(value) {
        this.changed.next({ filterValue: this.filterValue, immidiate: true });
    }
    @convertToView
    get viewValue() {
        return this.filterValue;
    }
    setValue(value) {
        this.filterValue = value;
        this.changed.next({ filterValue: this.filterValue, immidiate: true });
    }
}