// 编写一个名为 rename 的程序，该程序接受三个或更多的命令行参数：

// 一个要匹配的文件名扩展名。
// 一个用于替换它的扩展名。
// 一个或多个现有文件的名称。

// 当它运行时， rename 会将任何具有第一个扩展名的文件重命名为具有第二个扩展名的文件，但不会覆盖已存在的文件。例如，假设一个目录包含 a.txt、 b.txt 和 b.bck 。命令：
// rename .txt .bck a.txt b.txt

// 会将 a.txt 重命名为 a.bck ，但不会重命名 b.txt ，因为 b.bck 已经存在。

import * as fse from "fs-extra";
import * as path from "node:path";

const srcExtension = process.argv[2];
const dstExtension = process.argv[3];
const files = process.argv.slice(4);

for (const file of files) {
  if (path.extname(file) === srcExtension) {
    const newName = path.basename(file, path.extname(file)) + dstExtension;
    if (await fse.exists(newName)) {
      continue;
    } else {
      fse.copy(file, newName);
    }
  }
}
