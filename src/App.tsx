import { useState, useEffect, Component, type ReactNode } from 'react'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'
import {
  Clock,
  ArrowRight,
  Menu,
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
  Download,
} from 'lucide-react'

import { PRODUCT_CATEGORIES, type ProductCategory, type ProductType } from './products'

import {
  PHONE_PRIMARY,
  PHONE_SECONDARY,
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  FORM_ENDPOINT,
  formatPhone,
} from './siteConfig'

import zavodBalls from './assets/zavod1.jpg'
import zavodProte from './assets/zavod.jpg'
import uscLogo from './assets/usc-logo.jpg'
import proteStation from './assets/prote-station.jpg'
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

const NAV_LINKS = [
  { label: 'Головна', href: '#top' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Партнерам та дилерам', href: '#dealers' },
  { label: 'Сертифікати та контакти', href: '#contacts' },
]

function Nav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const time = useKyivTime()
  return (
    <div className="relative z-20 mx-auto w-full max-w-[1440px] px-3 pt-3 sm:px-6 sm:pt-6">
      <nav className="flex items-center justify-between rounded-full bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-3">
        {/* Left: logo + links */}
        <div className="flex items-center gap-6">
          <img
            src={uscLogo}
            alt="USC — Ukrainian Santechnical Company"
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="whitespace-nowrap text-[14px] text-gray-900 transition-colors hover:text-[#1E7FC2]"
                >
                  {l.label}
                </a>
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
        <button
          onClick={onOpenMenu}
          aria-label="Меню"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A4D52] text-white lg:hidden"
        >
          <Menu size={18} />
        </button>
      </nav>
    </div>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const time = useKyivTime()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="animate-slide-up absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={uscLogo}
              alt="USC — Ukrainian Santechnical Company"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[13px] text-gray-600">
              <Clock size={14} />
              {time} Київ
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрити"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A4D52] text-white"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="mb-6 space-y-3">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={onClose}
                className="block text-[28px] font-medium leading-[32px] text-gray-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#catalog"
          onClick={onClose}
          className="group flex items-center justify-between rounded-full bg-[#F5B915] py-3 pl-6 pr-3 text-[15px] font-medium text-gray-900"
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
            className="mt-4 flex items-center justify-center gap-2 text-[14px] font-medium text-gray-600"
          >
            <Facebook size={18} />
            Facebook
          </a>
        )}
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
      <Nav onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Brand mark centred in the open space, blended into the background */}
      <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="usc-hero-mark w-[52%] max-w-[285px] sm:w-[33%] sm:max-w-[345px]">
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
          <p className="mb-5 text-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px]">
            USC — Ukrainian Santechnical Company
          </p>
          <h1 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)]">
            Сталева кульова арматура <br className="hidden sm:block" />
            для опалення, газу <br className="hidden sm:block" />
            та спеціальних застосувань.
          </h1>

          <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#"
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
    <section className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="1" label="Про компанію USC" />
        </div>
        <h2 className="mb-10 max-w-[22ch] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-14 lg:mb-16">
          Український бренд трубопровідних <br className="hidden sm:block" />
          систем та запірної арматури.
        </h2>

        {/* Lead narrative + imagery */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_46%] lg:gap-12">
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
            <img
              src={zavodBalls}
              alt="Сталеві кулі для запірної арматури TM USC"
              className="aspect-[438/346] w-full rounded-2xl object-cover sm:w-1/2 lg:w-full"
            />
            <img
              src={zavodProte}
              alt="Обладнання PROTE"
              className="aspect-[900/600] w-full rounded-2xl object-cover sm:w-1/2 lg:w-full"
            />
          </div>
        </div>

        {/* Closing tagline */}
        <p className="mt-12 border-t border-gray-200 pt-8 text-[16px] font-medium leading-[1.5] text-gray-900 sm:mt-16 sm:text-[20px] lg:text-[24px]">
          Український характер. Європейська інженерія.{' '}
          <span className="text-[#1E7FC2]">Надійність, що працює поколіннями.</span>
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Catalog                                                 */
/* ------------------------------------------------------------------ */

