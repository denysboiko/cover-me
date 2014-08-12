var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var mongoosastic = require('mongoosastic');


var schema = new Schema({
    artist: {
        type: String,
        required: true,
        es_indexed:true
    },
    album: {
        type: String,
        required: true,
        es_indexed:true
    },
    year: {
        type: String,
        required: true,
        es_indexed:true
    },
    sPicture: {
        type: String
    },
    bPicture: {
        type: String
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
    console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
    console.log(err);
});


exports.Cover = mongoose.model('Cover', schema);