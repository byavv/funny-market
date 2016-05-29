var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.should();

describe('/test', function () {

    var server = require('../server/server');
    var request = require('supertest')(server);

    before(function () {
       // Student = server.models.Student
    });

    beforeEach(function (done) {
       // Student.upsert({ id: 1, points: 5000 }, function () { done() })
       done();
    });

    it('MOM 3', function () {
      //  request.post('/api/Students').send({ points: 5000 }).expect(200, done)
      assert.lengthOf("mom", 3);
    });
});