var Cover = require('../models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });

Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
    if (err) return next(err);
    for (i=0;i<covers.length;i++){

        gm('./public/'.concat(covers[i].bPicture))
            .resize(300, 300)
            .write('./uploads/small/'.concat(covers[i].bPicture.replace('img/',"")), function (err) {
                if (err) throw err
                else
                    console.log(' hooray! ');
            });
    }
});