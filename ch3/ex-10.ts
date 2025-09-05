import fs from "fs-extra-promise";
import yaml from "js-yaml";

const test = async () => {
  const raw = await fs.readFileAsync("./ch3/config.yml", "utf-8");
  console.log("inside test, raw text", raw);
  const cooked = yaml.load(raw);
  console.log("inside test, cooked configuration", cooked);
  return cooked;
};

const result = test();
console.log("outside test, result is", result.constructor.name);
result.then((something) => console.log("outside test we have", something));

// outside test, result is Promise
// inside test, raw text content: yaml-text-content

// inside test, cooked configuration { content: 'yaml-text-content' }
// outside test we have { content: 'yaml-text-content' }
