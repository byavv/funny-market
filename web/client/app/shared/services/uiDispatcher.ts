import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class UiDispatcher {
    width$: Observable<number>;
    height$: Observable<number>;
    scrollTop$: Observable<number>;
    scrollLeft$: Observable<number>;
    constructor() {
        //let windowSize$ = new BehaviorSubject(getWindowSize());
       // let windowScroll$ = new BehaviorSubject(getScrollPosition());
       // this.width$ = windowSize$.pluck('width').distinctUntilChanged();
      //  this.height$ = windowSize$.pluck('height').distinctUntilChanged();

      //  this.scrollTop$ = windowScroll$.pluck('top').distinctUntilChanged();
      //  this.scrollLeft$ = windowScroll$.pluck('left').distinctUntilChanged();

       /* Observable.fromEvent(window, 'resize')
            .map(getWindowSize)
            .subscribe(windowSize$);

        Observable.fromEvent(window, 'scroll')
            .map(getScrollPosition)
            .subscribe(windowScroll$);*/
    }
}

/*function getWindowSize() {
    return {
        height: window.innerHeight,
        width: window.innerWidth
    };
}

function getScrollPosition() {
    return {
        top: window.scrollY,
        left: window.scrollX
    };
}*/
