
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                UK postcodes                                */
/* -------------------------------------------------------------------------- */

// Royal Mail format (incl. GIR 0AA). Space optional; case-insensitive.
const UK_POSTCODE =
  /^(GIR ?0AA|[A-PR-UWYZ](\d{1,2}|[A-HK-Y]\d{1,2}|\d[A-HJKPSTUW]|[A-HK-Y]\d[ABEHMNPRV-Y]) ?\d[ABD-HJLNP-UW-Z]{2})$/i;

export function isValidUkPostcode(value: string) {
  return UK_POSTCODE.test(value.trim());
}

/** "sw1a1aa" -> "SW1A 1AA" */
export function formatUkPostcode(value: string) {
  const compact = value.replace(/\s+/g, "").toUpperCase();
  if (compact.length < 5) return value.toUpperCase();
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

/* -------------------------------------------------------------------------- */
/*                                 UK phones                                  */
/* -------------------------------------------------------------------------- */

/**
 * Accepts "07700 900123", "+44 7700 900123", "0044…", "7700900123", "020 7946 0018".
 * Returns E.164 ("+447700900123") or null when not a valid UK number.
 */
export function normaliseUkPhone(value: string): string | null {
  let digits = value.replace(/[\s().-]/g, "");
  if (digits.startsWith("+44")) digits = digits.slice(3);
  else if (digits.startsWith("0044")) digits = digits.slice(4);
  if (digits.startsWith("0")) digits = digits.slice(1);
  // Mobiles (7…) and geographic/non-geographic (1…, 2…, 3…): 9–10 national digits.
  return /^[1237]\d{8,9}$/.test(digits) ? `+44${digits}` : null;
}

export function isValidUkPhone(value: string) {
  return normaliseUkPhone(value) !== null;
}

export function isValidEmail(value: string) {
  return z.email().safeParse(value.trim()).success;
}

/* -------------------------------------------------------------------------- */
/*                                  Schemas                                   */
/* -------------------------------------------------------------------------- */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().refine(isValidEmail, "Enter a valid email address"),
  subject: z.string().trim().min(3, "Add a short subject").max(120),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
  company: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
