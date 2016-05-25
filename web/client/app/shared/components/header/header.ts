import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Instruction} from '@angular/router-deprecated';
import {Identity, AuthApi, Storage} from '../../services';

@Component({
    selector: 'app-header',
    template: require('./header.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class Header implements OnInit {
    isAuthenticated: boolean = false;
    shouldRedirect: boolean;
    username: string;

    constructor(private identity: Identity, private auth: AuthApi, private router: Router, private storage: Storage) { }

    ngOnInit() {
        this.username = this.identity.user.name || "Guest";
        this.isAuthenticated = this.identity.user.isAuthenticated();
        this.identity.identity$
            .subscribe((user) => {
                this.isAuthenticated = user.isAuthenticated();
                this.username = user.name;
            });
    }
    signOut() {
        this.auth.signOut().subscribe(
            (res) => {
                this.identity.update();
                this.storage.removeItem("authorizationData")
            },
            (err) => {
                this.identity.update();
                this.storage.removeItem("authorizationData");
            }
        );
    }
}