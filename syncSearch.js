var textSearch = require('mongoose-text-search');

var Cover = require('models/cover').Cover;

Cover.textSearch('blondie', function (err, output) {
    var inspect = require('util').inspect;
    console.log(inspect(output, { depth: null }));
});