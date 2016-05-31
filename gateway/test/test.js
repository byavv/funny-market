var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.should();

describe('/test', function () {
  var server = require('../server/server');
  var request = require('supertest')(server);

  before(function () {
  });

  beforeEach(function (done) {
    done();
  });

  it('MEGATEST', function () {
    assert.lengthOf("wow", 3);
  });
});