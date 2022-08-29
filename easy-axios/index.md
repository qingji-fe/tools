## 概述

axios 是一个基于 promise 实现的 http 库，可用在浏览器和 node 端

## 特性

- 基于 promise 的
- 有拦截请求和响应
- 取消请求
- 客户端支持防御 XSRF

## api

- axios(config)

```js
axios({
  url: '/api'
  method: 'get',
}).then(res=> {
 console.log(res);
})
```

- axios.method(url, data, config)

```js
axios.get("/api").then((res) => {
  console.log(res);
});
```

## 实现原理
