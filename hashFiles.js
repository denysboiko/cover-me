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
