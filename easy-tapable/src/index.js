import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} from "tapable";

// 1. 同步钩子hook
const hook1 = new SyncHook(); // 创建钩子对象

hook1.tap("a", () => {
  console.log("log1111");
});
hook1.tap("b", () => {
  console.log("log2222");
});
// hook1.call();

// 2.  同步钩子hook传递参数
const hook2 = new SyncHook(["parms"]); // 创建钩子对象

hook2.tap("a", (parms) => {
  console.log("log1111", parms);
});
hook2.tap("b", (parms) => {
  console.log("log2222", parms);
});
// hook2.call("a");

// 3.  同步钩子hook传递参数
const hook3 = new SyncBailHook(); // 创建钩子对象

hook3.tap("a", () => {
  console.log("log1111");
  return 1; // 这里return一个非undefined的值就不在执行下面注册的b  c了
});
hook3.tap("b", () => {
  console.log("log2222");
});
hook3.tap("c", () => {
  console.log("log3333");
});

// hook3.call();

// 4.  同步钩子hook传递参数
const hook4 = new SyncBailHook(["parms"]); // 创建钩子对象

hook4.tap("a", (parms) => {
  console.log("log1111", parms);
  return 1; // 这里return一个非undefined的值就不在执行下面注册的b  c了
});
hook4.tap("b", (parms) => {
  console.log("log2222", parms);
});
hook4.tap("c", (parms) => {
  console.log("log3333", parms);
});

// hook4.call("参数");

// 5.  同步钩子hook传递参数
const hook5 = new SyncWaterfallHook(["parms"]);
hook5.tap("a", (parms) => {
  console.log("log1111", parms);
  return `${parms}+1`;
});
hook5.tap("b", (parms) => {
  console.log("log2222", parms);
  return `${parms}+2`;
});
hook5.tap("c", (parms) => {
  console.log("log3333", parms);
});

// hook5.call("参数");

// 6.  同步钩子hook传递参数
let index = 0;
const hook6 = new SyncLoopHook(["parms"]);
hook6.tap("a", (parms) => {
  console.log("log1111", parms);
  if (index < 5) {
    index++;
    return 1;
  }
});

// hook6.call("参数");

// 7.  异步并行执行钩子hook
const hook7 = new AsyncParallelHook();
hook7.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback();
  }, 1000);
});
hook7.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 1000);
});

// hook7.callAsync(() => {
//   console.log("all完成");
// });

// 8. 异步并行执行钩子hook
const hook8 = new AsyncParallelBailHook();
hook8.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback("aaa");
  }, 1000);
});
hook8.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback("bbbb");
  }, 2000);
});
// hook8.callAsync((res) => {
//   console.log("all完成", res);
// });

// 9. 异步串行执行钩子hook
const hook9 = new AsyncSeriesHook();
hook9.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback();
  }, 1000);
});
hook9.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 2000);
});
// hook9.callAsync((res) => {
//   console.log("all完成", res);
// });

// 10. 异步串行执行钩子hook
const hook10 = new AsyncSeriesBailHook();
hook10.tapAsync("a", (callback) => {
  setTimeout(() => {
    console.log("aaa");
    callback("000000");
  }, 1000);
});
hook10.tapAsync("b", (callback) => {
  setTimeout(() => {
    console.log("bbbb");
    callback();
  }, 2000);
});
// hook10.callAsync((res) => {
//   console.log("all完成", res);
// });

// 11. 异步串行执行钩子hook返回值透传
const hook11 = new AsyncSeriesWaterfallHook(["parms"]);
hook11.tapAsync("a", (parms, callback) => {
  setTimeout(() => {
    console.log("aaa", parms);
    callback();
  }, 1000);
});
hook11.tapAsync("b", (parms, callback) => {
  setTimeout(() => {
    console.log("bbbb", parms);
  }, 2000);
});
hook11.callAsync("参数", (res) => {
  console.log("all完成", res);
});
