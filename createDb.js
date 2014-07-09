var Cover = require('models/cover').Cover;

var cover = new Cover({
    artist: "Tim Minchin",
    album: "Darkside",
    year: "2008",
    sPicture: "smaaaal.jpg",
    bPicture: "biiiiig.jpg"
});

cover.save(function(err, cover, affected) {
    if (err) throw err;

    Cover.findOne({album: "Darkside"}, function(err, cover) {
        console.log(cover);
    });
});