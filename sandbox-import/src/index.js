import Sandbox from "./sandbox";

var createDiv = document.createElement("div");
createDiv.innerHTML = "卸载!";
createDiv.id = "dd";
document.body.appendChild(createDiv);

var sandbox = new Sandbox();
sandbox.run();
var statics = {
  js: ["https://unpkg.com/react@16.14.0/umd/react.development.js"],
  // css: ["xxcs"],
};

statics.js.forEach((url) => {
  fetch(url)
    .then((response) => response.text())
    .then((code) => {
      const res = sandbox.buildCode(code);
      console.log("resresres", res);
    });
});

var dd = document.getElementById("dd");
dd.addEventListener("click", () => {
  console.log("gfd顶顶顶顶");
  sandbox.stop();
});
