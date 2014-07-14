var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra'),
    qt   = require('quickthumb'),
    easyimg = require("easyimage");
var gm = require('gm').subClass({ imageMagick: true });

// Use quickthumb
app.use(qt.static(__dirname + '/'));

app.post('/upload', function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
});



/*easyimg.info('./uploads/90125.jpeg', function(err, stdout, stderr) {
    if (err) throw err;
    console.log(stdout);
});*/



// Show the upload form
app.get('/', function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html' });
    /* Display the file upload form. */
    form = '<form action="/upload" enctype="multipart/form-data" method="post">' + '<input name="title" type="text" />' + '<input multiple="multiple" name="upload" type="file" />' + '<input type="submit" value="Upload" />' + '</form>';
    res.end(form);
});

app.listen(3001);

jj

/*
gm('./uploads/90125.jpeg')
    .resize(300, 300)
    .write('./uploads/small/90125-300x300.jpeg', function (err) {
        if (err) throw err
        else
        console.log(' hooray! ');
    });
*/

