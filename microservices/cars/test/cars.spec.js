"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const superagent = require('superagent');
const app = require('../server/server');
var server;
describe('CAR API TESTS', function () {

  before(function () {
    app.rabbit = {
      publish: sinon.stub()
    }
  });

  beforeEach(function (done) {
    server = app.listen('3010', done);
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('should get cars from database', function (done) {
    superagent
      .get('http://localhost:3010/api/Cars/')
      .set('Content-Type', 'application/json')
      .end(function (err, result) {
        if (err) { return done(err); }
        assert.equal(result.status, 200);
        result.body.should.be.a('array');
        done();
      });
  });

  it('should create new car', function (done) {
    superagent
      .post('http://localhost:3010/api/Cars/new')
      .send({ makerName: 'SUPERCAR', modelName: 'X3' })
      .set('Content-Type', 'application/json')
      .set('X-PRINCIPLE', 'user-id')
      .end(function (err, result) {
        if (err) { return done(err); }
        assert.equal(result.status, 200);
        assert.equal(result.body.car.makerName, 'SUPERCAR');
        assert.equal(result.body.car.userId, 'user-id');
        assert.equal(app.rabbit.publish.calledWith('tracker', {
          action: 'track',
          value: {
            carId: `${result.body.car.id}`,
            image: '/build/cl/assets/img/default.png',
            description: `${result.body.car.makerName}, ${result.body.car.modelName}`
          }
        }), true);
        done();
      })
  });

  it('should fire 400 error code if principle is not set', function (done) {
    superagent
      .post('http://localhost:3010/api/Cars/getusercars')
      .set('Content-Type', 'application/json')
      //.set('X-PRINCIPLE', 'user-id')
      .end((err, result) => {
        assert.equal(result.status, 400);
        should.exist(err);
        done();
      })
  });

  it('should delete car', function (done) {
    superagent
      .post('http://localhost:3010/api/Cars/new')
      .send({ makerName: 'SUPERCAR', modelName: 'X3' })
      .set('Content-Type', 'application/json')
      .set('X-PRINCIPLE', 'user-id')
      .end((err, result) => {
        if (err) { return done(err); }
        let id = result.body.car.id
        superagent
          .delete(`http://localhost:3010/api/Cars/${id}`)
          .set('X-PRINCIPLE', 'user-id')
          .end(function (err, result) {
            if (err) { return done(err); }
            assert.equal(result.status, 200);
            done();
          })
      })
  });
});