/**
 * Description: 简单的ajax封装
 * Author: lzhengms <lzhengms@gmail.com>
 * Date: 2015-01-13 14:46:03
 */

'use strict';

var Ajax;

var $ = require('jquery');
var Events = require('nd-events');

//默认的一些事件
var defaultEvents = {
  'timeout': function () {
    alert('对不起，访问超时了');
  },
  'disconnect': function () {
    alert('网络不给力，请检查网络');
  },
  'not-allowed': function () {
    alert('对不起，您没有权限访问');
  },
  'no-permission': function () {

  },
  'not-found': function () {
    alert('对不起，没有找到您要的东西');
  },
  'error': function () {

  }
};

//绑定默认事件
function bindDefaultCallback(obj) {
  $.each(defaultEvents, function (event, callback) {
    obj.on(event, callback, obj);
  });
}

//ajax中的默认的配置
Ajax = function (options) {
  var ajax = $.ajax(options);
  Events.mixTo(ajax);
  bindDefaultCallback(ajax);
  ajax.done(function (data, status, xhr) {
    ajax.trigger('done', data, status, xhr);
  }).fail(function (xhr, errorType, error) {
    if (xhr.readyState === 0) {
      if (errorType === 'timeout') {
        ajax.trigger('timeout', xhr, errorType, error);
      }
      else {
        ajax.trigger('disconnect', xhr, errorType, error);
      }
    }
    if (xhr.readyState === 4) {
      var status = xhr.status;
      switch (status) {
        case 401:
          ajax.trigger('not-allowed', xhr, errorType, error);
          break;
        case 403:
          ajax.trigger('no-permission', xhr, errorType, error);
          break;
        case 404:
          ajax.trigger('not-found', xhr, errorType, error);
          break;
        default:
          ajax.trigger('error', xhr, errorType, error);
          break;
      }

    }
  });

  return ajax;

};

module.exports = Ajax;
