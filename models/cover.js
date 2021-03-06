var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var mongoosastic = require('mongoosastic');


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

schema.plugin(mongoosastic);
schema.plugin(mongoosePaginate);


var Cover = mongoose.model('Cover', schema)
    , stream = Cover.synchronize()
    , count = 0;

stream.on('data', function(err, doc){
    count++;
});
stream.on('close', function(){
    console.log('Indexed ' + count + ' documents');
});
stream.on('error', function(err){
    console.log(err);
});

exports.Cover = Cover;