// Geometry of the pieces cut from the concept board (units = source pixels on a 1312 x 200 stage).
// Files in /images/parts have a transparent background (generated from /images/exploded).
export const STAGE = { w: 1312, h: 200 } as const;

export const PIECES = [
  { id: "filter",  src: "/images/parts/filter.webp",  x0: 66,  w: 180, h: 88,  y0: 20 },
  { id: "motor",   src: "/images/parts/motor.webp",   x0: 240, w: 206, h: 90,  y0: 20 },
  { id: "fan",     src: "/images/parts/fan.webp",     x0: 436, w: 186, h: 94,  y0: 20 },
  { id: "heating", src: "/images/parts/heating.webp", x0: 606, w: 256, h: 124, y0: 0 },
  { id: "cap",     src: "/images/parts/cap.webp",     x0: 858, w: 108, h: 124, y0: 0 },
  { id: "barrel",  src: "/images/parts/barrel.webp",  x0: 968, w: 314, h: 124, y0: 0 },
] as const;
