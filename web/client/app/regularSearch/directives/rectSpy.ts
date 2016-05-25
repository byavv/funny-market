import { Directive, OnInit, ElementRef, Renderer, AfterContentInit, ContentChild, Input} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Observable, ReplaySubject} from 'rxjs';


@Directive({
    selector: '[size]',
    exportAs: 'size'
})
export class SizeSpy {
    private _domAdapter: DomAdapter;

    get height(): number {
        let height = this._domAdapter.getComputedStyle(this.element.nativeElement).height;
        return height ? +height.replace('px', '') : 0;
    }
    get width(): number {
        let width = this._domAdapter.getComputedStyle(this.element.nativeElement).width;
        return width ? +width.replace('px', '') : 0;
    }

    constructor(private element: ElementRef, private renderer: Renderer) {
        this._domAdapter = getDOM();
    }
}