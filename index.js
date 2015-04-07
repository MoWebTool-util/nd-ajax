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

  return function(options) {
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

    // MUST BE A JSON
    if (data) {
      if (/^POST|PATCH|PUT$/i.test(type)) {
        data = JSON.stringify(data);
        processData = false;
      } else {
        // GET
        (function() {
          var encode = window.encodeURIComponent,
            paramUrl = [],
            key;

          for (key in data) {
            if (data.hasOwnProperty(key)) {
              paramUrl.push(encode(key) + '=' + encode(data[key]));
            }
          }

          url += '?' + paramUrl.join('&');

          // 防止 jQuery 自动拼接
          data = null;
        })();
      }
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
