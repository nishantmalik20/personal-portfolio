import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconMaple } from "@/components/icons";

/** Storybook chapter tag, e.g. "Chapter One · The Learning Years". */
export function ChapterTag({
  chapter,
  title,
  tone = "ink",
  className,
}: {
  chapter: string;
  title: string;
  tone?: "ink" | "cream";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[2.5px] px-4 py-1.5 font-display text-sm font-bold tracking-wide uppercase",
        tone === "ink"
          ? "border-ink bg-cream/90 text-ink shadow-[4px_5px_0_rgba(31,42,82,0.85)]"
          : "border-cream/70 bg-ink/30 text-cream shadow-[4px_5px_0_rgba(8,12,38,0.55)] backdrop-blur-sm",
        className
      )}
    >
      <IconMaple width={15} height={15} className="text-maple" />
      <span>{chapter}</span>
      <span aria-hidden className="opacity-50">·</span>
      <span className="normal-case tracking-normal">{title}</span>
    </p>
  );
}

/** Cartoon "sticker" card used across the story. */
export function StoryCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] border-[3px] border-ink bg-cream p-6 shadow-[10px_12px_0_rgba(31,42,82,0.9)] sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Small squishy icon chip used inside cards. */
export function IconChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl border-[2.5px] border-ink bg-sun text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
