var Cover = require('../models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });


/*function resizeCovers(req) {

    return Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
        if (err) return next(err);
        req.ts=covers;
    });

    return req.ts
*//*    gm('./'+'uploads/96286445.jpg')
        .resize(300, 300)
        .write('./uploads/small/96286445.jpg', function (err) {
            if (err) throw err
            else
                console.log('hooray!');
        });*//*
}*/

Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
    if (err) return next(err);
    for (i=0;i<=covers.length;i++){
        console.log(covers[i].artist);
    }
});