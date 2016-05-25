export abstract class ConverterBase {
    converterId: string;
    params: Array<string>;
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    isString(s) {
        return typeof s === 'string' || s instanceof String
    }

    abstract convert(value: any): any;
    abstract convertToRoute(value: any);
    abstract convertToView(value: any);
    abstract resetValue();

}