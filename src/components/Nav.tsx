import { useEffect, useRef, useState } from 'react'
import { Clock, ArrowRight, ArrowUpRight, ChevronDown, Facebook } from 'lucide-react'

import { PRODUCT_CATEGORIES, type ProductCategory } from '../products'
import { catCount } from '../lib/catalog'
import { useKyivTime } from '../lib/hooks'
import {
  CATEGORY_JUMP_EVENT,
  HOME_URL,
  KRANY_URL,
  PROTE_URL,
  categoryHref,
  sectionHref,
  type PageId,
} from '../lib/paths'
import { FACEBOOK_URL } from '../siteConfig'
import { TextRoll } from './ui'

import uscLogo from '../assets/usc-logo.jpg'
import proteWordmark from '../assets/prote-wordmark.png'

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

/** Catalog categories listed in the nav's "Інша продукція" dropdown — the
 *  flagship USC ball valves and the PROTE partner line have their own pages
 *  and top-level nav links instead (see NAV_ITEMS below). */
const OTHER_CATALOG_IDS = [
  'gate-valves',
  'flanges',
  'hatches',
  'clamps',
  'kmch',
  'boxes',
  'adapters',
  'tapping',
  'bends',
  'reducers',
]

/** Nav links that point at a catalog category dispatch this instead of a
 *  plain anchor jump — ProductShop listens and switches its active category.
 *  On a page without the catalog (PROTE) it navigates to the home page, where
 *  ProductShop reads the category from `?cat=`. */
