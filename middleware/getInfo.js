var Cover = require('models/cover').Cover;

module.exports = function(req, res, next) {
    Cover.findById(req.session.cover, function(err, cover) {
        if (err) return next(err);

        req.cover = res.locals.cover = cover;
        next();
    });
};

app.get('/covers', function (req, res, next) {
 Cover.find({}, function (err, covers) {
 if (err) return next(err);
 req.send(covers);
 })
 });