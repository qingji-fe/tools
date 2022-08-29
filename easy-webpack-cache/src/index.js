// import("./one1").then((module) => {
//   const greeter = module.default;
//   document.querySelector("#root").appendChild(greeter());
// });
// import("./two").then((module) => {
//   const greeter = module.default;
//   document.querySelector("#root").appendChild(greeter());
// });

import css from "./index.css";
console.log("给他人非的", css);

let div = document.createElement("div");
div.className = "div";
div.innerText = "hello div";
document.getElementsByTagName("body")[0].appendChild(div);
