import {Injectable, NgZone} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ExtHttp} from './extHttp';
import * as converters from "../lib/converters"
import {construct} from "../lib/helpers";
import {ConverterBase} from "../lib/converters/ConverterBase";
import {Api} from "./backEndApi";
import {ReplaySubject, Observable} from "rxjs";

@Injectable()
export class AppController {
    init$: ReplaySubject<any> = new ReplaySubject<any>();
    config: any = {
        apiBase: "https://localhost:3001" //todo get from data
    };
    converters: Array<ConverterBase> = [];
    makers: Array<any> = [];
    engineTypes: Array<any> = [];
    // todo: car colors     
    constructor(private _backEnd: Api, private _ngZone: NgZone) { }
    start() {
        this._ngZone.runOutsideAngular(() => {
            this._loadAppDefaults((defaults) => {
                this._ngZone.run(() => { this.init$.next(defaults); });
                console.log("APPLICATION STARTED");
            })
        });
    }

    _loadAppDefaults(doneCallback: (defaults: any) => void) {
        Object.keys(converters).forEach((key) => {
            this.converters.push(construct(converters[key]));
        });
        Observable.zip(
            this._backEnd.getMakers(),
            // require all servers you need to start the app
            this._backEnd.getEngineTypes(),
            (makers, engineTypes) => [makers, engineTypes])
            .subscribe(value => {
                [this.makers, this.engineTypes] = value; // <-- deprecate 
                doneCallback({
                    makers: value[0],
                    engineTypes: value[1]
                });
            }, err => {
                console.log(err);
            })
    }
}