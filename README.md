# nd-ajax

[![spm version](http://spmjs.io/badge/nd-ajax)](http://spmjs.io/package/nd-ajax)

> 简单的ajax封装

## 安装

```
$ spm install nd-ajax --save
```

## 使用

```js
var Ajax = require('nd-ajax');

new Ajax({
  // `$.ajax` 的参数
  settings: {
    url: 'some-url',
    type: 'POST',
    data: 'foo=bar'
  },
  // 默认 handlers 支持的事件列表
  events: {
    'done': function(data) {
      console.log(data);
    },
    'fail': function(xhr, errorType, error) {
      console.log('fail', xhr, errorType, error);
    },
    'error': function(xhr, errorType, error) {
      console.log('error', xhr, errorType, error);
    },
    'timeout': function() {
      console.log('对不起，访问超时了');
    },
    'disconnect': function() {
      console.log('网络不给力，请检查网络');
    },
    'unauthorized': function() {
      console.log('未登录或会话过期');
    },
    'forbidden': function() {
      console.log('没有权限访问、操作');
    },
    'not-found': function() {
      console.log('对不起，没有找到您要的东西');
    },
    'method-not-allowed': function() {
      console.log('请求方法不对');
    }
  },
  // 自定义 jQuery done/fail 后的处理函数
  // 默认对 fail 进行进一步细化，详见源码
  handlers: {
    done: function(data, statusText, xhr) {
      this.trigger('custom-done', data, statusText, xhr);
    },
    fail: function(xhr, statusText, error) {
      this.trigger('custom-fail', xhr, statusText, error);
    }
  }
});
```
