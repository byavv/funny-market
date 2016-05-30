import {Directive, Input, Output, EventEmitter} from '@angular/core';
@Directive({
    selector: '[image-loader]',
})
export class ImageLoader {
    @Input() path;
    constructor() {
        var worker = new Worker('url');
        // todo
    }
}