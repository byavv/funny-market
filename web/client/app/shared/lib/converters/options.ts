import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";
import {FilterModel} from "../../models/filter";

@Converter({
    converterId: "options",
    roteParams: ["options"]
})
export class OptionsConverter extends ConverterBase {

    public convert(value): any {
        value = value[0];

        if (!value) {
            return {
                value: { options: [] },
                active: false
            }
        } else {
            var params: Array<string> = value.split(',');

            return {
                value: {
                    options: params
                },
                active: true
            };
        }
    }
    public convertToRoute(value): any {
        if (value) {
            value = value.options || [];
            return (value.length > 0)
                ? { options: value.join() }
                : null;
        } else {
            return null;
        }
    }
    public convertToView(value) {
        var filterValue = value.options;
        if (Array.isArray(filterValue) && filterValue.length > 0) {
            return `${filterValue.length} options`;
        } else {
            return "not care"
        }
    }
    public resetValue() {
        return {
            options: []
        };
    }
}
