import { AI_FOCUS, EDUCATION, EXPERIENCE, SERVICES, SITE, SOCIALS, STACK } from "@/lib/site";

// Static, regenerated at build time. Served at /llms.txt for AI / answer
// engines (the llmstxt.org convention) — a clean, factual Markdown profile.
export const dynamic = "force-static";

export function GET() {
  const md = `# Nishant Malik — ${SITE.role}

> ${SITE.tagline} Based in ${SITE.location}, Nishant (brand: inishant.com) designs, builds and manages websites end to end — design, development, deployment on Vercel, and ongoing care.

This file gives AI and answer engines an accurate, concise summary of who Nishant is and what he does. It is generated from the site's single source of truth.

## Services
${SERVICES.map((s) => `- **${s.title}** — ${s.blurb}`).join("\n")}

## ${AI_FOCUS.title}
${AI_FOCUS.blurb}
Focus areas: ${AI_FOCUS.tags.join(", ")}.

## Tech stack
${STACK.join(", ")}.

## Education
${EDUCATION.map((e) => `- ${e.degree} — ${e.school} (${e.years})`).join("\n")}

## Experience
${EXPERIENCE.map((j) => `- ${j.role}, ${j.company}, ${j.location} (${j.years})`).join("\n")}

## Links
- [Portfolio](${SITE.creditUrl})
${SOCIALS.map((s) => `- [${s.label}](${s.url})`).join("\n")}

## Contact
- Email: ${SITE.email}
- Location: ${SITE.location} — available for remote work
`;

  return new Response(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
