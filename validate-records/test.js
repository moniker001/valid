'use strict';

var test = require('tape'),
    check = require('rec.schema');


test('schema', function (t) {

    test('LRB column constraints', function (t) {

        t.equal(check.LRB(''), undefined, "permit empty strings");
        t.equal(check.LRB('X'), 'LRB = `X` is an invalid value');
        t.equal(check.LRB('L'), undefined);
        t.equal(
            check.LRB(' L'),
            'LRB = ` L` is an invalid value',
            "check for spacing"
        );
        t.equal(
            check.LRB('LL'),
            'LRB = `LL` is an invalid value',
            "require prefix operators"
        );
        t.equal(check.LRB('L+L'), undefined, "permit multiple code chars");
        t.equal(check.LRB('L+R'), undefined);
        t.equal(check.LRB('L+R+B'), undefined);
        t.equal(
            check.LRB('L+X'),
            'LRB = `L+X` is an invalid value',
            "only permit valid code chars"
        );
        t.equal(
            check.LRB('L + R'),
            'LRB = `L + R` is an invalid value',
            "do not permit inline spacing"
        );

        t.end();
    });

    test('XYZ column constraints', function (t) {

        t.plan(5);
        t.equal(check.XYZ(''), undefined, "permit empty strings");
        t.equal(check.XYZ('x'), undefined);
        t.equal(check.XYZ('y'), undefined);
        t.equal(check.XYZ('z'), undefined);
        t.equal(check.XYZ('q'), 'XYZ = `q` is an invalid value');
    });

    test('Time column constraints', function (t) {
        t.equal(check.Time(''), undefined, "permit empty strings");
        t.equal(check.Time('00:00:00'), undefined);
        t.equal(check.Time('01:00:00'), undefined);
        t.equal(check.Time('23:59:59'), undefined);
        t.equal(check.Time('24:00:00'), undefined, "check max for hours");
        t.equal(check.Time('00:60:00'), undefined, "check max for minutes");
        t.equal(check.Time('00:00:60'), undefined, "check max for seconds");
        t.equal(check.Time('00:00'), undefined, "check for hours, minutes, and seconds");
        t.equal(check.Time('0'), undefined, "check for hours, minutes, and seconds");
        t.equal(check.Time('1:01:01'), undefined, "permit only double digit for hours");
        t.equal(check.Time('01:1:01'), undefined, "permit only double digit for minutes");
        t.equal(check.Time('01:01:1'), undefined, "permit only double digit for seconds");
        t.equal(check.Time(' 01:01:01'), undefined, "do not permit whitespace");
    });

    t.end();
});


test('validate', function (t) {

    var records = [
            {"_ID": "22", "ROW": "1", "LRB": "L", "XYZ": "x"},
            {"_ID": "22", "ROW": "2", "LRB": "L+L", "XYZ": "y"},
            {"_ID": "22", "ROW": "3", "LRB": "L+ ", "XYZ": "z"},
            {"_ID": "22", "ROW": "4", "LRB": "L+R+B", "XYZ": "q"},
            {"_ID": "22", "ROW": "5", "LRB": "L+R+X", "XYZ": "b"}
        ],
        Validator = require('./'),
        valid = new Validator(check),
        results = valid.validate(records);

    t.plan(2);
    t.equal(results.report.invalid, 4);
    t.equal(Object.keys(results.report.errors).length, 3, "3 lines have errors");
});
