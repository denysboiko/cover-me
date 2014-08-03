var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
//var paginate = require('express-paginate');
var Cover = require('./models/cover').Cover;
var mongoose = require('libs/mongoose');


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(paginate.middleware(30, 30));
//app.use(express.favicon());

app.use(express.logger('dev'));
app.use(express.json());

app.use(express.urlencoded());

app.use(express.cookieParser());


app.use(require('middleware/getInfo'));


app.use(app.router);

require('routes')(app);



app.use(express.static(path.join(__dirname, 'public')));


app.use(function (err, req, res, next) {
    // NODE_ENV = 'production'
    if (app.get('env') == 'development') {
        var errorHandler = express.errorHandler();
        errorHandler(err, req, res, next);
    } else {
        res.send(500);
    }
});

// development only
/*
 if ('development' == app.get('env')) {
 app.use(express.errorHandler());
 }

 var routes = require('./routes');
 var user = require('./routes/user');

 app.get('/', routes.index);
 app.get('/users', user.list);


 app.use(function(req, res, next) {
 if (req.url == '/forbidden') {
 next(new Error("wops, denied"));
 } else {
 next();
 }
 });

 app.use(function(req, res, next) {
 if (req.url == '/test') {
 res.end("Test");
 } else {
 next();
 }
 });



 app.use(express.favicon());
 app.use(express.logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded());
 app.use(express.methodOverride());
 app.use(express.cookieParser('your secret here'));
 app.use(express.session());
 app.use(app.router);
 app.use(express.static(path.join(__dirname, 'public')));
 */

//app.locals(require('express-pagination'));

/*app.get('/users', function(req, res, next) {

    // This example assumes you've previously defined `Users`
    // as `var Users = db.model('Users')` if you are using `mongoose`
    // and that you've added the Mongoose plugin `mongoose-paginate`
    // to the Users model via `User.plugin(require('mongoose-paginate'))`
    Users.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {

        if (err) return next(err)

        res.format({
            html: function() {
                res.render('users', {
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

    })

})*/

app.use(function(req, res) {
    res.send(404, "Page Not Found Sorry");
});

app.get('/covers', function (req, res, next) {
    Cover.find({}, function (err, covers) {
        if (err) return next(err);
       res.json(covers);
    })
});

app.get('/page', function (req, res, next) {

    Cover.paginate({}, req.query.n, 30, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        res.locals.cvrs = paginatedResults;
        res.render('index',{brand: "Cover Me"});
        next();
    });
});


app.get('/search', function (req, res, next) {

    Cover.sync(function (err, numSynced) {
    });

    Cover.search({ query: req.query.q, fuzziness: 0.7, hydrate: true}, function (err, results) {
    //console.log('search results', results.hits);

           // res.locals.cvrs = results.hits;

        res.render('main', {seqrchresults: results.hits});
        //return results;
    });
});

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});