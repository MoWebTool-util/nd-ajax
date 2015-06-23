/**
 * @module ajax
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var $ = require('jquery');

module.exports = function(processor) {

  processor || (processor = function(data) {
    return data;
  });

  var encode = window.encodeURIComponent;

  function addParam(url, params) {
    var arr = Object.keys(params).map(function(key) {
      return encode(key) + '=' + encode(params[key]);
    }).join('&');

    if (!arr) {
      return url;
    }

    return url + (url.indexOf('?') !== -1 ? '&' : '?') + arr;
  }

  return function(options) {
    var url = [];

    // baseUri: Array
    if (options.baseUri) {
      url = url.concat(options.baseUri);
    }

    // uri: id | null | undefined
    if (options.uri || options.uri === 0) {
      url = url.concat('' + encode(options.uri));
    }

    // additional uris: Array
    if (options.params) {
      url = url.concat(options.params);
    }

    // remove empty values
    url = url.filter(function(val) {
      return !!val;
    });

    url = url.join('/');

    if (options.additional) {
      url = addParam(url, options.additional);
    }

    var data = options.data;
    var type = options.type;
    var processData = true;

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

    var replacement = options.replacement;

    // 替换 URL 中的变量，如 {xxx}
    if (replacement) {
      Object.keys(replacement).forEach(function(key) {
        url = url.replace(new RegExp('{' + key + '}', 'img'), encode(replacement[key]));
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
