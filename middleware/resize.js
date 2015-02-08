var Cover = require('models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });

function resize (x,covers) {
    //var size = x

}


Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
    if (err) return next(err);
/*    for (i=0;i<covers.length;i++){
        resize (300,covers)
    }*/
    var start=0
    var end=0
    for (i=0;i<covers.length;i++){
        gm('./public/'.concat(covers[i].bPicture))
            .compress('Lossless')
            .resize(300, 300)
            .write('./public/'.concat(covers[i].bPicture.replace('img/',"small/")), function (err) {
                if (err) throw err

            });
    }
    console.log(' hooray! ');
});


//gm("img.png").compress(lossless)