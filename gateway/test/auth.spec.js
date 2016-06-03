/*jslint node: true, mocha:true*/
"use strict";
const express = require('express'),
    chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    errors = require("../server/lib/errors"),
    NotAuthorizedError = errors.err401,
    GatewayError = errors.err502
  //  request = require('supertest')('http://localhost:3001')
    ;
chai.should();

describe('AUTH TESTS', () => {
    var lookupSpy, User, fakeHttp, accessKey, user_user, user_admin;
    var app = require('../server/server');   
    var fakeData = require('./fakeUsers');   
    var fakeServer1 = express();
    var request = require('supertest')(app);
    var httpServer;
    fakeServer1.get('/api', (req, res) => {
        res.status(200).json({ name: 'potter', id: req.get('X-PRINCIPLE') });
    });
    fakeServer1.post('/api', (req, res) => {
        res.status(200).json({ name: 'potter', id: req.get('X-PRINCIPLE') });
    });
    fakeServer1.get('/api2', (req, res) => {
        res.status(200).json({ name: 'potter' });
    });
    fakeServer1.get('/api3', (req, res) => {
        res.status(200).json({ name: 'potter' });
    });
    fakeServer1.get('/api4', (req, res) => {
        res.status(200).json({ name: 'tobi' });
    });
  
    before(require('./start-server'));    
    before(() => {       
        User = app.models.user;
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
        fakeHttp = fakeServer1.listen(3232, done);
    });

    before((done) => {       
        User.login({
            username: 'potter',
            password: '111'
        }, 'user', (err, token) => {
            user_user = token;
            done();
        });
    });
    before((done) => {       
        User.login({
            username: 'ron',
            password: '222'
        }, 'user', (err, token) => {
            user_admin = token;
            done();
        });
    });

    after(function (done) {
        app.lookup.restore();
        app.close(done);
    });
    after(function (done) {
        fakeHttp.close(done);
    });

    it('should thow 401 when authorization header is not provided', function (done) {
        request
            .get('/fake4')
            .set('Content-Type', 'application/json')
            .expect(401, done);
    });

    it('should fail when token invalid', function (done) {
        request
            .get('/fake4')
            .set('Content-Type', 'application/json')
            .auth('invalid_token')
            .expect(401, done);
    });

    it('should pass when token valid and set X_PRINCIPLE', function (done) {
        request
            .get('/fake4')
            .set('Content-Type', 'application/json')
            .auth(user_user.id)
            .expect(200)
            .end(function (err, result) {
                if (err) { return done(err); }
                result.body.should.be.a('object');
                assert.equal(result.body.name, 'potter');
                assert.equal(result.body.id, user_user.userId);
                done();
            });
    });

    it('should throw 401 when user has not permissions', function (done) {
        request
            .post('/fake5')
            .set('Content-Type', 'application/json')
            .auth(user_user.id)
            .expect(401, done);
    });

    it('should throw 401 when required permission cant be applied to any role', function (done) {
        request
            .post('/unknown_role')
            .set('Content-Type', 'application/json')
            .auth(user_user.id)
            .expect(401, done);
    });

    it('should pass when user has permissions', function (done) {
        request
            .post('/fake5')
            .set('Content-Type', 'application/json')
            .auth(user_admin.id)
            .expect(200, done);
    });

    it('should pass when all default', function (done) {
        request
            .post('/fake6')
            .set('Content-Type', 'application/json')
            .expect(200, done);
    });
});