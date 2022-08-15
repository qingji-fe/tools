function getComponent() {
  return import("lodash").then((_) => {
    var element = document.createElement("div");
    element.innerHTML = _.join(["Hello", "webpack"], " ");
    return element;
  });
}

getComponent().then((component) => {
  document.body.appendChild(component);
});

import("./one1").then((module) => {
  const greeter = module.default;
  document.querySelector("#root").appendChild(greeter());
});
import("./two").then((module) => {
  const greeter = module.default;
  document.querySelector("#root").appendChild(greeter());
});
