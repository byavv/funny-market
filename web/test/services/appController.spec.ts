import {
    beforeEachProviders,
    inject,
    async,
    it,
    injectAsync,
    beforeEach, fakeAsync
} from '@angular/core/testing';

import { BaseRequestOptions, Http, Request, Response, ResponseOptions} from '@angular/http';
import { Router } from '@angular/router-deprecated';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { provide, Injector } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { User } from '../../client/app/shared/models/user';
import { UnauthorizedAccessError, ServerError } from '../helpers/errors';

var _injector: Injector;
import {Identity, ExtHttp, ResponseHandler, AppController, Api, APP_SERVICES_PROVIDERS} from "../../client/app/shared/services";
import { MockRouter, MockAppController, MockApiService } from '../helpers/mocks';

describe('App controller tests', () => {
    let apiBackEnd: Api;
    beforeEachProviders(() => [
        APP_SERVICES_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
        provide(Api, { useClass: MockApiService }),
        provide(Router, { useFactory: () => new MockRouter() }),
        provide(Http, {
            useFactory: (backend, defaultOptions) => {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        })
    ]);
    beforeEach(inject([Injector], (injector) => {
        _injector = injector;
        apiBackEnd = injector.get(Api);

        spyOn(apiBackEnd, 'getMakers').and.returnValue([{ name: 'fake' }]);
        spyOn(apiBackEnd, 'getEngineTypes').and.returnValue([{ name: 'fake' }]);
    }));

    it('should require app defaults calling backEnd service', async(inject([AppController], (appController: AppController) => {
        appController.start();
        appController.init$.subscribe((value) => {
            expect(apiBackEnd.getMakers).toHaveBeenCalled();
            expect(apiBackEnd.getEngineTypes).toHaveBeenCalled();
        })

    })));
    it('should init app converters, makers and enginetypes', async(inject([AppController], (appController: AppController) => {
        appController.start();
        appController.init$.subscribe((value) => {
            expect(appController.converters).toBeDefined();
            expect(appController.makers.length).toBe(1);
            expect(appController.makers[0].name).toBe('fake');
            expect(appController.engineTypes.length).toBe(1);
        })
    })));
})
