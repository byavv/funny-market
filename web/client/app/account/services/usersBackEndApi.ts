import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Observer, BehaviorSubject} from 'rxjs';
import {ExtHttp} from '../../shared/services/extHttp';

@Injectable()
export class UsersBackEndApi {
    private _carForms: any;

    constructor(private _http: ExtHttp) { }

    public getUserCars(): Observable<any> {
        return this._http
            .post("/api/cars/getusercars", null)
            .map(res => res.json());
    }

    public postNewCar(data: any) {
        return this._http
            .post("/api/cars/new", JSON.stringify(data))
            .map(res => res.json());
    }
    public deleteImage(id: string, key: string) {
        return this._http
            .post(`/api/cars/removeimage/${id}`, JSON.stringify({ key: key }))
            .map(res => res.json());
    }
    public deleteCar(id: string) {
        return this._http
            .delete(`/api/cars/${id}`)
            .map(res => res.json());
    }
    public deleteUserWithProfile() {
        return this._http
            .post(`/users/deleteuserandprofile`, null)
            .map(res => res.json());

    }
    public getProfileData() {
        return this._http
            .get(`/profiles/getProfile`)
            .map(res => res.json());
    }
    public setProfileData(data: any) {
        return this._http
            .post(`/profiles/updateProfile`, JSON.stringify(data))
            .map(res => res.json());
    }

    public updatePassword(data: any) {
        return this._http
            .post(`/users/updatePassword`, JSON.stringify(data))
            .map(res => res.json());
    }
    public updateAccount(data: any) {
        return this._http
            .post(`/users/updateAccount`, JSON.stringify(data))
            .map(res => res.json());
    }

    public getUser() {
        return this._http
            .get(`/users/getUser`)
            .map(res => res.json());
    }

    public createOrUpdate(data: any, id?: string) {
        return id
            ? this._http
                .nativeRequest('POST', `/api/cars/update/${id}`, data)
            : this._http
                .nativeRequest('POST', `/api/cars/new`, data)
    }
}
