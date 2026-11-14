import { z } from "zod";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit, sanitiseForSheet } from "@/lib/server-utils";

/**
 * POST /api/contact — quote & general enquiries.
 * Relays submissions to Google Apps Script (GOOGLE_SCRIPT_CONTACT_WEBHOOK_URL)
 * or Web3Forms (WEB3FORMS_ACCESS_KEY) directly to email & Google Sheets.
 */
export async function POST(request: Request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 60_000)) {
    return Response.json({ ok: false, message: "Too many messages. Please wait a minute." }, { status: 429 });
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }
  if (parsed.data.company) return Response.json({ ok: true });

  const { name, email, subject, message } = parsed.data;
  const googleWebhookUrl = process.env.GOOGLE_SCRIPT_CONTACT_WEBHOOK_URL;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!googleWebhookUrl && !web3FormsKey) {
    console.info("[api/contact] New enquiry (no webhook or key configured):", { name, email, subject, message });
    return Response.json({ ok: true });
  }

  try {
    if (googleWebhookUrl) {
      // 1. Google Apps Script Webhook (saves to Google Sheet + emails cleansweep89@outlook.com)
      const res = await fetch(googleWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitiseForSheet({ type: "contact", name, email, subject, message })),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Google Webhook returned HTTP ${res.status}`);
    } else if (web3FormsKey) {
      // 2. Web3Forms fallback
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "CleanSweepOasis/1.0",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `[Clean Sweep Oasis Quote] ${subject}`,
          from_name: "Clean Sweep Oasis Website",
          name,
          email,
          replyto: email,
          message: `Service / Subject: ${subject}\n\n${message}`,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });

      const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Web3Forms HTTP ${res.status}`);
      }
    }
  } catch (err) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    console.error("[api/contact] Relay failed:", errorDetails);
    return Response.json(
      { ok: false, message: `Submission error: ${errorDetails}. Please try WhatsApp or call us.` },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
