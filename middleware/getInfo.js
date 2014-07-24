var Cover = require('../models/cover').Cover;

module.exports = function(req, res, next) {

/*Cover.find({}).sort({'created': -1}).exec(function(err, covers) {
        if (err) return next(err);
        res.locals.cvrs=covers;
    console.log(covers);
        next();
    });
}*/

    Cover.paginate({}, 2, 30, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        res.locals.cvrs = paginatedResults;
        console.log(paginatedResults);
        next();
    });
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
