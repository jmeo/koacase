/**
 * Created by jmeo on 2016/6/3.
 */
var app = require('./app/index'),
    http = require('http'), config = require("./app/config");

http.createServer(app.callback()).listen(config.serverPort);
console.log(`${config.prefix} server is listen on : http://127.0.0.1:${config.serverPort}/${config.prefix}`);
