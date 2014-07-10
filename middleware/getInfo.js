var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {
    Cover.find({}, function (err, covers) {
        if (err) return next(err);
        req.covers = res.locals.covers = covers;
        next();
    });
};