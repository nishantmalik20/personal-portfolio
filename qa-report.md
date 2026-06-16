# QA Test Report — Pop-Up Storybook Portfolio

*Generated: 2026-06-16*
*Tested URL: https://personal-portfolio-ten-xi-45.vercel.app (production)*
*Tooling: Playwright (Chromium full suite + Firefox/WebKit smoke), software WebGL*

## Summary
- ✅ Pass: 28 checks
- ⚠️ Issues found: 0
- 🔴 Blockers (cannot ship): 0

**Verdict: Ready to ship.**

> Note: this is a single-page, scroll-driven 3D site, so the page-by-page audit is
> framed as the one route `/` and its story chapters. There is no `architecture.md`/
> `copy.md` (built ad-hoc), so checks ran against the live site + codebase.

---

## Page Results

### Home (`/`) — the full storybook
- ✅ Loads correctly (HTTP 200)
- ✅ Exactly one `<h1>` ("Nishant"), visible; clean hierarchy (1× h1, 6× h2, 10× h3)
- ✅ Tab title matches metadata ("Nishant · Web Designer & Developer")
- ✅ All chapter content present in server HTML (education / craft / Building with AI /
  experience / travel / contact) — verified strings: "Web Designer", "Winnipeg",
  "University of Manitoba", "Building with AI", "Send message", "maple syrup"
- ✅ Full 12,420px scroll-through triggered every chapter with **no console or page
  errors**
- ✅ Responsive at all breakpoints, no visual breaks (mobile hero verified by screenshot)
- ✅ 3D scene renders (Chromium + WebKit confirmed visually)

---

## Interactive Elements
- ✅ Header nav — "Back to top" (logo), "The story", "Say hello" buttons present and keyboard-focusable
- ✅ Hero CTAs — "Begin the story", "Say hello"
- ✅ Social links — GitHub, LinkedIn, Instagram all `target="_blank"` with `rel="noreferrer noopener"`
- ✅ Email link — `mailto:hello@inishant.com`
- ✅ Footer credit — links to `https://inishant.com` (`_blank`, safe `rel`)
- ✅ No element found that looks interactive but isn't

---

## Form Tests — Contact form

| Test | Result |
|------|--------|
| Empty submit → name/email/message errors all show | ✅ |
| Invalid email format → error | ✅ |
| Too-short message (<10 chars) → error | ✅ |
| Server error (mocked 500) → friendly error state shown | ✅ |
| Success (mocked 200) → "Message sent!" confirmation card | ✅ |
| Submit button disabled while sending → no double-submit | ✅ |
| Real `/api/contact` endpoint | ✅ verified live earlier (HTTP 200, email delivered) |

> Success/error UI states were exercised with mocked responses to avoid sending
> duplicate live emails; the genuine endpoint + delivery was confirmed separately.
> Honeypot (`company`) field is present and hidden.

---

## Responsive Tests
| Breakpoint | Horizontal overflow | Result |
|------------|--------------------|--------|
| 375px (phone) | 0px | ✅ Pass |
| 768px (tablet) | 0px | ✅ Pass |
| 1280px (laptop) | 0px | ✅ Pass |
| 1440px (desktop) | 0px | ✅ Pass |
| ~200% zoom (720px effective) | 0px | ✅ Pass |

---

## Cross-Browser Tests
| Engine | Result | Notes |
|--------|--------|-------|
| Chromium | ✅ Pass | Full suite; 3D renders; no errors |
| Firefox | ✅ Pass | Loads 200, content present, **no console/page errors**, no overflow |
| WebKit (Safari engine) | ✅ Pass | Loads 200, no errors; 3D scene renders (screenshot confirmed) |

> Cross-browser ran headless with software WebGL. Rendering + load are clean across all
> three. A quick real-device check on **iOS Safari / Android Chrome** is still
> recommended to judge 3D frame-rate and touch feel (headless can't measure those).

---

## Broken Links
- None. All internal interactions are in-page scroll actions (single route); external
  links (GitHub, LinkedIn, Instagram, inishant.com) are well-formed with safe `rel`.

---

## Accessibility
- ✅ Single H1; logical heading levels
- ✅ Keyboard tab order reaches the logo, nav buttons, hero CTAs, social links and footer
- ✅ Logo `<img>` correctly decorative (`alt=""`) — its wrapping button carries
  `aria-label="Back to top"`
- ✅ Form inputs have associated `<label>`s + `aria-invalid`/`aria-describedby` on error
- ✅ No horizontal scroll at 200% zoom

---

## Performance Notes
- Home `DOMContentLoaded` ≈ 2.25s, `load` ≈ 2.26s (production, software-WebGL bot)
- Lean network: 14 resources
- Largest asset: `avatar.glb` at ~3.1 MB (inherent to the 3D avatar), then JS chunks
  (328 KB / 71 KB / 49 KB)
- No obviously slow or redundant requests

---

## Fixes Applied During Testing
- None required. (The empty `alt` on the logo was reviewed and is correct — decorative
  image inside an `aria-label`'d button.)

---

## Outstanding Issues to Address

### 🔴 Blockers
- None.

### ⚠️ Important
- None.

### 🔵 Future improvements (optional)
- **`avatar.glb` (~3.1 MB)** is the heaviest asset. Load is already ~2.3s, but Draco/
  meshopt compression would trim it for slower mobile connections.
- **Real-device pass** on iOS Safari + Android Chrome to judge 3D performance/touch.
- **`prefers-reduced-motion`** — worth confirming the scroll-driven motion has a
  reduced-motion path for vestibular-sensitivity accessibility.

---

*Pipeline note: agent 07 (Reviewer) was skipped this run. Project `CLAUDE.md` has no
"Current Status" section to update (it only imports `AGENTS.md`).*
