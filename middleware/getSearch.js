var Cover = require('../models/cover').Cover;
var page = require('../routes/index.js').page;
var srchresults = require('./syncSearch');

module.exports = function(req, res, next) {

    Cover.paginate({}, page, /*req.query.limit*/30, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        res.locals.cvrs = paginatedResults;
        //res.render('index',{brand: "Cover Me"});
        next();
    });

}