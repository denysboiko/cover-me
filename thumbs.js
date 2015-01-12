var gm = require('gm').subClass({ imageMagick: true });

gm('uploads/600.jpg')
    .resize(300, 300, "^")
    .autoOrient()
    .gravity('Center')
    .extent(300, 300)
    .write('uploads/thumbs/600.jpg', function (err) {
if (err) throw err
else
    console.log(' hooray! ');
});