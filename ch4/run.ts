import { glob } from "glob";
import hope from "./Hope";

export const main = async (args: string[]) => {
  let files: string[] = [];
  if (args.length > 2) {
    files.push(...args.slice(2));
  } else {
    const filenames = await glob(`ch4/**/test-*.ts`);
    files.push(...filenames);
  }

  for (const file of files) {
    await import(file);
  }

  hope.run();
};
