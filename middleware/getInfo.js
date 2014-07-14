var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {

//req.covers = res.locals.covers = Cover.find({}).limit(20);

Cover.find({}).sort({'created': -1}).skip(30).limit(30).exec(function(err, covers) {
        if (err) return next(err);
        res.locals.cvrs=covers;
        next();
    });

    //console.log(arguments)

}