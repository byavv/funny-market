"use strict"
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const sinon = require('sinon')

const superagent = require('superagent');
const app = require('../server/server');
const request = require("supertest")(app)
var server;
describe('SEARCH API TESTS', function () {

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

    it('should find cars in database', function (done) {
        superagent
            .post('http://localhost:3010/api/search')
            .set('Content-Type', 'application/json')
            .end(function (err, result) {
                if (err) { return done(err); }
                assert.equal(result.status, 200);
                result.body.should.be.a('object');
                result.body.should.have.property('cars');
                result.body.should.have.property('count')
                done();
            });
    });
});