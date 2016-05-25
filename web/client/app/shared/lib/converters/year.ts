import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";

@Converter({
    converterId: "year",
    roteParams: ["year"]
})
export class YearConverter extends ConverterBase {

    public convert(value) {
        value = value[0];
        let yearFrom, yearUp;
        yearFrom = yearUp = "";
        let active = false;

        if (this.isNumeric(value)) {
            yearFrom = yearUp = value;
        } else {
            if (this.isString(value) && value.includes("..")) {
                let params = value.split('..');
                yearFrom = +params[0] || "";
                yearUp = +params[1] || "";
                active = true;
            }
        }
        return {
            value: { yearFrom, yearUp },
            active: active
        };
    }

    public convertToRoute(value): any {
        if (value.yearFrom || value.yearUp) {
            if (value.yearFrom === value.yearUp) {
                return { year: value.yearFrom };
            } else {
                return { year: `${value.yearFrom || ''}..${value.yearUp || ''}` };
            }
        } else {
            return { year: 'any' };
        }
    }

    public convertToView(value) {
        var from = value.yearFrom, up = value.yearUp;
        if (from && up) {
            return `year: ${from}...${up}`;
        }
        if (from) {
            return `year: from ${from}`;
        }
        if (up) {
            return `year: up ${up}`;
        }
        else{
            return "year: any"
        }
    }

    public resetValue() {
        return {
            yearFrom: "",
            yearUp: ""
        };
    }
}