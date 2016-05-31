import { Directive, OnInit, Inject, ElementRef, Renderer, AfterContentInit, ContentChild, Input} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Subject} from 'rxjs';

@Directive({
    selector: '[scroll-spy]',
    exportAs: "sSpy"
})
export class ScrollSpy implements AfterContentInit {
    private _domAdapter: DomAdapter;
    private _doc: HTMLDocument
    collapsed: boolean = false;
    @Input()
    boundary: number = 50;
    overBoundary: boolean = false;
    collapse$: Subject<any> = new Subject();
    constructor(private element: ElementRef, private renderer: Renderer) {
        this._domAdapter = getDOM();
        this._doc = this._domAdapter.defaultDoc();
    }
    ngAfterContentInit() {
        this.renderer.listenGlobal('window', 'scroll', (evt) => {
            var scrollTop = this._doc.documentElement.scrollTop || this._doc.body.scrollTop;
            if (scrollTop > this.boundary) {
                if (!this.overBoundary) {
                    this.collapse$.next(true);
                    this.overBoundary = true;
                }
            } else {
                if (this.overBoundary) {
                    this.overBoundary = false;
                    this.collapse$.next(false);
                }
            }
        })
    }
}