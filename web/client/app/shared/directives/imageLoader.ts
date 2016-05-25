//Thanks to http://stackoverflow.com/questions/35639174/passive-link-in-angular-2-a-href-equivalent
import {Directive, Input, Output, EventEmitter} from '@angular/core';
@Directive({
    selector: '[href]',
    host: {
        '(click)': 'preventDefault($event)'
    }
})
export class InertLink {
    @Input() href;
    constructor(){
        var worker = new Worker('url')
    }
}