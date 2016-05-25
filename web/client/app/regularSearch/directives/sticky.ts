import { Directive, OnInit, ElementRef, Renderer, Output, Input, EventEmitter} from '@angular/core';
import {Subscription, Subject, Observable} from 'rxjs';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {global, NumberWrapper} from '@angular/compiler/src/facade/lang';

@Directive({
    selector: '[sticky]',
})
export class StickyPanel implements OnInit {
    private _doc: HTMLDocument;
    private _domAdapter: DomAdapter;
    // private _ruler: Ruler;
    height: number = 0;
    width: number = 0;
    top: number = 0;
    _active: boolean = true;
   // _win;
    @Input()
    startFrom: number = 65;
    @Input()
    stickTo: number = 0;
    @Input()
    set active(value) {
        if (!value) {
            this._reset()
        }
        this._active = value;
    };
    get active() {
        return this._active;
    }

    @Input()
    bindWidthTo: string;

    ignoreElementSize = false;
    constructor(public element: ElementRef, private renderer: Renderer) {
       this._domAdapter = getDOM();
       this._doc = document
    }

    ngOnInit() {
        this.renderer.listenGlobal('window', 'scroll', (evt: any) => {
            if (this.active) {
                this.toggleStickyNav();
            }
        });
        this.renderer.listenGlobal('window', 'resize', (evt: any) => {
            if (this.active) {
                this.toggleStickyNav();
                this._setWidth()
            }
        });
        this.renderer.listen(this.element.nativeElement, 'click', (evt: any) => {
            if (this.active) {
                this.toggleStickyNav();
            }
        });
    }

    _setWidth() {
        if (!getDOM().hasClass(this.element.nativeElement, 'sticky')) {
            getDOM().setStyle(this.element.nativeElement, 'width', `auto`);
            return;
        }
        var baseCol = this._domAdapter.getElementsByClassName(this._doc.documentElement, this.bindWidthTo)[0];
        if (baseCol) {
            var paddingLeft: any = window.getComputedStyle(baseCol).paddingLeft;
            var paddingRight: any = window.getComputedStyle(baseCol).paddingRight;
            var colWidth: any = window.getComputedStyle(baseCol).width;
            colWidth = colWidth ? +colWidth.replace('px', '') : 0;
            paddingLeft = paddingLeft ? +paddingLeft.replace('px', '') : 0;
            paddingRight = paddingRight ? +paddingRight.replace('px', '') : 0;
            this._domAdapter.setStyle(this.element.nativeElement, 'transition-duration', `${0}ms`);
            this._domAdapter.setStyle(this.element.nativeElement, 'width', `${colWidth - (paddingLeft + paddingRight)}px`);
        }
    }

    _reset() {
        this._domAdapter.removeClass(this.element.nativeElement, 'sticky');
        this._domAdapter.setStyle(this.element.nativeElement, 'width', `auto`);
        this._domAdapter.setStyle(this.element.nativeElement, 'transition-duration', `${0}ms`);
    }

    toggleStickyNav() {

        var scrollTop = this._doc.documentElement.scrollTop || this._doc.body.scrollTop;
        var docHeight = this._doc.documentElement.clientHeight;
        var scrollHeight = this._doc.documentElement.scrollHeight;

        var rect = this._domAdapter.getBoundingClientRect(this.element.nativeElement);

        this.top = rect.top;
        this.height = rect.height;
        // if there is nothing to scroll reset sticky state        
        if (this.height + 151 /*header + footer + padding-top/bottom + 1px*/ > scrollHeight) {
            this._reset();
            return;
        }
        if (!this._domAdapter.hasClass(this.element.nativeElement, 'sticky')
            && scrollTop >= this.startFrom) {
            this._domAdapter.addClass(this.element.nativeElement, 'sticky');
            this._domAdapter.setStyle(this.element.nativeElement, 'top', `${this.stickTo}px`)
            this._setWidth();
            this._domAdapter.setStyle(this.element.nativeElement, 'transition-duration', `${250}ms`);
        } else {
            if (this._domAdapter.hasClass(this.element.nativeElement, 'sticky')
                && scrollTop < this.startFrom) {
                this._reset();
                return;
            }
            // when user scrolls to 100px on document's bottom sticky panel should be moved up 
            // to the height of the footer(65) + pudding-bottom(15) in case if it's height is too big
            if ((docHeight - this.height) <= 100 && ((docHeight + scrollTop) >= scrollHeight - 100)) {
                var k = (docHeight + scrollTop) / scrollHeight;
                var offset = k * (docHeight - (this.height + 80));
                this._domAdapter.setStyle(this.element.nativeElement, 'top', `${offset}px`);
            } else {
                this._domAdapter.setStyle(this.element.nativeElement, 'top', `${this.stickTo}px`);
            }
        }

    }
}
