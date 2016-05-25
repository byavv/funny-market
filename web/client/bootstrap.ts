import 'angular2-universal/polyfills';
import {ComponentRef, provide, PLATFORM_DIRECTIVES} from '@angular/core';

import {prebootComplete} from 'angular2-universal';
import {bootstrap, enableProdMode, BROWSER_ROUTER_PROVIDERS, BROWSER_HTTP_PROVIDERS,serializeApplication} from 'angular2-universal';

import {App} from './app/app';
import {Identity, Storage, AppController} from "./app/shared/services";
import {InertLink} from "./app/shared/directives/inertLink";

const PROVIDERS = [
    ...BROWSER_HTTP_PROVIDERS,   
    ...BROWSER_ROUTER_PROVIDERS,    
    provide(PLATFORM_DIRECTIVES, { useValue: InertLink, multi: true })
];
enableProdMode();
bootstrap(App, PROVIDERS)
    .then((appRef: ComponentRef<App>) => {
        prebootComplete(appRef);
    })
    .catch((err) => {
        console.error(err);
    })