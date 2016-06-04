import {
    beforeEachProviders,
    inject,
    async,
    it,
    injectAsync,
    beforeEach, fakeAsync
} from '@angular/core/testing';

import { BaseRequestOptions, Http } from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
let appControllerStart: jasmine.Spy;
class MockRouter {
    navigate(value) { }
}
class MockAppController {
    init$: ReplaySubject<any> = new ReplaySubject<any>()
    start() { this.init$.next('fake') }
}
// Load the implementations that should be tested
import { App } from '../client/app/app';
import {Identity, Storage, APP_SERVICES_PROVIDERS, AppController} from "../client/app/shared/services";

describe('App', () => {
    // provide our implementations or mocks to the dependency injector
    beforeEachProviders(() => [
        APP_SERVICES_PROVIDERS,
        App,
        provide(Router, { useFactory: () => new MockRouter() }),
        provide(AppController, { useFactory: () => new MockAppController() }),
        BaseRequestOptions,
        MockBackend,
        // Provide a mocked (fake) backend for Http
        provide(Http, {
            useFactory: function useFactory(backend, defaultOptions) {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        })
    ]);
    beforeEach(inject([AppController], (appController) => {
        spyOn(appController, "start").and.callThrough();
    }));

    it('app should run initialization', injectAsync([App, AppController], (app, appController) => {
        expect(app).toBeTruthy();
        app.appController.init$.subscribe(value => {
            expect(appController.start).toHaveBeenCalled();
            expect(value).toEqual('fake');
        })
    }));
});