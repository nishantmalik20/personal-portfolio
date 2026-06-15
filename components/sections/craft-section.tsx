"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { CHAPTERS } from "@/lib/scroll";
import { SERVICES, STACK } from "@/lib/site";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag, IconChip } from "./section-chrome";
import { IconCode, IconHeart, IconPalette } from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "craft")!.vh;

const ICONS = {
  palette: IconPalette,
  code: IconCode,
  heart: IconHeart,
};

export function CraftSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useSectionFades(section, content);

  useGSAP(
    () => {
      gsap.from("[data-craft-card]", {
        autoAlpha: 0,
        y: 120,
        scale: 0.92,
        rotate: (i) => (i % 2 ? 2.5 : -2.5),
        ease: "power2.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: section.current,
          start: "top 45%",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="craft"
      aria-label="What I do"
      style={{ height: `${VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-between px-5 pb-[7dvh] pt-[10dvh]">
        <div ref={content} className="flex w-full flex-col items-center">
          <div className="text-center">
            <ChapterTag chapter="Chapter Two" title="The Craft" />
            <h2 className="mt-5 font-display text-4xl font-extrabold text-ink sm:text-6xl">
              These days, I make websites
              <span className="text-maple-deep"> sing</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base font-semibold text-ink/70 sm:text-lg">
              One pair of hands for the whole journey: design, build, launch,
              and every update after.
            </p>

            <ul
              aria-label="My everyday tech stack"
              className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2"
            >
              {STACK.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border-2 border-ink/75 bg-cream/85 px-3 py-1 font-display text-xs font-bold text-ink/80 shadow-[2px_3px_0_rgba(31,42,82,0.22)] sm:text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto grid w-full max-w-4xl gap-4 pt-10 sm:grid-cols-3 sm:gap-5">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div
                  key={s.id}
                  data-craft-card
                  className="rounded-[22px] border-[3px] border-ink bg-cream p-5 shadow-[7px_9px_0_rgba(31,42,82,0.9)]"
                >
                  <div className="flex items-center gap-3">
                    <IconChip className="size-11 rounded-xl">
                      <Icon width={22} height={22} />
                    </IconChip>
                    <h3 className="font-display text-2xl font-extrabold text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink/70 sm:text-base">{s.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
