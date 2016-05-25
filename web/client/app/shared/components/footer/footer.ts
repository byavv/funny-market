import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';


@Component({
    selector: 'app-footer',
    template: require('./footer.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class Footer implements OnInit {
    constructor() { }
    ngOnInit() {}
}