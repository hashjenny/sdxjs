import hope from "./Hope.ts";
import { assertApproxEqual } from "./assertExtend.ts";

hope.test("Values are too far apart", () =>
  assertApproxEqual(1.0, 2.0, "Values are too far apart"), ["math"]
);

hope.test("Large margin of error", () =>
  assertApproxEqual(1.0, 2.0, "Large margin of error", 10.0), ["math", "pass"]
);
