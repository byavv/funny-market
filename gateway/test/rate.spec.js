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

var authHttp;
describe('RATE TESTS', function () {
    var httpServer;
    var fakeAuthServer = express();
    var app = require('../server/server');
    fakeAuthServer.post('/login', function (req, res) {
        res.status(200).json({ status: 'ok' });
    });

    before(require('./start-server'));

    before(() => {
        app.lookup = sinon.stub(app, "lookup", (name) => {
            return new Promise((resolve, reject) => {
                switch (name) {
                    case 'authserver':
                        resolve({
                            url: "http://localhost:3232",
                            name: name
                        });
                        break;
                    default:
                        break;
                }
            });
        });
    });

    before((done) => {
        authHttp = fakeAuthServer.listen(3232, done);
    });

    after(function (done) {
        app.lookup.restore();
        app.close(done);
    });
    
    after(function (done) {
        authHttp.close(done);
    });

    it('should limit requests', function (done) {
        request
            .post('/testauth/login')
            .expect(200)
            .end((err, res) => {
                assert.equal(res.get('X-RateLimit-Limit'), 2);
                done();
            });
    });
});