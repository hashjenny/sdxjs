// 编写一个名为 lc 的程序，该程序统计并报告一个或多个文件中的行数以及总行数，以便 lc a.txt b.txt 显示类似的内容：
// a.txt 475
// b.txt 31
// total 506

import * as fs from "node:fs/promises";

type FileInfo = {
  filename: string;
  lineCount: number;
};

const info: FileInfo[] = [];

for (const f of process.argv.slice(2)) {
  const buf = await fs.readFile(f);
  const content = buf.toString();
  info.push({ filename: f, lineCount: content.split("\n").length });
}

console.log(info);
