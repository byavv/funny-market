import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";

@Converter({
    converterId: "milage",
    roteParams: ["milageFrom", "milageUp"]
})
export class MilageConverter extends ConverterBase {
    public convert(value) {
        let milageFrom = Array.isArray(value) ? value[0] : "";
        let milageUp = Array.isArray(value) ? value[1] : "";
        let active = false;
        if (milageFrom || milageUp) {
            active = true;
        }
        return {
            value: {
                milageFrom: milageFrom || "",
                milageUp: milageUp || ""
            },
            active: active
        }
    }

    public convertToRoute(value): any {
        var result = {}
        if (value.milageUp) {
            Object.assign(result, { milageUp: value.milageUp })
        }
        if (value.milageFrom) {
            Object.assign(result, { milageFrom: value.milageFrom })
        }
        return result;
    };

    public convertToView(value) {
        var from = value.milageFrom, up = value.milageUp;
        if (from && up) {
            return `milage: ${from}...${up}`;
        }
        if (from) {
            return `milage: from ${from}`;
        }
        if (up) {
            return `milage: up ${up}`;
        }
        else {
            return "milage: any"
        }
    }

    public resetValue() {
        return {
            milageFrom: "",
            milageUp: ""
        };
    }
}