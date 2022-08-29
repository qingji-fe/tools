/*
  1. 实现 axiox构造函数
    axiox.config
    axios.method()
  2. 把Axios.prototype上的方法搬运到request
     用到utils的extend 来混合方法
*/

function CancelToken(fn) {
  var resolvePromise;
  this.promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });
  fn(function cancel(message) {
    resolvePromise(message);
  });
}
class InterceptorsManage {
  constructor() {
    this.queues = [];
  }

  use(fullfield, rejected) {
    this.queues.push({
      fullfield,
      rejected,
    });
  }
}
class MyAxiox {
  constructor() {
    this.interceptors = {
      request: new InterceptorsManage(),
      response: new InterceptorsManage(),
    };
  }
  run(config) {
    return new Promise((resolve, reject) => {
      const { url = "", method = "get", data = {} } = config;
      console.log("config", config);
      const xhr = new XMLHttpRequest();
      if (config.cancelToken) {
        config.cancelToken.promise.then((cancel) => {
          xhr.abort();
          reject(cancel);
        });
      }
      xhr.open(method, url, true);
      xhr.onload = function () {
        resolve(xhr.responseText);
      };
      xhr.send(data);
    });
  }
  request(config) {
    return new Promise((resolve) => {
      // 请求拦截
      let chain = [this.run.bind(this), undefined];
      this.interceptors.request.queues.forEach((interceptor) => {
        chain.unshift(interceptor.fullfield, interceptor.rejected);
      });
      this.interceptors.response.queues.forEach((interceptor) => {
        chain.push(interceptor.fullfield, interceptor.rejected);
      });

      let promise = Promise.resolve(config);
      while (chain.length > 0) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    });
  }
}
const methods = ["get", "post"];
methods.forEach((method) => {
  MyAxiox.prototype[method] = function () {
    return this.request({
      method: method,
      url: arguments[0],
      ...(arguments[1] || {}),
    });
  };
});

const utils = {
  extend(a, b, context) {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        if (typeof b[key] === "function") {
          a[key] = b[key].bind(context);
        } else {
          a[key] = b[key];
        }
      }
    }
  },
};

function CreateAxiox() {
  var axios = new MyAxiox();
  var request = axios.request.bind(axios); // 导出request方法

  utils.extend(request, MyAxiox.prototype, axios);

  utils.extend(request, axios);

  return request;
}
let axios = CreateAxiox();
axios.CancelToken = CancelToken;

console.log("axiosaxiosaxios", axios);
