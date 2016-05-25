interface ICarOption {
    name: string;
    description: string;
    active?: boolean;
}

import { Component, Self, EventEmitter, Output, ViewChild, Input, Optional } from '@angular/core';
import { NgControl, NgModel, ControlValueAccessor } from '@angular/common';

@Component({
    selector: 'optionPicker[ngModel]',
    template: require('./template.html'),
    styles: [require("./component.css")]
})

export class OptionsPickerControl implements ControlValueAccessor {
    private _selectedOptions = {};
    private _options = [];
    @Input()
    options: Array<ICarOption>;

    set selectedOptions(arrayOfSelected) {
        this._selectedOptions = arrayOfSelected;
    }
    get selectedOptions(): any {
        return this._selectedOptions;
    }

    ngOnInit() {
        this._options = this.options.map((option) => {
            return this.selectedOptions.indexOf(option.name) > -1
                ? Object.assign(option, { active: true })
                : Object.assign(option, { active: false })
        })
    }

    @Output()
    selected: EventEmitter<any> = new EventEmitter();

    constructor( @Optional() @Self() private ngModel: NgModel,
        @Optional() @Self() private ngControl: NgControl) {
        if (ngModel) ngModel.valueAccessor = this;
        if (ngControl) ngControl.valueAccessor = this;
    }

    onCheck(index) {
        this.options[index].active = !this.options[index].active;
        let activeOptions = this._options.filter((option) => option.active);
        let newValue = activeOptions.map((option) => option.name);
        this.selected.next(newValue);
        if (this.ngModel) this.ngModel.viewToModelUpdate(newValue);
        if (this.ngControl) this.ngControl.viewToModelUpdate(newValue);
    }

    /**
     * ControlValueAccessor
     */
    onChange = (_: any) => {
    };
    onTouched = () => {
    };
    writeValue(value) {
        this.selectedOptions = value;
    }
    registerOnChange(fn): void {
        this.onChange = fn;
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}