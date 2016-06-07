import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {LoginComponent} from './authentication/components/login/login';
import {SignUpComponent} from './authentication/components/signUp/signup';
import {Identity, Storage, APP_SERVICES_PROVIDERS, AppController} from "./shared/services";
import {Header} from "./shared/components/header/header";
import {FORM_PROVIDERS} from '@angular/common';
import {QuickSearchComponent} from "./quickSearch/components/quickSearchBase"
import {CarsSearchComponent} from "./regularSearch/components/searchBase"
import {CarDetailsComponent} from "./carDetails/carDetails";
import {PersonalBase} from "./account/components/accountBase";
import {LoaderComponent} from "./shared/components/loader/loader";

// applied to the whole app
import '../assets/styles/main.scss';

@Component({
  selector: 'app',
  directives: [ROUTER_DIRECTIVES, Header, LoaderComponent],
  template: `
    <div class="page-wrap">
      <loader [active]='loading' [async]='appController.init$'></loader>      
       <app-header></app-header>
       <div [hidden]='loading' class='container-fluid'>
          <div class='content-area'>
              <router-outlet>
              </router-outlet>
          </div>
      </div>
    </div>         
  `,
  providers: [FORM_PROVIDERS, APP_SERVICES_PROVIDERS]
})
@RouteConfig([
  { path: '/', name: 'Home', component: QuickSearchComponent, useAsDefault: true },
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/signup', name: 'SignUp', component: SignUpComponent },
  { path: '/search/:maker/:year/:price/', name: 'SearchList', component: CarsSearchComponent },
  { path: '/details/:id', name: 'Details', component: CarDetailsComponent },
  { path: '/settings/...', name: 'Settings', component: PersonalBase },
])
export class App {
  loading = true;
  constructor(private identity: Identity, private storage: Storage, private appController: AppController) {
    this.appController.init$.subscribe(() => {
      this.loading = false;
    })
    this.appController.start();
    identity.update(JSON.parse(storage.getItem("authorizationData")));
  }
}
