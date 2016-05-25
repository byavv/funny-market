import {Injectable} from '@angular/core';
import * as Rx from 'rxjs';
import {ExtHttp} from '../../shared/services/extHttp';

@Injectable()
export class Api {

    constructor(private _http: ExtHttp) { }

    public getCarsCount(query): Rx.Observable<any> {
        return this._http
            .post("/api/getcount", JSON.stringify(query))
            .map(res => res.json());
    }
    
    public getMakerModels(makerId): Rx.Observable<any> {
        return this._http
            .get(`/api/makers/${makerId}/carModels`)
            .map(res => res.json());
    }

    public getMakers(): Rx.Observable<any> {
        return this._http
            .get("/api/makers")
            .map(res => res.json());
    }

    public searchCars(query): Rx.Observable<any> {
        return this._http
            .post("/api/search", JSON.stringify(query))
            .map(res => res.json());
    }

    public getCar(id): Rx.Observable<any> {
        return this._http
            .get(`/api/cars/${id}`)
            .map(res => res.json());
    }

   public getEngineTypes(): Rx.Observable<any> {
        return this._http
            .get("/api/enginetypes", null)
            .map(res => res.json());
    }


}
