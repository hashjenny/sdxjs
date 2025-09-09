import { glob } from "glob";
import hope from "./Hope.ts"; // must add postfix '.ts' while using 'node main.ts'

export const main = async (args: string[]) => {
  let files: string[] = [];
  if (args.length > 2) {
    files.push(...args.slice(2));
  } else {
    const filenames = await glob(`ch4/**/test-*.ts`);
    files.push(...filenames);
  }

  for (const file of files) {
    // import(./test-*.ts)
    await import(file.replace("ch4", "."));
  }

  hope.run("verse");
};

// await main(process.argv);
