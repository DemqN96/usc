/* Analytics events for Google Tag Manager. The GTM container (GTM-KWKJ6GMN) is
 * loaded by the snippet at the top of every page's <head>; GA4 and any other
 * tags are configured in GTM itself. The site only pushes named events to the
 * dataLayer — GTM picks them up with Custom Event triggers:
 *   click_phone, click_messenger {messenger}, click_email, click_social {network}
 *     — all with {link_location}: rail / nav / footer / dialog / section id
 *   open_callback, generate_lead {form, delivery}, view_size_table {type, category}
 * If GTM is blocked, the pushes land in a plain array and do nothing. */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: string, params: Record<string, string | number> = {}) {
  ;(window.dataLayer ||= []).push({ event, ...params })
}

let started = false

/** Count clicks on contact links anywhere on the page (one delegated listener). */
export function initAnalytics() {
  if (started) return
  started = true
  document.addEventListener('click', onLinkClick, { capture: true })
}

function onLinkClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]')
  if (!a) return
  const href = a.getAttribute('href') ?? ''
  const where = { link_location: placeOf(a) }
  if (href.startsWith('tel:')) track('click_phone', where)
  else if (href.startsWith('mailto:')) track('click_email', where)
  else if (href.startsWith('viber:')) track('click_messenger', { messenger: 'viber', ...where })
  else if (href.startsWith('https://t.me/')) track('click_messenger', { messenger: 'telegram', ...where })
  else if (href.startsWith('https://wa.me/')) track('click_messenger', { messenger: 'whatsapp', ...where })
  else if (href.includes('facebook.com/')) track('click_social', { network: 'facebook', ...where })
}

/** Rough place of a link on the page, so reports tell the rail from the footer. */
function placeOf(el: Element) {
  if (el.closest('[role=dialog]')) return 'dialog'
  if (el.closest('footer')) return 'footer'
  if (el.closest('nav')) return 'nav'
  if (el.closest('.fixed')) return 'rail'
  return el.closest('section[id]')?.id || 'page'
}
