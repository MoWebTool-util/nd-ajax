/**
 * Description: RESTful 的 ajax 封装
 * Author: crossjs <liwenfu@crossjs.com>
 * Date: 2015-03-17 12:14:01
 */

'use strict';

var $ = require('jquery');

module.exports = function ajax(options) {
  var url = [],
    type = options.type,
    data = options.data,
    processData = true;

  // baseUri: Array
  if (options.baseUri) {
    url = url.concat(options.baseUri);
  }

  // uri: id | null | undefined
  if (options.uri !== null && options.uri !== undefined) {
    url = url.concat(options.uri);
  }

  // additional uris: Array
  if (options.params) {
    url = url.concat(options.params);
  }

  url = url.join('/');

  // GET：data 为 queryString，需要 jQuery 处理
  // OTR：data 为表单数据，手动转为 JSON string
  if (data && typeof data === 'object' && /^POST|PATCH|PUT$/i.test(type)) {
    data = JSON.stringify(data);
    processData = false;
  }

  // TODO: 此处统一处理错误信息

  var defer = $.Deferred();

  $.ajax({
    url: url,
    type: type,
    data: data,
    processData: processData
  })
  .done(function(data) {
    // TODO: 判断 成功 与 失败
    if (options.done) {
      options.done(defer, data);
    } else {
      defer.resolve(data);
    }
  })
  .fail(function(xhr, status, error) {
    if (options.fail) {
      options.fail(defer, error);
    } else {
      defer.reject(error);
    }
  })/*.always(function() {})*/;

  return defer;
};
