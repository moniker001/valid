'use strict';

// helper function to format reply for invalid values
var invalidReply = function (col, val, reason) {

    var value = '`' + val + '`';
    return [col, '=', value, reason].join(' ');
};


// specify your schema: constraints for particular columns
module.exports = {

    LRB: function (v) {
        var column = 'LRB';
        if (v) {
            if (!/^[LRB](?:\+[LRB])*$/.test(v)) {
                return invalidReply(column, v, 'is an invalid value');
            }
        }
    },

    XYZ: function (v) {
        var column = 'XYZ';
        if (v) {
            if (!/^[xyz]$/.test(v)) {
                return invalidReply(column, v, 'is an invalid value');
            }
        }
    }
    
    Time: function (v) {
        var column = 'Time';
        if (v) {
            if (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v)) {
                if (/[\s]/.test(v)) {
                    return invalidReply(column, v, 'Entry cannot contain space');
                };
                if (/[^:0-9]/.test(v)) {
                    return invalidReply(column, v, 'No letters or symbols other than colon');
                };
                if (/:{2}/g.test(v)) {
                    return invalidReply(column, v, 'Missing at least one colon');
                }
                if (/^[0-9][0-9][0-9][0-9]:[0-9][0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Missing a colon between hours and minutes');
                }
                if (/^[0-9][0-9]:[0-9][0-9][0-9][0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Missing a colon between minutes and seconds');
                }
                if (!/[:]/.test(v)) {
                    return invalidReply(column, v, 'Missing both colons');
                }          
                if (/:[0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Need two digits for seconds');
                };
                if (!/:[0-5][0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Out of range for seconds');
                };
                if (/^[0-9]:/.test(v)) {
                    return invalidReply(column, v, 'Need two digits for hours');
                }
                if (!/^(0[0-9])|(1[0-9])|(2[0-3]):/.test(v)) {
                    return invalidReply(column, v, 'Out of range for hours');
                }
                if (/^(0[0-9]|1[0-9]|2[0-3]):[0-9]:[0-5][0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Need two digits for minutes');
                }
                if (/^(0[0-9]|1[0-9]|2[0-3]):[0-9][0-9]:[0-5][0-9]$/.test(v)) {
                    return invalidReply(column, v, 'Out of range for minutes');
                }
                return invalidReply(column, v, 'Something is still wrong...');
            }
        }
    }
};
