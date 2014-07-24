var mongoose = require('libs/mongoose');
var elmongo = require('node_modules/elmongo');
var Cover = require('models/cover').Cover;

Cover.sync(function (err, numSynced) {
    // all cats are now searchable in elasticsearch
    console.log('number of cats synced:', numSynced)
});

Cover.search({ query: 'black sabbath', fuzziness: 0.5 }, function (err, results) {
    console.log('search results', results);
});

Cover.findById('53c41bc8456a71af0c94ecec', function (err, covers){
    console.log('search results', covers);
});