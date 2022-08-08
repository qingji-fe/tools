/**
 * 创建一个FakeWindow, 把window上不支持改变和删除的属性创建到我们创建的fake window上
 * @param global
 * @returns
 */
function createFakeWindow(global) {
  const fakeWindow = {};

  Object.getOwnPropertyNames(global)
    // 筛选出不可以改变或者可以删除的属性
    .filter((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      return !descriptor?.configurable;
    })
    // 重新定义这些属性可以可以改变和删除
    .forEach((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      if (descriptor) {
        // 判断有get属性，说明可以获取该属性值
        const hasGetter = Object.prototype.hasOwnProperty.call(
          descriptor,
          "get"
        );

        if (p === "top" || p === "parent" || p === "self" || p === "window") {
          descriptor.configurable = true;

          if (!hasGetter) {
            descriptor.writable = true;
          }
        }

        Object.defineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });

  return fakeWindow;
}
export default createFakeWindow;
