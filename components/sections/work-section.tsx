"use client";

import { useRef } from "react";
import { CHAPTERS } from "@/lib/scroll";
import { AI_FOCUS, EXPERIENCE, PROJECTS } from "@/lib/site";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag } from "./section-chrome";

const VH = CHAPTERS.find((c) => c.id === "work")!.vh;

function TechTags({ tech }: { tech: string[] }) {
  return (
    <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
      {tech.map((t) => (
        <li
          key={t}
          className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold text-ink/70"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export function WorkSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useSectionFades(section, content);

  // Flows as a normal section (content runs past one screen); min-height keeps the
  // 3D scroll-sync intact without ever overlapping the next chapter.
  return (
    <section
      ref={section}
      id="work"
      aria-label="Selected work and experience"
      style={{ minHeight: `${VH}vh` }}
      className="relative"
    >
      <div
        ref={content}
        className="mx-auto w-full max-w-6xl px-5 py-[11dvh] md:px-10 md:py-[13dvh]"
      >
        <div className="max-w-2xl">
          <ChapterTag chapter="Chapter Three" title="Selected Work" />
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            The proof: things I&apos;ve actually shipped.
          </h2>
          <p className="mt-2 max-w-xl text-sm font-semibold text-ink/70 sm:text-base">
            A few years of client builds and product work, from full storefronts
            and dashboards to AI automations and agents.
          </p>
        </div>

        {/* AI highlight — the headline of what I build now */}
        <div className="mt-7 rounded-[24px] border-[3px] border-ink bg-ink p-5 text-cream shadow-[7px_9px_0_rgba(31,42,82,0.45)] sm:mt-8 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sun px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-ink">
              AI
            </span>
            <h3 className="font-display text-2xl font-extrabold text-cream sm:text-3xl">
              {AI_FOCUS.title}
            </h3>
          </div>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-cream/85 sm:text-base">
            {AI_FOCUS.blurb}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {AI_FOCUS.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-cream/25 bg-cream/10 px-3 py-1 text-xs font-bold text-cream/90"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div className="mt-8">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-ink/55">
            Experience
          </h3>
          <div className="mt-3 max-w-2xl">
            {EXPERIENCE.map((job) => (
              <div
                key={job.id}
                className="flex flex-col rounded-[20px] border-[3px] border-ink bg-cream p-5 shadow-[6px_7px_0_rgba(31,42,82,0.85)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h4 className="font-display text-lg font-extrabold leading-tight text-ink">
                    {job.role}
                  </h4>
                  <span className="shrink-0 font-display text-xs font-bold tabular-nums text-ink/55">
                    {job.years}
                  </span>
                </div>
                <p className="mt-0.5 font-display text-sm font-bold text-maple-deep">
                  {job.company}
                </p>
                <p className="text-xs font-semibold text-ink/45">{job.location}</p>
                <p className="mt-2 text-sm font-semibold text-ink/70">{job.blurb}</p>
                <TechTags tech={job.tech} />
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mt-8">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-ink/55">
            Projects
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-[18px] border-[2.5px] border-ink bg-cream p-4 shadow-[4px_5px_0_rgba(31,42,82,0.8)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-extrabold leading-tight text-ink sm:text-base">
                    {p.name}
                  </h4>
                  <span className="shrink-0 rounded-full bg-sun px-2 py-0.5 font-display text-[11px] font-bold tabular-nums text-ink">
                    {p.year}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-ink/70">{p.blurb}</p>
                <TechTags tech={p.tech} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
