import { Observable, ReplaySubject } from "rxjs";
export class MockRouter {
    navigate(value) { }
}
export class MockAppController {
    init$: ReplaySubject<any> = new ReplaySubject<any>()
    start() {
        this.init$.next({
            makers: [{ name: 'gravitsapa_motors', id: 1 }],
            engineTypes: []
        })
    }
    get converters(){ return []}
}

export class MockApiService {
    getCarsCount() { }
    getMakerModels() { }
    getMakers() { }
    getEngineTypes() { }
}

export class MockResponseHandler {
    handleError(er) { return er.toString() }
}