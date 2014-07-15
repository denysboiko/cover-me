<<<<<<< HEAD
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var textSearch = require('mongoose-text-search');
=======
var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
>>>>>>> FETCH_HEAD

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

<<<<<<< HEAD
schema.plugin(textSearch);
schema.index({ artist: 'text' });

exports.Cover = mongoose.model('Cover', schema);
=======
schema.plugin(mongoosePaginate);

exports.Cover = mongoose.model('Cover', schema);
>>>>>>> FETCH_HEAD
