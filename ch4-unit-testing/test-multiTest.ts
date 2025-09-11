import * as assert from "node:assert";
import hope from "./Hope.ts";

function add(n1: number, n2: number): number {
    return n1 + n2;
}

hope.multiTest("multi test pass", add, [
    [[1, 2], 3],
    [[2, 3], 5],], ["math", "pass"]);

hope.multiTest("multi test fail", add, [
    [[1, 2], 4],
    [[2, 3], 4],], ["math",]);