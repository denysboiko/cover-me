var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {

//req.covers = res.locals.covers = Cover.find({}).limit(20);

Cover.find({}).sort({'created': -1}).exec(function(err, covers) {
        if (err) return next(err);
        res.locals.cvrs=covers;
        next();
    });

    //console.log(arguments)

}

/*

Cover.paginate({}, 2, 30, function(err, pageCount, paginatedResults, itemCount) {
    if (err) return next(err);
        console.log('Pages:', pageCount);
    res.format({
        html: function() {
            res.render('index', {
                users: users,
                pageCount: pageCount,
                itemCount: itemCount
            })
        },
        json: function() {
            // inspired by Stripe's API response for list objects
            res.json({
                object: 'list',
                has_more: paginate.hasNextPages(req)(pageCount),
                data: users
            })
        }
    })

});*/
