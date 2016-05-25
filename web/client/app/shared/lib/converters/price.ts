import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";

@Converter({
    converterId: "price",
    roteParams: ["price"]
})
export class PriceConverter extends ConverterBase {

    public convert(value) {
        value = value[0];
        let priceFrom, priceUp;
        priceFrom = priceUp = "";
        let active = false;

        if (this.isNumeric(value)) {
            priceFrom = priceUp = value;
        } else {
            if (this.isString(value) && value.includes("..")) {
                let params = value.split('..');
                priceFrom = +params[0] || '';
                priceUp = +params[1] || '';
                active = true;
            }
        }
        return {
            value: { priceFrom, priceUp },
            active: active
        };
    }

    public convertToRoute(value): any {
        if (value.priceFrom || value.priceUp) {
            if (value.priceFrom === value.priceUp) {
                return { price: value.priceFrom };
            } else {
                return { price: `${value.priceFrom || ''}..${value.priceUp || ''}` };
            }
        } else {
            return { price: 'any' };
        }
    }

    public convertToView(value) {
        var from = value.priceFrom, up = value.priceUp;
        if (from && up) {
            return `price: ${from}...${up}`;
        }
        if (from) {
            return `price: from ${from}`;
        }
        if (up) {
            return `price: up ${up}`;
        }
        else {
            return "price: any"
        }
    }

    public resetValue() {
        return {
            priceFrom: "",
            priceUp: ""
        };
    }
}