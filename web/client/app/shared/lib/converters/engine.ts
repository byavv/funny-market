import {ConverterBase} from "./ConverterBase";
import {Converter} from "../decorators";
import {FilterModel} from "../../models/filter"
@Converter({
    converterId: "typeng",
    roteParams: ["engineTypes"]
})
export class EngineTypeConverter extends ConverterBase {

    public convert(value): any {
        value = value[0];

        if (!value) {
            return {
                value: { engineTypes: [] },
                active: false
            }
        } else {
            var params: Array<string> = value.split(',');

            return {
                value: {
                    engineTypes: params
                },
                active: true
            };
        }
    }
    public convertToRoute(value): any {
        if (value) {
            value = value.engineTypes|| [];
            return (value.length > 0)
                ? { engineTypes: value.join() }
                : null;
        } else {
            return null;
        }
    }
    public convertToView(value) {
        var filterValue = value.engineTypes;
        if (Array.isArray(filterValue) && filterValue.length > 0) {
            return `${filterValue.length} engine types`;
        } else {
            return "all types"
        }
    }
    public resetValue() {
        return {
            engineTypes: []
        };
    }
}
