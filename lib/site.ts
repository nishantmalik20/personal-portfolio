/**
 * Single place to edit identity, education and social links.
 * Anything wrapped in [brackets] is a placeholder waiting for real data.
 */

export const SITE = {
  name: "Nishant",
  displayName: "NISHANT",
  role: "Web Designer & Developer",
  location: "Winnipeg, Canada",
  email: "hello@inishant.com",
  tagline:
    "I design, build and lovingly look after bright, story-driven websites, end to end.",
  credit: "Built and managed by inishant.com",
  creditUrl: "https://inishant.com",
};

export interface SocialLink {
  id: "github" | "linkedin" | "instagram";
  label: string;
  url: string;
}

export const SOCIALS: SocialLink[] = [
  { id: "github", label: "GitHub", url: "https://github.com/nishantmalik20" },
  { id: "linkedin", label: "LinkedIn", url: "https://ca.linkedin.com/in/nishantmalik20" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/nishantmalik20/" },
];

export interface Milestone {
  id: string;
  icon: "code" | "palette" | "gradcap";
  degree: string;
  school: string;
  years: string;
  blurb: string;
  sign: string;
}

export const EDUCATION: Milestone[] = [
  {
    id: "btech",
    icon: "code",
    degree: "B.Tech, Computer Science",
    school: "MDU, Rohtak",
    years: "2014-2018",
    blurb:
      "Where it all began. First lines of code, late-night labs, and the moment the web clicked.",
    sign: "B.Tech",
  },
  {
    id: "webdesign",
    icon: "palette",
    degree: "Web Design & Development",
    school: "Humber College, Toronto",
    years: "2020",
    blurb:
      "Fell head over heels for pixels: typography, colour, and interfaces with real personality.",
    sign: "Design",
  },
  {
    id: "msc",
    icon: "gradcap",
    degree: "Master of Science, Computer Science",
    school: "University of Manitoba, Winnipeg",
    years: "2021-2023",
    blurb:
      "Levelled up. Deeper systems, sharper engineering, and much bigger ideas.",
    sign: "M.Sc.",
  },
];

export interface Service {
  id: string;
  icon: "palette" | "code" | "heart";
  title: string;
  blurb: string;
}

export const SERVICES: Service[] = [
  {
    id: "design",
    icon: "palette",
    title: "Design",
    blurb:
      "Design systems, tokens and accessible (WCAG AA) UI, from wireframe to polished, responsive layouts.",
  },
  {
    id: "develop",
    icon: "code",
    title: "Develop",
    blurb:
      "Next.js App Router and TypeScript, React Server Components, APIs, Stripe and Supabase. Typed, fast and SEO-ready.",
  },
  {
    id: "care",
    icon: "heart",
    title: "Care",
    blurb:
      "Shipped on Vercel with CI, analytics and performance budgets, plus every update and edit, handled for you.",
  },
];

/**
 * The tools I actually reach for, day to day. Rendered as a stack strip in the
 * Craft chapter — keep this honest and current.
 */
export const STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "shadcn/ui",
  "GSAP",
  "Framer Motion",
  "Three.js / R3F",
  "Supabase",
  "Stripe",
  "Resend",
  "Vercel",
];

export interface Job {
  id: string;
  role: string;
  company: string;
  location: string;
  years: string;
  blurb: string;
  tech: string[];
}

export const EXPERIENCE: Job[] = [
  {
    id: "onboard",
    role: "Web Designer and Developer",
    company: "On Board Print & Signs Inc.",
    location: "Winnipeg, MB",
    years: "2024 – Present",
    blurb:
      "I help businesses get online and build the systems that run behind them: company sites, custom web apps, dashboards and integrations. I handle the design too, but spend most of my day writing the code.",
    tech: ["Next.js", "TypeScript", "React", "Node.js", "Supabase", "PostgreSQL"],
  },
];

/**
 * AI is the headline of the work chapter. Featured as its own highlight above
 * the project grid.
 */
export const AI_FOCUS = {
  title: "Building with AI",
  blurb:
    "More and more of my work centers on AI: wiring up automations that take the busywork off teams, and building AI products and agents that actually ship.",
  tags: [
    "AI automations",
    "Custom AI agents",
    "RAG chatbots",
    "Workflow automation",
    "Vercel AI SDK",
    "OpenAI & Anthropic",
  ],
};

export interface Project {
  id: string;
  name: string;
  year: string;
  blurb: string;
  tech: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "ops-autopilot",
    name: "Ops Autopilot",
    year: "2026",
    blurb: "AI automation that clears invoicing, follow-ups and data entry off a small team's plate.",
    tech: ["Vercel AI SDK", "OpenAI", "n8n"],
  },
  {
    id: "support-copilot",
    name: "Support Copilot",
    year: "2026",
    blurb: "A retrieval chatbot trained on a company's own docs to answer customers and cut support load.",
    tech: ["Next.js", "RAG", "Embeddings"],
  },
  {
    id: "lead-sorter",
    name: "Lead Sorter",
    year: "2025",
    blurb: "An AI agent that scores, tags and routes inbound leads on its own.",
    tech: ["Python", "OpenAI", "Webhooks"],
  },
  {
    id: "popup-portfolio",
    name: "Pop-Up Portfolio",
    year: "2025",
    blurb: "A 3D, scroll-driven storybook portfolio (yes, like this one).",
    tech: ["Next.js", "Three.js / R3F", "GSAP"],
  },
  {
    id: "studio-lumen",
    name: "Studio Lumen",
    year: "2024",
    blurb: "Animated agency site with an editable case-study system.",
    tech: ["Next.js", "Framer Motion", "Vercel"],
  },
  {
    id: "clinic-cal",
    name: "Clinic Cal",
    year: "2024",
    blurb: "Clinic booking and intake flow with automated email reminders.",
    tech: ["Next.js", "Supabase", "Resend"],
  },
  {
    id: "northern-roast",
    name: "Northern Roast",
    year: "2023",
    blurb: "Coffee subscription store with recurring billing and a roast-finder quiz.",
    tech: ["Next.js", "Stripe", "TypeScript"],
  },
  {
    id: "maple-meals",
    name: "Maple Meals",
    year: "2022",
    blurb: "Restaurant ordering and reservations PWA with offline menus.",
    tech: ["Next.js", "Supabase", "Stripe"],
  },
  {
    id: "aurora-commerce",
    name: "Aurora Commerce",
    year: "2021",
    blurb: "Headless storefront with cart and Stripe checkout.",
    tech: ["Next.js", "Stripe", "TypeScript"],
  },
];

export const TRAVEL_CHIPS = [
  "Coast to coast, twice",
  "Moose befriended: several",
  "Maple syrup: never enough",
  "Toque weather: year-round",
];
