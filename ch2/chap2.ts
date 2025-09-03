import fs from "node:fs";

const srcDir = process.argv[2];

fs.readdir(srcDir, (err, files) => {
  console.log("log ------- callback");
  if (err) {
    console.error(err);
  } else {
    for (const name of files) {
      console.log(name);
    }
  }
});

console.log("log ------- last line of program");
