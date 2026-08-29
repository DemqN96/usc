import { useState, useEffect, Component, type ReactNode } from 'react'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'
import {
  Clock,
  ArrowRight,
  Menu,
  X,
  Facebook,
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Gauge,
  ChevronDown,
  Download,
  Package,
} from 'lucide-react'

import { PRODUCT_CATEGORIES } from './products'

const FACEBOOK_URL = 'https://www.facebook.com/' // TODO: replace with the real USC page URL

import zavodBalls from './assets/zavod1.jpg'
import zavodProte from './assets/zavod.jpg'
import uscLogo from './assets/usc-logo.jpg'
import proteStation from './assets/prote-station.jpg'

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
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1E7FC2]"
          >
            <Facebook size={18} />
          </a>
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
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 text-[14px] font-medium text-gray-600"
        >
          <Facebook size={18} />
          Facebook
        </a>
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

      {/* Content pinned to bottom */}
      <div className="relative z-20 mt-auto w-full">
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

            <div className="inline-flex items-center gap-2 self-start rounded-[4px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <ValveMark className="h-5 w-5 fill-current text-[#1E7FC2] sm:h-6 sm:w-6" />
              <span className="text-[13px] font-medium text-gray-900 sm:text-[14px]">
                Власне виробництво
              </span>
              <span className="rounded bg-[#4A4D52] px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:text-[11px]">
                Сертифіковано
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — About                                                   */
/* ------------------------------------------------------------------ */

function BadgeRow({
  num,
  label,
  border,
}: {
  num: string
  label: string
  border: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4A4D52] text-[13px] font-medium text-white">
        {num}
      </span>
      <span className={`rounded-full border ${border} px-4 py-1.5 text-[13px] text-gray-700`}>
        {label}
      </span>
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
          <BadgeRow num="1" label="Про компанію USC" border="border-gray-200" />
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
          <BadgeRow num="2" label="Каталог продукції" border="border-gray-300" />
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
                Оберіть категорію, щоб розгорнути перелік типорозмірів. Актуальні ціни —
                за запитом.
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

          <ProductAccordion />
        </div>

        {/* PROTE — partner line, kept as a separate highlight */}
        <div className="mt-14 sm:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[13px] font-medium text-gray-700">
              Партнерська лінійка
            </span>
            <span className="h-px flex-1 bg-gray-300" />
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

/* Collapsible list of the full assortment, grouped by category (no prices) */
function ProductAccordion() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
      {PRODUCT_CATEGORIES.map((cat) => {
        const isOpen = !!open[cat.id]
        return (
          <div
            key={cat.id}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [cat.id]: !s[cat.id] }))}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 sm:px-6 sm:py-5"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-20 sm:w-20">
                <Package size={26} className="text-[#1E7FC2]/60" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[15px] font-semibold text-gray-900 sm:text-[16px]">
                    {cat.name}
                  </h4>
                  <span className="shrink-0 rounded-full bg-[#1E7FC2]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1E7FC2]">
                    {cat.items.length}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-[1.5] text-gray-600">{cat.blurb}</p>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4 sm:px-6">
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13px] leading-[1.5] text-gray-700"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E7FC2]" />
                      {item}
                    </li>
                  ))}
                </ul>
                {cat.note && (
                  <p className="mt-4 flex items-start gap-2 text-[12px] leading-[1.5] text-gray-500">
                    <Gauge size={14} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
                    {cat.note}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
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
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // NOTE: auto-forwarding the signed contract to corporate email
    // requires a backend endpoint — this is a front-end stub for the demo.
    setSubmitted(true)
  }

  return (
    <section id="dealers" className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="3" label="Партнерам та дилерам" border="border-gray-200" />
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
              роздрібні мережі. Заповніть форму та завантажте договір — ми
              опрацюємо заявку й повернемось із відповіддю.
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
            {submitted ? (
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
                    placeholder="Ім’я / контактна особа"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2]"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Компанія (ФОП / ТОВ)"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2]"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Телефон"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2]"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-4 text-[14px] text-gray-600 transition-colors hover:border-[#1E7FC2]">
                  <Upload size={18} className="shrink-0 text-[#1E7FC2]" />
                  <span className="truncate">
                    {fileName ? (
                      <span className="flex items-center gap-2 text-gray-900">
                        <FileText size={16} /> {fileName}
                      </span>
                    ) : (
                      'Завантажити підписаний договір (PDF, JPG)'
                    )}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                  />
                </label>

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#4A4D52] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#3a3d42]"
                >
                  Надіслати заявку
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight size={15} className="text-[#4A4D52]" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-gray-400">
                  Після погодження документ надійде на корпоративну пошту USC.
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
          <BadgeRow num="4" label="Сертифікати та контакти" border="border-gray-300" />
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
              href="tel:+380963235506"
              className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
            >
              +38 (096) 323-55-06
            </a>
            <a
              href="tel:+380504811035"
              className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
            >
              +38 (050) 481-10-35
            </a>
          </div>
          <a
            href="mailto:yskpro@ukr.net"
            className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <Mail size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Email</span>
            <span className="text-[15px] font-semibold text-gray-900">
              yskpro@ukr.net
            </span>
          </a>
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <MapPin size={22} className="text-[#1E7FC2]" />
            <span className="text-[13px] text-gray-500">Адреса</span>
            <span className="text-[15px] font-semibold text-gray-900">
              03151, м. Київ, вул. Волинська, 48/50, офіс 516
            </span>
          </div>
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

export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Catalog />
      <DealersSection />
      <ContactsSection />
      <Footer />
    </main>
  )
}
