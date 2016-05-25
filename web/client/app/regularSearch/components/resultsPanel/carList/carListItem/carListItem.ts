import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Car} from '../../../../../shared/models/car';

@Component({
    selector: 'carItem',
    template: require("./carListItem.html"),
    directives: [ROUTER_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [require('./component.scss')]
})
export class CarItemComponent {
    @Input()
    car: Car;
    constructor() { }
}