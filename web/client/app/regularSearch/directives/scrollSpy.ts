import { Directive, OnInit, Inject, ElementRef, Renderer, AfterContentInit, ContentChild, Input} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {global} from '@angular/compiler/src/facade/lang';
import {Subject} from 'rxjs';

@Directive({
    selector: '[scroll-spy]',
    exportAs: "sSpy"
})
export class ScrollSpy implements AfterContentInit {
    private _domAdapter: DomAdapter;
    collapsed: boolean = false;
    @Input()
    boundary: number = 50;

   
    overBoundary: boolean = false;
    collapse$: Subject<any> = new Subject();
    constructor(private element: ElementRef, private renderer: Renderer, @Inject(DOCUMENT) private _doc) {
       this._domAdapter = getDOM();
       //let oldRoots = getDOM().querySelectorAll(this._doc, '[id^=root]');
    }
    ngAfterContentInit() {
        this.renderer.listenGlobal('window', 'scroll', (evt) => {
            var scrollTop =  document.documentElement.scrollTop ||  document.body.scrollTop;
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