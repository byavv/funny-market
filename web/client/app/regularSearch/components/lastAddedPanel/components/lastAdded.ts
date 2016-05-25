import {Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {TrackerApi} from '../services/trackerApi';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {LoaderComponent} from "../../../../shared/components/loader/loader";

@Component({
    selector: 'lastAdded',
    template: require('./lastAdded.html'),
    directives: [ROUTER_DIRECTIVES, LoaderComponent],
    providers: [TrackerApi],
    styles: [`
       .car-list .car-container {
            position: relative;
            background-color: #eee;
            margin: 0 5px 5px 0;
            top: 0;
            height: 100%;
            border-bottom: 1px solid #ddd;
            padding: 2px;
            color: inherit;
            display: block;
        }
        .car-container img {           
            height: 100%;           
            width: 100%;                      
        }
        .car-container > .model-info {
            background-color: rgba(250, 250, 250, 0.75);
            position: absolute;
            top:0px;
            width: 100%;
            height: 35px;
            padding: 7px 8px;  
            color: inherit;       
        }
        .model-info > label {            
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;
            overflow: hidden;
        }
        .car-container:hover > .model-info {
            background-color: rgba(250, 250, 250, 0.9);
        }
        
    `]
})
export class LastAddedComponent implements OnInit, OnDestroy {
    private _subscription: Subscription;
    lastAdded: Array<any> = [];
    loading: boolean = true;
    constructor(private trackerApi: TrackerApi) { }
    ngOnInit() {
        this.trackerApi.getLastAdded().subscribe(cars => {
            this.lastAdded = cars;
        })
    }
    ngOnDestroy() {
        if (this._subscription)
            this._subscription.unsubscribe();
    }
}