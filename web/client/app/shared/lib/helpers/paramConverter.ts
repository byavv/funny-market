import {FilterModel, FilterStateModel} from "../../models";

export function convertFromRoute(converters, routeParams): any {
    let filterState: FilterStateModel = new FilterStateModel();
    let filters = new Array<FilterModel>();
    converters
        .forEach((converter) => {
            var converterParams = [];
            converter.params.forEach((paramName) => {
                converterParams.push(routeParams[paramName]);
            });
            let filter = converter.convert(converterParams);
            Object.assign(filterState, filter.value);
            filters.push(Object.assign({ id: converter.converterId }, filter));
        });
    Object.assign(filterState,
        { page: +routeParams["page"] || 1 },
        { sort: routeParams["sort"] || "price-" },
        { limit: +routeParams["limit"] || 20 });
    return [filterState, filters]
}

export function convertToRoute(converters, filterState: FilterStateModel): any {
    var route = {};
    converters
        .forEach((converter) => {
            var roteParam = converter.convertToRoute(filterState);
            if (roteParam) {
                Object.assign(route, roteParam);
            }
        });
    if (filterState.page != 1)
        Object.assign(route, { page: filterState.page })
    if (filterState.sort != "price-")
        Object.assign(route, { sort: filterState.sort })
    if (filterState.limit != 20)
        Object.assign(route, { limit: filterState.limit })
    return route;
}