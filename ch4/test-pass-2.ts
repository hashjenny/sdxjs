import * as assert from "node:assert";
import hope from "./Hope.ts";
import { sign } from "./sign.ts";

hope.test("Sign of positive is 1", () => assert.equal(sign(19), 1));
