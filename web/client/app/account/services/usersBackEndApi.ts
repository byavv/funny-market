import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Observer, BehaviorSubject} from 'rxjs';
import {ExtHttp} from '../../shared/services/extHttp';

@Injectable()
export class UsersBackEndApi {
    private _carForms: any;

    constructor(private _http: ExtHttp) { }

    public getUserCars(): Observable<any> {
        return this._http           
            .post("/profiles/cars/getusercars", null)
            .map(res => res.json());
    }

    public postNewCar(data: any) {
        return this._http           
            .post("/profiles/cars/new", JSON.stringify(data))
            .map(res => res.json());
    }
    public deleteImage(id: string, key: string) {
        return this._http
            .post(`/image/remove`, JSON.stringify({ key: key, carId: id }))
            .map(res => res.json());
    }


    public deleteCar(id: string) {
        return this._http           
            .delete(`/profiles/cars/${id}`)
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
          return (id
            ? this._http
                .post(`/profiles/cars/update/${id}`, JSON.stringify(data))
            : this._http
                .post(`/profiles/cars/new`, JSON.stringify(data)))
            .map(res => res.json());      
    }

    public uploadImages(data, carId) {
        return this._http
            .nativeRequest('POST', `/image/upload/${carId}`, data);
    }

}
