import { main, hashExisting } from "./ch5/run.ts";

for (const ele of await hashExisting('./ch4')) {
    console.log(ele);
}
