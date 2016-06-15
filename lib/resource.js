/**
 * @authors      gebilaoxiong 
 * @email        gebilaoxiong@gmail.com
 * @date         2016-06-14 20:59:09
 * @description  资源文件
 */
var $ = require('lodash'),

  utilSys = require('util'),

  util = require('./util'),

  Event = require('events'),

  qiniu = require('qiniu'),

  log = require('./log'),

  Resource, proto;



/**
 * 资源构造函数
 * @param {Object}          options                   配置选项
 * 
 * options 选项:
 *   
 *   @param {String}        bucket                    存储的区块名称
 *   @param {String}        asset                     需要上传的本地文件名称
 *   @param {String}        path                      上传后保存的文件名
 *   
 */
Resource = module.exports = util.createClass();


// 继承Event
utilSys.inherits(Resource, Event);


// 掏出原型出来搞
proto = Resource.prototype;


/**
 * 初始化方法
 */
proto.init = function(options) {
  $.assign(this, options);
};



/**
 * 生成上传token
 * @return {String}                             令牌字符串
 */
proto.buildToken = function() {
  var me = this,

    bucket = me.bucket,

    path = me.path,

    policy = new qiniu.rs.PutPolicy(bucket + ':' + path);

  return policy.token();
};


/**
 *  资源上传             
 */
proto.upload = function() {
  var me = this;

  // 上传文件
  qiniu.io.putFile(
    // 上传token
    me.buildToken(),
    // 上传到七牛云后保存的文件名称
    me.path,
    // 需要上传的本地文件名称
    me.asset,

    new qiniu.io.PutExtra(),
    // 回调
    callback);

  /**
   * 上传回调
   * @param  {Object}       exception           上传失败时产生的错误信息
   * @param  {Object}       response            上传成功后存储文件的信息
   */
  function callback(exception, response) {

    // 事件：上传完成
    me.emit('uploadcomplete');

    // fail
    if (exception) {

      // 事件：上传失败
      me.emit('uploadfail', exception);

      log.error([
        'exception: ' + exception.error,
        'asset: ' + me.asset
      ]);
    }
    // success
    else {
      
      // 事件：上传成功
      me.emit('uploadsuccess', response);

      log.success("release: " + me.path);
    }
  }
};