import { EDUCATION, SERVICES, SITE, SOCIALS, STACK } from "@/lib/site";

/**
 * Schema.org knowledge graph for the site, emitted once in the root layout.
 *
 * Drives both classic rich results (Google/Bing) and entity recognition in
 * generative engines (ChatGPT, Perplexity, Claude, Gemini, AI Overviews):
 *  - Person          → who Nishant is, where he studied, what he knows
 *  - ProfessionalService → the freelance business + the areas it serves
 *  - WebSite         → the site entity itself
 */
export function JsonLd() {
  const url = SITE.creditUrl; // https://inishant.com
  const ogImage = `${url}/opengraph-image`;
  const sameAs = SOCIALS.map((s) => s.url);

  const address = {
    "@type": "PostalAddress",
    addressLocality: "Winnipeg",
    addressRegion: "MB",
    addressCountry: "CA",
  };

  const knowsAbout = [
    "Web Design",
    "Web Development",
    "User Experience Design",
    "Search Engine Optimization",
    "AI Agents",
    "Generative AI",
    ...STACK,
  ];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: "Nishant Malik",
        alternateName: SITE.displayName,
        url,
        image: ogImage,
        jobTitle: SITE.role,
        description: SITE.tagline,
        email: `mailto:${SITE.email}`,
        address,
        worksFor: { "@id": `${url}/#business` },
        alumniOf: EDUCATION.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.school,
        })),
        knowsAbout,
        sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#business`,
        name: SITE.credit.replace("Built and managed by ", ""),
        legalName: "inishant.com",
        url,
        image: ogImage,
        description:
          "Freelance web design and development — bright, story-driven websites designed, built and managed end to end, from Winnipeg, Canada.",
        founder: { "@id": `${url}/#person` },
        email: `mailto:${SITE.email}`,
        address,
        areaServed: [
          { "@type": "City", name: "Winnipeg" },
          { "@type": "AdministrativeArea", name: "Manitoba" },
          { "@type": "Country", name: "Canada" },
        ],
        priceRange: "$$",
        knowsAbout,
        sameAs,
        makesOffer: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.blurb,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: `${SITE.name} — ${SITE.role}`,
        description: SITE.tagline,
        publisher: { "@id": `${url}/#person` },
        inLanguage: "en-CA",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Schema is built entirely from our own static config — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
