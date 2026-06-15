"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { CHAPTERS } from "@/lib/scroll";
import { scrollToChapter } from "@/lib/lenis-store";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { IconArrowDown, IconMaple, IconPin } from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "hero")!.vh;

export function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const intro = gsap.timeline({
        defaults: { ease: "back.out(1.6)" },
        delay: reduced ? 0 : 0.2,
      });
      if (reduced) intro.timeScale(100);

      intro
        .from("[data-letter]", {
          yPercent: 118,
          rotate: (i) => (i % 2 ? 8 : -8),
          duration: 0.85,
          stagger: 0.055,
        })
        // reveal done — drop the per-letter mask so the idle bob never clips
        .set("[data-letter-wrap]", { overflow: "visible" })
        .from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 36, duration: 0.7, stagger: 0.09, ease: "power3.out" },
          "-=0.35"
        );

      if (!reduced) {
        gsap.to("[data-letter]", {
          y: (i) => (i % 2 ? -5 : -9),
          duration: 1.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.12, yoyo: true },
          delay: 1.6,
        });
        gsap.to("[data-scroll-cue]", {
          y: 9,
          duration: 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // lift the hero copy away as the story starts
      gsap.to(content.current, {
        autoAlpha: 0,
        y: -110,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "2% top",
          end: "32% top",
          scrub: 0.4,
        },
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="hero"
      aria-label="Intro"
      style={{ height: `${VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center px-5 pt-[11dvh] text-center">
        <div ref={content} className="flex flex-col items-center">
          <p
            data-hero-fade
            className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-cream/90 px-4 py-1.5 font-display text-sm font-bold text-ink shadow-[4px_5px_0_rgba(31,42,82,0.85)]"
          >
            <IconPin width={15} height={15} className="text-maple" />
            {SITE.location}
            <IconMaple width={15} height={15} className="text-maple" />
          </p>

          <h1
            aria-label={SITE.name}
            className="poster-text mt-5 font-display font-extrabold leading-[0.92] tracking-tight text-[clamp(4.2rem,14.5vw,11rem)]"
          >
            {SITE.displayName.split("").map((letter, i) => (
              <span
                key={i}
                data-letter-wrap
                className="inline-block overflow-hidden px-[0.08em] -mx-[0.08em] pb-[0.14em] align-bottom"
              >
                <span data-letter className="inline-block will-change-transform">
                  {letter}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-fade
            className="mt-4 -rotate-2 rounded-2xl border-[2.5px] border-ink bg-sun px-6 py-2.5 font-display text-base font-extrabold uppercase tracking-[0.16em] text-ink shadow-[5px_6px_0_rgba(31,42,82,0.9)] sm:text-lg"
          >
            {SITE.role}
          </p>

          <p data-hero-fade className="mt-6 max-w-md text-base font-semibold text-ink/75 sm:text-lg">
            {SITE.tagline}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => scrollToChapter("education")}
              className="h-14 rounded-full border-[2.5px] border-ink bg-maple-deep px-8 font-display text-base font-bold text-cream shadow-[0_7px_0_#1F2A52] transition-all hover:translate-y-[2px] hover:bg-maple-deep hover:shadow-[0_5px_0_#1F2A52] active:translate-y-[6px] active:shadow-[0_1px_0_#1F2A52]"
            >
              Begin the story
              <IconArrowDown width={18} height={18} />
            </Button>
            <Button
              onClick={() => scrollToChapter("contact")}
              className="h-14 rounded-full border-[2.5px] border-ink bg-cream px-8 font-display text-base font-bold text-ink shadow-[0_7px_0_#1F2A52] transition-all hover:translate-y-[2px] hover:bg-cream hover:shadow-[0_5px_0_#1F2A52] active:translate-y-[6px] active:shadow-[0_1px_0_#1F2A52]"
            >
              Say hello
            </Button>
          </div>
        </div>

        <p
          data-scroll-cue
          className="absolute bottom-7 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/10 px-4 py-2 text-sm font-bold text-ink/70 backdrop-blur-sm"
        >
          <IconArrowDown width={15} height={15} />
          Scroll to begin the story
        </p>
      </div>
    </section>
  );
}
