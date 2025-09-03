import { glob } from "glob";
import path from "node:path";

async function findFiles(srcDir: string, dstDir: string) {
  try {
    let files = await glob(`${srcDir}/**/*.*`, {
      ignore: ["**/node_modules/**", "*.bck"],
    });
    for (const srcName of files) {
      const relativePath = path.relative(srcDir, dstDir);
      // console.log(relativePath);
      const dstName = path.join(relativePath, srcName);
      console.log(srcName, "->", dstName);
    }
  } catch (err) {
    console.error(err);
  }
}

const [srcDir, dstDir] = process.argv.slice(2);

await findFiles(srcDir, dstDir);
