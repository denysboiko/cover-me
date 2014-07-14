var fs = require('fs');

var dir = "./public/img/";

function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = 'img/' + files[i];
        files_.push(name);
        /*if (fs.statSync(name).isDirectory()){
         getFiles(name,files_);
         } else {
         files_.push(name);

         }*/
    }
    return files_;
}

var allcovers = getFiles(dir);

function outputNames() {


    var artist = new Array(allcovers.length)
    var album = new Array(allcovers.length)

    for (var i = 0; i < allcovers.length; i++) {
        var split = allcovers[i].split(' - ');
        artist[i] = (split[0].split('/'))[1];
        album[i] = (split[1].split('.'))[0];
    }
    return [album, artist];
}
var AlbumInfo = outputNames();

exports.AlbumInfo = AlbumInfo;
exports.allcovers = allcovers;