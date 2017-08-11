'use strict';
const config = require('../config'),Log = require('log');
const logger;

if(config.log4j){

}else{
    logger = new Log('info');
}

module.exports = logger;