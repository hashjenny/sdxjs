import { main, hashExisting } from "./ch5-file-backup/run.ts";

for (const ele of await hashExisting('./ch4')) {
    console.log(ele);
}
