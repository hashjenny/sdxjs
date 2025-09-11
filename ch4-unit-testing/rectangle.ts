export type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const isRectangle = (rec: Rectangle) =>
  rec.x >= 0 && rec.y >= 0 && rec.w > 0 && rec.h > 0;
