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

//可选参数,可以配置默认的一些事件
 var defaultEvents={
      done:function(){
       console.log('done');
      },
      'timeout':function(){
        alert('timeout');
      }
    }


 Ajax({
      url: './data.json'
    },defaultEvents).on('done', function (data) {
      console.log(data);
    }).on('not-allowed',function( xhr, errorType, error){

    }).on('error',function( xhr, errorType, error){

    });
    
// use Ajax
```
