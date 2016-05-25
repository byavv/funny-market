import {Component, OnInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, OnActivate} from "@angular/router-deprecated";
import {MasterBaseComponent} from './masterBase';
import {UserCarsListComponent} from './carList';
@Component({
    selector: 'usercars',
    template: `
        <div class="row">        
            <div class="col-md-12">
                <router-outlet>
                </router-outlet>
            </div>
        </div>
    `,

    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/master/*id', name: 'MasterBase', component: MasterBaseComponent },
    { path: '/list', name: 'UserCars', component: UserCarsListComponent, useAsDefault: true }
])
export class UserCarsComponent implements OnInit {
    constructor() { }
    ngOnInit() {
    }
}