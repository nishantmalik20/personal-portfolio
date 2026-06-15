"use client";

import { useRef } from "react";
import { CHAPTERS } from "@/lib/scroll";
import { TRAVEL_CHIPS } from "@/lib/site";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag } from "./section-chrome";
import { IconMaple } from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "travel")!.vh;

export function TravelSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useSectionFades(section, content);

  return (
    <section
      ref={section}
      id="travel"
      aria-label="Travel story"
      style={{ height: `${VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh items-center">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
          <div ref={content} className="max-w-md md:max-w-lg">
            <ChapterTag chapter="Chapter Four" title="The Great Canadian Road Trip" />
            <h2 className="poster-text mt-5 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
              Fuelled by maple syrup &amp; curiosity.
            </h2>
            <p className="mt-5 max-w-md text-base font-bold text-cream/95 drop-shadow-[0_3px_14px_rgba(20,18,60,0.55)] sm:text-lg">
              When I&apos;m not shipping websites, I&apos;m chasing horizons.
              I&apos;ve roamed coast to coast across Canada, paddle in one hand,
              camera in the other.
            </p>
            <ul className="mt-7 flex max-w-md flex-wrap gap-2.5">
              {TRAVEL_CHIPS.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-cream/95 px-3.5 py-1.5 text-sm font-bold text-ink shadow-[3px_4px_0_rgba(31,42,82,0.85)]"
                >
                  <IconMaple width={13} height={13} className="text-maple" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
