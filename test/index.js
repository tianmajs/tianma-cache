var tianma = require('tianma'),
    tianma_static = require('./tianma_static.js'),
    tianma_cache = require('../index.js');


tianma(9080)
    .use(tianma_cache(10 * 1000))
    .use(tianma_static(__dirname));
