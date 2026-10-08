import { useEffect, useState, type MouseEventHandler, type ReactNode } from 'react'
import { ChevronUp, ShieldCheck } from 'lucide-react'

import { PRODUCT_CATEGORIES } from '../products'
import { ProductShop } from './ProductShop'
import { BadgeRow, Collapse, Cta, Reveal } from '../components/ui'
import { InshiCover, KranyCover, ProteCover } from '../components/BrandCover'
import { catCount, plural } from '../lib/catalog'
import { CATEGORY_JUMP_EVENT, KRANY_URL, PROTE_URL, proteTechHref } from '../lib/paths'
import { PROTE_TECHS } from '../pages/prote/content'

/* ------------------------------------------------------------------ */
/* Section 2 — Catalog                                                 */
/* ------------------------------------------------------------------ */

/** Ball valves live on their own page (/krany/); the home catalog lists the rest. */
const OTHER_CATEGORIES = PRODUCT_CATEGORIES.filter((c) => c.id !== 'ball-valves')
const BALL_VALVE_TYPES = PRODUCT_CATEGORIES.find((c) => c.id === 'ball-valves')?.types ?? []
const OTHER_POSITIONS = OTHER_CATEGORIES.reduce((n, c) => n + catCount(c), 0)

/** Category name without its explanation: "КМЧ (кріпильно-…)" → "КМЧ". */
const shortName = (name: string) => name.split(' — ')[0].split(' (')[0]

export function Catalog() {
  return (
    <section id="catalog" className="pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="2" label="Каталог продукції" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:mb-16 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
            Наш асортимент
          </h2>
        </Reveal>

        <Reveal delay={80} className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <LineCard
            id="krany"
            cover={<KranyCover />}
            badge="Власне виробництво"
            title="Кульові крани USC"
            text="Сталеві кульові крани TM USC — фланцеві, приварні, муфтові, комбіновані та для підземного встановлення. DN15–700, PN16–PN40."
            chips={BALL_VALVE_TYPES.map((t) => ({ label: t.name, href: `${KRANY_URL}#types` }))}
            cta={{ label: 'Перейти до кранів', href: KRANY_URL }}
          />
          <LineCard
            id="prote"
            cover={<ProteCover />}
            badge="Ексклюзивний представник в Україні"
            title="Технології PROTE"
            text="Кондиціювання води, переробка осаду на добриво, рекультивація водойм і ремедіація ґрунтів — рішення PROTE Technologies for our Environment LLC (Польща)."
            chips={PROTE_TECHS.map((t) => ({ label: t.name, href: proteTechHref(t.slug) }))}
            cta={{ label: 'Перейти на сторінку PROTE', href: PROTE_URL }}
          />
          <OtherProducts />
        </Reveal>
      </div>
    </section>
  )
}

/** «Інша продукція» — a full-width card in the same style as the product
 *  lines. Its catalog (categories, items, size tables) unfolds inside the
 *  card: from the button, a category chip, the nav's category links, a
 *  `?cat=` link from another page or any `#full-catalog` link. */
