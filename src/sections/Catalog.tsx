import type { ReactNode } from 'react'
import { ShieldCheck } from 'lucide-react'

import { PRODUCT_CATEGORIES } from '../products'
import { ProductShop } from './ProductShop'
import { BadgeRow, Cta, Reveal } from '../components/ui'
import { KranyCover, ProteCover } from '../components/BrandCover'
import { plural } from '../lib/catalog'
import { KRANY_URL, PROTE_URL, proteTechHref } from '../lib/paths'
import { PROTE_TECHS } from '../pages/prote/content'

/* ------------------------------------------------------------------ */
/* Section 2 — Catalog                                                 */
/* ------------------------------------------------------------------ */

/** Ball valves live on their own page (/krany/); the home catalog lists the rest. */
const OTHER_CATEGORIES = PRODUCT_CATEGORIES.filter((c) => c.id !== 'ball-valves')
const BALL_VALVE_TYPES = PRODUCT_CATEGORIES.find((c) => c.id === 'ball-valves')?.types ?? []

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

        {/* Product lines with their own pages */}
        <Reveal delay={80} className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <LineCard
            id="krany"
            cover={<KranyCover />}
            badge="Власне виробництво"
            title="Кульові крани USC"
            text="Сталеві кульові крани TM USC — фланцеві, приварні, муфтові, комбіновані та для підземного встановлення. DN15–700, PN16–PN40."
            chips={BALL_VALVE_TYPES.map((t) => ({ label: t.name, href: `${KRANY_URL}#types` }))}
            cta="Перейти до кранів"
            href={KRANY_URL}
          />
          <LineCard
            id="prote"
            cover={<ProteCover />}
            badge="Ексклюзивний представник в Україні"
            title="Технології PROTE"
            text="Кондиціювання води, переробка осаду на добриво, рекультивація водойм і ремедіація ґрунтів — рішення PROTE Technologies for our Environment LLC (Польща)."
            chips={PROTE_TECHS.map((t) => ({ label: t.name, href: proteTechHref(t.slug) }))}
            cta="Перейти на сторінку PROTE"
            href={PROTE_URL}
          />
        </Reveal>

        {/* Everything else — single unified list (no prices) */}
        <div className="mt-14 sm:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Інша продукція
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>
          <Reveal delay={80} id="full-catalog" className="scroll-mt-24">
            <div className="mb-8">
              <p className="max-w-[68ch] text-[15px] leading-[1.7] text-gray-600 sm:text-[16px]">
                Шафові газорегуляторні пункти TM USC, засувки, фланці, люки, хомути,
                монтажне обладнання й трубні деталі —{' '}
                <span className="font-medium text-gray-900">
                  {OTHER_CATEGORIES.length}{' '}
                  {plural(OTHER_CATEGORIES.length, 'категорія', 'категорії', 'категорій')}.
                </span>{' '}
                Оберіть категорію та товар, щоб побачити доступні типорозміри. Актуальні
                ціни — за запитом.
              </p>
            </div>

            <ProductShop categories={OTHER_CATEGORIES} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** A product line that has its own page: cover with brand lockup, short
 *  description, quick links into the page and the main call to action. */
function LineCard({
  id,
  cover,
  badge,
  title,
  text,
  chips,
  cta,
  href,
}: {
  id: string
  cover: ReactNode
  badge: string
  title: string
  text: string
  chips: { label: string; href: string }[]
  cta: string
  href: string
}) {
  return (
    <article
      id={id}
      className="group flex scroll-mt-24 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
    >
      {cover}
      <div className="flex flex-1 flex-col px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1E7FC2]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1E7FC2] sm:text-[11px]">
          <ShieldCheck size={13} className="shrink-0" />
          {badge}
        </span>
        <h3 className="mt-4 text-[20px] font-semibold leading-tight text-gray-900 sm:text-[24px]">
          {title}
        </h3>
        <p className="mt-2 max-w-[60ch] text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
          {text}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="inline-block rounded-full border border-gray-200 px-3 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:border-[#1E7FC2] hover:text-[#1E7FC2]"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        {/* pinned to the bottom so both cards' buttons line up */}
        <div className="mt-auto pt-7">
          <Cta href={href}>{cta}</Cta>
        </div>
      </div>
    </article>
  )
}
