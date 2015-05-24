//var Cover = require('models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');



var dir1 = "public/img";
var dir = "xsmall/";
var dir3 = "xxsmall/";
var dim = 200;

function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = 'img/' + files[i];
        files_.push(name);
    }
    return files_;
}

var allcovers = getFiles(dir1);

function resize (x,image) {
    var oldImg = './public/'.concat(image);
    var newImg = './public/'.concat(image.replace('img/', dir3));
    gm(oldImg)
        .resize(x, x)
        .write(newImg, function (err) {
            if (err) throw err
        });
}

function ras () {
    for (var i = 0; i < 300; i++) {
        resize(dim, allcovers[i])
    }
   /* for (i = 300; i < 600; i++) {
        resize(dim, allcovers[i])
    }
    for (i = 600; i < 900; i++) {
        resize(dim, allcovers[i])
    }*/
    /*for (i = 900; i < allcovers.length; i++) {
        resize(dim, allcovers[i])
    }*/
}

ras();
/*
Cover.find({}).sort({'artist': 1}).exec(function(err, covers, next) {
    if (err) return next(err);
    for (var i=0;i<100;i++){
        resize(dim, covers[i].bPicture)
    }
    console.log('hooray!');
});*/


//exports.resize = resize;