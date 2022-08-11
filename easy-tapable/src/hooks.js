// 1.  模拟实现同步的钩子 SyncHook
class EasySyncHook {
  constructor(args = []) {
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call(...args) {
    for (let i = 0; i < this.taps.length; i++) {
      this.taps[i](...args);
    }
  }
}
// var hook1 = new EasySyncHook(["parms"]);
// hook1.tap("a", (parms) => {
//   console.log("log1111", parms);
// });
// hook1.tap("b", (parms) => {
//   console.log("log2222", parms);
// });

// hook1.call("参数");
// 2.  模拟实现同步的钩子 SyncBailHook
class EasySyncBailHook {
  constructor(args = []) {
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call(...args) {
    for (let i = 0; i < this.taps.length; i++) {
      const res = this.taps[i](...args);
      if (res !== undefined) {
        return res;
      }
    }
  }
}
// var hook2 = new EasySyncBailHook();
// hook2.tap("a", (parms) => {
//   console.log("log1111", parms);
//   return 1;
// });
// hook2.tap("b", (parms) => {
//   console.log("log2222", parms);
// });

// hook2.call("参数");

/*
 发现代码几乎是一样的
 注册地方是一样的
 只有在触发的地方不太一样
 我们做一个抽取

*/

// 改造一下; 抽象hook
const CALL_DELEGATE = function (...args) {
  this.call = this.createCall();
  return this.call(...args);
};
class Hook {
  constructor(args = []) {
    this.args = args;
    this.taps = [];
    this.call = CALL_DELEGATE;
  }

  tap(name, fn) {
    this.taps.push(fn);
  }
  createCall() {
    return this.callInterface({
      //通过接口调用子类的 返回真正子类使用的call
      taps: this.taps,
      args: this.args,
    });
  }
}

function SyncHook(args = []) {
  const hook = new Hook(args);
  hook.constructor = SyncHook;
  hook.callInterface = function (options) {
    const { taps } = options;
    const call = function (...args) {
      for (let i = 0; i < taps.length; i++) {
        this.taps[i](...args);
      }
    };

    return call;
  };
  return hook;
}
SyncHook.prototype = null;

// var hook = new SyncHook();
// hook.tap("a", (parms) => {
//   console.log("log1111", parms);
// });
// hook.tap("b", (parms) => {
//   console.log("log2222", parms);
// });
// hook.call("参数");

function SyncBailHook(args = []) {
  const hook = new Hook(args);
  hook.constructor = SyncHook;
  hook.callInterface = function (options) {
    const { taps } = options;
    const call = function (...args) {
      for (let i = 0; i < taps.length; i++) {
        const res = this.taps[i](...args);
        if (res !== undefined) {
          return res;
        }
      }
    };

    return call;
  };
  return hook;
}
SyncBailHook.prototype = null;

// var hook = new SyncBailHook();
// hook.tap("a", (parms) => {
//   console.log("log1111", parms);
//   return 1;
// });
// hook.tap("b", (parms) => {
//   console.log("log2222", parms);
// });
// hook.call("参数");

/*
  callInterface 接口是在每一个子类中实现的
  也导致了每一个子类实现这个callInterface
*/

// 再次改造一下; 抽象一个callInterface的制造工厂

class HookCodeFactory {
  constructor() {
    this.options = undefined;
    this._args = undefined;
  }
  init(options) {
    this.options = options;
    this._args = options.args.slice();
  }

  setup(instance, options) {
    instance._x = options.taps.map((t) => t);
  }

  create(options) {
    console.log("规范热", options);
    this.init(options);
    const { taps } = options;
    let code = "";
    let fn;
    for (let i = 0; i < taps.length; i++) {
      code += `
             var _fn${i} = _x[${i}];
             _fn${i}(${this._args.join(",")});
         `;
    }
    const allCodes =
      `
     "use strict";
     var _x = this._x;
 ` + code;

    console.log("ffffff发发发发发", allCodes);

    // 用传进来的参数和生成的函数体创建一个函数出来
    fn = new Function(this._args.join(","), allCodes);
    return fn;
  }
}

const factory = new HookCodeFactory();
const COMPILE = function (options) {
  console.log("咕咕咕咕咕咕", options);
  factory.setup(this, options);
  return factory.create(options);
};

function SyncHook(args = []) {
  const hook = new Hook(args);
  hook.constructor = SyncHook;
  hook.callInterface = COMPILE;
  return hook;
}
SyncHook.prototype = null;

var hook = new SyncHook(["tt"]);
hook.tap("a", (parms) => {
  console.log("log1111", parms);
});
hook.tap("b", (parms) => {
  console.log("log2222", parms);
});
hook.call("参数");
