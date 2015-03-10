var fs = require('fs'),
    nodePath = require('path'),
    tianma_static = function(path, root) {
        return function*(next) {
            var req = this.request,
                res = this.response;

            if (root) {
                path = nodePath.join(root, path);
            }

            if (fs.existsSync(path)) {
                res.status(200);
                //读取文件
                res.data(fs.createReadStream(path));
            } else {
                yield next;
            }
        };
    };


var tianma = require('tianma'),
    tianma_cache = require('../index.js'),
    app = tianma(9080),
    http = require('http');


app
    .use(tianma_cache())
    .use(tianma_static('../index.js', __dirname));
/*

describe('tianma-cache', function() {
    it('should cache ', function(done) {
        var req = http.request({
            host: '127.0.0.1',
            port: 9080
        }, function(res) {
            res.on('data', function(chunk) {
                done();
            })
        });

        req.on('error', function(e) {
            console.log(e.message);
        });

        req.end();
    });
});
*/
