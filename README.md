# Nishant — Portfolio ("The Pop-Up Storybook")

A single-screen, scroll-driven 3D storybook portfolio. One fixed WebGL canvas sits
behind the page; as you scroll, paper-toy scenes pop out of the ground, the sky
shifts from morning to night, and a chibi avatar travels through the story —
education → craft → a cross-Canada road trip → Newfoundland → a campfire contact
scene. Every 3D asset is procedural (no model or texture downloads).

See `design-spec.md` for the full art direction.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (form controls)
- react-three-fiber + drei (3D), GSAP ScrollTrigger (DOM scrub), Lenis (smooth scroll)
- Resend (contact form delivery, via REST)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Things to update (placeholders)

| What | Where |
| --- | --- |
| Education schools + years (`[University Name]`, `[20XX – 20XX]`) | `lib/site.ts` |
| Social URLs (`your-handle`) | `lib/site.ts` |
| Name / role / tagline / email | `lib/site.ts` |
| Chapter pacing (section heights drive everything) | `lib/scroll.ts` → `CHAPTERS` |
| Colours / fonts | `app/globals.css`, `app/layout.tsx` |

## Contact form

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` (+ optional
`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`). Without a key the form still succeeds
locally but skips delivery — handy for previews.

## Architecture notes

- `lib/scroll.ts` is the single source of truth: DOM section heights and 3D scene
  windows both derive from `CHAPTERS`, so retiming a chapter keeps everything in sync.
- The scroll position feeds a tiny mutable store (`scrollState`), smoothed each
  frame inside the canvas — no React re-renders during scroll.
- `components/three/avatar.tsx` owns the character: a rigged GLB at
  `public/models/avatar.glb` (currently an Avaturn selfie export — Mixamo rig,
  one full-body Idle clip, its own hair/glasses/clothing). The Idle always plays;
  only the canoe and campfire layer a procedural seated pose. Standing scenes are
  pure idle + mouse head-tracking — intentionally calm, since a realistic human
  reads best mostly still. Seated poses rotate bones about the character's world
  axes (rig-agnostic), and the graduation cap + hand props portal onto bones.
  To swap the likeness, export a new Avaturn/Mixamo-rigged GLB over that file.
- The GLB is loaded **outside** the Canvas (`hooks/use-gltf-model.ts`) — never
  suspend inside the R3F tree.
- If the 3D world ever looks "frozen" during automated/browser testing: check
  `document.visibilityState` first. Chrome suspends rAF for hidden/occluded
  windows; the canvas freezes at its last frame with zero errors.
- Linting: `react-hooks/immutability`/`refs` are disabled for `components/three/**`
  because mutating cameras/materials inside `useFrame` is react-three-fiber's API.
