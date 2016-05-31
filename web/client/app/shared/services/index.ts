import {Identity} from './identity';
import {ExtHttp} from './extHttp';
import {Api} from './backEndApi';
import {AuthApi} from './authBackEndApi';
import {ResponseHandler} from './responseHandler';
import {AppController} from './appController';
import {STORAGE_PROVIDERS} from './storage';

export * from './identity';
export * from './extHttp';
export * from './backEndApi';
export * from './responseHandler';
export * from './appController';
export * from './authBackEndApi';
export * from './storage';

export var APP_SERVICES_PROVIDERS: Array<any> = [
    ExtHttp,
    Identity,    
    Api,
    ResponseHandler,    
    AppController,
    AuthApi,
    ...STORAGE_PROVIDERS
];