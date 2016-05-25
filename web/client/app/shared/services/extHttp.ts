import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response, RequestMethod, Request} from '@angular/http';
import {Subject, Observable, Observer} from 'rxjs';
import {Identity} from "./identity";
import {ResponseHandler} from "./responseHandler";
export enum Action { QueryStart, QueryStop };

@Injectable()
export class ExtHttp {
    process: Subject<any> = new Subject<any>();
    constructor(private _http: Http, private identity: Identity, private responseHandler: ResponseHandler) {
    }

    private _createAuthHeaders(): Headers {
        let identityData = this.identity.user;
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        if (!!identityData && identityData.token) {
            headers.append('Authorization', `${identityData.token}`)
        }
        return headers;
    }

    public get(url: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Get, url, null, options);
    }

    public post(url: string, body: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Post, url, body, options);
    }

    public put(url: string, body: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Put, url, body, options);
    }

    public delete(url: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Delete, url, null, options);
    }

    private _request(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs): Observable<any> {
        let requestOptions = new RequestOptions(Object.assign({
            method: method,
            url: url,
            body: body,
            headers: this._createAuthHeaders()
        }, options));
        return Observable.create((observer) => {
            this.process.next(Action.QueryStart);
            this._http.request(new Request(requestOptions))
                .finally(() => {
                    this.process.next(Action.QueryStop);
                })
                .subscribe(
                (res) => {
                    observer.next(res);
                    observer.complete();
                },
                (err) => {
                    switch (err.status) {
                        case 401:
                            this.responseHandler.handle401();
                            observer.complete();
                            break;
                        case 500:
                            this.responseHandler.handle500();
                            observer.error(err);
                            break;
                        default:
                            observer.error(err);
                            break;
                    }
                })
        })
    }

    // I hope it's temp design
    public nativeRequest(method, url, body): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open(method, url, true);
            let identityData = this.identity.user;
            if (!!identityData && identityData.token) {
                xhr.setRequestHeader('Authorization', `${identityData.token}`);
            }
            xhr.addEventListener("error", function (event) {
                observer.error(xhr.response);
            });
            xhr.onreadystatechange = () => {                
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(<any>JSON.parse(xhr.response))
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.send(body)
        });
    }
}