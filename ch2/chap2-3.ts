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

const [srcDir, dstDir] = process.argv.slice(2);

await findFiles(srcDir, dstDir);
