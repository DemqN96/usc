import { useState, useEffect, useRef, Component, type ReactNode } from 'react'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'
import {
  Clock,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Check,
  X,
  Facebook,
  Instagram,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Gauge,
} from 'lucide-react'

import { PRODUCT_CATEGORIES, type ProductCategory, type ProductType } from './products'
import { getGroups, type ProductGroup } from './productGroups'

import {
  PHONE_PRIMARY,
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  FORM_ENDPOINT,
  formatPhone,
} from './siteConfig'

import zavodBalls from './assets/zavod1.jpg'
import zavodProte from './assets/zavod.jpg'
import uscLogo from './assets/usc-logo.jpg'
import proteForest from './assets/prote-forest.jpg'
import proteWordmark from './assets/prote-wordmark.png'
import proteLogo from './assets/prote-logo.png'
import uscLogoMark from './assets/usc-logo-mark.png'

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function useKyivTime() {
  const [time, setTime] = useState(() => formatKyiv())
  useEffect(() => {
    const id = setInterval(() => setTime(formatKyiv()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatKyiv() {
  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Kyiv',
  }).format(new Date())
}

/* A rolling text label used on CTA buttons */
function TextRoll({ children }: { children: string }) {
  return (
    <span className="text-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

/* On-brand valve / flame mark (replaces the original starburst-compass) */
function ValveMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.5 2c.4 1.9-.3 3.2-1.3 4.4-1 1.2-2.2 2.4-2.2 4.3a3.9 3.9 0 0 0 7.8.2c0-1-.3-1.8-.7-2.6.9.5 1.6 1.5 1.9 2.8.7 3-1.2 6.1-4.3 6.9-3.1.8-6.3-1-7.1-4-.6-2.3.2-4.3 1.5-5.9C13.8 6 14.2 4 13.5 2Z" />
    </svg>
  )
}

/** Fires once when the wrapped element scrolls into view. Used to drive the
 *  scroll-reveal animation below without re-triggering on every re-render. */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px', ...options },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

/** Fades a section into place the first time it scrolls into view. Purely
 *  CSS-driven (transform/opacity) so it costs nothing extra to host. */
function Reveal({
  children,
  className = '',
  delay = 0,
  id,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
  as?: 'div' | 'article'
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      id={id}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/** Thin brand-gradient bar pinned to the very top, filling with scroll
 *  progress — a small, static-only touch of "app" polish. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = document.documentElement
        const max = el.scrollHeight - el.clientHeight
        setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#1E7FC2] to-[#F5B915] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shader background                                                   */
/* ------------------------------------------------------------------ */

class ShaderBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  render() {
    return this.state.err ? null : this.props.children
  }
}

function HeroShaders() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Shader className="h-full w-full">
        <Swirl colorA="#eef6fc" colorB="#cfe6f7" detail={1.7}>
          <ChromaFlow
            baseColor="#ffffff"
            downColor="#1E7FC2"
            leftColor="#1E7FC2"
            rightColor="#1E7FC2"
            upColor="#1E7FC2"
            momentum={13}
            radius={3.5}
          >
            <FlutedGlass
              aberration={0.61}
              angle={31}
              frequency={8}
              highlight={0.12}
              highlightSoftness={0}
              lightAngle={-90}
              refraction={4}
              shape="rounded"
              softness={1}
              speed={0.15}
            >
              <FilmGrain strength={0.05} />
            </FlutedGlass>
          </ChromaFlow>
        </Swirl>
      </Shader>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

/** Catalog categories listed in the nav's "Інша продукція" dropdown — the
 *  flagship USC ball valves and the PROTE partner line get their own
 *  top-level nav links instead (see NAV_ITEMS below). */
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

const CATEGORY_JUMP_EVENT = 'usc:select-category'

/** Nav links that point at a catalog category dispatch this instead of a
 *  plain anchor jump — ProductShop listens and switches its active category. */
function jumpToCategory(id: string) {
  window.dispatchEvent(new CustomEvent(CATEGORY_JUMP_EVENT, { detail: id }))
  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

type NavItem =
  | { kind: 'anchor'; label: string; href: string }
  | { kind: 'category'; label: string; categoryId: string }
  | { kind: 'group'; label: string; categoryIds: string[] }

const NAV_ITEMS: NavItem[] = [
  { kind: 'anchor', label: 'Головна', href: '#top' },
  { kind: 'category', label: 'USC Крани', categoryId: 'ball-valves' },
  { kind: 'anchor', label: 'Prote', href: '#prote' },
  { kind: 'group', label: 'Інша продукція', categoryIds: OTHER_CATALOG_IDS },
  { kind: 'anchor', label: 'Партнерам та дилерам', href: '#dealers' },
  { kind: 'anchor', label: 'Сертифікати', href: '#certificates' },
  { kind: 'anchor', label: 'Контакти', href: '#contact-details' },
]

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
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  const time = useKyivTime()
  return (
    <div className="relative z-[60] mx-auto w-full max-w-[1440px] px-3 pt-3 sm:px-6 sm:pt-6">
      <nav className="flex items-center justify-between rounded-full bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-3">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <img
            src={uscLogo}
            alt="USC — Ukrainian Santechnical Company"
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.kind === 'group' ? (
                  <NavGroupDropdown label={item.label} categoryIds={item.categoryIds} />
                ) : (
                  <a
                    href={item.kind === 'category' ? '#catalog' : item.href}
                    onClick={(e) => {
                      if (item.kind === 'category') {
                        e.preventDefault()
                        jumpToCategory(item.categoryId)
                      }
                    }}
                    className="whitespace-nowrap text-[14px] text-gray-900 transition-colors hover:text-[#1E7FC2]"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right (desktop) */}
        <div className="hidden items-center gap-5 lg:flex">
          <span className="hidden text-[13px] text-gray-600 lg:inline">
            Лише краще обладнання
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-gray-600">
            <Clock size={14} />
            {time} Київ
          </span>
          <a
            href="#"
            className="group flex items-center gap-3 rounded-full bg-[#4A4D52] py-2 pl-5 pr-2 text-[13px] font-medium text-white"
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

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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

              const href = item.kind === 'category' ? '#catalog' : item.href
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
              href="#catalog"
              onClick={onClose}
              className="group flex flex-1 items-center justify-between rounded-full bg-[#F5B915] py-3 pl-5 pr-2.5 text-[15px] font-medium text-gray-900 transition-transform active:scale-[0.98]"
            >
              Перейти до каталогу
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
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

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <section id="top" className="relative flex min-h-screen flex-col bg-[#EFEFEF]">
      <ShaderBoundary>
        <HeroShaders />
      </ShaderBoundary>
      <Nav menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Brand mark centred in the open space, blended into the background */}
      <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="usc-hero-mark animate-mark-in w-[52%] max-w-[285px] sm:w-[33%] sm:max-w-[345px]">
          <img
            src={uscLogoMark}
            alt="USC — Ukrainian Santechnical Company"
            className="w-full object-contain"
          />
          <span className="usc-flame-glow" aria-hidden="true" />
        </div>
      </div>

      {/* Content pinned to bottom */}
      <div className="relative z-20 w-full">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <p
            className="animate-hero-in mb-5 text-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px]"
            style={{ animationDelay: '120ms' }}
          >
            USC — Ukrainian Santechnical Company
          </p>
          <h1
            className="animate-hero-in font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)]"
            style={{ animationDelay: '240ms' }}
          >
            Сталева кульова арматура <br className="hidden sm:block" />
            для опалення, газу <br className="hidden sm:block" />
            та спеціальних застосувань.
          </h1>

          <div
            className="animate-hero-in mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5"
            style={{ animationDelay: '420ms' }}
          >
            <a
              href="#catalog"
              className="group inline-flex items-center gap-3 self-start rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:pl-6 sm:text-[14px]"
            >
              <TextRoll>Перейти до каталогу</TextRoll>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45 sm:h-8 sm:w-8">
                <ArrowRight size={16} className="text-gray-900" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — About                                                   */
/* ------------------------------------------------------------------ */

function BadgeRow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E7FC2] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(30,127,194,0.35)]">
        {num}
      </span>
      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 sm:text-[12px] sm:tracking-[0.16em]">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  )
}

const VALUE_PILLARS = [
  {
    title: 'Український характер',
    text: 'Працьовитість, відповідальність і витримка — здатність працювати та розвиватися навіть у найскладніших умовах. Саме ці риси стали частиною ДНК USC.',
  },
  {
    title: 'Європейська інженерна культура',
    text: 'Ми надихаємося технологічною спадщиною провідних виробників галузі. Їхній підхід до якості, безпеки, енергоефективності та довговічності — орієнтир для розвитку бренду.',
  },
]

function About() {
  const CtaButton = (
    <a
      href="#catalog"
      className="group inline-flex items-center gap-3 self-start rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:pl-6 sm:text-[14px]"
    >
      <TextRoll>Дивитися продукцію</TextRoll>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45 sm:h-8 sm:w-8">
        <ArrowRight size={16} className="text-gray-900" />
      </span>
    </a>
  )

  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32">
      {/* Soft depth wash — decorative only, keeps the white section from reading flat */}
      <div
        className="pointer-events-none absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#1E7FC2]/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="1" label="Про компанію USC" />
        </div>
        <Reveal>
          <h2 className="mb-10 max-w-[22ch] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-14 lg:mb-16">
            Український бренд трубопровідних <br className="hidden sm:block" />
            систем та запірної арматури.
          </h2>
        </Reveal>

        {/* Lead narrative + imagery */}
        <Reveal delay={80} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_46%] lg:gap-12">
          <div className="max-w-[62ch]">
            <p className="mb-5 text-[16px] font-medium leading-[1.6] text-gray-900 sm:text-[18px]">
              Історія USC починається з переконання, що сучасна Україна заслуговує
              на власний сильний інженерний бренд у сфері трубопровідних систем та
              запірної арматури.
            </p>
            <p className="mb-5 text-[15px] leading-[1.7] text-gray-600 sm:text-[16px]">
              Назва <span className="font-medium text-gray-900">Ukrainian Santechnical
              Company</span> відображає нашу філософію з перших літер — українська
              компанія, створена для забезпечення надійності систем, від яких залежить
              щоденне життя міст, підприємств та цілої країни.
            </p>
            <p className="mb-8 text-[15px] leading-[1.7] text-gray-600 sm:text-[16px]">
              Для нас запірна арматура — це не просто продукт, а елемент складної
              системи, який має працювати безвідмовно десятки років. Тому кожне рішення
              USC створюється відповідно до міжнародних стандартів якості — від
              інженерної ідеї до готового продукту.
            </p>
            <div className="mb-10">{CtaButton}</div>

            {/* Value pillars */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {VALUE_PILLARS.map((p) => (
                <div key={p.title} className="border-t border-gray-200 pt-5">
                  <h3 className="mb-2 text-[15px] font-semibold text-gray-900 sm:text-[16px]">
                    {p.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-gray-600 sm:text-[15px]">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Imagery */}
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <div className="group aspect-[438/346] w-full overflow-hidden rounded-2xl sm:w-1/2 lg:w-full">
              <img
                src={zavodBalls}
                alt="Сталеві кулі для запірної арматури TM USC"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="group aspect-[900/600] w-full overflow-hidden rounded-2xl sm:w-1/2 lg:w-full">
              <img
                src={zavodProte}
                alt="Обладнання PROTE"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        {/* Closing tagline */}
        <Reveal delay={120}>
          <p className="mt-12 border-t border-gray-200 pt-8 text-[16px] font-medium leading-[1.5] text-gray-900 sm:mt-16 sm:text-[20px] lg:text-[24px]">
            Український характер. Європейська інженерія.{' '}
            <span className="text-[#1E7FC2]">Надійність, що працює поколіннями.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Catalog                                                 */
/* ------------------------------------------------------------------ */

/** PROTE partner line — USC is the exclusive representative in Ukraine.
 *  Source: PROTE presentations (USC-Prote-вода, PROTE-POS_EN333, PROTEP). */
const PROTE_TECHNOLOGIES = [
  {
    name: 'PROTE-QUEST',
    tag: 'Кондиціювання води',
    desc: 'Усунення осадів і корозійних відкладень у водопровідних мережах та захист від вторинного забруднення питної води.',
  },
  {
    name: 'PROTE-POS',
    tag: 'Переробка осаду',
    desc: 'Перетворення осаду стічних вод на мінерально-органічне добриво з адаптивним складом (азот, фосфор, калій).',
  },
  {
    name: 'PROTE-MOS',
    tag: 'Мінімізація осаду',
    desc: 'Технологія мінімізації та модифікації кількості осаду на очисних спорудах.',
  },
  {
    name: 'PROTE-FOS',
    tag: 'Рекультивація озер',
    desc: 'Комплексні дослідження та відновлення (рекультивація) озер і водойм.',
  },
  {
    name: 'SYMBIO',
    tag: 'Біомоніторинг',
    desc: 'Система біомоніторингу якості води для безперервного контролю стану водного середовища.',
  },
  {
    name: 'TIB',
    tag: 'Екологічна ремедіація',
    desc: 'Оцінка стану та ремедіація ґрунтового й водного середовища, зокрема від нафтопродуктів.',
  },
]

const PROTE_STATS = [
  { value: '120', label: 'підприємств водопостачання' },
  { value: '20 000 км', label: 'водопровідних мереж' },
  { value: '3 000 т/рік', label: 'осаду на один модуль' },
  { value: 'з 1995', label: 'років досвіду PROTE' },
]

function Catalog() {
  return (
    <section id="catalog" className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="2" label="Каталог продукції" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:mb-16 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
            Наш асортимент
          </h2>
        </Reveal>

        {/* Full assortment — single unified list (no prices) */}
        <Reveal delay={80} id="full-catalog" className="scroll-mt-24">
          <div className="mb-8">
            <p className="max-w-[68ch] text-[15px] leading-[1.7] text-gray-600 sm:text-[16px]">
              Повний асортимент трубопровідної та запірної арматури, газового й
              монтажного обладнання — від кульових кранів власного виробництва TM USC
              до засувок, фланців, люків, хомутів і трубних деталей.{' '}
              <span className="font-medium text-gray-900">
                Понад 185 позицій у {PRODUCT_CATEGORIES.length} категоріях.
              </span>{' '}
              Оберіть категорію та товар, щоб побачити доступні типорозміри. Актуальні
              ціни — за запитом.
            </p>
          </div>

          <ProductShop />
        </Reveal>

        {/* PROTE — partner line, kept as a separate highlight */}
        <div id="prote" className="mt-14 scroll-mt-24 sm:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Партнерська лінійка
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>
          <Reveal as="article" className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            {/* Partner cover — PROTE brand visual */}
            <div className="relative">
              <div className="h-[150px] w-full overflow-hidden sm:h-[210px] lg:h-[240px]">
                <img
                  src={proteForest}
                  alt="PROTE — технології для захисту довкілля"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              {/* USC mark × PROTE wordmark meeting on the cover edge */}
              <div className="absolute -bottom-8 left-5 flex items-end gap-3 sm:-bottom-9 sm:left-8 sm:gap-4">
                <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:h-[92px] sm:w-[92px]">
                  <img
                    src={proteLogo}
                    alt="USC — Ukrainian Santechnical Company"
                    className="h-[60px] w-[60px] object-contain sm:h-[74px] sm:w-[74px]"
                  />
                </span>
                <img
                  src={proteWordmark}
                  alt="PROTE"
                  className="h-[24px] w-auto object-contain sm:h-[30px]"
                />
              </div>
            </div>

            <div className="px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16 lg:px-10 lg:pb-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1E7FC2]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1E7FC2] sm:text-[11px]">
                <ShieldCheck size={13} className="shrink-0" />
                Ексклюзивний представник в Україні
              </span>
              <p className="mt-4 max-w-[70ch] text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
                Ми — USC, ексклюзивний партнер{' '}
                <span className="font-medium text-gray-900">
                  PROTE Technologies for our Environment LLC
                </span>{' '}
                (Польща) в Україні. Понад 30 років PROTE розробляє технології, які
                повертають воді чистоту, а осаду — цінність. Ми приводимо ці рішення
                на українські водоканали, комунальні та промислові об’єкти: від
                обстеження до запуску під ключ.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-8 sm:grid-cols-4">
                {PROTE_STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="text-[20px] font-semibold leading-none text-gray-900 sm:text-[24px]">
                      {s.value}
                    </dt>
                    <dd className="mt-1.5 text-[11px] leading-[1.4] text-gray-500 sm:text-[12px]">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={80} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROTE_TECHNOLOGIES.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(30,127,194,0.14)] sm:p-6"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1E7FC2]">
                  {t.tag}
                </span>
                <h4 className="mt-2 text-[16px] font-semibold text-gray-900 sm:text-[17px]">
                  {t.name}
                </h4>
                <p className="mt-2 text-[13px] leading-[1.65] text-gray-600 sm:text-[14px]">
                  {t.desc}
                </p>
              </article>
            ))}
          </Reveal>

          <p className="mt-5 flex items-start gap-2 text-[12px] leading-[1.6] text-gray-500 sm:text-[13px]">
            <Award size={15} className="mt-0.5 shrink-0 text-[#F5B915]" />
            <span>
              Відзнаки технологій PROTE: золоті медалі MTP POL-ECO (TIB — 2007,
              SYMBIO — 2008, PROTE-FOS — 2011, PROTE-QUEST — 2013), золота медаль
              TIWS, медаль EXPO SILESIA та нагорода GreenEvo.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

type SelectedProduct = { cat: ProductCategory; item: string }
type SelectedType = { cat: ProductCategory; type: ProductType }
type SelectedGroup = { cat: ProductCategory; group: ProductGroup }

/** Number of clickable product cards shown for a category. */
const catCount = (c: ProductCategory) =>
  c.types ? c.types.length : getGroups(c)?.length ?? c.items?.length ?? 0
const typeSizeCount = (t: ProductType) => t.variants.reduce((n, v) => n + v.sizes.length, 0)

/** Ukrainian plural form: 1 позиція / 2–4 позиції / 5+ позицій. */
const plural = (n: number, one: string, few: string, many: string) => {
  const d = n % 10
  const dd = n % 100
  if (d === 1 && dd !== 11) return one
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return few
  return many
}

/* Shop-style catalogue: category rail + clickable product-card grid */
/** Mobile category picker — bottom sheet matching the main menu. */
function CategorySheet({
  activeId,
  onPick,
  onClose,
}: {
  activeId: string
  onPick: (id: string) => void
  onClose: () => void
}) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    /* Bring the current category into view on short screens */
    activeRef.current?.scrollIntoView({ block: 'nearest' })
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Оберіть категорію"
    >
      <div
        className="animate-menu-fade absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div className="animate-slide-up absolute inset-x-0 bottom-0 mx-2 mb-2 flex max-h-[78vh] flex-col overflow-hidden rounded-[26px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.22)]">
        <div className="flex justify-center pb-1 pt-3">
          <span className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 pb-2 pt-1">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Оберіть категорію
          </h4>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          >
            <X size={17} />
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
          {PRODUCT_CATEGORIES.map((c) => {
            const isActive = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  ref={isActive ? activeRef : undefined}
                  onClick={() => onPick(c.id)}
                  aria-current={isActive}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left transition-colors ${
                    isActive ? 'bg-[#1E7FC2] text-white' : 'text-gray-700 active:bg-gray-50'
                  }`}
                >
                  <span className="flex w-4 shrink-0 justify-center">
                    {isActive && <Check size={15} />}
                  </span>
                  <span
                    className={`min-w-0 flex-1 text-[14.5px] leading-[1.3] ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {c.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1E7FC2]/10 text-[#1E7FC2]'
                    }`}
                  >
                    {catCount(c)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function ProductShop() {
  const [activeId, setActiveId] = useState(PRODUCT_CATEGORIES[0].id)
  const [item, setItem] = useState<SelectedProduct | null>(null)
  const [openType, setOpenType] = useState<SelectedType | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<SelectedGroup | null>(null)
  const active = PRODUCT_CATEGORIES.find((c) => c.id === activeId) ?? PRODUCT_CATEGORIES[0]
  const groups = getGroups(active)

  /* Nav links (desktop dropdown + mobile sheet) dispatch this to jump straight
   * to a category instead of just scrolling to the top of the catalog. */
  useEffect(() => {
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (PRODUCT_CATEGORIES.some((c) => c.id === id)) setActiveId(id)
    }
    window.addEventListener(CATEGORY_JUMP_EVENT, onJump)
    return () => window.removeEventListener(CATEGORY_JUMP_EVENT, onJump)
  }, [])

  return (
    <div className="lg:grid lg:grid-cols-[248px_1fr] lg:gap-8">
      {/* Category navigation — horizontal chips on mobile, sidebar on desktop */}
      <aside className="mb-6 lg:mb-0">
        {/* Mobile: one row that opens a full category sheet */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.99] lg:hidden"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] leading-none text-gray-400">Категорія</span>
            <span className="mt-1 block truncate text-[15px] font-semibold text-gray-900">
              {active.name}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#1E7FC2]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1E7FC2]">
            {catCount(active)}
          </span>
          <ChevronDown size={16} className="shrink-0 text-gray-400" />
        </button>

        <ul className="hidden overflow-hidden rounded-2xl bg-white p-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)] lg:block">
          {PRODUCT_CATEGORIES.map((c) => {
            const isActive = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  aria-current={isActive}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] leading-[1.3] transition-colors ${
                    isActive
                      ? 'bg-[#1E7FC2] font-medium text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="min-w-0">{c.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1E7FC2]/10 text-[#1E7FC2]'
                    }`}
                  >
                    {catCount(c)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Product grid for the active category */}
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-gray-900 sm:text-[19px]">{active.name}</h3>
          <span className="shrink-0 text-[13px] text-gray-500">
            {active.types
              ? `${active.types.length} типів приєднання`
              : groups
                ? `${groups.length} ${plural(groups.length, 'позиція', 'позиції', 'позицій')} · ${groups.reduce((n, g) => n + g.rows.length, 0)} типорозмірів`
                : `${active.items?.length ?? 0} позицій`}
          </span>
        </div>

        {active.types ? (
          /* Connection-type cards: one per type, opens the size list */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {active.types.map((t) => {
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setOpenType({ cat: active, type: t })}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                >
                  <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-3 sm:p-4">
                    <span className="text-[13px] font-semibold leading-[1.35] text-gray-900 sm:text-[14px]">
                      {t.name}
                    </span>
                    <span className="mt-1 text-[12px] text-gray-500">
                      {typeSizeCount(t)} типорозмірів
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                      Дивитись розміри
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : groups ? (
          /* Grouped cards: near-identical price-list rows folded into one product */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setOpenGroup({ cat: active, group: g })}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                  {g.image ? (
                    <img
                      src={g.image}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
                  )}
                </span>
                <span className="flex flex-1 flex-col p-3 sm:p-4">
                  <span className="text-[13px] font-semibold leading-[1.35] text-gray-900 sm:text-[14px]">
                    {g.name}
                  </span>
                  <span className="mt-1 text-[12px] text-gray-500">
                    {g.rows.length}{' '}
                    {plural(g.rows.length, 'типорозмір', 'типорозміри', 'типорозмірів')}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                    Дивитись розміри
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {(active.items ?? []).map((it, i) => {
              const key = `${active.id}-${i}`
              const itImg = active.itemImages?.[it] ?? active.image
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setItem({ cat: active, item: it })}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                >
                  <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                    {itImg ? (
                      <img
                        src={itImg}
                        alt={it}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-3 sm:p-4">
                    <span className="line-clamp-3 text-[12.5px] font-medium leading-[1.4] text-gray-800 sm:text-[13px]">
                      {it}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                      Детальніше
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {active.note && (
          <p className="mt-5 flex items-start gap-2 text-[12.5px] leading-[1.5] text-gray-500">
            <Gauge size={14} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
            {active.note}
          </p>
        )}
      </div>

      {pickerOpen && (
        <CategorySheet
          activeId={activeId}
          onPick={(id) => {
            setActiveId(id)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
      {item && <ProductModal product={item} onClose={() => setItem(null)} />}
      {openGroup && (
        <GroupModal
          cat={openGroup.cat}
          group={openGroup.group}
          onClose={() => setOpenGroup(null)}
        />
      )}
      {openType && (
        <TypeModal cat={openType.cat} type={openType.type} onClose={() => setOpenType(null)} />
      )}
    </div>
  )
}

/* Product detail dialog — opened by clicking a product card */
function ProductModal({
  product,
  onClose,
}: {
  product: SelectedProduct
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={product.item}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          {(() => {
            const img = product.cat.itemImages?.[product.item] ?? product.cat.image
            return img ? (
              <img
                src={img}
                alt={product.item}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <ValveMark className="h-16 w-16 fill-current text-[#1E7FC2]/25" />
            )
          })()}
        </div>
        <div className="p-5 sm:p-6">
          <span className="text-[12px] font-medium text-[#1E7FC2]">{product.cat.name}</span>
          <h4 className="mt-1 text-[16px] font-semibold leading-[1.35] text-gray-900 sm:text-[17px]">
            {product.item}
          </h4>
          {product.cat.note && (
            <p className="mt-3 text-[13px] leading-[1.6] text-gray-500">{product.cat.note}</p>
          )}
          <a
            href="#contacts"
            onClick={onClose}
            className="group mt-5 inline-flex items-center gap-3 rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:text-[14px]"
          >
            <TextRoll>Залишити запит</TextRoll>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={15} className="text-gray-900" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* Grouped-product dialog — photo, description and the parsed size table */
function GroupModal({
  cat,
  group,
  onClose,
}: {
  cat: ProductCategory
  group: ProductGroup
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={group.name}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header — photo + description */}
        <div className="border-b border-gray-100 p-5 pr-14 sm:flex sm:gap-5 sm:p-6 sm:pr-16">
          <div className="mb-4 flex h-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 p-3 sm:mb-0 sm:h-32 sm:w-32">
            {group.image ? (
              <img
                src={group.image}
                alt={group.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <ValveMark className="h-12 w-12 fill-current text-[#1E7FC2]/25" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-[#1E7FC2]">{cat.name}</span>
            <h4 className="mt-1 text-[17px] font-semibold leading-[1.3] text-gray-900 sm:text-[19px]">
              {group.name}
            </h4>
            {group.blurb && (
              <p className="mt-2 text-[13px] leading-[1.6] text-gray-500">{group.blurb}</p>
            )}
          </div>
        </div>

        {/* Scrollable size table */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gray-800">Доступні типорозміри</span>
            <span className="text-[12px] text-gray-400">{group.rows.length} шт.</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  {group.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-gray-100">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-3 py-1.5 ${
                          ci === 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                        } ${cell.length <= 12 ? 'whitespace-nowrap' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cat.note && (
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.5] text-gray-500">
              <Gauge size={14} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
              {cat.note}
            </p>
          )}

          <a
            href="#contacts"
            onClick={onClose}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:text-[14px]"
          >
            <TextRoll>Залишити запит</TextRoll>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={15} className="text-gray-900" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* Connection-type dialog — lists every available size for the chosen type */
function TypeModal({
  cat,
  type,
  onClose,
}: {
  cat: ProductCategory
  type: ProductType
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={type.name}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header — description */}
        <div className="border-b border-gray-100 p-5 pr-14 sm:p-6 sm:pr-16">
          <span className="text-[12px] font-medium text-[#1E7FC2]">{cat.name}</span>
          <h4 className="mt-1 text-[17px] font-semibold leading-[1.3] text-gray-900 sm:text-[19px]">
            {type.name}
          </h4>
          {type.blurb && (
            <p className="mt-2 text-[13px] leading-[1.6] text-gray-500">{type.blurb}</p>
          )}
        </div>

        {/* Scrollable size tables (grouped by bore variant) */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {type.variants.map((v, vi) => (
            <div key={vi} className={vi > 0 ? 'mt-6' : ''}>
              {v.label && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-gray-800">{v.label}</span>
                  <span className="text-[12px] text-gray-400">{v.sizes.length} шт.</span>
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full border-collapse text-left text-[12.5px]">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-2 font-medium">DN</th>
                      <th className="px-3 py-2 font-medium">PN</th>
                      <th className="px-3 py-2 font-medium">Артикул</th>
                    </tr>
                  </thead>
                  <tbody>
                    {v.sizes.map((s, si) => {
                      const reductor = !!s.code && s.code.includes('.302')
                      return (
                        <tr key={si} className="border-t border-gray-100">
                          <td className="whitespace-nowrap px-3 py-1.5 font-medium text-gray-900">
                            DN{s.dn}
                          </td>
                          <td className="whitespace-nowrap px-3 py-1.5 text-gray-600">PN{s.pn}</td>
                          <td className="px-3 py-1.5">
                            <span className="font-mono text-[11.5px] text-gray-700">{s.code}</span>
                            {reductor && (
                              <span className="ml-2 whitespace-nowrap rounded bg-[#F5B915]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#8a6d0b]">
                                редуктор
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <a
            href="#contacts"
            onClick={onClose}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:text-[14px]"
          >
            <TextRoll>Залишити запит</TextRoll>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={15} className="text-gray-900" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — Dealers & Partners                                       */
/* ------------------------------------------------------------------ */

const DEALER_BENEFITS = [
  {
    title: 'Дилерські ціни',
    desc: 'Спеціальні умови та гнучка знижкова політика для партнерів.',
  },
  {
    title: 'Продукція зі складу',
    desc: 'Наявність ходових типорозмірів TM USC та обладнання PROTE.',
  },
  {
    title: 'Технічна підтримка',
    desc: 'Допомога з підбором арматури, кресленнями та документацією.',
  },
]

/** Minimal, on-page notice about how the dealer form's personal data is
 *  processed — makes the checkbox consent an *informed* consent per the Law
 *  of Ukraine "Про захист персональних даних" (№ 2297-VI, ст. 8, 12). This is
 *  intentionally short: a lead form, not a full privacy-policy document. */
function PrivacyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Обробка персональних даних"
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pr-14 sm:p-8 sm:pr-16">
          <h4 className="text-[17px] font-semibold text-gray-900 sm:text-[19px]">
            Обробка персональних даних
          </h4>
          <div className="mt-4 space-y-3 text-[13.5px] leading-[1.7] text-gray-600">
            <p>
              Заповнюючи цю форму, ви передаєте{' '}
              <span className="font-medium text-gray-900">ТОВ «ЮСК.ПРО»</span> (ЄДРПОУ
              46315118, 03151, м. Київ, вул. Волинська, 48/50, офіс 516) свої
              персональні дані: ім’я, назву компанії, email та номер телефону.
            </p>
            <p>
              Дані використовуються виключно для розгляду вашої заявки на
              партнерство чи дилерство та зворотного зв’язку з вами. Ми не передаємо
              їх третім особам, окрім сервісів, що технічно забезпечують доставку
              заявки до нашого відділу продажів.
            </p>
            <p>
              Обробка здійснюється на підставі вашої згоди відповідно до Закону
              України «Про захист персональних даних» № 2297-VI. Ви маєте право
              будь-коли відкликати згоду, а також отримати, виправити чи вимагати
              видалення своїх даних — для цього напишіть на{' '}
              <a href={`mailto:${EMAIL}`} className="font-medium text-[#1E7FC2] hover:underline">
                {EMAIL}
              </a>{' '}
              або зателефонуйте на{' '}
              <a
                href={`tel:${PHONE_PRIMARY}`}
                className="font-medium text-[#1E7FC2] hover:underline"
              >
                {formatPhone(PHONE_PRIMARY)}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DealersSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  /** Consent to process personal data (Law of Ukraine "Про захист персональних
   *  даних" № 2297-VI) — required before the form may be submitted. */
  const [consent, setConsent] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    try {
      // Deliver the lead to the CRM / form backend. The destination is set via
      // VITE_FORM_ENDPOINT (see .env.example), so the CRM can be swapped without
      // code changes. While the endpoint is empty we succeed optimistically.
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...form,
            source: 'USC landing — dealer application',
            submittedAt: new Date().toISOString(),
          }),
        })
        if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
      } else if (import.meta.env.DEV) {
        console.warn('VITE_FORM_ENDPOINT is not set — the application was not delivered.')
      }
      setStatus('success')
    } catch (err) {
      console.error('Dealer form submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <section id="dealers" className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="3" label="Партнерам та дилерам" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
            Станьте офіційним <br className="hidden sm:block" />
            дилером USC.
          </h2>
        </Reveal>

        <Reveal delay={80} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Benefits */}
          <div>
            <p className="mb-8 max-w-md text-[15px] font-medium leading-[1.6] text-gray-800 sm:text-[17px]">
              Запрошуємо до співпраці монтажні організації, дистриб’юторів та
              роздрібні мережі. Заповніть форму — ми опрацюємо заявку й
              повернемось із відповіддю.
            </p>
            <ul className="space-y-5">
              {DEALER_BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">{b.title}</p>
                    <p className="text-[13px] text-gray-600">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-[#F5F5F5] p-6 sm:p-8">
            {status === 'success' ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                <CheckCircle2 size={48} className="mb-4 text-[#1E7FC2]" />
                <p className="text-[18px] font-semibold text-gray-900">Заявку надіслано!</p>
                <p className="mt-2 max-w-xs text-[14px] text-gray-600">
                  Дякуємо. Ми зв’яжемось із вами найближчим часом за вказаними
                  контактами.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    disabled={status === 'sending'}
                    placeholder="Ім’я / контактна особа"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                  <input
                    required
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={update('company')}
                    disabled={status === 'sending'}
                    placeholder="Компанія (ФОП / ТОВ)"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    disabled={status === 'sending'}
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={status === 'sending'}
                    placeholder="Телефон"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-gray-600">
                  <input
                    required
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={status === 'sending'}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#1E7FC2] focus:ring-[#1E7FC2] disabled:opacity-60"
                  />
                  <span>
                    Я даю згоду на обробку моїх персональних даних відповідно до
                    Закону України «Про захист персональних даних».{' '}
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(true)}
                      className="font-medium text-[#1E7FC2] underline underline-offset-2 hover:text-[#175f92]"
                    >
                      Детальніше
                    </button>
                  </span>
                </label>

                {status === 'error' && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">
                    Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте
                    нам за вказаними контактами.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending' || !consent}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#4A4D52] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#3a3d42] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight size={15} className="text-[#4A4D52]" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-gray-400">
                  Менеджер USC зв’яжеться з вами для оформлення договору.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — Certificates & Contacts                                  */
/* ------------------------------------------------------------------ */

const CERTIFICATES = [
  { icon: Award, title: 'ISO 9001:2015', desc: 'Система управління якістю' },
  { icon: ShieldCheck, title: 'Сертифікати відповідності', desc: 'На продукцію TM USC' },
  { icon: FileText, title: 'Технічні паспорти', desc: 'Для кожного типорозміру' },
]

function ContactsSection() {
  return (
    <section
      id="contacts"
      className="relative overflow-hidden bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28"
    >
      {/* Soft depth wash — decorative only */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#1E7FC2]/[0.05] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="4" label="Сертифікати та контакти" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
            Якість, підтверджена <br className="hidden sm:block" />
            документально.
          </h2>
        </Reveal>

        {/* Certificates */}
        <Reveal
          delay={80}
          id="certificates"
          className="mb-14 scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
        >
          {CERTIFICATES.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E7FC2]/10 text-[#1E7FC2]">
                  <Icon size={24} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">{c.title}</p>
                  <p className="mt-1 text-[13px] text-gray-600">{c.desc}</p>
                </div>
              </div>
            )
          })}
        </Reveal>

        {/* Contacts */}
        <Reveal
          delay={140}
          id="contact-details"
          className="scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6"
        >
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
            <Phone size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Телефон</span>
            <a
              href={`tel:${PHONE_PRIMARY}`}
              className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
            >
              {formatPhone(PHONE_PRIMARY)}
            </a>
          </div>
          <a
            href={`mailto:${EMAIL}`}
            className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <Mail size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Email</span>
            <span className="text-[15px] font-semibold text-gray-900">{EMAIL}</span>
          </a>
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
            <MapPin size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Адреса</span>
            <span className="text-[15px] font-semibold text-gray-900">
              03151, м. Київ, вул. Волинська, 48/50, офіс 516
            </span>
          </div>
          {FACEBOOK_URL && (
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
            >
              <Facebook size={22} className="text-[#1E7FC2]" />
              <span className="text-[13px] text-gray-500">Соцмережі</span>
              <span className="text-[15px] font-semibold text-gray-900">Facebook</span>
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

/** Quick-nav links repeated in the footer — same anchors as the main nav's
 *  plain (non-catalog-jump) items, so both stay in sync by hand when the
 *  page structure changes. */
const FOOTER_LINKS = [
  { label: 'Про компанію', href: '#top' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Prote', href: '#prote' },
  { label: 'Партнерам та дилерам', href: '#dealers' },
  { label: 'Сертифікати', href: '#certificates' },
  { label: 'Контакти', href: '#contact-details' },
]

function Footer() {
  return (
    <footer className="relative bg-[#4A4D52] pb-8 pt-14 text-white sm:pt-16">
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1E7FC2] via-[#F5B915] to-[#1E7FC2]"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src={uscLogo} alt="USC" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-[15px] font-semibold text-white">
                USC — Ukrainian Santechnical Company
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-[1.65] text-gray-300">
              Український бренд трубопровідних систем та запірної арматури.
              Ексклюзивний представник PROTE в Україні.
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Навігація
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13.5px] text-gray-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Контакти
            </p>
            <ul className="space-y-2.5 text-[13.5px] text-gray-300">
              <li>
                <a
                  href={`tel:${PHONE_PRIMARY}`}
                  className="transition-colors hover:text-white"
                >
                  {formatPhone(PHONE_PRIMARY)}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li className="leading-[1.5]">03151, м. Київ, вул. Волинська, 48/50</li>
            </ul>
            {(FACEBOOK_URL || INSTAGRAM_URL) && (
              <div className="mt-5 flex items-center gap-2">
                {FACEBOOK_URL && (
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {INSTAGRAM_URL && (
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <span className="text-center text-[12px] text-gray-400 sm:text-left">
            © {new Date().getFullYear()} ТОВ «ЮСК.ПРО» (ЄДРПОУ 46315118). Усі права захищені.
          </span>
          <span className="text-[12px] text-gray-500">Лише краще обладнання</span>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

/* Fixed vertical social rail — stays in place while scrolling */
function SocialRail() {
  const items = [
    { href: `tel:${PHONE_PRIMARY}`, label: 'Зателефонувати', Icon: Phone, external: false },
    INSTAGRAM_URL && { href: INSTAGRAM_URL, label: 'Instagram', Icon: Instagram, external: true },
    FACEBOOK_URL && { href: FACEBOOK_URL, label: 'Facebook', Icon: Facebook, external: true },
  ].filter(Boolean) as {
    href: string
    label: string
    Icon: typeof Phone
    external: boolean
  }[]
  return (
    <div className="fixed right-2.5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-4 sm:gap-2.5">
      {items.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1E7FC2] shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all hover:bg-[#1E7FC2] hover:text-white sm:h-11 sm:w-11"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <main>
      <ScrollProgress />
      <SocialRail />
      <Hero />
      <About />
      <Catalog />
      <DealersSection />
      <ContactsSection />
      <Footer />
    </main>
  )
}
