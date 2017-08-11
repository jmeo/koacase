/**
 * Created by jmeo on 2016/6/3.
 */

"use strict";
const fs = require("fs"), underscore = require("underscore"), Log = require('log'), log = new Log('info'),path = require('path');
//读取.config.json 配置
const configService = require('./config.json');
try {
    //TODO 读取config.json 配置
    let fileDir = '';
    if(configService.prefix){
        fileDir = configService.prefix;
    }else{
        let programPath = path.join(__dirname,'..');
        fileDir = path.basename(programPath);
        configService.prefix = fileDir;
    }
    let filePath = path.join("/timafawvw/config",fileDir,"config.json");
    log.info("customer config.json path is : " + filePath);
    var configFile = fs.readFileSync(filePath, {encoding: 'utf-8'});
    var configFs = JSON.parse(configFile);
    underscore.extend(configService, configFs);
} catch (e) {
    log.error('customer config.json file read Error!');
    log.error(e);
}
log.info(configService);
module.exports = configService;


