import * as assert from "node:assert";
import hope from "./Hope.ts";
import { sign } from "./sign.ts";

hope.test("Sign of negative is -1", () => assert.equal(sign(-3), -1), ["math", "pass"]);
