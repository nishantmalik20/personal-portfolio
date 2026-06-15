import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  EMAIL_ATTACHMENTS,
  ownerNotificationEmail,
  visitorConfirmationEmail,
} from "@/lib/emails";

const FALLBACK_TO = "hello@inishant.com";
const FALLBACK_FROM = "Portfolio <onboarding@resend.dev>";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const honeypot = typeof payload.company === "string" ? payload.company.trim() : "";

  // bots fill the hidden field — accept silently and discard
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  // No key configured (local dev / preview): succeed without sending so the
  // form remains testable end-to-end.
  if (!apiKey) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL ?? FALLBACK_FROM;
  const ownerTo = process.env.CONTACT_TO_EMAIL ?? FALLBACK_TO;

  // The lead notification is the message that must not be lost. Send it first
  // and fail the request only if this one doesn't go through.
  const owner = ownerNotificationEmail({ name, email, message });
  const { error: ownerError } = await resend.emails.send({
    from,
    to: [ownerTo],
    replyTo: email,
    subject: owner.subject,
    html: owner.html,
    text: owner.text,
    attachments: EMAIL_ATTACHMENTS,
  });

  if (ownerError) {
    return NextResponse.json(
      { error: "Email service failed to send the message." },
      { status: 502 }
    );
  }

  // Friendly auto-reply to the visitor. Best-effort: the lead is already
  // captured, so a confirmation failure shouldn't surface as an error.
  const visitor = visitorConfirmationEmail({ name, message });
  const { error: visitorError } = await resend.emails.send({
    from,
    to: [email],
    replyTo: ownerTo,
    subject: visitor.subject,
    html: visitor.html,
    text: visitor.text,
    attachments: EMAIL_ATTACHMENTS,
  });

  return NextResponse.json({ ok: true, delivered: true, confirmed: !visitorError });
}
