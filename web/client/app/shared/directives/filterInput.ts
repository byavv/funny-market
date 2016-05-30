import { Component, Output, EventEmitter, Input, ViewChild, ViewQuery, ElementRef, Optional, QueryList, Self, HostListener } from '@angular/core';
import { NgModel, NgControl, FORM_DIRECTIVES, ControlValueAccessor } from '@angular/common';
import { ReplaySubject, Observable } from 'rxjs/Rx';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import { PatternInput } from './patternInput'

@Component({
    selector: 'input-wrapper[ngControl],input-wrapper[ngModel]',
    template: ` <input #input 
                       [class]="css"
                       [(ngModel)] = 'value' 
                       type="text"
                       [attr.pattern] = "only"
                       [id] = "id"                               
                       [placeholder] = "placeholder"/> `,
    directives: [FORM_DIRECTIVES, PatternInput]
})
export class DebounceInput implements ControlValueAccessor {
    private _value;
    @ViewChild('input') inputElement: ElementRef;
    @Input() delay: number = 300;
    @Input() css: string;
    @Input() id: string;
    @Input() placeholder: string;
    @Input() pattern: string;
    set value(value) {       
        this._value = value;
    }   
    get value() {
        return this._value;
    }
    eventStream: ReplaySubject<any> = new ReplaySubject();
    preventPropagation: boolean = true;
    constructor( @Optional() @Self() private ngModel: NgModel, @Optional() @Self() private ngControl: NgControl) {
        if (ngModel) ngModel.valueAccessor = this;
        if (ngControl) ngControl.valueAccessor = this;
    }

    ngAfterViewInit() {      
        Observable.fromEvent(this.inputElement.nativeElement, 'input')
            .debounceTime(this.delay)
            .map((event: any) => event.target.value)
            .distinctUntilChanged()
            .subscribe((value) => {
                this.onChange.next(value);
                if (this.ngModel) this.ngModel.viewToModelUpdate(value);
                if (this.ngControl) this.ngControl.viewToModelUpdate(value);
            })
    }

    @Output()
    onChange: EventEmitter<any> = new EventEmitter()
    onTouched = () => {
    };
    writeValue(value) {
        this.value = value;
    }
    registerOnChange(fn): void {
        this.onChange.subscribe(fn);
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}
