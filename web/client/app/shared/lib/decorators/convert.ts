/**
 * Function or property decorator used to convert filter value to "presentable" string
 * ex. {maker: "BMW", model: "3-series"} --> "BMW,3-series"
 * conversion method should be defined in a component, decorated by ConverterProvider 
 */
export function convertToView(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {

    if (descriptor.value != null) {
        _convertFilterValue_func(descriptor, target);
    }
    else if (descriptor.get != null) {
        _convertFilterValue_acc(descriptor, target);
    }
    else {
        throw "Only put a convert decorator on a method or get accessor.";
    }
}

function _convertFilterValue_func(descriptor: TypedPropertyDescriptor<any>, target) {
    const originalValue = descriptor.value;
    let convertedValue: string = `Converter not found`;

    descriptor.value = function(...args: any[]) {
        var filterValue = originalValue.apply(this, args);
        let converter = target.prototype.converter;
        if (!!converter) {
            convertedValue = converter.convertToView(filterValue);
        }
        return convertedValue;
    };
}

function _convertFilterValue_acc(descriptor: TypedPropertyDescriptor<any>, target) {
    const originalGet = descriptor.get;
    const originalSet = descriptor.set;
    let convertedValue: string = `Converter not found`;

    descriptor.get = function(...args: any[]) {
        var filterValue = originalGet.apply(this, args);
        let converter = target.converter;
        if (!!converter) {
            convertedValue = converter.convertToView(filterValue);
        }
        return convertedValue;
    };

    if (descriptor.set != null) {
        descriptor.set = function(...args: any[]) {
            return originalSet.apply(this, args);
        };
    }
}
