import {Component, OnInit} from '@angular/core';
import {Control, ControlGroup, FormBuilder, Validators} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {UsersBackEndApi} from "../../services/usersBackEndApi"
import {Api, Identity} from "../../../shared/services";
import {ShowError} from '../../directives/showError';

@Component({
    selector: 'account',
    template: require('./account.html'),
    directives: [ShowError],
    styles: [`       
        .panel-heading.red{
            color: #fff;
            text-shadow: 0 -1px 0 #900;
            background-color: #df3e3e;
            border: 1px solid #a00;
        }
        .red-text {
            color: #900;
        }
        .red-text:hover {
            color: #fff;
            background-color: #df3e3e;
        }
      
       
    `]
})

export class AccountComponent implements OnInit {
    accountForm: ControlGroup;
    passwordForm: ControlGroup;
    model: any = {};
    user: any = {};
    passwordSubmitted = false;
    accountSubmitted = false;
    acc_error: string;
    pas_error: string;
    acc_info: string;
    pas_info: string;

    constructor(private _usersBackEnd: UsersBackEndApi, private _identity: Identity, private router: Router, private _fb: FormBuilder) {
        this.accountForm = _fb.group({
            username: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, emailValidator])]
        });

        this.passwordForm = _fb.group({
            oldPassword: ['', Validators.compose([Validators.required])],
            newPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.pattern('.*[0-9].*')
            ])],
            confirm: ['', Validators.compose([sholdBeEqualToNewPassword(this.model)])]
        });
    }

    ngOnInit() {
        this._usersBackEnd.getUser().subscribe(user => {
            this.user = user
        })
        this.passwordForm.controls['newPassword'].valueChanges.subscribe((value) => {
            this.passwordForm.controls['confirm'].updateValueAndValidity();
        })
    }

    deleteProfile() {
        this._usersBackEnd.deleteUserWithProfile().subscribe((result) => {
            this._identity.update();
            console.log(result);
            this.router.navigate(['/Home']);
        }, (err) => {
            this._identity.update();
            console.error(err);
            this.router.navigate(['/Home']);
        })
    }

    onSubmitPassword() {
        this.passwordSubmitted = true;
        if (this.passwordForm.valid) {
            this._usersBackEnd.updatePassword(this.passwordForm.value).subscribe((result) => {
                this.pas_error = null;
                this.pas_info = 'Password successfully updated';
                this.model.newPassword = this.model.oldPassword = this.model.confirm = '';
                this.passwordSubmitted = false;
                setTimeout(() => {
                    this.pas_info = null;
                }, 5000)
            }, err => {
                let error = err.json().error;
                this.pas_error = error.message;
            })
        }
    }

    onSubmitAccount() {
        this.accountSubmitted = true;
        if (this.accountForm.valid) {
            this._usersBackEnd.updateAccount(this.accountForm.value).subscribe((result) => {
                this.acc_error = null;
                this.acc_info = 'Account data was updated successfully';
                setTimeout(() => {
                    this.acc_info = null;
                }, 5000)
            }, err => {
                let error = err.json().error;
                this.acc_error = error.message;
            })
        }
    }
}

export function emailValidator(control: any) {
    if (!/.+\@.+\..+/.test(control.value)) {
        return { email: true };
    }
}

function shouldContainNumberCh(control: any) {
    if (!/[0-9]/.test(control.value)) {
        return { number: true };
    }
}

function minLengthIfExists(length: any) {
    return function (control) {
        if ((control.value) && control.value <= length) {
            return { minLengthIfExists: true }
        }
    }
}

function sholdBeEqualToNewPassword(model: any) {
    return function (control) {
        if ((control.value && model.newPassword) && model.newPassword != control.value) {
            return { confirm: true }
        }
    }
}