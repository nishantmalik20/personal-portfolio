import { Shape } from "three";

/**
 * Simplified Canadian maple leaf outline.
 * Right half from the top tip down to the stem; the left half is mirrored.
 * Coordinates are roughly within [-1, 1], y up.
 */
const RIGHT_HALF: [number, number][] = [
  [0.0, 1.0],
  [0.14, 0.66],
  [0.4, 0.72],
  [0.36, 0.5],
  [0.78, 0.45],
  [0.55, 0.22],
  [0.92, 0.1],
  [0.5, -0.05],
  [0.6, -0.32],
  [0.2, -0.22],
  [0.28, -0.5],
  [0.07, -0.36],
  [0.06, -1.0],
];

export function mapleOutline(): [number, number][] {
  const pts: [number, number][] = [...RIGHT_HALF];
  for (let i = RIGHT_HALF.length - 1; i >= 1; i--) {
    const [x, y] = RIGHT_HALF[i];
    pts.push([-x, y]);
  }
  return pts;
}

export function mapleShape(size = 1): Shape {
  const shape = new Shape();
  mapleOutline().forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x * size, y * size);
    else shape.lineTo(x * size, y * size);
  });
  shape.closePath();
  return shape;
}

/** Draws the same leaf on a 2D canvas (y flipped for canvas space). */
export function drawMaple(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  mapleOutline().forEach(([x, y], i) => {
    const px = cx + x * size;
    const py = cy - y * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fill();
}
