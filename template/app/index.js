'use strict';

const path = require('path'),koa = require('koa'),mount=require('koa-mount');
const Pug = require('koa-pug'),staticServe = require('koa-static'),favicon=require('koa-favi'),session=require('koa-generic-session'),redisStore=require('koa-redis');
const bodyParser = require('koa-bodyparser'),log = require('./common/logger');
const config = require('./config'),errorCode=require('./errorCode'),routerScan=require('./common/routerScan'),
        jutil=require('./common/jutil'),cRouter = require('./common/cRouter')();

const app = koa();
app.use(bodyParser());
// app.use(staticServe(path.join(__dirname,'assets')));

function renderErrorCode(errorObj){
    if(errorObj && errorObj.errorCode && errorCode[errorObj.errorCode]){
        var _tmRs = errorCode[errorObj.errorCode];
        if(typeof errorCode[errorObj_rs.errorCode] === 'string' ){
            errorObj.errorMessage = errorCode[errorObj.errorCode] ;
        }else if(typeof errorCode[errorObj.errorCode] === 'object' ){
            errorObj.errorMessage = errorCode[errorObj.errorCode].zn ;
        }
        return errorObj;
    }else{
        return errorObj;
    }
}

app.use(function *(next) {
        try {
            yield next;
            var _rs = this.body;
            this.body = renderErrorCode(_rs);
        } catch (e) {
            this.body = renderErrorCode(e);
        }
});

app.keys = [`${config.prefix}-session`];
const sessionOpt = {
    key : `${config.prefix}-session`,
};
if(config.redis){
    if(config.redis.ttl){
        sessionOpt.ttl = config.redis.ttl;
    }
    sessionOpt.store = redisStore({
        host : config.redis.host,
        port : config.redis.port,
        socket : config.redis.socket,
        ttl : config.redis.ttl,
        db : config.redis.db
    });

}
app.use(session(sessionOpt));

//token 认证
app.use(function *(next){
    if(!this.session.token){
        throw {errorCode : 'sys.token.001'}
    }else{
        yield next;
    }
});

// import pug plugin
const pug = new Pug({
    viewPath: path.join(__dirname, "views"),
    debug: true,
    noCache: true,
    pretty: false,
    compileDebug: false,
    basedir: path.join(__dirname, "views")
});
app.use(pug.middleware);

/**
 * 添加kRender 及校验请求路径
 */
app.use(function *(next) {
    try{
        let orginUrl = this.originalUrl;
        let mountPath = this.mountPath;
        let index = orginUrl.lastIndexOf(mountPath);
        var slice = orginUrl.substring(index+mountPath.length,orginUrl.length);
        if(slice.length<=0){
            this.pathLength = 0;
        }else{
            this.pathLength = slice.split('/').length - 1 ;
        }

        if(this.pathLength == 0){
            this.pathBasic = config.prefix+'/';
        }else if(this.pathLength == 1){
            this.pathBasic = './'
        }else if(this.pathLength >= 2){
            this.pathBasic = '';
            for(var i=0;i<this.pathLength-1;i++){
                this.pathBasic += '../';
            }
        }
        var _this = this;
        this.kRender = function (path,obj) {
            obj = obj ? obj : {};
            obj['pathBasic'] = _this.pathBasic;
            obj['pathLength'] = _this.pathLength;
            _this.render(path,obj);
        };
    }catch(e){
        console.error(e);
    }
    yield next;
});

/**
 * 遍历路由 router
 */
routerScan(app);

app.use(function *(next){
    this.throw(404);
});

var mountApp = koa();
mountApp.use(mount("/"+config.prefix, app));
mountApp.keys = [config.prefix];
module.exports = mountApp;