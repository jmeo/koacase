var cRouter = require('../common/cRouter')();

cRouter.get('/',function *(next){
    this.body = "Hello world";
});

cRouter.get('/pug',function *(next){
    this.kRender('test',{title:'hello world'});
});

module.exports = cRouter.router;