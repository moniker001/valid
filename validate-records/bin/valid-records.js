#!/usr/bin/env node 
'use strict';

var ndj = require('ndjson'),
    thru = require('through2'),
    argv = require('minimist')(process.argv.slice(2)),
    Validator = require('../');

if (!argv.schema) {
    var usage = 'valid-records --schema=your.schema.js < records.ndj';
    console.log(usage);
}

var valid = new Validator(argv.schema),
    i = 0;


var invalidFilter = thru.obj(function (rec, enc, next) {

    var errors = valid.validateRec(rec);
    if (errors) {
        this.push({ index: i, errors: errors });
    }
    i++;
    next();
});

process.stdin
    .pipe(ndj.parse())
    .pipe(invalidFilter)
    .pipe(ndj.serialize())
    .pipe(process.stdout);