function Catalog() {
  return (
    <section id="catalog" className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="2" label="Каталог продукції" />
        </div>
        <h2 className="mb-12 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:mb-16 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
          Наш асортимент
        </h2>

        {/* Full assortment — single unified list (no prices) */}
        <div id="full-catalog" className="scroll-mt-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
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
            <a
              href="/USC-Catalog-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:pl-6 sm:text-[14px]"
            >
              <TextRoll>Завантажити каталог (PDF)</TextRoll>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:translate-y-0.5 sm:h-8 sm:w-8">
                <Download size={16} className="text-gray-900" />
              </span>
            </a>
          </div>

          <ProductShop />
        </div>

        {/* PROTE — partner line, kept as a separate highlight */}
        <div className="mt-14 sm:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Партнерська лінійка
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>
          <article className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#1E7FC2] md:aspect-auto">
              <img
                src={proteStation}
                alt="PROTE — станція водопідготовки та захисту від корозії"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <h3 className="text-[18px] font-semibold text-gray-900 sm:text-[22px]">
                PROTE
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
                Технології водопідготовки та захисту трубопроводів від корозії й
                відкладень від партнера PROTE. Рішення для промислових і комунальних
                систем водопостачання та теплопостачання.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

type SelectedProduct = { cat: ProductCategory; item: string }
type SelectedType = { cat: ProductCategory; type: ProductType }

const catCount = (c: ProductCategory) => (c.types ? c.types.length : c.items?.length ?? 0)
const typeSizeCount = (t: ProductType) => t.variants.reduce((n, v) => n + v.sizes.length, 0)

/* Shop-style catalogue: category rail + clickable product-card grid */
function ProductShop() {
  const [activeId, setActiveId] = useState(PRODUCT_CATEGORIES[0].id)
  const [item, setItem] = useState<SelectedProduct | null>(null)
  const [openType, setOpenType] = useState<SelectedType | null>(null)
  const active = PRODUCT_CATEGORIES.find((c) => c.id === activeId) ?? PRODUCT_CATEGORIES[0]

  return (
    <div className="lg:grid lg:grid-cols-[248px_1fr] lg:gap-8">
      {/* Category navigation — horizontal chips on mobile, sidebar on desktop */}
      <aside className="mb-6 lg:mb-0">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:hidden">
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                c.id === activeId
                  ? 'bg-[#1E7FC2] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

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
                    <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
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
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {(active.items ?? []).map((it, i) => {
              const key = `${active.id}-${i}`
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setItem({ cat: active, item: it })}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                >
                  <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                    <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
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

      {item && <ProductModal product={item} onClose={() => setItem(null)} />}
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          <ValveMark className="h-16 w-16 fill-current text-[#1E7FC2]/25" />
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
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

function DealersSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
          Станьте офіційним <br className="hidden sm:block" />
          дилером USC.
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
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

                {status === 'error' && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">
                    Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте
                    нам за вказаними контактами.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
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
        </div>
      </div>
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
      className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="4" label="Сертифікати та контакти" />
        </div>
        <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
          Якість, підтверджена <br className="hidden sm:block" />
          документально.
        </h2>

        {/* Certificates */}
        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {CERTIFICATES.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
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
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <Phone size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Телефон</span>
            <a
              href={`tel:${PHONE_PRIMARY}`}
              className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
            >
              {formatPhone(PHONE_PRIMARY)}
            </a>
            <a
              href={`tel:${PHONE_SECONDARY}`}
              className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
            >
              {formatPhone(PHONE_SECONDARY)}
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
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
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
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-[#4A4D52] py-8 text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <img src={uscLogo} alt="USC" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-[13px] text-gray-300">
            USC — Ukrainian Santechnical Company
          </span>
        </div>
        <span className="text-[12px] text-gray-400">
          © {new Date().getFullYear()} ТОВ «ЮСК.ПРО» (ЄДРПОУ 46315118). Усі права захищені.
        </span>
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
