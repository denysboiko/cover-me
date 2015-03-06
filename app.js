var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);

//var compression = require('compression');
//var paginate = require('express-paginate');

var resizeImage = require('./middleware/resizeImage');


var Cover = require('./models/cover').Cover;
var mongoose = require('libs/mongoose');



/*   Crypto   */
var crypto = require('crypto');

var app = express();



app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//app.set('view options', { layout:false, root: __dirname + '/templates' } );


//app.use(express.compress());

//app.use(paginate.middleware(30, 30));
//app.use(express.favicon());



/*  Upload */

var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
/*var qt   = require('quickthumb');

app.use(qt.static(__dirname + '/'));*/



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
    res.status(404);
    res.render("404");
});

app.get('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'http://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
        next();
    }
});

app.use(function(req, res, next) {
    if(req.url.substr(-1) == '/' && req.url.length > 1)
        res.redirect(301, req.url.slice(0, -1));
    else
        next();
});


/*app.get('/covers', function (req, res, next) {
    Cover.find({}, function (err, covers) {
        if (err) return next(err);
        res.json(covers);
    });
});*/

/*app.get('/device', function (req, res, next) {
    res.render('device');
});*/

function paginateCovers (current, index, n, res, next) {
    Cover.paginate({}, index, n, function (error, pageCount, paginatedResults, itemCount) {
        if (error) console.log(error);
        if (current<pageCount) {
            var nextUrl = "/page/".concat((parseInt(current)+1).toString());
        }

        //res.locals.cvrs = paginatedResults;

        //var ejs_file = fs.readFileSync('views/index.ejs', 'utf-8');
        //var page_html = ejs.render(ejs_file, {brand: "Cover Me", next: nextUrl, cvrs: paginatedResults});
        //res.send(page_html);

        res.render('index',{brand: "Cover Me", next: nextUrl, cvrs: paginatedResults});

        //var rnd=Math.random();
        /*, { sortBy : { rnd : -1 } } */

        next();
    });
}


app.get('/', function (req, res, next) {
    var currentPage = 1;
    paginateCovers(currentPage, currentPage, 72, res, next);
});



app.get('/page/:page', function (req, res, next) {
    var currentPage = parseInt(req.params.page);
    var currentIndex = currentPage + 8;
    paginateCovers(currentPage, currentIndex, 8, res, next);

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
            artists[i]=covers[i].artist + " - " + covers[i].album;
        }
        res.send(artists);
    });
});


/*app.get('/add', function (req, res, next) {
    var coverData= {artist: 'ras', album: 'rasdva', year: '2008', sPicture: 'sm-rasdva.jpg', bPicture: 'rasdva.jpg'}
    var cover = new mongoose.models.Cover(coverData);
    cover.save();
    res.send(coverData)
});*/

app.get('/upload', function (req, res){
    res.render('upload');
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

        //var file_name = this.openedFiles[0].name;
        var random = Math.random().toString();
        var file_name = crypto.createHash('sha1').update(this.openedFiles[0].name + random).digest('hex') + '.jpg';

        /* Location where we want to copy the uploaded file */
        //var covers_dir = 'public/img/';
        //var cover_name = artist + ' - ' + album;
        var new_location = 'uploads/';
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");
                resizeImage(600, new_location + file_name, "img");
                resizeImage(300, new_location + file_name, "small");
            }
        });
        var coverData = { artist: artist, album: album, year: year, sPicture: "small/" + file_name, bPicture: "img/" + file_name };
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





