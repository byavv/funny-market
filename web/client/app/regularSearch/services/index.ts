import {FilterController} from './filterController';
import {TotalCounter} from "./totalCounter";

export * from './filterController';
export * from './totalCounter';

export var SEARCH_SERVICES_PROVIDERS: Array<any> = [
    FilterController,  
    TotalCounter    
];