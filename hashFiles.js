var Cover = require('models/cover').Cover;
var crypto = require('crypto');
var path = require('path');
var fs = require('fs-extra');

var coversData = [];
    Cover.find({}).sort({'artist': 1}).exec(function(err, covers, next) {
        if (err) return next(err);
        coversData = covers;
        console.log(coversData.length);
        //next();
        for (var i=0; i<coversData.length; i++) {
            var bp = coversData[i].bPicture;
            var sp = coversData[i].sPicture;
            var id = coversData[i]._id;
            var imgName = bp.split('img/')[1];
            var random = Math.random().toString();
            var extention = path.extname(imgName);
            var newName = crypto.createHash('sha1').update(imgName + random).digest('hex') + extention;

            fs.rename("public/" + sp, "public/small/" + newName, function (err) {
                if (err) console.log(err);
            });
            fs.rename("public/" + bp, "public/img/" + newName, function (err) {
                if (err) console.log(err);
            });
            Cover.update({_id: id}, { bPicture: "img/" + newName, sPicture: "small/" + newName }, function (err) {
                if (err) console.log(err);
                console.log("good");
            });

            console.log(id);
        }
    });
/*Cover.update({_id: "54f739a366edd2351ab421b1"}, { sPicture: "hi.jpeg"}, function (err) {
    if (err) console.log(err);
});*/

//76020891a6a067e10e50fe8357a299a9e1fe0748

//54f736f3fa694afc19b5eeed

/*
 ;*/
//var file_name = this.openedFiles[0].name;

/*fs.rename("public/small/Beastie Boys - Licensed To Ill-2.jpeg", "public/small/Beastie Boys - Licensed To Ill.jpeg", function (err) {
    if (err) console.log(err);
    console.log("good!")
});*/




/*app.get('/add', function (req, res, next) {
 var coverData= {artist: 'ras', album: 'rasdva', year: '2008', sPicture: 'sm-rasdva.jpg', bPicture: 'rasdva.jpg'}
 var cover = new mongoose.models.Cover(coverData);
 cover.save();
 res.send(coverData)
 });*/