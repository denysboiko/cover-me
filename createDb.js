var mongoose = require('libs/mongoose');
var async = require('async');

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
], function(err) {
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

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createCovers(callback) {

    var covers = [
        {artist: 'Tim Minchin', album: 'Darkside', year: '2008', sPicture: 'smaaaal.jpg', bPicture: 'biiiiig.jpg'},
        {artist: 'Oasis', album: 'SOTSOG', year: '2004', sPicture: 'smaaaal1.jpg', bPicture: 'biiiiig2.jpg'}
    ];

    console.log(covers);

    async.each(covers, function(coverData, callback) {
        var cover = new mongoose.models.Cover(coverData);
        cover.save(callback);
    }, callback);
}
