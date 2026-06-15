"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

interface SectionFadeOptions {
  /** Animate content in as the section scrolls up into view. */
  enter?: boolean;
  /** Animate content out as the section scrolls away. */
  exit?: boolean;
}

/**
 * Standard scrollytelling fades for a tall section with sticky inner content:
 * content rises in while the section arrives and lifts away as it leaves.
 */
export function useSectionFades(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  { enter = true, exit = true }: SectionFadeOptions = {}
) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      if (enter) {
        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 90, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 18%",
              scrub: 0.4,
            },
          }
        );
      }

      if (exit) {
        gsap.fromTo(
          content,
          { autoAlpha: 1, y: 0, scale: 1 },
          {
            autoAlpha: 0,
            y: -85,
            scale: 0.975,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "bottom 78%",
              end: "bottom 32%",
              scrub: 0.4,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );
}
