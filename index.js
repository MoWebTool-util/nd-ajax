/**
 * Description: 简单的ajax封装
 * Author: lzhengms <lzhengms@gmail.com>
 * Date: 2015-01-13 14:46:03
 */

'use strict';

var $ = require('jquery');
var Base = require('nd-base');
var Events = require('nd-events');

var HTTP_STATUS_CODES = {
  /* 来自 HTTP 标准 与 API 文档 */
  // '400': 'bad-request',    // 客户端通用请求参数出错，需要解析error_code
  '401': 'unauthorized',      // 未登录或会话过期（需要登录但未登录或会话过期）
  '403': 'forbidden',         // 没有权限访问、操作（IP受限或已登录但没权限）
  '404': 'not-found',         // 接口不存在或请求地址不存在
  '405': 'method-not-allowed' // 请求方法不对如需要GET请求，实际是POST请求
  // '409': 'conflict'        // 请求的业务数据存在冲突，如工号或身份证被占用，需要解析error_code
};

var Ajax = module.exports = Base.extend({
  Implements: Events,

  attrs: {
    settings: {
      type: 'GET',
      dataType: 'json'
    },
    // events: {
    //   主要
    //   'done': function(data, statusText, xhr) {
    //   },
    //   'fail': function(xhr, statusText, error) {
    //   },
    //   其它
    //   'timeout': function() {
    //     // alert('对不起，访问超时了');
    //   },
    //   'disconnect': function() {
    //     // alert('网络不给力，请检查网络');
    //   },
    //   'unauthorized': function() {
    //     // alert('未登录或会话过期');
    //   },
    //   'forbidden': function() {
    //     // alert('没有权限访问、操作');
    //   },
    //   'not-found': function() {
    //     // alert('对不起，没有找到您要的东西');
    //   },
    //   'method-not-allowed': function() {
    //     // alert('请求方法不对');
    //   },
    //   'error': function() {
    //   }
    // },
    handlers: {
      done: function(data, statusText, xhr) {
        this.trigger('done', data, statusText, xhr);
      },
      fail: function(xhr, statusText, error) {
        var event;

        if (xhr.readyState === 0) {
          event = statusText === 'timeout' ? 'timeout' : 'disconnect';
        } else if (xhr.readyState === 4) {
          event = HTTP_STATUS_CODES['' + xhr.status] || 'error';
        }

        this.trigger(event + ' fail', xhr, statusText, error);
      }
    }
  },

  initialize: function(config) {
    Ajax.superclass.initialize.call(this, config);

    this._initEvents();
    this._initHandlers();
  },

  _initEvents: function() {
    var that = this,
      events = /*this.events = */this.get('events');

    if (events) {
      // clear
      this.attrs.events = null;

      $.each(events, function(event, callback) {
        that.on(event, callback, that);
      });
    }
  },

  _initHandlers: function() {
    var that = this,
      handlers = /*this.handlers = */this.get('handlers');

    // clear
    this.attrs.handlers = null;

    this.ajax = $.ajax(this.get('settings'))
    .done(function(data, statusText, xhr) {
      handlers.done.call(that, data, statusText, xhr);
    })
    .fail(function(xhr, statusText, error) {
      handlers.fail.call(that, xhr, statusText, error);
    });
  }

});
