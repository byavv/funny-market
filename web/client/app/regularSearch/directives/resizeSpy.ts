import { Directive, OnInit, OnDestroy, ElementRef, Renderer, AfterContentInit, ContentChild, Input} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Observable, BehaviorSubject, ReplaySubject} from 'rxjs';
import {NumberWrapper} from '@angular/compiler/src/facade/lang';

@Directive({
    selector: '[bs4-spy]',
    exportAs: "rSpy"
})
export class ResizeSpy implements OnInit, OnDestroy {
    private _domAdapter: DomAdapter;  
    private _sub1;
    private _sub2;
    private _sub3;
    private _sub4;
    private _windowSize$: BehaviorSubject<any> = new BehaviorSubject({});
    width$: ReplaySubject<number> = new ReplaySubject<number>();
    width$2: ReplaySubject<number> = new ReplaySubject<number>();

    widthSm$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    widthSm: boolean = true;
    widthMd$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    widthLg$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    height$: ReplaySubject<number> = new ReplaySubject<number>();
    height: number;
    constructor(private element: ElementRef, private renderer: Renderer) {
         this._domAdapter = getDOM();
    }
    ngOnInit() {

        let window: Window = this._domAdapter.getGlobalEventTarget('window');
        this.height = window.innerHeight;
      
        // this.height
        this.widthSm = this.getWindowSize(window.innerWidth, window.innerHeight).widthSm;


        // this._windowSize$.next(this.getWindowSize())
        this.renderer.listenGlobal('window', 'resize', (evt: any) => {
            console.log(evt);

            let dimensions = this.getWindowSize(evt.target.innerWidth, evt.target.innerHeight);
            this.width$.next(dimensions.width);
            // this.height$.next(dimensions.height);
            this.widthSm = dimensions.widthSm;
            this.height = dimensions.height;
            //this.widthSm$.next(dimensions.widthSm);
            // this.widthMd$.next(dimensions.widthMd);
            //  this.widthLg$.next(dimensions.widthLg);


            // this._windowSize$.next(this.getWindowSize())
        });
    }
    ngOnDestroy() {

    }
    getWindowSize(width, height) {

        //var width = window.innerWidth;


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
