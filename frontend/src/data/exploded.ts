// Geometry of the exploded-view pieces cut from the concept board (units = source pixels on a 1312 x 200 stage).
export const STAGE = { w: 1312, h: 200 } as const;

export const PIECES = [
  { id: "filter",  src: "/images/exploded/filter.webp",  x0: 66,  w: 180, h: 88 },
  { id: "motor",   src: "/images/exploded/motor.webp",   x0: 240, w: 206, h: 90 },
  { id: "fan",     src: "/images/exploded/fan.webp",     x0: 436, w: 186, h: 94 },
  { id: "heating", src: "/images/exploded/heating.webp", x0: 606, w: 256, h: 124 },
  { id: "cap",     src: "/images/exploded/cap.webp",     x0: 858, w: 108, h: 124 },
  { id: "barrel",  src: "/images/exploded/barrel.webp",  x0: 968, w: 314, h: 124 },
] as const;

// Callout labels: anchor x on the stage, y where the leader line starts.
export const LABELS = [
  { x: 217,  lineTop: 92 },
  { x: 392,  lineTop: 94 },
  { x: 511,  lineTop: 98 },
  { x: 745,  lineTop: 128 },
  { x: 1107, lineTop: 128 },
] as const;
