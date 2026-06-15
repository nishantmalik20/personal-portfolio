/**
 * Branded HTML emails for the contact form.
 *
 * Two messages go out per submission:
 *  - ownerNotificationEmail  → lands in the owner's inbox (the lead)
 *  - visitorConfirmationEmail → friendly auto-reply to the person who wrote in
 *
 * Built as table-based, inline-styled HTML so they render in Gmail, Outlook,
 * Apple Mail and the rest. Palette matches the "Pop-Up Storybook" design spec.
 */

import { SITE, SOCIALS } from "./site";
import { LOGO_PNG_BASE64 } from "./email-assets";

/** Inline logo, referenced in the HTML as `cid:logo`. Attach to every send. */
export const EMAIL_ATTACHMENTS = [
  {
    filename: "logo.png",
    content: LOGO_PNG_BASE64,
    contentId: "logo",
    contentType: "image/png",
  },
];

const C = {
  ink: "#1F2A52",
  maple: "#E63946",
  mapleDeep: "#D62839",
  sun: "#FFD23F",
  leaf: "#58C24A",
  cream: "#FFF9EC",
  paper: "#FFFFFF",
  // warm golden-hour backdrop behind the card
  backdrop: "#FFEFC4",
};

const SOCIAL_LABEL: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

function paragraphs(message: string): string {
  return escapeHtml(message).replace(/\r?\n/g, "<br />");
}

