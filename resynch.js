var fs = require('fs');
var dir = "public/img/";

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


var allcovers = getFiles(dir);
//console.log(allcovers);

function outputNames() {


    var artist = new Array(allcovers.length)
    var album = new Array(allcovers.length)

    for (var i = 0; i < allcovers.length; i++) {
        if (allcovers[i].substring(allcovers[i].length-4, allcovers[i].length)=="jpeg") {
            var split = allcovers[i].split(' - ');
            artist[i] = (split[0].split('/'))[1];
            album[i] = (split[1].split('.jpeg'))[0];
        }
        else if (allcovers[i].substring(allcovers[i].length-3, allcovers[i].length)=="jpg") {
            var split = allcovers[i].split(' - ');
            artist[i] = (split[0].split('/'))[1];
            album[i] = (split[1].split('.jpg'))[0];
        }
        else if (allcovers[i].substring(allcovers[i].length-3, allcovers[i].length)=="png") {
            var split = allcovers[i].split(' - ');
            artist[i] = (split[0].split('/'))[1];
            album[i] = (split[1].split('.png'))[0];
        }
    }
    return [album, artist];
}
var AlbumInfo = outputNames();


console.log(AlbumInfo)
