import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Observer, BehaviorSubject} from 'rxjs';
import {ExtHttp} from '../../../../shared/services/extHttp';

@Injectable()
export class TrackerApi {
    constructor(private _http: ExtHttp) { }
    public getLastAdded(): Observable<any> {
        return this._http
            .get("/tracks?filter[limit]=5&filter[order]=added%20DESC")
            .map(res => res.json());
    }
}
