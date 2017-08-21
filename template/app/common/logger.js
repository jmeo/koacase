'use strict';
const config = require('../config'),Log = require('log');
const logger = console;

if(config.log4j){

}else{
    logger = new Log('info');
}

module.exports = logger;