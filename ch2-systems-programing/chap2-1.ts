import { glob } from "glob";

async function findFiles(srcDir: string) {
  try {
    let files = await glob(`${srcDir}/**/*.*`, { ignore: "*bck" });
    files = files.filter((f) => !f.includes("node_modules"));
    for (const filename of files) {
      console.log(filename);
    }
  } catch (err) {
    console.error(err);
  }
}

const srcDir = process.argv[2];

await findFiles(srcDir);
