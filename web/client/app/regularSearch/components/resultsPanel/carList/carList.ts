import {Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, OnInit} from '@angular/core';
import {CarItemComponent} from './carListItem/carListItem'
import {Observable, Subscription} from "rxjs";
import {LoaderComponent} from "../../../../shared/components/loader/loader";
import {AppController} from "../../../../shared/services";

@Component({
    selector: 'carsList',
    template: `
     <div class="row">
       <div class="col-md-12" style="position: relative">            
            <ul class="cars-list">        
                <li *ngFor="let car of cars | async">
                    <carItem  [car]="car"></carItem>
                </li>           
            </ul>             
            <div *ngIf='!found'>
                <hr/>
                <h3 style='text-align: center;padding-top: 70px;'>Nothing was found</h3>
            </div>
       </div>     
     </div>
    `,
    directives: [CarItemComponent, LoaderComponent],
    styles: [`
        .cars-list{
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .cars-list li {
            border-bottom: 1px solid #ebebeb;
            padding:5px 0;            
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarsListComponent implements OnInit, OnDestroy {
    @Input()//loading
    cars: Observable<Array<any>>;
    private _subscription: Subscription;
    init: boolean;
    found: boolean = true;
    constructor(private cd: ChangeDetectorRef, private appController: AppController) { }
    ngOnInit() {
        this._subscription =
            this.cars.subscribe((cars: Array<any>) => {
                this.found = cars.length > 0;
                this.cd.markForCheck();
            })
    }
    ngOnDestroy() {
        if (this._subscription)
            this._subscription.unsubscribe();
    }
}