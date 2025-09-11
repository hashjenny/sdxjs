import hope from "./Hope.ts";
import { isRectangle } from "./rectangle.ts";

hope.test("is a valid rectangle", () =>
  isRectangle({ x: 1, y: 1, w: 1, h: 1 }), ["math", "pass"]
);
