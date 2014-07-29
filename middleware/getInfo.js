var Cover = require('../models/cover').Cover;
var page = require('../routes/index.js').page;

module.exports = function(req, res, next) {

/*    Cover.find({}).sort({'created': -1}).exec(function(err, covers) {
        if (err) return next(err);
        res.locals.cvrs=covers;
        next();
    });*/

    Cover.paginate({}, page, /*req.query.limit*/30, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        res.locals.cvrs = paginatedResults;
        //res.render('index',{brand: "Cover Me"});
        next();
    });

}