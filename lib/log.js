/**
 * @authors      gebilaoxiong 
 * @email        gebilaoxiong@gmail.com
 * @date         2016-06-12 12:41:25
 * @description  日志工具
 */

var bashColor = require('bash-color'),

  arraySlice = Array.prototype.slice,

  log = module.exports;

/**
 * 打印成功信息
 */
log.success = function(txt) {
  print(txt, 'green');
};

/**
 * 打印错误信息
 */
log.error = function(txt) {
  print(txt, 'red');
};


/**
 * 打印信息
 */
function print() {
  var params = arraySlice.call(arguments, 0),

    color = params.pop(),

    txt = params.join('\n');

  console.log(bashColor[color](txt));
}