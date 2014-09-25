var parse = require('minimist');
var XLS = require('xlsjs');
var XLSX = require('xlsx');

var argOptions = {
    alias: {
        filename: 'f'
    },
    "default": {
        filename: 'goodtest.xls'
    }
};
var argv = parse(process.argv.slice(2), argOptions);
var rows = [];
var Name = argv.filename;

if (Name.match('\.xls$')) {
    var wb = XLS.readFile(Name); // XLS.read(data, {type: 'binary'});
} else if (Name.match('\.xlsx$')) {
    var wb = XLSX.readFile(Name); // XLSX.read(data, {type: 'binary'});
} else {
    console.error('File must have .xls or .xlsx extension.');
};

var name_list = wb.SheetNames;
var sheet = wb.Sheets[name_list[0]];
for (var i = 1; i <= 10; ++i) {
    var index = "C" + i.toString();
    var cell = sheet[index].v.toString();
    rows.push(cell);
}

var validateFile = function (rows) {
    var cell;
    var validbit = 1;
    for (var i = 0; i < rows.length; ++i) {
        cell = rows[i];
        if (!cell.match(/[^LRB+]/) && !cell.match(/[\s]/)) {
            if (cell.match(/[+]/)) {
                if (!cell.match(/\+(?=L)/g) && !cell.match(/\+(?=R)/g) && 
                    !cell.match(/\+(?=B)/g)) {
                    validbit = 0;
                    console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
                    continue;
                }
                if (cell.match(/\+\+/g)) {
                    validbit = 0;
                    console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
                    continue;
                }
                if (cell.match(/^\+/g)) {
                    validbit = 0;
                    console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
                    continue;
                }
                if (cell.match(/\+$/g)) {
                    validbit = 0;
                    console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
                }
            } else {
                if (cell.match(/L(?=L)/g) || cell.match(/L(?=R)/g) || cell.match(/L(?=B)/g) || 
                    cell.match(/R(?=L)/g) || cell.match(/R(?=R)/g) || cell.match(/R(?=B)/g) ||
                    cell.match(/B(?=L)/g) || cell.match(/B(?=R)/g) || cell.match(/B(?=B)/g)) {
                    validbit = 0;
                    console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
                }
            };
        } else {
            validbit = 0;
            console.error('Invalid entry at row ' + (i+1) + ': "' + cell + '"');
        };
    };
    if (validbit == 1) {
        console.log('File is valid!');
        return true;
    } else {
        return false;
    };
};

validateFile(rows);
