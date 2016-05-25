import { Directive, OnInit, ElementRef, Renderer, ContentChild, Input} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Observable, ReplaySubject} from 'rxjs';
import { NumberWrapper} from '@angular/compiler/src/facade/lang';

@Directive({
    selector: '[responsive]',
    exportAs: 'resp'
})
export class Responsive implements OnInit {
    private _domAdapter: DomAdapter;
    get height(): number {
        let height = this._domAdapter.getComputedStyle(this.element.nativeElement).height;
        return height ? NumberWrapper.parseFloat(height.replace('px', '')) : 0;
    }
    constructor(private element: ElementRef, private renderer: Renderer) {
        this._domAdapter = getDOM();
    }
    ngOnInit() {
        let height = document.documentElement.clientHeight;
        this._setMinHeight(height);
        this.renderer.listenGlobal('window', 'resize', (evt) => {
            this._setMinHeight(evt.target.innerHeight);
        })
    }
    private _setMinHeight(height) {
        this._domAdapter.setStyle(this.element.nativeElement, 'min-height', `${height}px`);
    }
}