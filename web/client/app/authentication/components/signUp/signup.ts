import {Component, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, OnActivate} from "@angular/router-deprecated";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder} from '@angular/common';
import {Identity, AuthApi, Storage} from '../../../shared/services';

@Component({
    selector: 'signup',
    directives: [ROUTER_DIRECTIVES],
    template: require("./signup.html")
})

export class SignUpComponent implements OnActivate {
    signInForm: ControlGroup;
    error: string;
    constructor(builder: FormBuilder,
        private router: Router,
        private authService: AuthApi,
        private identityService: Identity, private storage: Storage
    ) {
        this.signInForm = builder.group({
            "username": ["admin"],
            "email": ["myemail@gmail.com"],
            "password": ["admin"]
        });
    }

    onSubmit(value) {
        this.authService.signUp(value).subscribe(
            data => this.onSuccess(data),
            err => this.onError(err)
        );
    }

    routerOnActivate() {
        if (this.identityService.user.isAuthenticated()) {
            this.router.navigate(['/Home']);
        }
    }

    onSuccess(data) {

        console.log(data);
        this.router.navigate(['/Home']);

    }

    onError(err) {
        this.error = "Login failed"
    }
}