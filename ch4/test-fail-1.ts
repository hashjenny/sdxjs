import * as assert from "node:assert";
import hope from "./Hope.ts";
import { sign } from "./sign.ts";

hope.test("Sign of zero is 0", () => assert.equal(sign(0), 0));
