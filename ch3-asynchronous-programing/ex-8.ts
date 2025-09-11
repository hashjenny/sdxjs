// 使用 async 和 await ，编写一个名为 in-all.js 的程序，查找并打印出在所有输入文件中都出现的行

import * as fs from "node:fs/promises";

async function getSameLines(files: string[]) {
  let loadLines = false;
  let s: Set<string> = new Set<string>();
  for (const file of files) {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    const lines = content.split("\n").filter((e) => e);
    if (!loadLines) {
      s = new Set<string>(lines);
      loadLines = true;
    } else {
      const commonItems: string[] = [];
      for (const item of lines) {
        if (s.has(item)) {
          commonItems.push(item);
        }
      }
      s = new Set<string>(commonItems);
    }
  }
  for (const item of s) {
    console.log(item);
  }
}

const files = process.argv.slice(2);
// const files = ["ch3/ex-5.ts", "ch3/ex-6.ts", "ch3/ex-7.ts", "ch3/ex-8.ts"];
await getSameLines(files);
