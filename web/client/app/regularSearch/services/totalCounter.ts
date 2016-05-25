import {Injectable} from '@angular/core';
import {ReplaySubject, BehaviorSubject} from 'rxjs';
import {Api} from '../../shared/services';

@Injectable()
export class TotalCounter extends BehaviorSubject<number>{
    constructor(private apiService: Api) {
        super(0);
    }
    getCount(query) {
        this.apiService.getCarsCount(query)
            .subscribe((result: any) => {
                super.next(+result.count);
            })
    }
}