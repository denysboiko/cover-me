var Cover = require('models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });

function resize (x,image) {
    gm('./public/'.concat(image))
        .compress('Lossless')
        .resize(x, x)
        .write('./public/'.concat(image.replace('img/',"small/")), function (err) {
            if (err) throw err
        });
}


Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
    if (err) return next(err);
/*    for (i=0;i<covers.length;i++){
        resize (300,covers)
    }*/

    var start=0
    var end=0

    for (i=0;i<covers.length;i++){
        resize(300,covers[i].bPicture)
    }
    console.log(' hooray! ');
});


//gm("img.png").compress(lossless)

exports.resize = resize;