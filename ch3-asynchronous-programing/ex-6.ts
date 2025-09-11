import { glob } from "glob";
import * as fs from "node:fs/promises";

// usage: node thisfile 'pattern'
const pattern = process.argv[2];
// const pattern = "ch2/*.*";

const files = await glob(pattern);

const table = new Map<number, number>();

for (const file of files) {
  //   console.log(file);
  const content = await fs.readFile(file, { encoding: "utf-8" });
  const len = content.split("\n").length;
  const oldValue = table.get(len);
  if (oldValue) {
    table.set(len, oldValue + 1);
  } else {
    table.set(len, 1);
  }
}

console.log("length  number");
for (const [key, value] of [...table].sort(([key1], [key2]) => key1 - key2)) {
  console.log(`${key}      ${value}`);
}