function OtherProducts() {
  const [open, setOpen] = useState(() => {
    const cat = new URLSearchParams(window.location.search).get('cat')
    return OTHER_CATEGORIES.some((c) => c.id === cat) || window.location.hash === '#full-catalog'
  })

  useEffect(() => {
    const unfold = () => setOpen(true)
    const onHash = () => {
      if (window.location.hash === '#full-catalog') setOpen(true)
    }
    window.addEventListener(CATEGORY_JUMP_EVENT, unfold)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener(CATEGORY_JUMP_EVENT, unfold)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  const pick = (id: string) => {
    setOpen(true)
    window.dispatchEvent(new CustomEvent(CATEGORY_JUMP_EVENT, { detail: id }))
  }

  const fold = () => {
    setOpen(false)
    if (window.location.hash === '#full-catalog') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    document.getElementById('inshi')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <LineCard
      id="inshi"
      wide
      className="lg:col-span-2"
      cover={<InshiCover />}
      badge={`${OTHER_CATEGORIES.length} ${plural(OTHER_CATEGORIES.length, 'категорія', 'категорії', 'категорій')} · ${OTHER_POSITIONS} ${plural(OTHER_POSITIONS, 'позиція', 'позиції', 'позицій')}`}
      title="Інша продукція"
      text="Шафові газорегуляторні пункти TM USC, засувки, фланці, люки, хомути, монтажне обладнання й трубні деталі. Оберіть категорію — відкриються товари з таблицями типорозмірів. Актуальні ціни — за запитом."
      chips={OTHER_CATEGORIES.map((c) => ({
        label: shortName(c.name),
        count: catCount(c),
        href: '#full-catalog',
        onClick: () => pick(c.id),
      }))}
      cta={{ label: 'Відкрити каталог', href: '#full-catalog', onClick: () => setOpen(true), expanded: open, controls: 'full-catalog' }}
    >
      <Collapse open={open} id="full-catalog" labelledBy="inshi-title">
        <div className="border-t border-gray-100 bg-[#f5f8fb] px-4 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-10">
          <ProductShop categories={OTHER_CATEGORIES} />
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={fold}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-[#1E7FC2] hover:text-[#1E7FC2]"
            >
              Згорнути каталог
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      </Collapse>
    </LineCard>
  )
}

type LineCardLink = {
  label: string
  href: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  count?: number
}

/** A product line: cover with brand lockup, short description, quick links
 *  into the line and the main call to action; `children` render below.
 *  `wide` (a card spanning both columns) moves the links into a second
 *  column on large screens. */
function LineCard({
  id,
  cover,
  badge,
  title,
  text,
  chips,
  cta,
  wide = false,
  className = '',
  children,
}: {
  id: string
  cover: ReactNode
  badge: string
  title: string
  text: string
  chips: LineCardLink[]
  cta: LineCardLink & { expanded?: boolean; controls?: string }
  wide?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <article
      id={id}
      className={`flex scroll-mt-24 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${className}`}
    >
      {/* `group` stops here so the unfolded content doesn't zoom the cover */}
      <div className="group flex flex-1 flex-col">
        {cover}
        <div
          className={`flex flex-1 flex-col px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16 ${
            wide ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:px-10' : ''
          }`}
        >
          <div className="lg:col-start-1">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1E7FC2]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1E7FC2] sm:text-[11px]">
              <ShieldCheck size={13} className="shrink-0" />
              {badge}
            </span>
            <h3
              id={`${id}-title`}
              className="mt-4 text-[20px] font-semibold leading-tight text-gray-900 sm:text-[24px]"
            >
              {title}
            </h3>
            <p className="mt-2 max-w-[60ch] text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
              {text}
            </p>
          </div>
          <div className={wide ? 'mt-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center' : 'mt-5'}>
            {wide && (
              <p className="mb-3 hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 lg:block">
                Категорії
              </p>
            )}
            <ul className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    onClick={c.onClick}
                    className={`inline-flex items-center rounded-full border border-gray-200 font-medium text-gray-700 transition-colors hover:border-[#1E7FC2] hover:text-[#1E7FC2] ${
                      wide ? 'px-3.5 py-1.5 text-[12.5px] sm:text-[13px]' : 'px-3 py-1 text-[12px]'
                    }`}
                  >
                    {c.label}
                    {c.count != null && <span className="ml-1.5 text-[11px] text-gray-400">{c.count}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* pinned to the bottom so side-by-side cards' buttons line up */}
          <div className="mt-auto pt-7 lg:col-start-1">
            <Cta href={cta.href} onClick={cta.onClick} expanded={cta.expanded} controls={cta.controls}>
              {cta.label}
            </Cta>
          </div>
        </div>
      </div>
      {children}
    </article>
  )
}