export function jumpToCategory(id: string) {
  const catalog = document.getElementById('catalog')
  if (!catalog) {
    window.location.assign(categoryHref(id))
    return
  }
  window.dispatchEvent(new CustomEvent(CATEGORY_JUMP_EVENT, { detail: id }))
  catalog.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

type NavItem =
  | { kind: 'anchor'; label: string; hash: string }
  | { kind: 'category'; label: string; categoryId: string }
  | { kind: 'page'; label: string; href: string; page: PageId; logo?: string }
  | { kind: 'group'; label: string; categoryIds: string[] }

const NAV_ITEMS: NavItem[] = [
  { kind: 'page', label: 'USC Крани', href: KRANY_URL, page: 'krany' },
  { kind: 'page', label: 'PROTE', href: PROTE_URL, page: 'prote', logo: proteWordmark },
  { kind: 'group', label: 'Інша продукція', categoryIds: OTHER_CATALOG_IDS },
  { kind: 'anchor', label: 'Партнерам та дилерам', hash: '#dealers' },
  { kind: 'anchor', label: 'Сертифікати', hash: '#certificates' },
  { kind: 'anchor', label: 'Контакти', hash: '#contact-details' },
]

/** Where a (non-dropdown) nav item points from the given page. */
function itemHref(item: Exclude<NavItem, { kind: 'group' }>, page: PageId) {
  switch (item.kind) {
    case 'category':
      return categoryHref(item.categoryId)
    case 'page':
      return item.href
    case 'anchor':
      return sectionHref(page, item.hash)
  }
}

/** Desktop dropdown for the "Інша продукція" nav item — lists the remaining
 *  catalog categories with their card counts; picking one jumps into the
 *  catalog with that category preselected. */
function NavGroupDropdown({ label, categoryIds }: { label: string; categoryIds: string[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const categories = categoryIds
    .map((id) => PRODUCT_CATEGORIES.find((c) => c.id === id))
    .filter((c): c is ProductCategory => Boolean(c))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 whitespace-nowrap text-[14px] text-gray-900 transition-colors hover:text-[#1E7FC2]"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-10 mt-3 w-[300px] -translate-x-1/2 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                jumpToCategory(c.id)
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="min-w-0">{c.name}</span>
              <span className="shrink-0 rounded-full bg-[#1E7FC2]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#1E7FC2]">
                {catCount(c)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Burger that morphs into a close icon. Three bars: the outer two rotate
 *  into an X while the middle one collapses. */
function BurgerButton({
  open,
  onClick,
}: {
  open: boolean
  onClick: () => void
}) {
  const bar =
    'absolute left-1/2 h-[1.5px] -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#4A4D52] text-white transition-transform duration-300 active:scale-90 lg:hidden"
    >
      <span className="relative block h-[18px] w-[18px]">
        <span
          className={`${bar} w-[18px] ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[3px]'}`}
        />
        <span
          className={`${bar} top-1/2 -translate-y-1/2 ${open ? 'w-0 opacity-0' : 'w-[12px] opacity-100'}`}
        />
        <span
          className={`${bar} w-[18px] ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[13px]'}`}
        />
      </span>
    </button>
  )
}

function Nav({
  page,
  menuOpen,
  onToggleMenu,
}: {
  page: PageId
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  const time = useKyivTime()
  return (
    <div className="relative z-[60] mx-auto w-full max-w-[1440px] px-3 pt-3 sm:px-6 sm:pt-6">
      <nav className="flex items-center justify-between rounded-full bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-3">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <a
            href={page === 'home' ? '#top' : HOME_URL}
            aria-label="USC — Ukrainian Santechnical Company"
            className="shrink-0"
          >
            <img
              src={uscLogo}
              alt=""
              className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
            />
          </a>
          <ul className="hidden items-center gap-5 lg:flex xl:gap-6">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'group') {
                return (
                  <li key={item.label}>
                    <NavGroupDropdown label={item.label} categoryIds={item.categoryIds} />
                  </li>
                )
              }
              const current = item.kind === 'page' && item.page === page
              return (
                <li key={item.label} className="relative">
                  <a
                    href={itemHref(item, page)}
                    aria-current={current ? 'page' : undefined}
                    aria-label={item.kind === 'page' && item.logo ? item.label : undefined}
                    onClick={(e) => {
                      if (item.kind === 'category') {
                        e.preventDefault()
                        jumpToCategory(item.categoryId)
                      }
                    }}
                    className={`flex items-center whitespace-nowrap text-[14px] transition-colors hover:text-[#1E7FC2] ${
                      current ? 'text-[#1E7FC2]' : 'text-gray-900'
                    }`}
                  >
                    {item.kind === 'page' && item.logo ? (
                      // max-w-none: with the preflight max-width:100% the logo collapses to 0 in a tight row
                      <img src={item.logo} alt="" className="h-[15px] w-auto max-w-none" />
                    ) : (
                      item.label
                    )}
                  </a>
                  {current && (
                    <span
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#1E7FC2]"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right (desktop) — clock from xl, tagline from 1360px; below that the links need the room */}
        <div className="hidden items-center gap-5 lg:flex">
          <span className="hidden whitespace-nowrap text-[13px] text-gray-600 min-[1360px]:inline">
            Лише краще обладнання
          </span>
          <span className="hidden items-center gap-1.5 whitespace-nowrap text-[13px] text-gray-600 xl:flex">
            <Clock size={14} />
            {time} Київ
          </span>
          <a
            href="#"
            className="group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-[#4A4D52] py-2 pl-5 pr-2 text-[13px] font-medium text-white"
          >
            <TextRoll>Замовити дзвінок</TextRoll>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={14} className="text-[#4A4D52]" />
            </span>
          </a>
        </div>

        {/* Mobile toggle */}
        <BurgerButton open={menuOpen} onClick={onToggleMenu} />
      </nav>
    </div>
  )
}

function MobileMenu({ page, open, onClose }: { page: PageId; open: boolean; onClose: () => void }) {
  const time = useKyivTime()
  const [otherOpen, setOtherOpen] = useState(false)

  /* Esc to close + lock the page behind the sheet while it is open */
  useEffect(() => {
    if (!open) setOtherOpen(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="animate-menu-fade absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        id="mobile-menu"
        className="animate-slide-up absolute inset-x-0 bottom-0 mx-2 mb-2 overflow-hidden rounded-[26px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.22)]"
      >
        {/* Grab handle — signals the sheet is dismissible */}
        <div className="flex justify-center pb-1 pt-3">
          <span className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-5">
          <div
            className="menu-row mb-1 flex items-center gap-3"
            style={{ animationDelay: '40ms' }}
          >
            <img
              src={uscLogo}
              alt="USC — Ukrainian Santechnical Company"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Clock size={13} />
              {time} Київ
            </span>
          </div>

          <ul className="mb-5">
            {NAV_ITEMS.map((item, i) => {
              if (item.kind === 'group') {
                const categories = item.categoryIds
                  .map((id) => PRODUCT_CATEGORIES.find((c) => c.id === id))
                  .filter((c): c is ProductCategory => Boolean(c))
                return (
                  <li
                    key={item.label}
                    className="menu-row border-b border-gray-100 last:border-b-0"
                    style={{ animationDelay: `${90 + i * 55}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => setOtherOpen((v) => !v)}
                      aria-expanded={otherOpen}
                      className="group flex w-full items-baseline gap-3 py-3.5 text-left active:opacity-60"
                    >
                      <span className="w-[22px] shrink-0 text-[11px] font-semibold tabular-nums text-gray-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[clamp(21px,5.8vw,26px)] font-medium leading-[1.15] tracking-[-0.01em] text-gray-900">
                        {item.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 self-center text-gray-300 transition-transform ${otherOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {otherOpen && (
                      <ul className="mb-3 grid gap-0.5 pl-[34px] pr-1">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => {
                                onClose()
                                jumpToCategory(c.id)
                              }}
                              className="flex w-full items-center justify-between gap-2 rounded-xl py-2 text-left text-[14px] text-gray-700 active:opacity-60"
                            >
                              <span className="min-w-0">{c.name}</span>
                              <span className="shrink-0 rounded-full bg-[#1E7FC2]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#1E7FC2]">
                                {catCount(c)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }

              const href = itemHref(item, page)
              return (
                <li
                  key={item.label}
                  className="menu-row border-b border-gray-100 last:border-b-0"
                  style={{ animationDelay: `${90 + i * 55}ms` }}
                >
                  <a
                    href={href}
                    onClick={(e) => {
                      if (item.kind === 'category') {
                        e.preventDefault()
                        jumpToCategory(item.categoryId)
                      }
                      onClose()
                    }}
                    className="group flex items-baseline gap-3 py-3.5 active:opacity-60"
                  >
                    <span className="w-[22px] shrink-0 text-[11px] font-semibold tabular-nums text-gray-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[clamp(21px,5.8vw,26px)] font-medium leading-[1.15] tracking-[-0.01em] text-gray-900">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 self-center text-gray-300 transition-colors group-active:text-[#1E7FC2]"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div
            className="menu-row flex items-center gap-2.5"
            style={{ animationDelay: `${90 + NAV_ITEMS.length * 55}ms` }}
          >
            <a
              href={sectionHref(page, '#catalog')}
              onClick={onClose}
              className="usc-cta group flex flex-1 items-center justify-between rounded-full py-3 pl-5 pr-2.5 text-[15px] font-semibold text-gray-900"
            >
              Перейти до каталогу
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(122,80,0,0.28)] transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight size={16} className="text-gray-900" />
              </span>
            </a>
            {FACEBOOK_URL && (
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors active:bg-gray-200"
              >
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Pill navigation + its mobile sheet, with the open/closed state kept here so
 *  every page can drop in a single element. */
export function SiteNav({ page }: { page: PageId }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <Nav page={page} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu page={page} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