/** Outer chrome shared by both emails: backdrop, header bar, card, footer. */
function shell({
  preheader,
  badge,
  badgeBg,
  badgeColor,
  body,
}: {
  preheader: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(SITE.name)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>
      body { margin: 0; padding: 0; background-color: ${C.backdrop}; }
      a { text-decoration: none; }
      .btn:hover { transform: translateY(2px); box-shadow: 0 2px 0 ${C.ink} !important; }
      .social:hover { transform: translateY(-2px); }
      @media (max-width: 600px) {
        .container { width: 100% !important; }
        .px { padding-left: 22px !important; padding-right: 22px !important; }
        .h1 { font-size: 30px !important; }
      }
    </style>
  </head>
  <body>
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${escapeHtml(
      preheader
    )}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.backdrop};background-image:linear-gradient(180deg,#FF9966 0%,#FFC371 26%,${C.backdrop} 60%);">
      <tr>
        <td align="center" style="padding:34px 16px 44px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

            <!-- brand bar -->
            <tr>
              <td class="px" style="padding:0 8px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <span style="display:inline-block;background:${C.maple};border:2.5px solid ${C.ink};border-radius:14px;padding:9px 16px 6px;box-shadow:0 4px 0 ${C.ink};">
                        <img src="cid:logo" width="120" height="62" alt="iNishant" style="display:block;border:0;outline:none;width:120px;height:62px;" />
                      </span>
                    </td>
                    <td align="right" valign="middle" style="font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:13px;font-weight:800;color:${C.ink};">
                      <span style="display:inline-block;background:${badgeBg};color:${badgeColor};border:2px solid ${C.ink};border-radius:999px;padding:6px 14px;text-transform:uppercase;letter-spacing:1.1px;">${escapeHtml(
    badge
  )}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- card -->
            <tr>
              <td style="background:${C.cream};border:3px solid ${C.ink};border-radius:26px;box-shadow:10px 12px 0 rgba(31,42,82,0.65);overflow:hidden;">
                ${body}
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td class="px" style="padding:22px 14px 6px;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:12px;line-height:1.6;color:${C.ink};opacity:0.7;text-align:center;">
                ${escapeHtml(SITE.name)} · ${escapeHtml(SITE.role)} · ${escapeHtml(
    SITE.location
  )}<br />
                <a href="${SITE.creditUrl}" style="color:${C.mapleDeep};font-weight:800;">${escapeHtml(
    SITE.credit
  )}</a> 🍁
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Chunky storybook CTA button. */
function button(label: string, href: string, bg: string, color: string): string {
  return `<a class="btn" href="${href}" style="display:inline-block;font-family:'Baloo 2','Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:16px;font-weight:800;color:${color};background:${bg};border:2.5px solid ${C.ink};border-radius:999px;padding:13px 26px;box-shadow:0 5px 0 ${C.ink};transition:all .12s ease;">${escapeHtml(
    label
  )}</a>`;
}

const H1 =
  "font-family:'Baloo 2','Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-weight:800;color:" +
  C.ink +
  ";line-height:1.1;margin:0;";
const EYEBROW =
  "font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:" +
  C.mapleDeep +
  ";margin:0 0 10px;";
const BODY =
  "font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:16px;line-height:1.65;color:" +
  C.ink +
  ";margin:0;";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** The lead notification that lands in the owner's inbox. */
export function ownerNotificationEmail({ name, email, message }: ContactMessage) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const received = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Winnipeg",
  }).format(new Date());

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 18px;border-bottom:2px solid rgba(31,42,82,0.10);font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.mapleDeep};width:108px;vertical-align:top;">${label}</td>
      <td style="padding:11px 18px;border-bottom:2px solid rgba(31,42,82,0.10);font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:15px;font-weight:700;color:${C.ink};">${value}</td>
    </tr>`;

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="height:6px;background:${C.maple};"></td></tr>
      <tr>
        <td class="px" style="padding:30px 36px 4px;">
          <p style="${EYEBROW}">New enquiry</p>
          <h1 class="h1" style="${H1}font-size:34px;">You&rsquo;ve got mail 🍁</h1>
          <p style="${BODY}margin-top:12px;">Someone just reached out through your portfolio. Here are the details.</p>
        </td>
      </tr>
      <tr>
        <td class="px" style="padding:22px 36px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};border:2.5px solid ${C.ink};border-radius:18px;overflow:hidden;">
            ${row("From", safeName)}
            ${row("Email", `<a href="mailto:${safeEmail}" style="color:${C.mapleDeep};font-weight:800;">${safeEmail}</a>`)}
            <tr>
              <td style="padding:11px 18px;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${C.mapleDeep};vertical-align:top;">Received</td>
              <td style="padding:11px 18px;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:15px;font-weight:700;color:${C.ink};">${escapeHtml(received)} CT</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="px" style="padding:22px 36px 0;">
          <p style="${EYEBROW}margin-bottom:8px;">Message</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:${C.sun}1A;border-left:5px solid ${C.maple};border-radius:6px;padding:16px 18px;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:16px;line-height:1.7;color:${C.ink};">${paragraphs(
    message
  )}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="px" align="center" style="padding:28px 36px 34px;">
          ${button(
            `Reply to ${escapeHtml(firstName(name))}`,
            `mailto:${safeEmail}?subject=${encodeURIComponent(
              "Re: your message to inishant.com"
            )}`,
            C.mapleDeep,
            C.cream
          )}
          <p style="font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:12px;color:${C.ink};opacity:0.6;margin:16px 0 0;">Sent automatically from your portfolio contact form.</p>
        </td>
      </tr>
    </table>`;

  return {
    subject: `New portfolio message from ${name}`,
    html: shell({
      preheader: `${name}: ${message.slice(0, 90)}`,
      badge: "New lead",
      badgeBg: C.sun,
      badgeColor: C.ink,
      body,
    }),
    text: `New portfolio message\n\nFrom: ${name} <${email}>\nReceived: ${received} CT\n\n${message}\n\n— Reply directly to this email to reach ${firstName(
      name
    )}.`,
  };
}

