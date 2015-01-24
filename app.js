var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
//var compression = require('compression');
var gm = require('gm').subClass({ imageMagick: true }); // Для thumbs можно удалить

//var paginate = require('express-paginate');
var Cover = require('./models/cover').Cover;
var mongoose = require('libs/mongoose');



/*  Upload */
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var qt   = require('quickthumb');

var crypto = require('crypto');

var app = express();
app.engine('ejs', require('ejs-locals'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(compression());

//app.use(paginate.middleware(30, 30));
//app.use(express.favicon());

app.use(qt.static(__dirname + '/'));

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
        for (i=0;i=5;i++){
       res.json(covers)};
    })
});

app.get('/device', function (req, res, next) {
    res.render('device');
});


app.get('/', function (req, res, next) {
    var currentPage = 1;
    var nextPageURL="";
    Cover.paginate({}, currentPage, 72, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        if (currentPage<pageCount) {
            nextPageURL = "/page?n=".concat(parseInt(currentPage)+1);
        }
        res.locals.cvrs = paginatedResults;
        res.render('index',{brand: "Cover Me", next: nextPageURL, cvrs: paginatedResults});

        next();
    });
});

app.get('/page', function (req, res, next) {
    var currentPage = req.query.n;
    var nextPageURL="";
    Cover.paginate({}, currentPage, 72, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        if (currentPage<pageCount) {
            nextPageURL = "/page?n=".concat(parseInt(currentPage)+1);
        }

        res.locals.cvrs = paginatedResults;
        res.render('index',{brand: "Cover Me", next: nextPageURL, cvrs: paginatedResults});

        next();
    });
});





app.get('/search', function (req, res, next) {

    Cover.search({ query: req.query.q, size:50}, {hydrate: false}, function (err, results) {
       res.render('search', {searchResults: results.hits.hits});
       console.log(results.hits.hits.length)
    });

});

app.get('/auto', function (req, res, next) {
    Cover.find().or([{artist: new RegExp('^'+req.query.q, "i")},{album: new RegExp('^'+req.query.q, "i")}]).sort({'artist': 1}).exec(function(err, covers) {
        if (err) return next(err);
        var artists = new Array
        for (var i=0; i<covers.length; i++) {
            artists[i]=covers[i].artist
        }
        res.send(artists);
    });
});


app.get('/add', function (req, res, next) {
    var coverData= {artist: 'ras', album: 'rasdva', year: '2008', sPicture: 'sm-rasdva.jpg', bPicture: 'rasdva.jpg'}
    var cover = new mongoose.models.Cover(coverData);
    cover.save();
    res.send(coverData)
});

app.get('/upload', function (req, res){
    res.render('mini-upload-form/upload');
});

app.post('/upload', function (req, res){
    var form = new formidable.IncomingForm();
    var artist;
    var album;
    var year;
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
        artist = fields.artist;
        album = fields.album;
        year = fields.year;
        console.log(fields)
    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });

        var coverData= {artist: artist, album: album, year: year, sPicture: new_location + file_name, bPicture: new_location + file_name}
        var cover = new mongoose.models.Cover(coverData);
        cover.save();
    });
});

app.get('/about', function (req, res){
    res.render('about');
});

app.get('/legal', function (req, res){
    res.render('legal');
});



http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});





