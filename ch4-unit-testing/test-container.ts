import hope from "./Hope.ts";
import { assertMapEqual, assertSetEqual } from "./assertExtend.ts";

const map1 = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 3],
]);
const map2 = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 3],
]);
const map3 = new Map<string, number>([
    ["a", 1],
    ["b", 2],
    ["c", 4],
]);
hope.test("Map1 and map2 are equal", () =>
    assertMapEqual(map1, map2, "Map1 and map2 are equal"))
hope.test("Map1 and map3 are not equal", () =>
    assertMapEqual(map1, map3, "Map1 and map3 are not equal"))

const set1 = new Set<number>([1, 2, 3]);
const set2 = new Set<number>([1, 2, 3]);
const set3 = new Set<number>([1, 2, 4]);
hope.test("Set1 and set2 are equal", () =>
    assertSetEqual(set1, set2, "Set1 and set2 are equal"))
hope.test("Set1 and set3 are not equal", () =>
    assertSetEqual(set1, set3, "Set1 and set3 are not equal"))
