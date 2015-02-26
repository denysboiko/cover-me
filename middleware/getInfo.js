var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {

   Cover.find({}).sort({'artist': 1}).exec(function(err, covers) {
        if (err) return next(err);
        res.locals.cvrs=covers;
        next();
    });
};