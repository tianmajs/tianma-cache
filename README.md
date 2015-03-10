# tianma-cache

![build status](https://travis-ci.org/tianmajs/tianma-mount.svg?branch=master)

天马静态资源服务的缓存中间件


## 安装

    $ npm install tianma-cache

## 使用

### 使用缓存中间件，默认时效时间为1800ms
    tianma()
        .use(tianma_cache())


### 使用缓存中间件，并配置失效时间
    tianma()
        .use(tianma_cache(10*1000))



## 授权协议

[MIT](https://github.com/tianmajs/tianmajs.github.io/blob/master/LICENSE)
