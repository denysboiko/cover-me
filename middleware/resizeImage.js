var gm = require('gm').subClass({ imageMagick: true });

function resizeImage (x,image,dir) {
    gm(image)
        .resize(x, x)
        .write('public/'.concat(image.replace('uploads/',dir+"/")), function (err) {
            if (err) throw err
        });
}

module.exports = resizeImage;