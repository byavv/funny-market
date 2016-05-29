import {MakerFilterComponent} from "./makerFilter";
import {YearFilterComponent} from "./yearFilter";
import {PriceFilterComponent} from "./priceFilter";
import {MilageFilterComponent} from "./milageFilter";
import {ColorFilterComponent} from "./colorFilter";
import {EngineTypeFilterComponent} from "./engineTypeFilter";
import {OptionsFilterComponent} from "./optionsFilter";

export * from "./makerFilter";
export * from "./yearFilter";
export * from "./priceFilter";
export * from "./milageFilter";
export * from "./colorFilter";
export * from "./engineTypeFilter";
export * from "./optionsFilter";

export var allFilters = [
    MakerFilterComponent,
    YearFilterComponent,
    PriceFilterComponent,
    MilageFilterComponent,
    ColorFilterComponent,
    EngineTypeFilterComponent,
    OptionsFilterComponent
]
