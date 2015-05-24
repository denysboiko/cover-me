var Cover = require('models/cover').Cover;
var gm = require('gm').subClass({ imageMagick: true });

var dir = "xsmall/";
var dim = 200;

function resize (x,image) {
    var oldImg = './public/'.concat(image);
    var newImg = './public/'.concat(image.replace('img/', dir));
    gm(oldImg)
        .resize(x, x)
        .write(newImg, function (err) {
            if (err) throw err
        });
}

Cover.find({}).sort({'artist': 1}).exec(function(err, covers, next) {
    if (err) return next(err);
    for (var i=0;i<100;i++){
        resize(dim, covers[i].bPicture)
    }
    console.log('hooray!');
});


exports.resize = resize;