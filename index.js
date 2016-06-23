/**
 * @authors      gebilaoxiong 
 * @email        gebilaoxiong@gmail.com
 * @date         2016-06-12 12:41:25
 * @description  将webpack打包后的资源文件上传至七牛云
 */

var path = require('path'),

  qiniu = require('qiniu'),

  queue = require('queue'),

  $ = require('lodash'),

  utilSys = require('util'),

  util = require('./lib/util'),

  Resource = require('./lib/resource'),

  package = require(path.join(process.cwd(), 'package.json')),

  Plugin, proto;



/**
 * 插件构造函数
 * @param {Object}          options                   配置选项
 * 
 * options 选项:
 *   @param {String}        accessKey                 七牛云accessKey
 *   @param {String}        secretKey                 七牛云密匙
 *   @param {String}        bucket                    存储的区块名称
 *   @param {String}        path                      上传后保存的文件名
 */
Plugin = module.exports = util.createClass();


// 原型
proto = Plugin.prototype;


/**
 * 初始化方法
 * @param {Object}          options                   配置选项
 */
proto.init = function(options) {
  var me = this;

  $.assign(me, options);

  // 检查accessKey 和 secretKey
  ['accessKey', 'secretKey'].forEach(function(prop) {

    if (!(prop in me)) {
      util.error(prop + ' is undefined!');
    }

  });

  // Access Key & Secret Key
  qiniu.conf.ACCESS_KEY = me.accessKey;
  qiniu.conf.SECRET_KEY = me.secretKey;
};


/**
 * webpack 插件接口
 * 通过绑定编译器(compile)的事件做相应工作
 * @param  {Object}          compiler                  编译器
 */
proto.apply = function(compiler) {
  var me = this,

    // 文件命名函数
    named = util.format(me.path),

    // 空间名称
    bucket = me.bucket;


  compiler.plugin('after-emit', onAfterEmit);


  /**
   * 事件处理函数
   */
  function onAfterEmit(compilation, callback) {
    var assets = compilation.assets,

      // 队列
      taskQueue = queue(),

      options = $.cloneDeep(package);

    // 遍历资源
    $.each(assets, function(asset, fileName) {
      var resource;

      if (!asset.emitted) {
        return;
      }

      // 资源文件名
      options.asset = fileName;

      // 实例化资源
      resource = new Resource({
        bucket: bucket,
        asset: asset.existsAt,
        path: named(options)
      });

      // 将上传任务放入队列中
      taskQueue.push(function(next){

        // 上传完毕后上传下一个文件
        resource.on('uploadsuccess', next);

        resource.upload();
      });

    });

    // run queue
    taskQueue.start(function(){
      callback();
    });
  }
}