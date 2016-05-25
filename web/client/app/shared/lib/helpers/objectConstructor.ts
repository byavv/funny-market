export function construct(constructor, ...args: any[]) {
    var c: any = function() {
        return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    return new c();
}