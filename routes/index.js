module.exports = function(app) {
    app.get('/', require('./main').get);
};
