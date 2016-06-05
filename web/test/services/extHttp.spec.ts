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
import { MockRouter } from '../helpers/mocks';

var fakeStorageValue = { token: 'fakeToken' };
var _injector: Injector;
import {Identity, ExtHttp, ResponseHandler, APP_SERVICES_PROVIDERS} from "../../client/app/shared/services";



describe('Extended http tests', () => {
    beforeEachProviders(() => [
        APP_SERVICES_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
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
        var responseHandler = injector.get(ResponseHandler);
        var identity = injector.get(Identity);
        spyOn(responseHandler, 'handle401').and.returnValue(null);
        spyOn(responseHandler, 'handle500').and.returnValue(null);
        identity.update(new User("potter", "supersecret"))
    }));

    it('should be created initialize', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        expect(extHttp).toBeTruthy();
    })));

    it('should make get request', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        var connection;
        var text;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => connection = c);
        extHttp.get('something.json').subscribe(res => {
            text = res.text();
            expect(text).toBe('Something');
        });
        connection.mockRespond(new Response(new ResponseOptions({ body: 'Something' })));
    })));

    it('should make post request and get responce', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            expect(connection.request.text()).toEqual(JSON.stringify({ some: 'request' }))
            connection.mockRespond(new Response(new ResponseOptions({ body: 'got' })))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res.text()).toBe('got');
            });
    })));

    it('should handle server error', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new Error('SOMETHINGBAD'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeUndefined();
            }, err => {
                expect(err.message).toBe('SOMETHINGBAD');
            });
    })));

    it('should handle 401 error', async(inject([ExtHttp, ResponseHandler], (extHttp: ExtHttp, responseHandler: ResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new UnauthorizedAccessError('Authorization failed'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeUndefined();
            }, err => {
                expect(err).toBeUndefined();
            });
        expect(responseHandler.handle401).toHaveBeenCalled()
    })));

    it('should handle 500 error', async(inject([ExtHttp, ResponseHandler], (extHttp: ExtHttp, responseHandler: ResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new ServerError('Server down'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeUndefined();
            }, err => {
                expect(err).toBeDefined();
            });
        expect(responseHandler.handle500).toHaveBeenCalled()
    })));


    it('should set authorization headers', async(inject([ExtHttp, ResponseHandler], (extHttp: ExtHttp, responseHandler: ResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            expect(connection.request.headers.get("Authorization")).toEqual('supersecret')
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeDefined();
            }, err => {
                expect(err).not.toBeDefined();
            });
    })));
})
