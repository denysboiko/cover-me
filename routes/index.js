module.exports = function(app) {

    app.get('/:page', function (req, res, next) {

    //var page=req.params.page;
        //require('../middleware/getInfo');


        //next(req.params.page)

        exports.page = req.params.page;
        require('./main').get;
        next();
    });
    //app.get('/', require('./main').get);
    //app.get('/main', function (req, res){res.render('main')});
    //app.get('/:page', function (req, res, next) {console.log(req.params.page)});
}


