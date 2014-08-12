var mongoose = require('libs/mongoose');
var elmongo = require('elmongo');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


var schema = new Schema({
    artist: {
        type: String,
        unique: false,
        required: true
    },
    album: {
        type: String,
        unique: false,
        required: true
    },
    year: {
        type: String,
        unique: false,
        required: true
    },
    sPicture: {
        type: String,
        unique: true,
        required: true
    },
    bPicture: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


schema.plugin(elmongo, { host: 'localhost', port: 9200, prefix: 'test'});

schema.plugin(mongoosePaginate);

var Cover = mongoose.model('Cover', schema);

Cover.sync(function (err, numSynced) {
    if (err) console.log(err)
    console.log('number of docs synced:', numSynced);
});

exports.Cover = Cover;