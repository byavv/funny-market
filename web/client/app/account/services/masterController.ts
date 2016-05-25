import {Injectable} from '@angular/core';
import {Observable, Subject, ReplaySubject, Observer} from 'rxjs';
import {Car} from '../../shared/models';

@Injectable()
export class MasterController {
    private _currentState: any = {};
    init$: ReplaySubject<any> = new ReplaySubject();
    error$: Subject<any> = new Subject();
    images: Array<any>;
    options: Array<any>;
    validation: any = {
        info: false, // will be set false by form validation
        img: false
    };
    diffLog: any; //<-- todo
    get info(): any {
        return this._currentState;
    }
    set info(value: any) {
        if (!!value.maker) {
            Object.assign(this._currentState, {
                makerId: value.maker.id,
                makerName: value.maker.name,
            });
        }
        if (!!value.model) {
            Object.assign(this._currentState, {
                carModelId: value.model.id,
                modelName: value.model.name,
            });
        }

        Object.assign(this._currentState, value);
        delete this._currentState.maker;
        delete this._currentState.model;
    }

    get validate$(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            const error = Object.keys(this.validation).find(key => !this.validation[key]);
            if (error) {
                observer.error(error);
                this.error$.next(error);
            } else {
                observer.next(this.diffLog);
                observer.complete();
            }
        })
    }

    constructor() {
        this.info = {};
        this.images = [];
        this.options = [];
    }
}
