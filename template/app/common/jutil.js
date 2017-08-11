/**
 * Created by jmeo on 17/3/21.
 * jutil to collect the utils for jmeo
 */

function jutil() {
}

jutil.prototype = {
    /**
     * 解密字符串
     * @param str
     * @returns {string}
     */
    parseS: function (str) {
        if(/(_\w+)+/ig.test(str)){
            var st = str.split('_');
            st.shift();
            var rs = '';
            for (var k = 0; k < st.length; k++) {
                rs += String.fromCharCode(parseInt(st[k], 16).toString(10));
            }
            return rs;
        }else{
            return str;
        }
    }
}

module.exports = new jutil();

