import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class TotalCounter extends BehaviorSubject<number>{
    constructor() {
        super(0);
    }
}