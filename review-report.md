# Code Review Report — Pop-Up Storybook Portfolio
*Generated: 2026-06-16*

## Summary
- 🔴 Critical issues: 0
- 🟡 Important issues: 1 (✅ resolved — see below)
- 🔵 Nice-to-have improvements: 4

**Overall verdict: Ready to ship.** No critical or build-blocking problems. One
security-hardening item is worth doing for a public email-sending endpoint; the rest
are optional polish.

> Single-page 3D site; reviewed against the codebase (no `architecture.md`/`copy.md`,
> built ad-hoc). Build ✅ zero errors, `npm run lint` ✅ clean, TypeScript ✅.

---

## 🔴 Critical Issues
None.

---

## 🟡 Important Issues

### 1. No rate limiting on the contact endpoint
- **File:** `app/api/contact/route.ts` (POST handler)
- **Issue:** `/api/contact` is public and sends **two real emails per request** via
  Resend. Validation + a honeypot are in place (good), but there's no rate limit, so a
  determined abuser could spam submissions — burning your Resend quota and inbox.
- **Fix:** Add a rate limit. Lowest-effort: a **Vercel Firewall** rate-limit rule on
  `/api/contact` (no code). Or in-code with Upstash Redis (`@upstash/ratelimit`) keyed
  by IP (`x-forwarded-for`), e.g. 5 requests / 10 min → return 429.
- *Severity note:* not launch-blocking for a low-traffic personal site, but it's the
  one hardening worth doing since the endpoint costs money/quota to abuse.
- **✅ Resolved (2026-06-16):** Added **Vercel BotID** (Basic, invisible) on
  `/api/contact` — bots/scrapers are denied with `403` before any email is sent, with
  zero friction for genuine visitors; the honeypot is retained as a second layer. (A
  rate limit could still be layered on later for raw volume, but BotID addresses the
  spam-content problem directly.)

---

## 🔵 Nice-to-Have Improvements

### 1. Compress the 3D avatar model
- **File:** `public/models/avatar.glb` (~3.1 MB) — loaded via `hooks/use-gltf-model.ts`
- **Fix:** Draco or meshopt compression (e.g. `gltf-transform optimize`) can cut GLBs
  50–80%, improving first load on slow mobile. Load is already ~2.3s, so this is polish.

### 2. No custom error boundary
- **File:** `app/` (add `app/error.tsx`)
- **Issue:** If the R3F tree throws at runtime, users get Next's default error screen.
- **Fix:** Add a branded `app/error.tsx` (client) with a friendly fallback + reset.

### 3. Pin the Node version
- **File:** `package.json`
- **Fix:** Add `"engines": { "node": ">=20" }` (or the version you build on) for
  reproducible local/CI/Vercel builds.

### 4. Contrast spot-check over dynamic 3D scenes
- **Files:** `components/sections/*` (cream text over night/campfire scenes)
- **Issue:** Light text sits over moving 3D backgrounds. It's already mitigated with
  `drop-shadow`, but worth a quick manual WCAG-AA check on the darkest frames.

---

## Category Breakdown

### Security
- ✅ No hardcoded secrets; `RESEND_API_KEY` read from `process.env`
- ✅ `.env*` in `.gitignore`; `.env.example` committed (no secret values)
- ✅ `/api/contact` validates name/email/message + honeypot, returns proper status codes
- 🟡 1 finding — no rate limiting (above)

### Accessibility
- ✅ Exactly one `<h1>`, logical heading hierarchy (1× h1 / 6× h2 / 10× h3)
- ✅ Form inputs labeled; `aria-invalid` + `aria-describedby` on errors
- ✅ Icon-only / logo button labeled (`aria-label="Back to top"`; logo `alt=""` correct)
- ✅ Keyboard-reachable controls; `focus-visible` states present
- ✅ **`prefers-reduced-motion` respected** (hero, experience, globals.css)

### Performance
- ✅ `next/font` for fonts; `next/image` everywhere (no raw `<img>`); logo `priority`
- ✅ Lean network (~14 requests), load ~2.3s; content server-rendered
- ✅ `"use client"` used only where required (R3F/GSAP/Lenis/Radix)
- 🔵 GLB compression (above)

### Code Quality
- ✅ No `console.*`, no `TODO`/`FIXME`, no `@ts-ignore`/`@ts-expect-error`, no `any`
- ✅ Named component exports (per Global CLAUDE.md); kebab-case files, PascalCase components
- ✅ Utilities live in `lib/`; `lint` clean
- ℹ️ `react-hooks` rules disabled for `components/three/**` — intentional & documented

### SEO
- ✅ Title + description + canonical; OpenGraph + Twitter card + dynamic OG image
- ✅ `sitemap.xml`, `robots.txt`, JSON-LD (`Person`/`ProfessionalService`/`WebSite`), `llms.txt`
- ✅ All resolve on the live domain (`https://inishant.com`)

---

## Recommended Next Steps
1. No 🔴 Critical issues — nothing blocks launch.
2. Consider the 🟡 rate-limiting hardening on `/api/contact`.
3. Address 🔵 items as time permits.
4. ✅ `08-qa-testing-agent` already run — see `qa-report.md` (passed, ready to ship).

*Project `CLAUDE.md` has no "Current Status" section to update (it only imports `AGENTS.md`).*
