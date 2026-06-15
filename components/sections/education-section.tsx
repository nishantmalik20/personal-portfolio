"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { CHAPTERS } from "@/lib/scroll";
import { EDUCATION } from "@/lib/site";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag, IconChip, StoryCard } from "./section-chrome";
import { IconCode, IconGradCap, IconPalette } from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "education")!.vh;

const ICONS = {
  code: IconCode,
  palette: IconPalette,
  gradcap: IconGradCap,
};

export function EducationSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useSectionFades(section, content);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
      const intro = "[data-edu-intro]";
      gsap.set([intro, ...cards], { yPercent: -50 });
      gsap.set(cards, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      tl.to(intro, { autoAlpha: 0, y: -95, scale: 0.97, duration: 1, ease: "power2.in" }, 0.9)
        .fromTo(
          cards[0],
          { autoAlpha: 0, y: 140, rotate: 2.5 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "power2.out" },
          1.5
        )
        .to(cards[0], { autoAlpha: 0, y: -125, rotate: -2, duration: 0.8, ease: "power2.in" }, 3.5)
        .fromTo(
          cards[1],
          { autoAlpha: 0, y: 140, rotate: -2.5 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "power2.out" },
          4.2
        )
        .to(cards[1], { autoAlpha: 0, y: -125, rotate: 2, duration: 0.8, ease: "power2.in" }, 6.2)
        .fromTo(
          cards[2],
          { autoAlpha: 0, y: 140, rotate: 2 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "power2.out" },
          6.9
        )
        .to({}, { duration: 2.6 });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="education"
      aria-label="Education story"
      style={{ height: `${VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh items-center">
        <div ref={content} className="mx-auto w-full max-w-6xl px-5 md:px-10">
          <div className="md:ml-auto md:w-[48%]">
            <div className="relative min-h-[480px] sm:min-h-[440px]">
              <div data-edu-intro className="absolute inset-x-0 top-1/2">
                <ChapterTag chapter="Chapter One" title="The Learning Years" />
                <h2 className="mt-5 font-display text-4xl font-extrabold text-ink sm:text-5xl">
                  Once upon a time, a kid in a backwards cap fell in love with
                  computers.
                </h2>
                <p className="mt-4 max-w-md text-base font-semibold text-ink/70 sm:text-lg">
                  Three schools, three chapters, one very happy nerd. Keep
                  scrolling to walk the path with me.
                </p>
              </div>

              {EDUCATION.map((m, i) => {
                const Icon = ICONS[m.icon];
                return (
                  <div key={m.id} data-edu-card className="absolute inset-x-0 top-1/2">
                    <StoryCard>
                      <div className="flex items-center justify-between gap-3">
                        <IconChip>
                          <Icon width={24} height={24} />
                        </IconChip>
                        <span className="rounded-full bg-ink px-4 py-1.5 font-display text-sm font-bold tabular-nums text-cream">
                          {m.years}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                        {m.degree}
                      </h3>
                      <p className="mt-2 inline-block border-b-[3px] border-dashed border-maple/70 pb-0.5 text-base font-bold text-ink/70">
                        {m.school}
                      </p>
                      <p className="mt-4 text-base font-semibold text-ink/70">{m.blurb}</p>
                      <div className="mt-6 flex items-center gap-2">
                        {EDUCATION.map((_, dot) => (
                          <span
                            key={dot}
                            aria-hidden
                            className={`size-2.5 rounded-full ${
                              dot <= i ? "bg-maple" : "bg-ink/15"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-display text-sm font-bold text-ink/55">
                          Quest {i + 1} of {EDUCATION.length}
                        </span>
                      </div>
                    </StoryCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
