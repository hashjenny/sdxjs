// 修改文件复制程序，使其检查是否提供了正确数量的命令行参数，并在未提供时打印一个合理的错误消息（包括使用说明）。

import path from "node:path";
import * as fs from "node:fs/promises";
import * as fse from "fs-extra";
import { glob } from "glob";

async function findFiles(srcDir: string, dstDir: string) {
  try {
    await fse.ensureDir(dstDir);

    let files = await glob(`${srcDir}/**/*.*`, {
      ignore: ["**/node_modules/**", "*.bck"],
      nodir: true,
    });
    for (const srcName of files) {
      const status = await fs.stat(srcName);
      if (status.isFile()) {
        const relativePath = path.relative(srcDir, dstDir);
        const dstName = path.join(relativePath, srcName);
        await fse.copy(srcName, dstName);
        console.log(srcName, "->", dstName);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

if (process.argv.length !== 4) {
  console.error("必须输入两个位置参数");
} else {
  const [srcDir, dstDir] = process.argv.slice(2);

  await findFiles(srcDir, dstDir);
}
