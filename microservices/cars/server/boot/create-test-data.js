//var async = require("async");

module.exports = function (app, cb) {
    var CarModel = app.models.CarModel;
    var Maker = app.models.Maker;
    var Car = app.models.Car;
    var CarOption = app.models.CarOption;
    var EngineType = app.models.EngineType;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRundomColor() {
        return ["beige", "violet", "red", "green", "white", "silver", "yellow", "black", "purple", "blue", "brown", "orange"][getRandomInt(0, 12)]
    }

    Maker.find({}, (err, makers) => {        
        if (!makers || makers.length == 0) {
            Maker.create([
                { name: 'BMW' },
                { name: 'AUDI' },
                { name: 'PORSHE' },
            ], (err, makers) => {
                if (err) throw err;

                console.log("CREATED TEST MAKERS:", makers.map(maker => maker.name));

                CarModel.find({}, (err, carModels) => {                    
                    if (!carModels || carModels.length == 0) {
                        CarModel.create([
                            { name: 'M5', makerId: makers[0].id },
                            { name: 'X3', makerId: makers[0].id },
                            { name: '525', makerId: makers[0].id },
                            { name: '318', makerId: makers[0].id },

                            { name: 'A4', makerId: makers[1].id },
                            { name: 'A5', makerId: makers[1].id },
                            { name: 'A8', makerId: makers[1].id },

                            { name: 'Cayman', makerId: makers[2].id },
                            { name: 'Panamera', makerId: makers[2].id }
                        ], (err, models) => {
                            console.log("CREATED TEST MODELS: ", models.map(model => model.name));

                            var cars = [];
                            for (var i = 0; i < 200; i++) {
                                var car = {
                                    images: [{ url: "/build/cl/assets/images/bmw.jpg", key: 'key' }],
                                    milage: getRandomInt(0, 250000),
                                    year: getRandomInt(1980, 2015),
                                    price: getRandomInt(500, 25000),
                                    added: Date.now(),
                                    makerName: 'BMW',
                                    modelName: models[getRandomInt(0, 4)].name,
                                    color: getRundomColor(),
                                    makerId: makers[0].id,
                                    carModelId: models[getRandomInt(0, 4)].id,

                                }
                                cars.push(car)
                            }


                            for (var i = 0; i < 200; i++) {
                                var car = {
                                    images: [{ url: "/build/cl/assets/images/audi.jpg", key: 'key' }],
                                    milage: getRandomInt(0, 250000),
                                    year: getRandomInt(1980, 2015),
                                    price: getRandomInt(500, 25000),
                                    added: Date.now(),
                                    makerName: 'AUDI',
                                    modelName: models[getRandomInt(4, 7)].name,
                                    color: getRundomColor(),
                                    makerId: makers[1].id,
                                    carModelId: models[getRandomInt(4, 7)].id,

                                }
                                cars.push(car)
                            }


                            for (var i = 0; i < 200; i++) {
                                var car = {
                                    images: [{ url: "/build/cl/assets/images/tesla.jpg", key: 'key' }],
                                    milage: getRandomInt(0, 250000),
                                    year: getRandomInt(1980, 2015),
                                    price: getRandomInt(500, 25000),
                                    added: Date.now(),
                                    makerName: 'PORSHE',
                                    modelName: models[getRandomInt(7, 9)].name,
                                    color: getRundomColor(),
                                    makerId: makers[2].id,
                                    carModelId: models[getRandomInt(7, 9)].id,
                                }
                                cars.push(car)
                            }
                            CarOption.create([
                                { name: "b1", description: "Cruise control" },
                                { name: "b2", description: "Air conditioning" },
                                { name: "b3", description: "Central locking" },
                                { name: "b4", description: "Navigation system" },
                                { name: "b5", description: "Electric side mirrow" },
                                { name: "b6", description: "Rain sensor" }
                            ], (err, options) => {
                                var engines = [
                                    { name: "e1", description: "Pertol" },
                                    { name: "e2", description: "Diesel" },
                                    { name: "e3", description: "Hybrid" },
                                    { name: "e4", description: "Electric" }
                                ]

                                EngineType.create(engines, (err, engines) => {
                                    cars.forEach((car) => {
                                        car.engineType = engines[getRandomInt(0, 4)].name;
                                        Car.create(car, (err, car) => {
                                            car.carOptions.add(options[0], (err, options) => {

                                            })
                                        })
                                    });
                                    cb()
                                })
                            })
                        });
                    }
                })
            })
        } else {
            cb()
        }
    })
};