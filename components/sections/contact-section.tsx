"use client";

import { useRef, useState, type FormEvent } from "react";
import { CHAPTERS } from "@/lib/scroll";
import { SITE, SOCIALS } from "@/lib/site";
import { useSectionFades } from "@/hooks/use-section-fades";
import { ChapterTag, StoryCard } from "./section-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconCheck,
  IconGithub,
  IconInstagram,
  IconLinkedin,
  IconMail,
  IconMaple,
  IconSend,
  IconSpinner,
} from "@/components/icons";

const VH = CHAPTERS.find((c) => c.id === "contact")!.vh;

const SOCIAL_ICONS = {
  github: IconGithub,
  linkedin: IconLinkedin,
  instagram: IconInstagram,
};

type FieldErrors = { name?: string; email?: string; message?: string };
type Status = "idle" | "sending" | "sent" | "error";

const inputClasses =
  "h-12 rounded-xl border-2 border-ink/20 bg-white text-base text-ink placeholder:text-ink/35 focus-visible:border-maple-deep focus-visible:ring-[3px] focus-visible:ring-maple/25 aria-invalid:border-maple-deep aria-invalid:ring-maple/20";

function validate(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Tell me your name so I know who to thank.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = "That email looks a little off, mind double-checking?";
  if (values.message.trim().length < 10)
    errors.message = "Tell me a little more, at least a sentence.";
  return errors;
}

export function ContactSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  useSectionFades(section, content, { exit: false });

  function readValues(form: HTMLFormElement) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };
  }

  function validateField(field: keyof FieldErrors) {
    if (!formRef.current) return;
    const fieldErrors = validate(readValues(formRef.current));
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = readValues(form);
    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    const firstInvalid = (["name", "email", "message"] as const).find((f) => fieldErrors[f]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      ref={section}
      id="contact"
      aria-label="Contact"
      style={{ minHeight: `${VH}vh` }}
      className="relative"
    >
      <div className="flex flex-col md:sticky md:top-0 md:h-dvh md:overflow-visible">
        <div className="flex flex-1 flex-col md:items-center md:justify-center">
          <div
            ref={content}
            className="mx-auto grid w-full max-w-6xl gap-6 px-5 md:grid-cols-[1fr_1.08fr] md:items-center md:gap-10 md:px-10 md:pt-6"
          >
            {/* On phones this column fills the first screen so the campfire scene
                shows beneath the invitation; the form sits just below the fold. */}
            <div className="flex min-h-[88dvh] flex-col pb-2 md:block md:min-h-0 md:pb-0">
              <ChapterTag chapter="The Next Chapter" title="Yours?" tone="cream" />
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-cream drop-shadow-[0_6px_24px_rgba(10,16,50,0.55)] sm:mt-5 sm:text-6xl">
                Let&apos;s write it together.
              </h2>
              <p className="mt-3 max-w-md text-base font-bold text-cream/85 sm:mt-4 sm:text-lg">
                Have a project, an idea, or just want to talk websites (or a
                place to visit in Canada)? Pull up a log, my inbox is always warm.
              </p>
              <ul className="mt-5 flex items-center gap-3 sm:mt-7">
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  return (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.label}
                        title={s.label}
                        className="grid size-12 place-items-center rounded-full border-[2.5px] border-ink bg-cream text-ink shadow-[3px_5px_0_rgba(8,12,38,0.65)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                      >
                        <Icon width={21} height={21} />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-4 inline-flex items-center gap-2 text-base font-bold text-cream/85 underline decoration-maple decoration-[3px] underline-offset-4 transition-colors hover:text-cream sm:mt-6"
              >
                <IconMail width={18} height={18} />
                {SITE.email}
              </a>
            </div>

            <StoryCard className="p-5 shadow-[10px_12px_0_rgba(8,12,38,0.65)] sm:p-8">
              {status === "sent" ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center" role="status">
                  <span className="grid size-16 place-items-center rounded-full border-[3px] border-ink bg-leaf/90 text-ink">
                    <IconCheck width={30} height={30} />
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-extrabold text-ink">
                    Message sent!
                  </h3>
                  <p className="mt-2 max-w-xs text-base font-semibold text-ink/70">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                    Promise.
                  </p>
                  <Button
                    onClick={() => setStatus("idle")}
                    className="mt-6 h-12 rounded-full border-[2.5px] border-ink bg-cream px-6 font-display text-base font-bold text-ink shadow-[0_5px_0_#1F2A52] transition-all hover:translate-y-[2px] hover:bg-cream hover:shadow-[0_3px_0_#1F2A52]"
                  >
                    Send another
                  </Button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate>
                  <h3 className="font-display text-2xl font-extrabold text-ink">
                    Send a message
                  </h3>
                  <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="contact-name" className="font-display text-sm font-bold text-ink">
                        Name
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        onBlur={() => validateField("name")}
                        className={inputClasses}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="text-sm font-bold text-maple-deep">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="contact-email" className="font-display text-sm font-bold text-ink">
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        onBlur={() => validateField("email")}
                        className={inputClasses}
                      />
                      {errors.email && (
                        <p id="contact-email-error" className="text-sm font-bold text-maple-deep">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="contact-message" className="font-display text-sm font-bold text-ink">
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={3}
                        placeholder="Tell me about your project…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        onBlur={() => validateField("message")}
                        className="min-h-28 rounded-xl border-2 border-ink/20 bg-white text-base text-ink placeholder:text-ink/35 focus-visible:border-maple-deep focus-visible:ring-[3px] focus-visible:ring-maple/25 aria-invalid:border-maple-deep"
                      />
                      {errors.message && (
                        <p id="contact-message-error" className="text-sm font-bold text-maple-deep">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    {/* honeypot — humans never see or fill this */}
                    <div className="hidden" aria-hidden>
                      <label htmlFor="contact-company">Company</label>
                      <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
                    </div>
                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="mt-1 h-12 w-full rounded-full border-[2.5px] border-ink bg-maple-deep font-display text-base font-bold text-cream shadow-[0_6px_0_#1F2A52] transition-all hover:translate-y-[2px] hover:bg-maple-deep hover:shadow-[0_4px_0_#1F2A52] active:translate-y-[5px] active:shadow-[0_1px_0_#1F2A52] disabled:opacity-80"
                    >
                      {status === "sending" ? (
                        <>
                          <IconSpinner width={18} height={18} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <IconSend width={18} height={18} />
                        </>
                      )}
                    </Button>
                    <p aria-live="polite" className="min-h-5 text-sm font-bold text-maple-deep" role={status === "error" ? "alert" : undefined}>
                      {status === "error" && (
                        <>
                          Something went wrong, please try again, or email me at{" "}
                          <a className="underline" href={`mailto:${SITE.email}`}>
                            {SITE.email}
                          </a>
                          .
                        </>
                      )}
                    </p>
                  </div>
                </form>
              )}
            </StoryCard>
          </div>
        </div>

        <footer className="border-t border-cream/15 px-5 py-4 sm:py-5">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 text-center text-sm font-semibold text-cream/65 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} {SITE.name} · {SITE.role}
            </p>
            <p className="inline-flex items-center gap-1.5">
              Made in Canada
              <IconMaple width={13} height={13} className="text-maple" />
              maple syrup &amp; TypeScript
            </p>
            <a
              href={SITE.creditUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-maple/70 decoration-2 underline-offset-4 transition-colors hover:text-cream"
            >
              {SITE.credit}
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
