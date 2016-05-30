import 'angular2-universal/polyfills';
import { provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { Http } from '@angular/http';
import {
    TranslateLoader,
    TranslateStaticLoader,
    TranslateService
} from "ng2-translate/ng2-translate";
import {prebootComplete} from 'angular2-universal';
import {bootstrap, enableProdMode, BROWSER_ROUTER_PROVIDERS, BROWSER_HTTP_PROVIDERS} from 'angular2-universal';

import {App} from './app/app';
import {InertLink} from "./app/shared/directives";

const PROVIDERS = [
    ...BROWSER_HTTP_PROVIDERS,
    ...BROWSER_ROUTER_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
        deps: [Http]
    }),
    provide(PLATFORM_DIRECTIVES, { useValue: InertLink, multi: true })
];
enableProdMode();
bootstrap(App, PROVIDERS)
    .then(prebootComplete)
    .catch(console.error)