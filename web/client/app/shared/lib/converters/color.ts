import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";
import {FilterModel} from "../../models/filter"
@Converter({
    converterId: "color",
    roteParams: ["colors"]
})
export class ColorConverter extends ConverterBase {

    // convert from route to filter value
    // "red,green" --> ["red", "green"]
    public convert(value): any {
        value = value[0];

        if (!value) {
            return {
                value: { colors: [] },
                active: false
            }
        } else {
            var params: Array<string> = value.split(',');

            return {
                value: {
                    colors: params
                },
                active: true
            };
        }
    }

    // ["red", "green"] --> "red,green"
    public convertToRoute(value): any {
        if (value) {
            value = value.colors || [];
            return (value.length > 0)
                ? { colors: value.join() }
                : null;
        } else {
            return null;
        }
    }

    // how to present filter value to user
    public convertToView(value) {
        var filterValue = value.colors;
        if (Array.isArray(filterValue) && filterValue.length > 0) {
            return `${filterValue.length} colors`;
        } else {
            return "all colors"
        }
    }
    public resetValue() {
        return {
            colors: []
        };
    }

}
