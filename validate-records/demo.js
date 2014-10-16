'use strict';

var fs = require('fs'),
    ndj = require('ndjson'),    // split-and-parse each newline-delim json record
    Validator = require('./');

var dataFile = './records.ndj',
    schema = './rec.schema.js',
    valid = new Validator(schema);

var i = 0,
    report = [];   // log of invalid records

fs.createReadStream(dataFile)
    .pipe(ndj.parse())
    .on('data', function (rec) {
        var err = valid.validateRec(rec);
        if (err) {
            report.push({ index: i, errors: err });
        }
        i = i + 1;
    })
    .on('end', function () {
        console.log(report);
    });
