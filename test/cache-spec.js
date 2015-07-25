'use strict';

var http = require('http');
var cache = require('..');
var request = require('supertest');
var tianma = require('tianma');

function createApp() {
    var app = tianma();
    var server = http.createServer(app.run);

    app.server = server;

    return app;
}

describe('cache()', function () {
    var count = 0;
    var server;
    var address;

    before(function (done) {
        var app = createApp();

        app.use(cache())
            .use(function *(next) {
                this.response
                    .status(200)
                    .head('last-modified', new Date(3000).toGMTString())
                    .data(++count);
            });

        app.server.listen(0, '127.0.0.1', function (err) {
            if (err) {
                done(err);
            } else {
                server = app.server;
                address = 'http://127.0.0.1:' + server.address().port;
                // warm up
                request(address)
                    .get('/foo.js')
                    .end(done);
            }
        });
    });

    after(function (done) {
        server.close(done);
    });

    it('should return cached data with default expires', function (done) {
        request(address)
            .get('/foo.js')
            .expect(200)
            .expect('cache-control', 'max-age=1800')
            .expect('1')
            .end(done);
    });

    it('should bypass uncached request and cache it', function (done) {
        request(address)
            .get('/bar.js')
            .expect(200)
            .expect('cache-control', 'max-age=1800')
            .expect('2')
            .end(done);
    });

    it('should support condition request #part1', function (done) {
        request(address)
            .get('/bar.js')
            .set('if-modified-since', new Date(4000).toGMTString())
            .expect(304)
            .expect('last-modified', new Date(3000).toGMTString())
            .end(done);
    });

    it('should support condition request #part2', function (done) {
        request(address)
            .get('/bar.js')
            .set('if-modified-since', new Date(2000).toGMTString())
            .expect(200)
            .expect('last-modified', new Date(3000).toGMTString())
            .expect('cache-control', 'max-age=1800')
            .expect('2')
            .end(done);
    });
});

describe('cache(expires)', function () {
    function createServer() {
        var app = createApp();

        app.use(cache(3600))
            .use(function *(next) {
                this.response
                    .data('hello');
            });

        return app.server;
    }

    it('should support custom expires', function (done) {
        request(createServer())
            .get('/foo.js')
            .expect(200)
            .expect('cache-control', 'max-age=3600')
            .expect('hello')
            .end(done);
    });
});
