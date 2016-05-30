import { Directive, OnInit, OnDestroy, ElementRef, Renderer, AfterContentInit, ContentChild, Input} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Observable, BehaviorSubject, ReplaySubject} from 'rxjs';
import {NumberWrapper} from '@angular/compiler/src/facade/lang';

@Directive({
    selector: '[bs4-spy]',
    exportAs: "rSpy"
})
export class ResizeSpy implements OnInit {
    private _domAdapter: DomAdapter;
    width$: ReplaySubject<number> = new ReplaySubject<number>();
    height$: ReplaySubject<number> = new ReplaySubject<number>();

    widthSm: boolean = true;
    widthMd: boolean = true;
    widthLg: boolean = true;
    widthExl: boolean = true;
    height: number;
    width: number;

    constructor(private element: ElementRef, private renderer: Renderer) {
        this._domAdapter = getDOM();
    }
    ngOnInit() {
        let window: Window = this._domAdapter.getGlobalEventTarget('window');
        this.measure(window.innerWidth, window.innerHeight);
        this.renderer.listenGlobal('window', 'resize', (evt: any) => {
            this.measure(evt.target.innerWidth, evt.target.innerHeight)
        });
    }
    private measure(width, height) {
        let dimensions = this._getWindowSize(width, height);
        this.width$.next(dimensions.width);
        this.height$.next(dimensions.height);
        this.widthSm = dimensions.widthSm;
        this.widthMd = dimensions.widthMd;
        this.widthLg = dimensions.widthLg;
        this.widthExl = dimensions.widthExl;
        this.height = dimensions.height;
        this.width = dimensions.width;
    }
    private _getWindowSize(width, height) {
        return {
            height: height,
            width: width,
            widthExs: width ? width < 544 : false,
            widthSm: width ? (width >= 544) && (width < 768) : false,
            widthMd: width ? (width >= 768) && (width < 992) : false,
            widthLg: width ? (width >= 992) && (width < 1200) : false,
            widthExl: width ? (width >= 1200) : false
        };
    }
}
