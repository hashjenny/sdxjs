// 使用 async 和 await ，编写一个名为 file-diff.js 的程序，该程序比较两个文件中的行，并显示哪些行只存在于第一个文件中，哪些行只存在于第二个文件中，哪些行同时存在于两个文件中。例如，如果 left.txt 包含：
// some
// people
//  并且 right.txt 包含：
// write
// some
// code
// 然后：
// node file-diff.js left.txt right.txt
// 会打印：
// 2 code
// 1 people
// * some
// 2 write
// 其中 1 、 2 和 * 表示行是否仅出现在第一个文件或第二个文件中，或者同时出现在两个文件中。请注意，文件中行的顺序并不重要。

import * as fs from "node:fs/promises";

type FileContent = {
  filename: string;
  content: Set<string>;
};

async function getFileContent(file: string) {
  const content = await fs.readFile(file, { encoding: "utf-8" });
  const lines = content.split("\n").filter((e) => e);
  return new Set(lines);
}

function printIntersection(content1: FileContent, content2: FileContent) {
  for (const element of [...content1.content].filter((e) =>
    content2.content.has(e)
  )) {
    console.log(`*  ${element}`);
  }
}

function printUnique(fileContent1: FileContent, fileContent2: FileContent) {
  for (const element of [...fileContent1.content].filter(
    (e) => !fileContent2.content.has(e)
  )) {
    console.log(`${fileContent1.filename} ${element}`);
  }
  for (const element of [...fileContent2.content].filter(
    (e) => !fileContent1.content.has(e)
  )) {
    console.log(`${fileContent2.filename} ${element}`);
  }
}

const filename1 = process.argv[2];
const set1 = await getFileContent(filename1);
const fileContent1: FileContent = { filename: filename1, content: set1 };

const filename2 = process.argv[3];
const set2 = await getFileContent(filename2);
const fileContent2: FileContent = { filename: filename2, content: set2 };

printIntersection(fileContent1, fileContent2);
printUnique(fileContent1, fileContent2);
