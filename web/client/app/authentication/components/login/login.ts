import {Component, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, OnActivate} from "@angular/router-deprecated";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder} from '@angular/common';
import {Identity, AuthApi, Storage} from '../../../shared/services';

@Component({
    selector: 'login',
    directives: [ROUTER_DIRECTIVES],
    template: require("./login.html")
})

export class LoginComponent implements OnActivate {
    signInForm: ControlGroup;
    error: string;
    constructor(builder: FormBuilder,
        private router: Router,
        private authService: AuthApi,
        private identityService: Identity, private storage: Storage
    ) {
        this.signInForm = builder.group({
            "username": ["admin"],
            "password": ["admin"]
        });
    }

    onSubmit(value) {
        this.authService.signIn(value).subscribe(
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
        if (data && data.token) {
            this.storage.setItem("authorizationData", JSON.stringify(data))
            this.identityService.update(data);
            this.router.navigate(['/Home']);
        } else {
            this.error = "Unexpected server error";
        }
    }

    onError(err) {
        this.error = "Login failed"
    }    
}