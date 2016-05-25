import {
  provide,
  enableProdMode,
  expressEngine,
  REQUEST_URL,
  ORIGIN_URL,
  BASE_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_HTTP_PROVIDERS,
  ExpressEngineConfig
} from 'angular2-universal';

import {FORM_PROVIDERS} from '@angular/common';

import {HTTP_PROVIDERS} from '@angular/http';
import {App} from '../../client/app/app';

import * as express from 'express';
import {APP_SERVICES_PROVIDERS} from "../../client/app/shared/services";
const APP_PROVIDERS = [
    ...APP_SERVICES_PROVIDERS
];

export function configureRoutes(app) {

    if (process.env === "production") {
        enableProdMode();
    }   
    
    function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';

    let config: ExpressEngineConfig = {
        directives: [ ],
        platformProviders: [
            provide(ORIGIN_URL, {useValue: 'http://0.0.0.0:3030'}),
            provide(BASE_URL, {useValue: baseUrl}),
        ],
        providers: [
            provide(REQUEST_URL, {useValue: url}),
            NODE_ROUTER_PROVIDERS,
            NODE_HTTP_PROVIDERS,
            ...APP_PROVIDERS
        ],
        async: true,
        preboot: true // { appRoot: 'app' } // your top level app component selector
    };

    res.render('index', config);
    }
    
    app.use('/', ngApp);
};
