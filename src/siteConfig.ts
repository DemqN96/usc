/* ------------------------------------------------------------------ */
/* Central site configuration                                          */
/* ------------------------------------------------------------------ */
/*
 * All contact / social / form values come from Vite env vars (VITE_*)
 * with safe fallbacks, so the site keeps working without a .env file.
 *
 * IMPORTANT: VITE_* variables are inlined into the built client bundle
 * and are therefore PUBLIC. Never place real secrets here (CRM API keys,
 * passwords, tokens) — those must live on a server / proxy, never in the
 * browser. A public form-submission URL (webhook / Formspree) is fine.
 */

const env = import.meta.env

/** Phone numbers in international format (+380XXXXXXXXX). */
export const PHONE_PRIMARY = env.VITE_PHONE_PRIMARY ?? '+380963235506'
export const PHONE_SECONDARY = env.VITE_PHONE_SECONDARY ?? '+380504811035'

/** Public contact email. */
export const EMAIL = env.VITE_EMAIL ?? 'yskpro@ukr.net'

/** Social profile URLs — empty string means "not configured" (link hidden). */
export const FACEBOOK_URL = env.VITE_FACEBOOK_URL ?? ''
export const INSTAGRAM_URL = env.VITE_INSTAGRAM_URL ?? ''

/**
 * Dealer-form submission endpoint (CRM webhook or form service).
 * The form POSTs JSON here. Empty until the CRM is connected.
 */
export const FORM_ENDPOINT = env.VITE_FORM_ENDPOINT ?? ''

/** "+380963235506" → "+38 (096) 323-55-06" (falls back to the raw input). */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  const local = digits.startsWith('380') ? digits.slice(3) : digits
  if (local.length !== 9) return raw
  return `+38 (0${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5, 7)}-${local.slice(7, 9)}`
}
