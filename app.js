var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var coverinfo = require('./coverInfo');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());

app.use(express.urlencoded());

app.use(express.cookieParser());

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

 app.use(function(req, res) {
 res.send(404, "Page Not Found Sorry");
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


app.get('/', function (req, res, next) {
    res.render("index", {
        brand: "Cover Me",
        files: coverinfo.allcovers,
        names: coverinfo.AlbumInfo
    });
});


var Cover = require('models/cover').Cover;
app.get('/covers', function (req, res, next) {
    Cover.find({}, function (err, covers) {
        if (err) return next(err);
       res.json(covers);
    })
});


/*app.get('/covers', function (req, res, next) {
    Cover.find({}, function (err, covers) {
        if (err) return next(err);
 req.send(covers);
 })
});*/


http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});
