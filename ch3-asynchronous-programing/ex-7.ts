// 使用 async 和 await ，编写一个名为 match.js 的程序，用于查找并打印包含给定字符串的行。例如：

import * as fs from "node:fs/promises";

async function getContents(files: string[], word: string) {
  for (const file of files) {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    if (content.includes(word)) {
      // console.log(file);
      console.log(content);
      break;
    }
  }
}

const files = process.argv.slice(2);
// const files = ["ch3/ex-1.ts", "ch3/ex-2.ts", "ch3/ex-3.ts", "ch3/ex-4.ts"];
const word = "Promise";
await getContents(files, word);
