// Promise.resolve("hello");

// Promise.resolve("hello").then((result) => console.log(result));

const p = new Promise((resolve, reject) => resolve("hello")).then((result) =>
  console.log(result)
);
