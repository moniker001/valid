'use strict';

(function () {

    var Validator = function (schema) {

        if (typeof schema === 'string') {
            schema = require(schema);
        }
        this.schema = schema;
        this.records = [];
        this.report = {
            invalid: 0,     // total invalid records
            errors: {}      // errors keyed by record number
        };
    };


    Validator.prototype.validateRec = function (rec) {

        var errors = [],
            field,
            value,
            error;

        for (field in this.schema) {
            value = rec[field];
            error = this.schema[field](value);
            if (error) {
                errors.push(error);
            }
        }

        if (errors.length) { return errors; }   // undefined unless errors
    };


    Validator.prototype.validate = function (records) {

        var rec, errors, invalid, i, il, j, jl;
        this.records = records;

        for (i = 0, il = records.length; i < il; ++i) {
            rec = records[i];
            errors = this.validateRec(rec);
            invalid = errors ? errors.length : 0;
            if (invalid !== 0) {
                this.report.invalid += invalid;
                if (!this.report.errors.hasOwnProperty(i)) {
                    this.report.errors[i] = [];
                }
                for (j = 0, jl = errors.length; j < jl; ++j) {
                    this.report.errors[i].push(errors[j]);
                }
            }
        }
        return this;
    };


    Validator.prototype.printReport = function () {

        var num, error, i, il;

        console.log(this.report.invalid + " invalid values");

        for (num in this.report.errors) {
            error = this.report.errors[num];
            console.log("\nREC " + num + ":");
            for (i = 0, il = error.length; i < il; ++i) {
                if (typeof error[i] !== 'string') {
                    console.log(JSON.stringify(error[i]));
                }
                console.log("  " + error[i]);
            }
        }
    };

    module.exports = Validator;
}());
