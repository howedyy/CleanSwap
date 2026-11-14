import { z } from "zod";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/server-utils";

/**
 * POST /api/contact — quote & general enquiries.
 * Forwards submissions via Web3Forms (WEB3FORMS_ACCESS_KEY) directly to
 * cleansweep89@outlook.com; logs locally if the key is not configured.
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
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.info("[api/contact] New enquiry (WEB3FORMS_ACCESS_KEY not configured):", { name, email, subject, message });
    return Response.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
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
  } catch (err) {
    console.error("[api/contact] Email relay failed", err);
    return Response.json(
      { ok: false, message: "Message failed to send. Please try WhatsApp or call us." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
