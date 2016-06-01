var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.should();

describe('profile test', function () {

  var server = require('../server/server');
  var request = require('supertest')(server);

  beforeEach(function (done) {
    done();
  });

  it('test', function () {
    assert.lengthOf("IMM", 3);
  });
});
