/**
 * Description: RESTful 的 ajax 封装
 * Author: crossjs <liwenfu@crossjs.com>
 * Date: 2015-03-17 12:14:01
 */

'use strict';

var $ = require('jquery');

module.exports = function(processor) {

  processor || (processor = function(data) {
    return data;
  });

  function addParam(url, params) {
    var encode = window.encodeURIComponent,
      arr = [],
      key;

    for (key in params) {
      if (params.hasOwnProperty(key)) {
        arr.push(encode(key) + '=' + encode(params[key]));
      }
    }

    return url + (url.indexOf('?') !== -1 ? '&' : '?') + arr.join('&');
  }

  return function(options) {
    var url = [];
    var replacement = options.replacement;
    var type = options.type;
    var data = options.data;
    var processData = true;

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

    if (options.additional) {
      url = addParam(url, options.additional);
    }

    // MUST BE A JSON
    if (data) {
      if (/^POST|PATCH|PUT$/i.test(type)) {
        data = JSON.stringify(data);
        processData = false;
      } else {
        // GET
        url = addParam(url, data);
        // 防止 jQuery 自动拼接
        data = null;
      }
    }

    // 替换 URL 中的变量，如 {xxx}
    if (replacement) {
      Object.keys(replacement).forEach(function(key) {
        url = url.replace(new RegExp('{' + key + '}', 'img'), replacement[key]);
      });
    }

    var defer = $.Deferred();

    $.ajax(
      processor({
        url: url,
        type: type,
        data: data,
        processData: processData,
        contentType: 'application/json'
      })
    )
    .done(function(data, status, xhr) {
      if (options.done) {
        options.done(defer, data, xhr);
      } else {
        defer.resolve(data);
      }
    })
    .fail(function(xhr, status, error) {
      if (options.fail) {
        options.fail(defer, error, xhr);
      } else {
        defer.reject(error);
      }
    });

    return defer.promise();
  };

};
