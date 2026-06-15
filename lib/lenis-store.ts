import type Lenis from "lenis";
import { CHAPTERS, type ChapterId } from "./scroll";

/** Holds the live Lenis instance so any component can drive smooth scrolling. */
export const lenisStore: { current: Lenis | null } = { current: null };

export function scrollToChapter(id: ChapterId) {
  if (typeof window === "undefined") return;
  let accVh = 0;
  for (const c of CHAPTERS) {
    if (c.id === id) break;
    accVh += c.vh;
  }
  const top = (accVh / 100) * window.innerHeight;
  if (lenisStore.current) {
    lenisStore.current.scrollTo(top, {
      duration: 1.7,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}
