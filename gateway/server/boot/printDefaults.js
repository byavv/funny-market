/*jslint node: true */
"use strict";
const ping = require('ping'),
    debug = require('debug')('proxy'),
    registry = require('etcd-registry'),
    async = require('async'),
    console = require('better-console'),
    os = require('os')
    ;

module.exports = (app, done) => {    
    let proxyTable = app.get('proxyTable') || [];
    let accessTable = app.get('access') || [];
    let hosts = proxyTable.map((rule) => rule.mapTo);
    async.map(hosts, (host, callback) => {
        app.lookup(host).then((service) => {
            if (!service) {
                callback(null, { "NAME": host, "HOST": 'N/A', "STATUS": 'not registered' });
            } else {
                ping.sys.probe(service.hostname, (isAlive) => {
                    callback(null, { "NAME": host, "HOST": service.hostname, 'STATUS': isAlive ? 'alive' : 'dead' });
                });
            }
        }).catch(err => {
            callback(null, { "NAME": host, "HOST": 'n/a', 'STATUS': 'dead' });
        });
    }, (err, table) => {
        if (err) {
            console.log(err);
        }
        else {
            var cleanedTable = []
            table.forEach(row => {
                if (!cleanedTable.find((tblRow) => tblRow.NAME == row.NAME)) {
                    cleanedTable.push(row)
                }
            })
            console.table(cleanedTable);
        }
        done();
    });
    let lookupTable = proxyTable.map((rule) => {
        let auth = accessTable.find(entry => rule.rule.match(new RegExp(entry.url)));
        return {
            "ENTRY": rule.rule,
            "": "  \u2192  ",
            'PASS': `$(${rule.mapTo})${rule.withPath}`,
            'ACL': `${auth ? auth.grant : '*'}`
        };
    });
    console.table(lookupTable);
};
