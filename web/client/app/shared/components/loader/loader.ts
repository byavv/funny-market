import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
@Component({
    selector: 'loader',
    template: `
    <div class='loader-container' *ngIf='active'>
        <div class='spinner'></div>
    </div>`,
    styles: [require('./component.css')]
})
export class LoaderComponent implements OnInit, OnDestroy {
    private _subscription: Subscription
    @Input()
    async: Observable<any>;
    @Input()
    delay: number = 0;
    @Input()
    active: boolean = false;
    @Output()
    completed: EventEmitter<any> = new EventEmitter();
    constructor() { }
    ngOnInit() {
        if (this.async)
            this._subscription = this.async
                .subscribe(() => {
                    setTimeout(() => {
                        this.active = false;
                        this.completed.next(this.active)
                    }, this.delay)
                }, (err) => {
                    setTimeout(() => {
                        this.active = false;
                        this.completed.next(this.active)
                    }, this.delay)
                })
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}