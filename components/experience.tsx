"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { lenisStore, scrollToChapter } from "@/lib/lenis-store";
import { clamp01, range, scrollState, WIN } from "@/lib/scroll";
import { SITE } from "@/lib/site";
import { useGltfModel } from "@/hooks/use-gltf-model";
import { Scene } from "@/components/three/scene";
import { HeroSection } from "@/components/sections/hero-section";
import { EducationSection } from "@/components/sections/education-section";
import { CraftSection } from "@/components/sections/craft-section";
import { WorkSection } from "@/components/sections/work-section";
import { TravelSection } from "@/components/sections/travel-section";
import { NewfoundlandSection } from "@/components/sections/newfoundland-section";
import { ContactSection } from "@/components/sections/contact-section";

const SKIES = {
  day: "linear-gradient(180deg, #6FC9FF 0%, #A5E3FF 46%, #FFF2C9 100%)",
  golden: "linear-gradient(180deg, #FF9966 0%, #FFC371 52%, #FFEFC4 100%)",
  dusk: "linear-gradient(180deg, #5B4B8A 0%, #B86BA6 48%, #FF8E6E 100%)",
  night: "linear-gradient(180deg, #0F1B4D 0%, #27418B 56%, #3D5DA9 100%)",
};

const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export function Experience() {
  const golden = useRef<HTMLDivElement>(null);
  const dusk = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const avatarGltf = useGltfModel("/models/avatar.glb");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateChrome = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp01(window.scrollY / max) : 0;
      scrollState.p = p;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (golden.current)
        golden.current.style.opacity = String(range(p, WIN.education.end, WIN.craft.start));
      if (dusk.current)
        dusk.current.style.opacity = String(range(p, WIN.work.end, WIN.travel.start));
      if (night.current)
        night.current.style.opacity = String(
          range(p, WIN.travel.end, WIN.newfoundland.start + 0.015)
        );
    };

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ duration: 1.15 });
      lenisStore.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    window.addEventListener("scroll", updateChrome, { passive: true });
    updateChrome();
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("scroll", updateChrome);
      cancelAnimationFrame(refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisStore.current = null;
    };
  }, []);

  return (
    <div className="relative">
      {/* sky — crossfading day → golden hour → dusk → night */}
      <div aria-hidden className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: SKIES.day }} />
        <div ref={golden} className="absolute inset-0 opacity-0" style={{ background: SKIES.golden }} />
        <div ref={dusk} className="absolute inset-0 opacity-0" style={{ background: SKIES.dusk }} />
        <div ref={night} className="absolute inset-0 opacity-0" style={{ background: SKIES.night }} />
      </div>

      {/* the 3D storybook world */}
      <Scene gltf={avatarGltf} />

      {/* story content */}
      <main id="main" className="relative z-10">
        <HeroSection />
        <EducationSection />
        <CraftSection />
        <WorkSection />
        <TravelSection />
        <NewfoundlandSection />
        <ContactSection />
      </main>

      {/* film grain + vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: NOISE_URL }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 42%, transparent 62%, rgba(15, 23, 64, 0.16) 100%)",
        }}
      />

      {/* minimal chrome */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => scrollToChapter("hero")}
          aria-label="Back to top"
          className="pointer-events-auto transition-transform hover:-translate-y-0.5"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={154}
            height={80}
            className="h-9 w-auto"
            priority
            unoptimized
          />
        </button>
        <nav aria-label="Site" className="pointer-events-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollToChapter("education")}
            className="rounded-full border-[2.5px] border-ink bg-cream/95 px-4 py-2 font-display text-sm font-bold text-ink shadow-[3px_4px_0_rgba(31,42,82,0.85)] transition-transform hover:-translate-y-0.5"
          >
            The story
          </button>
          <button
            type="button"
            onClick={() => scrollToChapter("contact")}
            className="rounded-full border-[2.5px] border-ink bg-maple-deep px-4 py-2 font-display text-sm font-bold text-cream shadow-[3px_4px_0_rgba(31,42,82,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Say hello
          </button>
        </nav>
      </header>

      {/* reading progress */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3.5px] bg-ink/10">
        <div
          ref={bar}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-maple via-[#F77F00] to-sun"
        />
      </div>

      <span className="sr-only">{SITE.credit}</span>
    </div>
  );
}
