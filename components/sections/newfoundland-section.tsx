"use client";

import { useRef } from "react";
import { CHAPTERS } from "@/lib/scroll";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag } from "./section-chrome";
import { IconHeart } from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "newfoundland")!.vh;

export function NewfoundlandSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useSectionFades(section, content);

  return (
    <section
      ref={section}
      id="newfoundland"
      aria-label="Favourite place"
      style={{ height: `${VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh items-center">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-10">
          <div ref={content} className="max-w-md md:max-w-xl">
            <ChapterTag chapter="Chapter Five" title="Home" tone="cream" />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-cream/90 backdrop-blur-sm">
              <IconHeart width={15} height={15} className="text-maple" />
              Favourite place on Earth
            </p>
            <h2 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] text-cream drop-shadow-[0_6px_24px_rgba(10,16,50,0.55)] sm:text-7xl">
              Manitoba
            </h2>
            <p className="mt-5 max-w-lg text-base font-bold text-cream/85 sm:text-lg">
              Endless prairie skies, the northern lights dancing over the lakes,
              and the warmest people you will ever meet. It is where I landed, and
              the chapter I am still writing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
