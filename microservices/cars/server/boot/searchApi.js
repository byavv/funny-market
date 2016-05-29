module.exports = function (server) {
    var router = server.loopback.Router();
    var Car = server.models.Car;
    var CarModel = server.models.CarModel;
    var CarOption = server.models.CarOption;
    var Maker = server.models.Maker;
    var EngineType = server.models.EngineType;

    router.post("/api/getcount", (req, res) => {
        var query = _createFilterQuery(req.body);
        Car.count(query, (err, count) => {
            return res.status(200).send({ count: count });
        })
    });

    router.post("/api/search", (req, res) => {
        var query = _createFilterQuery(req.body);
        var optionsQuery = _createOptionsQuery(req.body);
        Car.count(query, (err, count) => {
            var dbQuery = Object.assign({ where: query }, optionsQuery);
            Car.find(dbQuery, (err, cars) => {
                return res.status(200).send({ cars: cars, count: count });
            })
        })
    })
    server.use(router);
};

function _createOptionsQuery(request) {
    var query = {};
    if (request.sort) {
        var sort = request.sort;
        var sort = sort.replace('+', " ASC");
        var sort = sort.replace("-", " DESC");
        Object.assign(query, { order: sort })
    }
    if (request.limit) {
        Object.assign(query, { limit: +request.limit })
    }
    if (request.limit && request.page) {
        Object.assign(query, { skip: (+request.limit) * (+request.page - 1) })
    }
    return query;
}

function _createFilterQuery(request) {
    var query = [];
    if (request) {
        if (request.model) {
            query.push({ modelName: request.model });
        }
        if (request.maker) {
            query.push({ makerName: request.maker });
        }
        if (request.priceFrom) {
            query.push({ price: { gte: parseInt(request.priceFrom) } });
        }
        if (request.priceUp) {
            query.push({ price: { lte: parseInt(request.priceUp) } });
        }
        if (request.yearFrom) {
            query.push({ year: { gte: parseInt(request.yearFrom) } });
        }
        if (request.yearUp) {
            query.push({ year: { lte: parseInt(request.yearUp) } });
        }
        if (request.colors && request.colors.length > 0) {
            query.push({ color: { inq: request.colors } });
        }
        if (request.milageUp) {
            query.push({ milage: { lte: request.milageUp } });
        }
        if (request.milageFrom) {
            query.push({ milage: { gte: request.milageFrom } });
        }
        if (request.engineTypes && request.engineTypes.length > 0) {
            query.push({ engineType: { inq: request.engineTypes } });
        }
    }
    return query.length > 0 ? { and: query } : {};
}