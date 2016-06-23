/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 00:49:49
 * @description   日志
 */
var $ = require('lodash'),

  colors = require('colors'),

  logColors;


logColors = {
  'info': 'blue',
  'success': 'green',
  'warning': 'yellow',
  'error': 'red'
};

/**
 * 打印日志
 * @param  {String}           type                日志类型
 * @param  {String}           message             日志信息
 */
var log = module.exports = function log(type, message) {
  var color;

  message = '\n  [' + type.toUpperCase() + '] ' + message;

  if (type in logColors) {
    color = logColors[type];
    message = message[color];
  }

  console.log(message);
};


/**
 * 带有颜色提示的日志输出方法 
 */
['info', 'success', 'warning'].forEach(function(type) {
  log[type] = function(message) {
    log(type, message);
  };
});


// 是否抛出异常
// 如果需要在代码层面捕获异常 设置为true;
log.throw = false;


/**
 * 异常日志
 * @param  {String|Error}        Error             异常
 */
log.error = function(error) {

  // String => error
  if (typeof error === 'string') {
    error = new Error(error);
  }

  // 抛出异常
  if (log.throw) {
    throw error;
  }
  // 打印日志 中断线程
  else {
    log('error', error.message);
    process.exit(1);
  }

}