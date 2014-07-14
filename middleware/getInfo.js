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


Cover.paginate({}, 2, 30, function(error, pageCount, paginatedResults, itemCount) {
    if (error) {
        console.error(error);
    } else {
        console.log('Pages:', pageCount);
        console.log(paginatedResults);
    }
});