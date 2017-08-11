'use strict';
const router = require('koa-router');
const page ='/page';
const inf = '/interface';

let routerContainer = function(){
    this.router = router();
};

routerContainer.prototype.page = function(path,callback){
    this.router.get(page+path+'.page',callback);
}

routerContainer.prototype.interface = function(path,callback){
     this.router.post(inf+path+'.inf',callback);
}

routerContainer.prototype.get = function(path,callback){
    this.router.get(path,callback);
}

routerContainer.prototype.router = function(){
    return this.router;
}

routerContainer.pagePath = routerContainer.prototype.pagePath = function(path){
    return page+path+'.page';
}
routerContainer.interfacePath = routerContainer.prototype.interfacePath = function(path){
    return inf+path+'.inf';
}

module.exports = function(){
    return new routerContainer();
};



