import {Component, ViewEncapsulation, Input} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';

// Require our Universal App
import {App} from '../../client/app/app';
import {LoginComponent} from '../../client/app/authentication/components/login/login';
import {Identity} from "../../client/app/shared/services";
import {Header} from "../../client/app/shared/components/header/header";

import {QuickSearchComponent} from "../../client/app/quickSearch/components/quickSearchBase"
import {CarsSearchComponent} from "../../client/app/regularSearch/components/searchBase"
import {CarDetailsComponent} from "../../client/app/carDetails/carDetails";
import {PersonalBase} from "../../client/app/account/components/accountBase"

@Component({
  selector: 'server-only-app',
  template: `
  
  <!--<footer>
    <nav class="navbar navbar-light app-footer">
      <div class='footer-content'>
          {{seo}}
      </div>
    </nav>
</footer>-->
  
 
  `
})
export class ServerOnlyApp {
  @Input() 
  some: string;
  seo;
  ngOnInit(){   
      this.seo = 'Angular 2 Universal - server only rendered component';    
  }
}

@Component({
  selector: 'html',
  directives: [
    App,
    ServerOnlyApp
  ],
  providers: [

  ],
  styles: [`
    .footer {
      background:#ede;
    }
  `],
  template: require('./html.html')
})
@RouteConfig([
    { path: '/', name: 'Home', component: QuickSearchComponent, useAsDefault: true },
    { path: '/login', name: 'Login', component: LoginComponent },
    { path: '/search/:maker/:year/:price/', name: 'SearchList', component: CarsSearchComponent },
    { path: '/details/:id', name: 'Details', component: CarDetailsComponent },
    { path: '/settings/...', name: 'Settings', component: PersonalBase },
])
export class Html {
  seo = {     
    title: 'Angular 2 Universal Starter - this component replaces the title element'
  };
}