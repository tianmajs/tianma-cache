# tianma-cache

![build status](https://travis-ci.org/tianmajs/tianma-mount.svg?branch=master)

天马静态资源服务的缓存中间件


## 安装

    $ npm install tianma-cache

## 使用

### 使用缓存中间件
    tianma()
        .use(tianma_cache())


## 使用缓存中间件，并配置失效实现
    tianma()
        .use(tianma_cache(3600))



## 授权协议

[MIT](https://github.com/tianmajs/tianmajs.github.io/blob/master/LICENSE)
