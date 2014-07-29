var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {
    Cover.paginate({}, 2, 30, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        res.locals.cvrs = paginatedResults;
        next();
    });
}