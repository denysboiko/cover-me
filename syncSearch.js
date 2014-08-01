
var Cover = require('models/cover').Cover;


Cover.sync(function (err, numSynced) {
    // all covers are now searchable in elasticsearch
});

Cover.search({ query: 'black sabbath', fuzziness: 0.5 }, function (err, results) {
    console.log('search results', results.hits.get('_id'));
    Cover.findById(results);
    return results;
});