/** The warm auto-reply sent back to the visitor. */
export function visitorConfirmationEmail({ name, message }: Omit<ContactMessage, "email">) {
  const fname = escapeHtml(firstName(name));

  const step = (emoji: string, text: string) => `
    <tr>
      <td width="40" style="vertical-align:top;padding:6px 0;">
        <span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;background:${C.sun};border:2px solid ${C.ink};border-radius:999px;font-size:15px;">${emoji}</span>
      </td>
      <td style="vertical-align:middle;padding:6px 0;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:15px;line-height:1.5;font-weight:600;color:${C.ink};">${text}</td>
    </tr>`;

  const socialButtons = SOCIALS.map(
    (s) =>
      `<a class="social" href="${s.url}" style="display:inline-block;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:13px;font-weight:800;color:${C.ink};background:${C.cream};border:2px solid ${C.ink};border-radius:999px;padding:8px 16px;margin:0 5px;box-shadow:2px 3px 0 ${C.ink};transition:transform .12s ease;">${escapeHtml(
        SOCIAL_LABEL[s.id] ?? s.label
      )}</a>`
  ).join("");

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="height:6px;background:${C.leaf};"></td></tr>
      <tr>
        <td class="px" style="padding:32px 36px 4px;">
          <p style="${EYEBROW}">Message received</p>
          <h1 class="h1" style="${H1}font-size:36px;">Thanks, ${fname}! 🎉</h1>
          <p style="${BODY}margin-top:14px;">Your message just landed in my inbox and I&rsquo;m glad you reached out. This is a quick automatic note to let you know it arrived safely &mdash; a real reply from me is on the way.</p>
        </td>
      </tr>

      <tr>
        <td class="px" style="padding:24px 36px 0;">
          <p style="${EYEBROW}margin-bottom:8px;">What you sent</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:${C.paper};border:2px solid rgba(31,42,82,0.15);border-radius:14px;padding:16px 18px;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;font-size:15px;line-height:1.7;color:${C.ink};">${paragraphs(
    message
  )}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td class="px" style="padding:26px 36px 0;">
          <p style="${EYEBROW}margin-bottom:10px;">What happens next</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${step("✉️", "I read every message personally, usually within a day or two.")}
            ${step("🤝", "I&rsquo;ll reply with thoughts, next steps, or a few questions.")}
            ${step("🍁", "If we&rsquo;re a fit, we&rsquo;ll start writing the next chapter together.")}
          </table>
        </td>
      </tr>

      <tr>
        <td class="px" style="padding:28px 36px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px dashed rgba(31,42,82,0.2);">
            <tr><td style="height:18px;"></td></tr>
            <tr>
              <td width="112" style="vertical-align:middle;">
                <span style="display:inline-block;background:${C.maple};border:2.5px solid ${C.ink};border-radius:13px;padding:7px 12px 5px;box-shadow:0 3px 0 ${C.ink};">
                  <img src="cid:logo" width="80" height="42" alt="iNishant" style="display:block;border:0;outline:none;width:80px;height:42px;" />
                </span>
              </td>
              <td style="vertical-align:middle;font-family:'Nunito',Segoe UI,Tahoma,Arial,sans-serif;color:${C.ink};">
                <div style="font-family:'Baloo 2','Nunito',sans-serif;font-size:17px;font-weight:800;">${escapeHtml(
                  SITE.name
                )}</div>
                <div style="font-size:13px;font-weight:700;opacity:0.7;">${escapeHtml(
                  SITE.role
                )} &middot; ${escapeHtml(SITE.location)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td class="px" align="center" style="padding:22px 36px 34px;">
          ${socialButtons}
        </td>
      </tr>
    </table>`;

  return {
    subject: "Thanks for reaching out 🍁 — I'll be in touch soon",
    html: shell({
      preheader: `Thanks ${firstName(name)} — your message reached ${SITE.name} safely.`,
      badge: "Auto-reply",
      badgeBg: C.leaf,
      badgeColor: C.ink,
      body,
    }),
    text: `Thanks, ${firstName(
      name
    )}!\n\nYour message just landed in my inbox and arrived safely. This is a quick automatic note — a real reply from me is on the way (usually within a day or two).\n\nWhat you sent:\n${message}\n\n— ${SITE.name}, ${SITE.role}, ${SITE.location}\n${SITE.credit}`,
  };
}
