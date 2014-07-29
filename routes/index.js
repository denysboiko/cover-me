module.exports = function(app) {
    app.get('/', require('./main').get);
    app.get('/main', function (req, res){res.render('main')});
    //app.get('/:page', function (req, res, next) {console.log(req.params.page)});
}


