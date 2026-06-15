/**
 * Single source of truth for scroll choreography.
 * DOM section heights and 3D scene windows are both derived from CHAPTERS,
 * so the storybook stays in sync no matter how chapters are re-timed.
 */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const range = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a || 1e-6));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOut = (t: number) => t * t * (3 - 2 * t);

export type ChapterId =
  | "hero"
  | "education"
  | "craft"
  | "work"
  | "travel"
  | "newfoundland"
  | "contact";

export interface Chapter {
  id: ChapterId;
  vh: number;
}

export const CHAPTERS: Chapter[] = [
  { id: "hero", vh: 140 },
  { id: "education", vh: 320 },
  { id: "craft", vh: 150 },
  { id: "work", vh: 240 },
  { id: "travel", vh: 190 },
  { id: "newfoundland", vh: 190 },
  { id: "contact", vh: 150 },
];

export const TOTAL_VH = CHAPTERS.reduce((sum, c) => sum + c.vh, 0);

/** Maximum scrollable distance in vh units (page height minus one viewport). */
const SCROLL_RANGE = TOTAL_VH - 100;

/**
 * Progress milestones of a chapter, all in global scroll progress [0..1]:
 *  enter — chapter top reaches viewport bottom (it starts arriving)
 *  start — chapter top reaches viewport top (sticky content fully on screen)
 *  end   — chapter bottom reaches viewport bottom (about to start leaving)
 *  exit  — chapter bottom reaches viewport top (fully gone)
 */
export interface ChapterWindow {
  enter: number;
  start: number;
  end: number;
  exit: number;
}

function computeWindows(): Record<ChapterId, ChapterWindow> {
  const out = {} as Record<ChapterId, ChapterWindow>;
  let acc = 0;
  for (const c of CHAPTERS) {
    out[c.id] = {
      enter: clamp01((acc - 100) / SCROLL_RANGE),
      start: clamp01(acc / SCROLL_RANGE),
      end: clamp01((acc + c.vh - 100) / SCROLL_RANGE),
      exit: clamp01((acc + c.vh) / SCROLL_RANGE),
    };
    acc += c.vh;
  }
  return out;
}

export const WIN = computeWindows();

/** Global p for a fraction f (0..1) of a chapter's pinned (sticky) segment. */
export function chapterLocalP(id: ChapterId, f: number): number {
  let acc = 0;
  for (const c of CHAPTERS) {
    if (c.id === id) return clamp01((acc + f * (c.vh - 100)) / SCROLL_RANGE);
    acc += c.vh;
  }
  return 0;
}

/**
 * Mutable scroll store shared between the DOM (writes p on scroll) and the
 * 3D scene (reads + smooths every frame). Deliberately not React state —
 * it changes every frame and must never trigger re-renders.
 */
export const scrollState = {
  /** raw page progress 0..1 */
  p: 0,
  /** frame-damped progress, written by the scene updater */
  smooth: 0,
  /** 0 = full day, 1 = full night, derived from smooth */
  night: 0,
};

/** Normalized pointer (-1..1), shared by camera parallax and head tracking. */
export const scenePointer = { x: 0, y: 0 };

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

export function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) {
    const u = t - 1.5 / d1;
    return n1 * u * u + 0.75;
  }
  if (t < 2.5 / d1) {
    const u = t - 2.25 / d1;
    return n1 * u * u + 0.9375;
  }
  const u = t - 2.625 / d1;
  return n1 * u * u + 0.984375;
}

/**
 * Visibility (0..1) of a pop-up set for the given chapter window:
 * rises while the chapter arrives, holds at 1, drops while it leaves.
 */
export function setAmount(p: number, w: ChapterWindow): number {
  const fadeIn =
    w.start <= 0.0001 ? 1 : range(p, (w.enter + w.start) / 2, w.start);
  const fadeOut =
    w.end >= 0.9999 ? 1 : 1 - range(p, w.end, (w.end + w.exit) / 2);
  return Math.min(fadeIn, fadeOut);
}
