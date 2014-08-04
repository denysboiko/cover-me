var mongoose = require('libs/mongoose');
var coverinfo = require('./coverInfo');
var async = require('async');

//console.log(AlbumInfo[1]);
/*var cover = new Cover({
 artist: "Tim Minchin",
 album: "Darkside",
 year: "2008",
 sPicture: "smaaaal.jpg",
 bPicture: "biiiiig.jpg"
 });*/

async.series([
    open,
    dropDatabase,
    requireModels,
    createCovers
], function (err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/cover');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}


function createCovers(callback) {
    var covers = new Array;
    /*    var covers = [
     {artist: 'Tim Minchin', album: 'Darkside', year: '2008', sPicture: 'smaaaal.jpg', bPicture: 'biiiiig.jpg'},
     {artist: 'Oasis', album: 'SOTSOG', year: '2004', sPicture: 'smaaaal1.jpg', bPicture: 'biiiiig2.jpg'}
     ];*/

    for (var i = 0; i < coverinfo.AlbumInfo[0].length; i++) {
        covers[i] = {artist: coverinfo.AlbumInfo[1][i], album: coverinfo.AlbumInfo[0][i], year: '2008', sPicture: coverinfo.allcovers[i], bPicture: coverinfo.allcovers[i]}
    }

    async.each(covers, function (coverData, callback) {
        var cover = new mongoose.models.Cover(coverData);
        cover.save(callback);
    }, callback);
}