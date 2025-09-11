new Promise((resolve, reject) => reject(new Error("failure")))
  .catch((err) => console.log(err))
  .then((err) => console.log(err));

// Promise 构造函数同步执行
// reject(new Error('failure')) 被调用
// Promise 状态变为 rejected，reason 为 Error('failure')

// 由于 Promise 是 rejected 状态，.catch() 会捕获错误
// .catch() 返回一个新的 Promise
// 错误处理回调 err => console.log(err) 被加入微任务队列
// 重要：.catch() 如果没有显式返回或抛出错误，会返回一个 resolved Promise

// 这个 .then() 是链接在前一个 .catch() 返回的 Promise 上
// 由于前一个 .catch() 返回的是 resolved Promise（值为 undefined）
// .then() 的回调会正常执行，参数为 undefined
