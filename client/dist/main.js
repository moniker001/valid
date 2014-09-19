//-----------------------------------------------------------------------------
// Host and port configuration
var host = '128.135.17.84'  // midway-login2 is 128.135.112.72
var port = 8001
//-----------------------------------------------------------------------------

var validateFields = function () { // Validate form fields
    var msg = document.getElementById('msg');
    var first = document.getElementById("firstname").value.match(/^[a-zA-Z]+$/);
    var last = document.getElementById("lastname").value.match(/^[a-zA-Z]+$/);
    if (first && last) {
        return true;
    } else {
        msg.style.color = "red";
        msg.innerHTML = "Form fields must be filled and contain only letters";
        return false;
    }
};

var validateFile = function (File) { // Validate uploaded file
    var msg = document.getElementById('msg');
    if (File.name.match('\.xls$') || File.name.match('\.xlsx$')) {
        var cell;
        for (var i = 0; i < rows.length; ++i) {
            cell = rows[i];
            if (!cell.match(/[^LRB+]/) && !cell.match(/[\s]/)) {
                if (cell.match(/[+]/)) {
                    if (!cell.match(/\+(?=L)/g) && !cell.match(/\+(?=R)/g) && 
                        !cell.match(/\+(?=B)/g)) {
                        valid = 0;
                        return false;
                    }
                    if (cell.match(/\+\+/g)) {
                        valid = 0;
                        return false;
                    }
                    if (cell.match(/^\+/g)) {
                        valid = 0;
                        return false;
                    }
                    if (cell.match(/\+$/g)) {
                        valid = 0;
                        return false;
                    }
                } else {
                    if (cell.match(/L(?=L)/g) || cell.match(/L(?=R)/g) || cell.match(/L(?=B)/g) || 
                        cell.match(/R(?=L)/g) || cell.match(/R(?=R)/g) || cell.match(/R(?=B)/g) ||
                        cell.match(/B(?=L)/g) || cell.match(/B(?=R)/g) || cell.match(/B(?=B)/g)) {
                        valid = 0;
                        return false;
                    }
                }
            } else {
                valid = 0;
                return false;
            }
        }
        valid = 1;
        return true;
    } else {
        msg.style.color = 'red';
        msg.innerHTML = "Files must have .xls or .xlsx extension.";
        valid = 0;
        return false;
    }
};

var handleFileSelect = function (e) { // Display uploaded file description
    var list = document.getElementById('list');
    var f = e.target.files[0];
    var output = [];
    output.push(
        '<li class="list-group-item"><strong>',
        escape(f.name),
        '</strong> (',
        f.type || 'n/a',
        ') - ',
        f.size,
        ' bytes, last modified: ',
        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        '</li>');
    list.innerHTML = '<ul class="list-group">' + output.join('') + '</ul>';
    list.style.display = 'block';
};

var handleDragOver = function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};

var sendForm = function () { // Send form data to server
    var formData = new FormData();
    var fname = document.getElementById('firstname').value;
    var lname = document.getElementById('lastname').value;
    var upload = document.getElementById('files').files[0];
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('upload', upload);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://'+host+':'+port+'/submit', true);
    xhr.onload = function(e) {
        if (this.status==200) {console.log('Form sent!')};
    };
    xhr.send(formData);
};

var load = function (e) { // When file is uploaded, display file info and validate
    var reader;
    var File = this.files[0];
    var msg = document.getElementById('msg');
    var badfile = document.getElementById('badfile');
    var Name = File.name;
    filename.textContent = Name;
    reader = new FileReader();
    reader.onload = function(e) {
        rows = [];
        var data = e.target.result;
        if (Name.match('\.xls$')) {
            var wb = XLS.read(data, {type: 'binary'});
        } else if (Name.match('\.xlsx$')) {
            var wb = XLSX.read(data, {type: 'binary'});
        }
        var name_list = wb.SheetNames;
        var sheet = wb.Sheets[name_list[0]];
        for (var i = 1; i <= 10; ++i) {
            var index = "C" + i.toString();
            var cell = sheet[index].v.toString();
            rows.push(cell);
        }
        document.getElementById('data').innerHTML = rows;
        document.getElementById('badfile').innerHTML = '';
        if (validateFile(File)) {
            msg.style.color = 'green';
            msg.innerHTML = "Valid.";
        } else {
            msg.style.color = 'red';
            msg.innerHTML = "Please fix data.";
            badfile.style.color = 'red';
            badfile.innerHTML = "Please fix the following file: " + Name;
            return;
        }
    };
    reader.readAsBinaryString(File);
};

var clearFileInput = function clearFileInput() { // Create new file input element
    var oldInput = document.getElementById('files');
    var newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.id = oldInput.id;
    newInput.name = oldInput.name;
    newInput.className = oldInput.className;
    newInput.style.cssText = oldInput.style.cssText;
    newInput.addEventListener('change', handleFileSelect);
    newInput.addEventListener('change', load, false);
    oldInput.parentNode.replaceChild(newInput, oldInput);
};

var submitFunc = function () { // Submit button
    var msg = document.getElementById('msg');
            var badfile = document.getElementById('badfile');
    if (validateFields() && valid === 1) {
        sendForm();
        msg.style.color = 'green';		
        msg.innerHTML = "Submitted!";
        badfile.innerHTML = "";
        valid = 0;
    } else {
        msg.style.color = 'red';		
        msg.innerHTML = "Submission failed!";
        badfile.style.color = 'red';
        badfile.innerHTML = "Please make sure name fields are filled in and files are valid.";
    }
};

var resetFunc = function () { // Reset button
    rows = [];
    valid = 0;
    document.getElementById('submit').innerHTML = "Submit"
    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('list').style.display = 'none';
    document.getElementById('msg').style.color = '#777';
    document.getElementById('msg').innerHTML = "Validation message here";
    document.getElementById('badfile').innerHTML = "";
    document.getElementById('data').innerHTML = "";
    document.getElementById('filename').innerHTML = "";
    clearFileInput();
};

(function () {
    var rows = [];
    var valid = 0;
    files.addEventListener('change', load, false);
    var dropZone = document.getElementById('drop_zone'); // Setup the drag&drop listeners.
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
}).call(this);
