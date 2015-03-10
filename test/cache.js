'use strict';

var http = require('http');
var request = require('supertest');
var tianma = require('tianma');
var cache = require('..');
var tianma_static = require('./tianma_static');
var maxAge = 10 * 1000;

function createApp() {
    var app = tianma(9080);
    app.use(cache(maxAge)).then
        .use(tianma_static(__dirname));

    return app;
}

describe('tianma-cache()', function() {
    var app = createApp().run;

    /*it('should response status 200', function(done) {
        reqApp
            .get('/index.js')
            .expect(200)
            .end(done);
    });*/

    it('should response status 304', function(done) {
        var reqApp = request(app),
            now = new Date(Date.now() + 10000);

        reqApp
            .get('/index.js')
            .expect(200)
            .set('if-modified-since', now)
            .expect('cache-control', 'max-age=' + maxAge / 1000);
        // .end(done);

        reqApp
            .get('/index.js')
            .set('if-modified-since', now)
            .expect(304)
            .end(done);
    });

});
