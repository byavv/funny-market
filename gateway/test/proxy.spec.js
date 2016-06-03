/*jslint node: true, mocha:true*/
"use strict";
const express = require('express'),
    chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    NotAuthorizedError = require("../server/lib/errors").err401,
    GatewayError = require("../server/lib/errors").err502,
    request = require('supertest')('http://localhost:3001')
    ;

chai.should();

describe('PROXY TESTS', function () {
    var app = require('../server/server');
    var httpServer, fakeHttpServer1, fakeHttpServer2;

    var fakeServer1 = express();
    fakeServer1.get('/api', function (req, res) {
        res.status(200).json({ name: 'potter' });
    });
    var fakeServer2 = express();
    fakeServer2.get('/blach/api', function (req, res) {
        res.status(200).json({ name: 'tobi' });
    });
    fakeServer2.get('/', function (req, res) {
        res.status(200).json({ name: 'ron' });
    });
    fakeServer2.post('/', function (req, res, next) {
        return next(new NotAuthorizedError("error"));
    });

    before(require('./start-server'));

    before(() => {
        app.lookup = sinon.stub(app, "lookup", (name) => {
            return new Promise((resolve, reject) => {
                switch (name) {
                    case 'fakeserver1':
                        resolve({
                            url: "http://localhost:3232",
                            name: name
                        });
                        break;
                    case 'fakeserver2':
                        resolve({
                            url: "http://localhost:3233",
                            name: name
                        });
                        break;
                    case 'fakeserver_err':
                        reject(new GatewayError("Service cant be found for some reason"));
                        break;
                    default:
                        break;
                }
            });
        });
    });
    before((done) => {
        fakeHttpServer1 = fakeServer1.listen(3232, done);
    });
    before((done) => {
        fakeHttpServer2 = fakeServer2.listen(3233, done);
    });

    after(function (done) {
        app.lookup.restore();
        app.close(done);
    });
    after(function (done) {
        fakeHttpServer1.close(done);
    });
    after(function (done) {
        fakeHttpServer2.close(done);
    });

    it('should lookup service', (done) => {
        request
            .get('/fake1')
            .end(function (err, result) {
                if (err) { return done(err); }
                try {
                    assert(app.lookup.calledWith('fakeserver1'));
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('should pass request to server', function (done) {
        request
            .get('/fake3')
            .set('Content-Type', 'application/json')
            .expect(200, done);
    });

    it('should throw 502 when target is not awailable', function (done) {
        request
            .get('/not/exists')
            .set('Content-Type', 'application/json')
            .expect(502, done);
    });

    it('should throw when target throw', function (done) {
        request
            .post('/fake3')
            .set('Content-Type', 'application/json')
            .expect(401, done);
    });

    it('should throw when target discovering error', function (done) {
        request
            .post('/fake7')
            .set('Content-Type', 'application/json')
            .expect(502, done);
    });

    it('should add path then request target', function (done) {
        request
            .get('/fake2')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, result) {
                if (err) { return done(err); }
                assert(app.lookup.calledWith('fakeserver2'));
                result.body.should.be.a('object');
                assert.equal(result.body.name, 'tobi');
                done();
            });
    });
});