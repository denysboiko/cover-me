var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;
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

schema.plugin(mongoosePaginate);

exports.Cover = mongoose.model('Cover', schema);
