import {provide, ApplicationRef, Component, PLATFORM_DIRECTIVES} from '@angular/core';
import {FORM_PROVIDERS, FormBuilder} from '@angular/common';
import {it, xit, describe, expect, afterEach, 
    beforeEach, async, inject, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {QuickSearchComponent} from "../../client/app/quickSearch/components/quickSearchBase";
import { APP_SERVICES_PROVIDERS, AppController, Api } from '../../client/app/shared/services';
import {setBaseTestProviders} from '@angular/core/testing';
import { MockRouter, MockAppController, MockApiService } from '../helpers/mocks';
import {dispatchEvent} from '@angular/platform-browser/testing';
import {Router} from '@angular/router-deprecated';
import {Subject, Observable} from 'rxjs';


import {
    ComponentFixture,
    TestComponentBuilder
} from '@angular/compiler/testing';

@Component({
    selector: 'test-cmp',
    directives: [QuickSearchComponent],
    template: '<div><quickSerch></quickSerch></div>'
})
class TestComponent { }

describe('COMPONENTS TESTS', () => {
    let builder: TestComponentBuilder;
    let componentFxt: ComponentFixture<QuickSearchComponent>;

    describe("Quich search component tests", () => {
        beforeEachProviders(() => [
            FORM_PROVIDERS,
            APP_SERVICES_PROVIDERS,
            provide(Router, { useFactory: () => new MockRouter() }),
            provide(AppController, { useFactory: () => new MockAppController() }),
            provide(Api, { useClass: MockApiService }),
        ]);
        beforeEach(inject([TestComponentBuilder], (tcb) => {
            builder = tcb;
        }));
        beforeEach(inject([AppController, Router, Api], (appController, router, apiBackEnd) => {
            spyOn(router, "navigate");
            spyOn(apiBackEnd, "getCarsCount").and.returnValue(Observable.of({ count: 42 }));
            spyOn(apiBackEnd, 'getMakerModels').and.returnValue(Observable.of([]));
           
        }));
        beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(QuickSearchComponent)
                .then(fixture => {
                    componentFxt = fixture;
                    fixture.detectChanges();
                });
        }));

        it('app should initialize', async(inject([AppController], (appController) => {
            var compiled = componentFxt.debugElement.nativeElement;
            appController.init$.subscribe(value => {
                expect(value.makers).toBeDefined();
            });
            componentFxt.debugElement.componentInstance.count$.subscribe((value) => {
                expect(value).toBe(42);
                componentFxt.detectChanges();
                expect(componentFxt.componentInstance.carMakers[0].name).toBe('gravitsapa_motors');
                expect(compiled.querySelector('#maker')
                    .options.item(1).innerHTML).toBe('gravitsapa_motors');
                expect(compiled.querySelector('button').innerText).toBe('Show 42');
            })
            appController.start();
        })));

        it('should require cars models when maker change', async(inject([AppController, Api], (appController, apiBackend) => {
            var compiled = componentFxt.debugElement.nativeElement;

            appController.init$.subscribe(value => {
                //   let select = componentFxt.debugElement.query(By.css("select#maker"));
                //   dispatchEvent(select.nativeElement, "change");
                componentFxt.debugElement.componentInstance.carFormModel.maker = value.makers[0];
                componentFxt.detectChanges();
                componentFxt.whenStable().then(() => {
                    expect(apiBackend.getMakerModels).toHaveBeenCalledWith(1)
                })
            });
            appController.start();
        })));
        it('should submit and build search request params', async(inject([Router, Api], (router, apiBackend) => {
            componentFxt.debugElement.componentInstance.submit();
            expect(router.navigate).toHaveBeenCalledWith(['SearchList', {}]);
        })));
    });
});