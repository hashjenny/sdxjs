import * as assert from "node:assert";
import hope from "./Hope.ts";
import { sign } from "./sign.ts";

hope.test("Sign misspelled is error", () => assert.equal(sgn(1), 1));
