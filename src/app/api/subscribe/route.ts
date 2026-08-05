import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Buttondown API. POST /v1/subscribers creates a subscriber (201).
// A duplicate returns 400 with an "already subscribed" message.
const BUTTONDOWN_ENDPOINT = "https://api.buttondown.email/v1/subscribers";

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

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Newsletter isn't configured yet." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(BUTTONDOWN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Already subscribed → Buttondown returns 400; treat as a friendly success.
    const text = await res.text().catch(() => "");
    if (res.status === 400 && /already|subscribed|exists/i.test(text)) {
      return NextResponse.json({ ok: true, already: true });
    }

    return NextResponse.json(
      { ok: false, error: "Couldn't subscribe that address. Please try another." },
      { status: res.status >= 500 ? 502 : 400 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again later." },
      { status: 502 },
    );
  }
}
