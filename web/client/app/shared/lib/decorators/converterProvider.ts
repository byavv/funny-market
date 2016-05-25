import {construct}  from '../helpers';
import {ConverterBase} from "../converters/ConverterBase";

interface IConverterProviderOptions {
    bindWith: typeof ConverterBase;
}

export function ConverterProvider(options: IConverterProviderOptions) {
    return (target: any) => {
        var converter = construct(options.bindWith);
        target.prototype.converter = converter;
        target.filterId = converter.converterId;
    }
}