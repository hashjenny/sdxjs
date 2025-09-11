// 编写一个名为 wherenode.js 的程序，打印出它所运行的 Node 版本的完整路径。

import * as path from "node:path";

console.log(path.resolve(process.argv[0]));

// 下面这个程序按什么顺序打印消息？

const red = () => {
  console.log("RED");
};

const green = (func) => {
  console.log("GREEN");
  func();
};

const blue = (left, right) => {
  console.log("BLUE");
  left(right);
};

blue(green, red);

// BLUE GREEN RED

const blue2 = (left, right) => {
  console.log("BLUE");
  left(right);
};

blue2(
  (callback) => {
    console.log("GREEN");
    callback();
  },
  () => console.log("RED")
);

// BLUE GREEN RED

// 在下面的代码中填写空白，使输出与所示匹配。
const people = [
  { personal: "Jean", family: "Jennings" },
  { personal: "Marlyn", family: "Wescoff" },
  { personal: "Ruth", family: "Lichterman" },
  { personal: "Betty", family: "Snyder" },
  { personal: "Frances", family: "Bilas" },
  { personal: "Kay", family: "McNulty" },
];

const result = people.filter((item) => item.family < "M");

console.log(result);

// [
//   { personal: "Jean", family: "Jennings" },
//   { personal: "Ruth", family: "Lichterman" },
//   { personal: "Frances", family: "Bilas" },
// ];
