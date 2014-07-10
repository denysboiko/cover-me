var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var fs = require('fs');
var log = require('libs/log')(module);

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());

app.use(express.urlencoded());

app.use(express.cookieParser());

app.use(app.router);
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

var dir = "./public/img/";

function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = 'img/' + files[i];
        files_.push(name);
        /*if (fs.statSync(name).isDirectory()){
         getFiles(name,files_);
         } else {
         files_.push(name);

         }*/
    }
    return files_;
}

var allcovers = getFiles(dir);

function outputNames() {


    var artist = new Array(allcovers.length)
    var album = new Array(allcovers.length)

    for (var i = 0; i < allcovers.length; i++) {
        var split = allcovers[i].split(' - ');
        artist[i] = (split[0].split('/'))[1];
        album[i] = (split[1].split('.'))[0];
    }
    return [album, artist];
}



app.get('/', function (req, res, next) {
    res.render("index", {
        brand: "Cover Me",
        files: allcovers,
        names: outputNames()
    });
});

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});
