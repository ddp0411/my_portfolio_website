import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// New MailerLite API (connect.mailerlite.com). POST /subscribers upserts:
// 201 for a new subscriber, 200 if it already existed — both are success.
const MAILERLITE_ENDPOINT = "https://connect.mailerlite.com/api/subscribers";

export async function POST(req: NextRequest) {
  let body: { email?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Silently accept without hitting the API.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Newsletter isn't configured yet." },
      { status: 500 },
    );
  }

  const payload: Record<string, unknown> = { email };
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (groupId) payload.groups = [groupId];

  try {
    const res = await fetch(MAILERLITE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // 422 = validation (e.g. a role/blocked address). Keep the message generic.
    return NextResponse.json(
      { ok: false, error: "Couldn't subscribe that address. Please try another." },
      { status: res.status === 422 ? 422 : 502 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again later." },
      { status: 502 },
    );
  }
}
