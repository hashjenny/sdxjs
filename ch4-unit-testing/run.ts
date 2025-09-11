import * as fs from "node:fs/promises"

import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import hope from "./Hope.ts" // must add postfix '.ts' while using 'node main.ts'
import { createTmpFile, removeTmpFile } from "./setup.ts"

export const main = async (args: string[]) => {
  const argv = await yargs(hideBin(args))
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "是否启用详细模式",
    })
    .option("select", {
      alias: "s",
      type: "string",
      description: "the program only runs tests in files that contain the string",
    })
    .option("tagname", {
      alias: "t",
      type: "string",
      description: "only tests with that tag are run",
    }).argv

  let files: string[] = []
  let tag: string | undefined = undefined
  if (argv._.length > 0) {
    files.push(...argv._.map(e => e.toString()))
  } else if (argv.v) {
    const filenames = await fs.readdir("./ch4")
    for (const filename of filenames) {
      if (filename.startsWith("test-") && filename.endsWith(".ts")) {
        files.push(`./${filename}`)
      }
    }
    // console.log(files);
  } else if (argv.s) {
    const filenames = await fs.readdir("./ch4")
    for (const filename of filenames) {
      if (filename.startsWith("test-")
        && filename.endsWith(".ts")
        && filename.includes((argv.s).toString())) {
        files.push(`./${filename}`)
      }
    }
  }

  if (argv.t) {
    tag = (argv.t).toString()
  }

  for (const file of files) {
    // import(./test-*.ts)
    // await import(file.replace("ch4", "."))
    await import(file)
  }

  hope.setup(createTmpFile)
  hope.teardown(removeTmpFile)
  hope.run(tag)

}

// await main(process.argv);
