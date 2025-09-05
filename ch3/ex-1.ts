// setImmediate 和 process.nextTick 之间的区别是什么？什么时候你会使用每一个？

console.log("开始");

process.nextTick(() => {
  console.log("nextTick 1");
});

setImmediate(() => {
  console.log("setImmediate 1");
});

setTimeout(() => {
  console.log("setTimeout 0");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

process.nextTick(() => {
  console.log("nextTick 2");
});

console.log("结束");

// 输出顺序:
// 开始
// 结束
// nextTick 1
// nextTick 2
// Promise 1
// setTimeout 0
// setImmediate 1

// 主要区别
// 特性	process.nextTick	setImmediate
// 执行时机	当前操作完成后立即执行	在当前事件循环的 I/O 阶段之后执行
// 事件循环阶段	不属于任何阶段，在每个阶段之间执行	在 I/O 回调阶段之后执行
// 优先级	更高（立即执行）	较低（下一个事件循环）
// 递归风险	容易导致事件循环饥饿	相对安全
// 浏览器支持	Node.js 特有	浏览器也支持（但行为可能不同）
