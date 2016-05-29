import { Component, Self, EventEmitter, Output, ElementRef, Optional, Attribute } from '@angular/core';
import { NgControl, NgModel, ControlValueAccessor } from '@angular/common';
import { allColors } from "./carColors";
import { isString } from '@angular/compiler/src/facade/lang';
@Component({
    selector: `
        colorPicker[ngControl],
        colorPicker[ngFormControl],
        colorPicker[ngModel]`,
    template: require("./colorPicker.html"),
    styles: [`
        .color-picker{           
            height: 40px;          
            margin: 2px;
            border-radius: 4px;
            border: 1px solid rgba(0,0,0,.2);
            cursor: pointer;            
        }
        .color{
            flex: 0 1 16.6666666%;           
        }
        .color-picker.active{
            background-image: url('/build/cl/assets/img/check.png');
            background-repeat: no-repeat;
            background-position: center;
        }
    `]
})

export class ColorPickerControl implements ControlValueAccessor {
    private _colors = [];
    set colors(value) {
        if (isString(value))
            value = [value];
        if (Array.isArray(value)) {
            this._colors = allColors().map((color) => {
                return value.indexOf(color) > -1
                    ? { active: true, color: color }
                    : { active: false, color: color }
            })
        }
    }
    get colors() {
        return this._colors;
    }

    @Output()
    onChange: EventEmitter<any> = new EventEmitter()

    constructor(
        @Optional() @Self() private ngModel: NgModel,
        @Optional() @Self() private ngControl: NgControl,
        @Optional() @Attribute('single') private single) {
        if (ngModel) ngModel.valueAccessor = this;
        if (ngControl) ngControl.valueAccessor = this;
        this._colors = allColors().map((color) => {
            return {
                active: false,
                color: color
            }
        })
    }

    selectColor(index) {
        if (this.single != null) {
            this.colors.forEach(color => {
                color.active = false;
            })
            this.colors[index].active = true;
        } else {
            this.colors[index].active = !this.colors[index].active;
        }
        var activeColors = this.colors.filter((color) => color.active);
        var newValue = activeColors.map((color) => color.color);
        if (this.single != null) {
            newValue = newValue[0] || '';
        }
        this.onChange.next(newValue);
        if (this.ngModel) this.ngModel.viewToModelUpdate(newValue);
        if (this.ngControl) this.ngControl.viewToModelUpdate(newValue);
    }


    onTouched = () => {
    };
    writeValue(value) {
        this.colors = value;
    }
    registerOnChange(fn): void {
        this.onChange.subscribe(fn);
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}