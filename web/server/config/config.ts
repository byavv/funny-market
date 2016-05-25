"use strict";
import * as path from "path";
import * as fs from "fs";
import * as nconf from "nconf";

/**
 * Create app configuration
 */
export function configure() {
    nconf.argv().env();  
    nconf.file("app", {
        file: 'config.json',
        dir: __dirname,
        search: true
    });  
}

