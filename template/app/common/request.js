/**
 * Created by ly on 15-7-10.
 */
'use strict';
const http = require("http"),
    querystring = require("querystring"),
    coRequest = require("co-request"),
    log = require('./logger');

    /**
     * request请求
     * @param {*} url 
     * @param {*} method 
     * @param {*} rqBody 
     * @param {*} contentType 
     */
    function * transfer(url,method,rqBody,contentType) {
        let request_opt = { uri: url, method: method, body: rqBody };
        if(contentType){
            request_opt.headers = {"content-type":contentType};
        }else{
            request_opt.headers = {"content-type":'application/json'};
        }
        log.log(request_opt);
        let result = yield coRequest(request_opt);
        log.info(result.body);
        judgeStatus(result.statusCode);
        try {
            if (typeof result.body === "string") {
                result.body = JSON.parse(result.body);
            }
        } catch (e) {
            throw {errorCode:'sys.response.001'};
        }
        return result
    }

    /**
     * application/json 请求
     * @param {*} url 访问地址
     * @param {*} method get/post method
     * @param {*} data form data
     */
    function * jsonTransfer(url,method,data){
        return yield transfer(url,method,data);
    }

    /**
     * application/x-www-form-urlencoded 表单提交
     * @param {*} url  访问地址
     * @param {*} method  get/post method
     * @param {*} form form data
     */
    function * formTransfer(url,method,form){
        return yield transfer(url,method,form,'application/x-www-form-urlencoded');
    }


    /**
     * 判断请求状态
     * 非 200 状态全部抛出请求异常
     * @param {*} statusCode 
     */
    function judgeStatus(statusCode){
        if(statusCode && !(statusCode == 200 || statusCode == '200')){
            throw {errorCode:`sys.internal.${statusCode}`};
        }
    }

module.exports = {
    transfer:transfer,
    jsonTransfer:jsonTransfer,
    formTransfer:formTransfer
};