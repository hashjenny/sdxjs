import * as fs from "node:fs/promises";

async function head(lineNum: number, files: string[]) {
  for (const file of files) {
    const content = await fs.readFile(file, { encoding: "utf-8" });
    const lines = content.split("\n");
    let data: string[] = [];
    if (lineNum < lines.length) {
      data = lines.slice(0, lineNum);
    } else {
      data = lines;
    }
    for (const text of data) {
      console.log(text);
    }
  }
}

const lineNum = parseInt(process.argv[2], 10);
const files = process.argv.slice(3);
await head(lineNum, files);

// await head(15, ["./package.json", "./package-lock.json"]);
