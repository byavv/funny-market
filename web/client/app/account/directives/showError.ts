import {
    FORM_DIRECTIVES,
    ControlGroup,
    NgControl,
    Validators,
    NgFormModel
} from '@angular/common';
import {Component, Directive, Host} from '@angular/core';

import {RegExpWrapper, print, isPresent} from '@angular/compiler/src/facade/lang';



@Component({
    selector: 'show-error',
    inputs: ['controlPath: control', 'errorTypes: errors'],
    template: `
    <span *ngIf="errorMessage !== null">{{errorMessage}}</span>
  `,
    directives: []
})
export class ShowError {
    formDir;
    controlPath: string;
    errorTypes: string[];

    constructor( @Host() formDir: NgFormModel) { this.formDir = formDir; }

    get errorMessage(): string {
        var form: ControlGroup = this.formDir.form;
        var control = form.find(this.controlPath);
        if (isPresent(control)) {
            for (var i = 0; i < this.errorTypes.length; ++i) {
                if (control.hasError(this.errorTypes[i])) {
                    return this._errorMessage(this.errorTypes[i]);
                }
            }
        }
        return null;
    }

    _errorMessage(code: string): string {
        var config = {
            'required': 'Field is required',
            "confirm": "Must be equal",
            "email": "Wrong email format",
            "pattern" : "Must contain at least one number character",
            "minlength" : "Must be at least 6 characters long"            
        };
        return config[code];
    }
}