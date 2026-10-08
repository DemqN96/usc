import { EMAILS, FORM_ENDPOINT } from '../siteConfig'
import { track } from './analytics'

export type LeadField = { key: string; label: string; value: string }

/** `sent` — accepted by the form endpoint; `mail` — no endpoint configured, so
 *  the visitor's mail app was opened with the request (they still have to
 *  press "Send", and the UI has to say so). */
export type LeadResult = 'sent' | 'mail'

/** Ready-to-send email with the request, addressed to every sales mailbox. */
export function leadMailto(subject: string, fields: LeadField[]) {
  const body = [...fields.filter((f) => f.value).map((f) => `${f.label}: ${f.value}`), '', '— заявка з сайту usc-pro.com.ua'].join('\n')
  return `mailto:${EMAILS.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Deliver a lead. With VITE_FORM_ENDPOINT set it is POSTed as JSON
 *  ({ ...fields by key, source, submittedAt }); without one it never pretends
 *  to have been sent — it hands over to the visitor's mail app instead.
 *  Either way the lead is counted in analytics (`generate_lead`). */
export async function sendLead(form: 'dealer' | 'callback', subject: string, fields: LeadField[]): Promise<LeadResult> {
  const result = await deliver(subject, fields)
  track('generate_lead', { form, delivery: result })
  return result
}

async function deliver(subject: string, fields: LeadField[]): Promise<LeadResult> {
  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...Object.fromEntries(fields.map((f) => [f.key, f.value])),
        source: `USC site — ${subject}`,
        submittedAt: new Date().toISOString(),
      }),
    })
    if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
    return 'sent'
  }
  window.location.href = leadMailto(subject, fields)
  return 'mail'
}
