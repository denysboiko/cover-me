module.exports = function(app) {
    app.get('/main', require('./main').get);
};
