require(["a1", "a2"], function (res) {
  console.log("所有模块执行完毕的回调", res);
});

var a1 = document.getElementById("a1");
var a2 = document.getElementById("a2");
a1.addEventListener("click", function () {
  require(["a1"], function (res) {
    console.log("重复加载", res);
  });
});
