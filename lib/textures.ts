import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
import { drawMaple } from "./maple";

/**
 * Procedural canvas textures — the whole site ships zero image assets.
 * Every function must only be called client-side (inside useMemo/useEffect).
 */

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Red & black buffalo plaid for the avatar's shirt. */
export function makePlaidTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#D7263D";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "rgba(16, 16, 22, 0.55)";
  for (let x = 0; x < 256; x += 128) ctx.fillRect(x, 0, 64, 256);
  for (let y = 0; y < 256; y += 128) ctx.fillRect(0, y, 256, 64);
  // faint weave lines
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  for (let i = 0; i < 256; i += 8) {
    ctx.fillRect(i, 0, 1, 256);
    ctx.fillRect(0, i, 256, 1);
  }
  const tex = toTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(2.5, 2.5);
  return tex;
}

/** Red cap dome with a single small white maple leaf (no lettering). */
export function makeCapTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(1024, 512);
  ctx.fillStyle = "#E03131";
  ctx.fillRect(0, 0, 1024, 512);
  drawMaple(ctx, 512, 300, 110, "#FFFFFF");
  return toTexture(canvas);
}

/** Soft radial glow sprite (sun, moon, lamp, fireflies). */
export function makeGlowTexture(color = "255, 255, 255"): CanvasTexture {
  const { canvas, ctx } = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, `rgba(${color}, 0.85)`);
  g.addColorStop(0.35, `rgba(${color}, 0.32)`);
  g.addColorStop(1, `rgba(${color}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(canvas);
}

/** Crescent moon on a transparent square. */
export function makeCrescentTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#FFF6DC";
  ctx.beginPath();
  ctx.arc(128, 128, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(172, 102, 88, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  return toTexture(canvas);
}

/** Painted wooden sign plank with text. */
export function makeLabelTexture(
  text: string,
  bg = "#9A6B3F",
  fg = "#FFF6DF"
): CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 128);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "rgba(70, 40, 14, 0.35)";
  for (let i = 0; i < 5; i++) ctx.fillRect(0, 18 + i * 24, 256, 2);
  ctx.fillStyle = fg;
  ctx.font = "800 54px 'Arial Black', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 66);
  return toTexture(canvas);
}

/** Tiny colourful "code" screen for the floating laptop. */
export function makeCodeTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(512, 320);
  ctx.fillStyle = "#171E3C";
  ctx.fillRect(0, 0, 512, 320);
  const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#6FE3E1"];
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let row = 0; row < 11; row++) {
    let x = 28 + Math.floor(rand() * 3) * 26;
    const y = 26 + row * 26;
    const chunks = 2 + Math.floor(rand() * 3);
    for (let cIdx = 0; cIdx < chunks; cIdx++) {
      const w = 30 + rand() * 90;
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.roundRect(x, y, w, 12, 6);
      ctx.fill();
      x += w + 18;
      if (x > 430) break;
    }
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#FFD93D";
  ctx.fillRect(28, 26 + 11 * 26, 14, 14);
  return toTexture(canvas);
}

/** Soft dark ellipse used as a cartoon blob shadow. */
export function makeBlobTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, "rgba(21, 31, 64, 0.5)");
  g.addColorStop(0.65, "rgba(21, 31, 64, 0.28)");
  g.addColorStop(1, "rgba(21, 31, 64, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(canvas);
}

/** Round white label with a red maple leaf for the syrup jug. */
export function makeSyrupLabelTexture(): CanvasTexture {
  const { canvas, ctx } = makeCanvas(128, 128);
  ctx.fillStyle = "#FFF8EA";
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#D62839";
  ctx.lineWidth = 6;
  ctx.stroke();
  drawMaple(ctx, 64, 60, 38, "#D62839");
  return toTexture(canvas);
}

/** Vertical gradient ribbon for aurora curtains. */
export function makeAuroraTexture(rgb: string): CanvasTexture {
  const { canvas, ctx } = makeCanvas(32, 256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, `rgba(${rgb}, 0)`);
  g.addColorStop(0.3, `rgba(${rgb}, 0.55)`);
  g.addColorStop(0.62, `rgba(${rgb}, 0.78)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 256);
  return toTexture(canvas);
}
