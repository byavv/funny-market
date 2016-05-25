import {Component, OnInit} from '@angular/core';
import {Api} from '../shared/services';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {CAROUSEL_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
@Component({
    selector: 'carDetails',
    template: require("./carDetails.html"),
    styles: [require('./component.scss')],
    directives: [ROUTER_DIRECTIVES, CAROUSEL_DIRECTIVES]
})
export class CarDetailsComponent implements OnInit {
    car: any = {
        images: []
    };

    constructor(private apiService: Api, private params: RouteParams) { }

    ngOnInit() {
        this.apiService
            .getCar(this.params.get('id'))
            .subscribe((car: any) => {
                this.car = car;
            })
    }
}