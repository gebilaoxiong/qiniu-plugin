/**
 * @authors      gebilaoxiong 
 * @email        gebilaoxiong@gmail.com
 * @date         2016-06-12 12:41:25
 * @description  工具类
 */
var $ = require('lodash'),

  pth = require('path'),

  separator = $.escapeRegExp(pth.sep),

  fileRe = new RegExp(separator + '([^' + separator + ']+$)'),

  util = module.exports;


/**
 * 返回一个将对象格式化为字符串的函数
 * @param  {String}         format          字符串格式
 */
util.format = function(format) {
  var body = format.replace(/\[([^\]]*)\]/g, '\' + ($data.$1 || \'\') + \'');

  return new Function('$data', 'return \'' + body + '\';');
}


/**
 * 从路径中获取文件名
 * @param  {String}         path            路径
 */
util.filename = function(path) {
  return path.match(fileRe)[1];
}


/**
 * 创建类型
 */
util.createClass = function() {
  return function() {
    var me = this;
    me.init.apply(me, arguments);
  }
}

/**
 * 抛出异常
 * @param  {String}           message         异常信息
 */
util.error = function(message) {
  throw new Error(message);
}