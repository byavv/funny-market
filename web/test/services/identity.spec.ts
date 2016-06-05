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
import { Identity } from "../../client/app/shared/services";

var fakeUser = { token: 'fakeToken', name: 'john' };
describe('Identity service tests', () => {
    // provide our implementations or mocks to the dependency injector
    beforeEachProviders(() => [
        Identity
    ]);
    beforeEach(inject([Identity], (identity) => {
        spyOn(identity, "update").and.callThrough();
    }));

    it('should update user data', async(inject([Identity], (identity) => {
        expect(identity).toBeTruthy();
        identity.identity$.subscribe(value => {
            expect(value.name).toEqual(fakeUser.name)
            expect(value.token).toEqual(fakeUser.token)
        })
        identity.update(fakeUser)
    })));
    it('should user reset data', async(inject([Identity], (identity) => {
        expect(identity).toBeTruthy();
        identity.identity$.subscribe(value => {
            expect(value.name).not.toBeDefined()
            expect(value.token).not.toBeDefined()
        })
        identity.update()
    })));
});