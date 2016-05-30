interface IConverterOptions {
    converterId: string;
    roteParams: Array<string>;
}

export function Converter(options: IConverterOptions) {
    return (target: any) => {
        target.prototype.converterId = options.converterId;
        target.prototype.params = options.roteParams;
    }
}
