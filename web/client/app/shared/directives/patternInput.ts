import { Directive, ElementRef, Renderer, Optional, Attribute } from '@angular/core';
import { StringWrapper } from '@angular/compiler/src/facade/lang';

@Directive({
    selector: '[pattern]',
    inputs: [
        "regex : pattern"
    ],
    host: {
        '(keypress)': 'onKeydown($event)',
        '(paste)': 'onPaste($event)',
    }
})
export class PatternInput {
    private _expression: RegExp;
    private _regex: string;
    set regex(value) {
        this._expression = new RegExp(value);
          console.log(value)
        this._regex = value;
    };
    get regex() {
        return this._regex;
    }
    nopaste: boolean = true;
    constructor(private element: ElementRef, private renderer: Renderer, @Optional() @Attribute('nopaste') nopaste?: string) {
        this.nopaste = nopaste != null;
        this.regex = '[A-Za-z0-9]';
    }
    onKeydown(event: any) {
        if (this._expression && !this._expression.test(StringWrapper.fromCharCode(event.keyCode))) {
            this.renderer.setElementStyle(event.target, "background", "indianred")
            setTimeout(() => {
                this.renderer.setElementStyle(event.target, "background", "white")
            }, 150)
            event.preventDefault();
        }
    }
    onPaste(event) {
        if (this.nopaste) {
            event.preventDefault();
        }
    }
}