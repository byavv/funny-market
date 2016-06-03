var app = require('../server/server');
var fakeData = require('./fakeUsers');
module.exports = function (done) {
  if (app.loaded) {
    app.once('started', () => {
      fakeData(app, done);
    });
    app.start();
  } else {
    app.once('loaded', function () {
      app.once('started', () => {
        fakeData(app, done);
      });
      app.start();
    });
  }
};