/*jslint node: true */
"use strict";
const readline = require('readline'),
    ping = require('ping'),
    debug = require('debug')('proxy'),
    registry = require('etcd-registry'),
    async = require('async'),
    console = require('better-console'),
    os = require('os')
    ;
function printStats(stats) {
    process.stdout.write(EOL + stats.toString(STATS_OPTIONS) + EOL);
}
/**
 * Simplest client possible, handy for development. Only two command available: 
 * 'stat' to see microservices topology and current status,
 * 'lookup' to print proxy's lookup table
 */
module.exports = (app) => {
    const rl = readline.createInterface(process.stdin, process.stdout);
    let proxyTable = app.get('proxyTable') || [];
    let accessTable = app.get('access') || [];
    var hosts = proxyTable.map((rule) => rule.mapTo);
    rl.prompt();
    rl.on('line', (line) => {
        switch (line.trim()) {
            case 'stat':
                async.map(hosts, (host, callback) => {
                    console.log(host)
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
                        process.stdout.write(os.EOL);
                        console.log(err);
                    }
                    else {
                        console.log('SOMETHING');
                        console.log('\n');
                        console.table(table);
                        console.log('\n');
                    }
                });
                break;
            case 'lookup':
                let lookupTable = proxyTable.map((rule) => {
                    let auth = accessTable.find(entry => rule.rule.match(new RegExp(entry.url)));
                    return {
                        "ENTRY": rule.rule,
                        "": "  \u2192  ",
                        'PASS': `$(${rule.mapTo})${rule.withPath}`,
                        'AUTH': `${auth ? auth.grant : '*'}`
                    };
                });
                console.log('\n');
                console.table(lookupTable);
                console.log('\n');
                break;
            case 'help':
                console.log("Command available:\n");
                console.log("'stat', to see registered microservices topology");
                console.log("'lookup', to see proxy table");
                break;
            default:
                if (line) console.warn(`${line.trim()} is not a command, type 'help' to see the list of commands `);
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Bye');
    });
};