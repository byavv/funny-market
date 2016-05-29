import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";
import {isNumber, NumberWrapper, StringWrapper, isString, isPresent} from "@angular/compiler/src/facade/lang";
@Converter({
    converterId: "price",
    roteParams: ["price"]
})
export class PriceConverter extends ConverterBase {

    public convert(value) {
        value = value[0];
        let priceFrom = "", priceUp = "";
        let active = false;

        if (this.isNumeric(value)) {
            priceFrom = priceUp = value;
        } else {
            if (isString(value) && StringWrapper.contains(value, "..")) {
                let params = value.split('..');
                priceFrom = params[0] ? params[0] : "";
                priceUp = params[1] ? params[1] : "";
                if (priceFrom || priceUp) {
                    active = true;
                }
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
                return { price: `${value.priceFrom || ""}..${value.priceUp || ""}` };
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
