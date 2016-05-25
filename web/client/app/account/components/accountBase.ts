import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, OnActivate, Instruction} from "@angular/router-deprecated";
import {ProfileComponent} from './personal/personal';
import {AccountComponent} from './account/account';
import {UserCarsComponent} from './userCars/userCarsBase';
import {UsersBackEndApi} from "../services/usersBackEndApi"
import {AuthApi} from "../../shared/services/authBackEndApi"
import {Subscription} from "rxjs";

@Component({
    selector: 'settings',
    template: ` 
        <div class="row">
            <div class="col-md-2 col-sm-12 padding-shrink-right">   
                <div class="card">                      
                    <ul class="list-group list-group-flush">    
                        <a class="list-group-item" [routerLink]="['MyCars']">My Cars</a>
                        <a class="list-group-item" [routerLink]="['Profile']">Profile</a>
                        <a class="list-group-item" [routerLink]="['Account']">Account</a>
                    </ul>
                </div>                     
            </div>
            <div class="col-md-10 col-sm-12 padding-shrink-left">           
                <router-outlet>
                </router-outlet>               
            </div>
        </div>
   `,
    
    directives: [ROUTER_DIRECTIVES],
    providers: [UsersBackEndApi],
    styles: [`      
                      
        :host >>> .info-panel{
            padding: 7px 15px;    
            color: white;
        }
        :host >>> .info-panel.error{
            background-color: #E47F6E;          
        }
        :host >>> .info-panel.info{
            background-color: #6ECEE4;
        }        
        .router-link-active{
            background-color: #F5F5F5;
        }        
    `]
})
@RouteConfig([
    { path: '/profile', name: 'Profile', component: ProfileComponent },
    { path: '/account', name: 'Account', component: AccountComponent },
    { path: '/cars/...', name: 'MyCars', component: UserCarsComponent, useAsDefault: true }
])
export class PersonalBase implements OnInit, OnActivate, OnDestroy {
    private _subscr: Subscription;

    constructor(private authBackEnd: AuthApi) { }
    ngOnInit() { }

    routerOnActivate() {
        this._subscr = this.authBackEnd.authorize().subscribe(() => { });
    }

    ngOnDestroy() {
        if (this._subscr)
            this._subscr.unsubscribe();
    }
}