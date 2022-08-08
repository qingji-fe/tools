// import createFakeWindow from "./createFakeWindow";

export default class SandBox {
  constructor() {
    this.isActivation = false; // 是否激活
    this.proxyWindow = {};
    this.keysObj = new Set();
    this.fakeWindow = window;
    this.initProxy();
  }
  initProxy() {
    this.proxyWindow = new Proxy(this.fakeWindow, {
      get: (target, key) => {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key);
        } else {
          return Reflect.get(window, key);
        }
      },
      set: (target, key, value) => {
        if (this.isActivation) {
          Reflect.set(target, key, value);
          this.keysObj.add(key);
        }
        return true;
      },
      deleteProperty: (target, key) => {
        if (target.hasOwnProperty(key)) {
          return Reflect.deleteProperty(target, key);
        }
        return true;
      },
    });
  }
  run() {
    if (!this.isActivation) {
      this.isActivation = true;
    }
  }
  stop() {
    if (this.isActivation) {
      this.isActivation = false;
      this.keysObj.forEach((item) => {
        Reflect.deleteProperty(this.fakeWindow, item);
      });
      this.keysObj.clear();
    }
  }
  buildCode(code) {
    window.proxyWindow = this.proxyWindow;
    const buildCode = `(function (window) {
      with (window) {
        ${code}
      }
    }).call(window.proxyWindow, window.proxyWindow)`;
    new Function(buildCode)();
    const lastKey = [...this.keysObj][0];
    return lastKey ? this.fakeWindow[lastKey] : undefined;
  }
}
