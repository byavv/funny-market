import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {ExtHttp} from '../../shared/services/extHttp';
import {Observable} from 'rxjs';

@Injectable()
export class AuthApi {
    private _http: ExtHttp;

    constructor(exHttp: ExtHttp) {
        this._http = exHttp;
    }

    public authorize(): Observable<any> {
        return this._http
            .post("/profiles/me", null);
    }

    public signUp(form): Observable<any> {
        return this._http
            .post("/profiles/signup", JSON.stringify(form))
            .map(res => res.json());
    }

    public signIn(userData): Observable<any> {
        return this._http
            .post("/auth/login", JSON.stringify(userData))
            .map(res => res.json());
    }
    public signOut(): Observable<any> {
        return this._http
            .post("/auth/logout", JSON.stringify({}))
            .map(res => res.json());
    }
}
