# Design Spec — Nishant Portfolio ("The Pop-Up Storybook")

> Source of truth for the visual + motion design of this site.
> Concept approved from the original brief; update this file as the design evolves.

## Concept

A **single continuous screen** that behaves like a Disney/Illumination pop-up storybook.
One fixed 3D canvas lives behind the page. As the visitor scrolls, paper-toy 3D scenes
**pop up out of the ground**, the sky shifts from morning → golden hour → sunset → night,
and a chibi 3D avatar of Nishant travels through his own story:

1. **Hero** — bright morning, rolling green hills, drifting clouds, falling maple leaves.
   Avatar waves. Giant poster-style name.
2. **Chapter One — The Learning Years** — a winding path with wooden signposts.
   Three education milestone cards (BSc CS → Web Design & Development → MSc CS).
   A graduation cap bounces onto the avatar's head at the MSc moment + leaf confetti.
3. **Chapter Two — The Craft** — golden hour. Floating laptop, orbiting design shapes,
   sparkle dust. Design / Develop / Care service cards.
4. **Chapter Three — The Great Canadian Road Trip** — sunset. Snow-capped Rockies,
   pine forest, a lake. Avatar paddles a red canoe. A moose in a toque and a round
   grizzly hugging a maple syrup jug watch from shore.
5. **Chapter Four — The Rock** — night. Aurora ribbons, stars, a striped lighthouse with
   a sweeping beam on a cliff, jellybean row houses with glowing windows, a drifting
   iceberg. "Favourite place on Earth: Newfoundland & Labrador."
6. **The Next Chapter** — cozy campfire under the stars with fireflies. Contact form,
   social links, footer credit.

## Avatar

Rigged GLB character at `public/models/avatar.glb` — currently Nishant's own
**Avaturn** selfie export (Mixamo-convention humanoid rig, one full-body Idle clip,
its own hair + glasses + clothing textures). Driven in `components/three/avatar.tsx`.

- **Motion is idle-led for naturalism.** The full-body Idle clip always plays; only
  the canoe (paddle) and campfire (sit) layer a procedural seated pose on top.
  Standing chapters are pure idle + subtle mouse head-tracking. No marching/wave
  gimmicks — a realistic human reads best mostly still.
- **Rig-agnostic posing:** seated poses are quaternion rotations about the
  CHARACTER's world axes (not bone-local eulers), derived from the rig's bind-pose
  axes, so they survive any humanoid GLB. Bone lookup tolerates Mixamo
  (`LeftArm`, `RightForeArm`, `Spine2`), dotted (`UpperArm.L`), and sanitized names.
- **No cap** (the avatar's own hair is kept). The graduation cap still drops onto
  the Head bone for the M.Sc. story beat. Hand props (paddle, marshmallow stick)
  attach to the right-hand bone via R3F portals.
- Load happens **outside** the Canvas (`hooks/use-gltf-model.ts`); never suspend
  inside the R3F tree (React 19 reconciler kills useFrame subscriptions).
- To replace the likeness: export a new Avaturn (or any Mixamo-rigged) GLB and drop
  it in as `public/models/avatar.glb`. If it ships more clips, they can be mapped
  per chapter; otherwise the idle + seated-pose system carries it.

## Colour Tokens

| Token        | Hex       | Use                                  |
| ------------ | --------- | ------------------------------------ |
| `ink`        | `#1F2A52` | Text, outlines, cartoon offset shadows |
| `maple`      | `#E63946` | Primary accent, avatar cap, canoe    |
| `maple-deep` | `#D62839` | Buttons (AA contrast w/ white)       |
| `sun`        | `#FFD23F` | Highlights, role pill, tassel        |
| `sky`        | `#6FC9FF` | Day sky top                          |
| `leaf`       | `#58C24A` | Hills, grass                         |
| `cream`      | `#FFF9EC` | Cards, poster text fill              |

Sky gradients: day `#6FC9FF→#A5E3FF→#FFF2C9`, golden `#FF9966→#FFC371→#FFEFC4`,
dusk `#5B4B8A→#B86BA6→#FF8E6E`, night `#0F1B4D→#27418B→#3D5DA9`.
Jellybean houses: `#FF595E #FFCA3A #8AC926 #1982C4 #6A4C93`.

## Typography

- **Display:** Baloo 2 (Google) — 600/700/800, used for name, chapter titles, buttons
- **Body:** Nunito (Google) — 400–800, friendly rounded body text
- Poster headline treatment: cream fill, ink text-stroke, soft layered ink shadow

## UI Chrome

- Cards: `#FFF9EC`, 28px radius, 3px ink border, solid offset shadow (cartoon sticker)
- Buttons: chunky, rounded-full, pressed = translate down (shadow collapses)
- Minimal top bar: "N." monogram + Story / Say hello links; 3px scroll progress bar
- Film grain (SVG turbulence, ~4%) + soft vignette for the "rendered film" feel

## Motion Language

- Smooth inertial scroll (Lenis) drives everything; GSAP ScrollTrigger scrubs DOM
- 3D sets pop with back-ease overshoot (pop-up book); exits drop faster than entries
- Avatar hops between scene marks; bounce ease for the grad-cap landing
- Micro: 150–300 ms, ease-out in / ease-in out, 30–50 ms staggers
- `prefers-reduced-motion`: Lenis disabled, ambient float/particles minimized

## Content placeholders (to be replaced by Nishant)

- `[University Name]`, `[College Name]`, `[20XX – 20XX]` in `lib/site.ts`
- Social URLs in `lib/site.ts`
- Contact email + Resend keys in `.env.local`

## Footer credit (required on every build)

“Built and managed by inishant.com”
