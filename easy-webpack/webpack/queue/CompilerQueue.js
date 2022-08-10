class CompilerQueue {
  constructor(available) {
    // available 为最大的并发数量
    this.available = available;
    this.waiters = [];
    this._continue = this._continue.bind(this);
  }

  acquire(callback) {
    if (this.available > 0) {
      this.available--;
      callback();
    } else {
      this.waiters.push(callback);
    }
  }

  release() {
    this.available++;
    if (this.waiters.length > 0) {
      process.nextTick(this._continue);
    }
  }

  _continue() {
    if (this.available > 0) {
      if (this.waiters.length > 0) {
        this.available--;
        const callback = this.waiters.pop();
        callback();
      }
    }
  }
}
module.exports = CompilerQueue;
