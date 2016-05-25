export class FilterStateModel {
    maker: string;
    model: string;
    yearUp: number;
    yearFrom: number;
    priceUp: number;
    priceFrom: number;
    colors: Array<any>;
    milageFrom: number;
    milageUp: number;
    sort: string;;
    limit: number;
    page: number;
    options: Array<string>;
    engineTypes: Array<string>;

    constructor() {
        this.maker = "";
        this.priceUp = 0;
        this.priceFrom = 0;
        this.model = '';
        this.yearUp = 0;
        this.yearFrom = 0;
        this.colors = [];
        this.milageFrom = 0;
        this.milageUp = 0;
        this.sort = "price-"
        this.limit = 20;
        this.page = 1;
        this.options = [];
        this.engineTypes = [];
    }
}