'use strict';

var LRU = require('lru-cache');

function checkCache(req, res, lru) {
    var ret = true,
        entry = lru.get(req.url()),
        now = Date.now(),

        ims = new Date(req.head('if-modified-since') || 0),
        // No LRU entry equals the server has a cache
        // as new as freshly baked break.
        lm = new Date(entry ? entry.headers['last-modified'] : now);

    if (ims >= lm) {
        res.status(304)
            .head('last-modified', lm);
    } else if (entry) {
        res.status(200)
            .head(entry.headers)
            .data(entry.body);
    } else {
        ret = false;
    }
    return ret;
}

/**
 * 创建Lru
 * @param  {Int} maxAge     缓存失效时间，单位为秒
 * @return {[type]}        [description]
 */
function createLru(maxAge) {
    return LRU({
        max: 1024,
        maxAge: maxAge //缓存时效，单位毫秒。
    });
}

/**
 * 工程函数
 * @param  {Int} maxAge     缓存失效时间，单位为秒
 * @return {Function}       cache方法体
 */
module.exports = function(maxAge) {
    maxAge = maxAge || 1800;
    maxAge *= 1000;

    var lru = createLru(maxAge);

    return function*(next) {
        var req = this.request,
            res = this.response;

        if (req.method() === 'GET') {
            //check cache
            if (!checkCache(req, res, lru)) {
                var now = Date.now(),
                    lm = new Date(res.head('last-modified') || now);

                yield next;

                res.head({
                    'last-modified': lm.toGMTString(),
                    'expires': new Date(now + maxAge).toGMTString(),
                    'cache-control': 'max-age=' + maxAge/1000
                });

                //set cache
                lru.set(req.url(), {
                    headers: res.head(),
                    body: res.data()
                });
            }
        } else {
            yield next;
        }
    };
};;
