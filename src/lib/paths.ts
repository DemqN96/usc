/* ------------------------------------------------------------------ */
/* Page URLs                                                           */
/* ------------------------------------------------------------------ */
/*
 * The site is a small multi-page app (Vite MPA): `/` is the title page (about
 * USC, the catalog of other products, dealers, contacts), `/krany/` is the USC
 * ball-valve page and `/prote/` is the PROTE partner page. Every cross-page link is built from
 * Vite's BASE_URL so the site keeps working if it is ever served from a
 * sub-path (always ends with "/").
 */

const BASE = import.meta.env.BASE_URL

export type PageId = 'home' | 'krany' | 'prote'

export const HOME_URL = BASE
export const KRANY_URL = `${BASE}krany/`
export const PROTE_URL = `${BASE}prote/`
export const DOCS_URL = `${BASE}docs/`

/** Fired on `window` to make the catalog switch to a category. */
export const CATEGORY_JUMP_EVENT = 'usc:select-category'

/** Link to a section of the home page, e.g. homeHref('#dealers'). */
export const homeHref = (hash = '') => `${HOME_URL}${hash}`

/** Link that opens the catalog with `id` preselected (read by ProductShop). */
export const categoryHref = (id: string) => `${HOME_URL}?cat=${encodeURIComponent(id)}#catalog`

/** Link to a technology on the PROTE page; the panel opens from the hash. */
export const proteTechHref = (slug: string) => `${PROTE_URL}#${slug}`

/**
 * Sections that exist on each page. A `#hash` link stays a plain in-page
 * anchor when the section is on the current page, otherwise it points at the
 * home page.
 */
const LOCAL_ANCHORS: Record<PageId, readonly string[] | 'all'> = {
  home: 'all',
  krany: ['#top', '#contact-details'],
  prote: ['#top', '#contact-details'],
}

export function sectionHref(page: PageId, hash: string): string {
  const local = LOCAL_ANCHORS[page]
  return local === 'all' || local.includes(hash) ? hash : homeHref(hash)
}
