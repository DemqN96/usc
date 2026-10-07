import { useState } from 'react'
import { Gauge, ShieldCheck } from 'lucide-react'

import { PageShell } from '../../components/PageShell'
import { SiteNav } from '../../components/Nav'
import { KranyCover } from '../../components/BrandCover'
import { BadgeRow, Cta, Reveal } from '../../components/ui'
import { ContactGrid } from '../../sections/Contacts'
import { TypeCards, TypeModal } from '../../sections/ProductShop'
import { PRODUCT_CATEGORIES, type ProductCategory, type ProductType } from '../../products'
import { homeHref } from '../../lib/paths'

/* The USC ball-valve page: own production TM USC — what the valves are, the
 * five connection types with their size tables, and how to order. */

const BALL_VALVES = PRODUCT_CATEGORIES.find((c) => c.id === 'ball-valves') as ProductCategory

/** Key figures — the same facts the catalog states for the category. */
const SPECS = [
  { value: 'DN15–700', label: 'умовний прохід' },
  { value: 'PN16–PN40', label: 'тиск' },
  { value: 'P235GH', label: 'сталь корпусу' },
  { value: 'AISI 304', label: 'нержавіюча куля' },
  { value: '−40…+200 °C', label: 'температура середовища' },
  { value: '30 років', label: 'ресурс' },
]

export function KranyPage() {
  const [openType, setOpenType] = useState<ProductType | null>(null)

  return (
    <PageShell page="krany">
      <div id="top">
        <SiteNav page="krany" />
      </div>

      {/* 1 — Intro */}
      <section className="pb-14 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <BadgeRow num="1" label="Власне виробництво" />
          </div>
          <Reveal>
            <h1 className="mb-10 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,6vw,3.6rem)] sm:mb-14">
              Сталеві кульові крани <br className="hidden sm:block" />
              TM{'\u00a0'}USC.
            </h1>
          </Reveal>

          <Reveal
            as="article"
            delay={80}
            className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <KranyCover />

            <div className="px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16 lg:px-10 lg:pb-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1E7FC2]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1E7FC2] sm:text-[11px]">
                <ShieldCheck size={13} className="shrink-0" />
                Власне виробництво TM USC
              </span>
              <p className="mt-4 max-w-[70ch] text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
                {BALL_VALVES.blurb}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-8 sm:grid-cols-3 lg:grid-cols-6">
                {SPECS.map((s) => (
                  <div key={s.label}>
                    <dt className="text-[18px] font-semibold leading-none text-gray-900 sm:text-[22px]">
                      {s.value}
                    </dt>
                    <dd className="mt-1.5 text-[11px] leading-[1.4] text-gray-500 sm:text-[12px]">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Cta href="#types">Дивитись типорозміри</Cta>
                <a
                  href="#contact-details"
                  className="inline-flex items-center rounded-full border border-gray-200 px-5 py-2.5 text-[13px] font-medium text-gray-800 transition-colors hover:border-[#1E7FC2] hover:text-[#1E7FC2] sm:text-[14px]"
                >
                  Залишити запит
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — Connection types */}
      <section id="types" className="scroll-mt-24 pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <BadgeRow num="2" label="Типи приєднання" />
          </div>
          <Reveal>
            <h2 className="mb-4 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)]">
              П’ять типів приєднання.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[15px] leading-[1.7] text-gray-600 sm:mb-12 sm:text-[16px]">
              Оберіть тип — відкриється таблиця типорозмірів з артикулами. Актуальні ціни —
              за запитом.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <TypeCards
              cat={BALL_VALVES}
              onOpen={setOpenType}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
            />
          </Reveal>

          {BALL_VALVES.note && (
            <p className="mt-6 flex max-w-[90ch] items-start gap-2 text-[12.5px] leading-[1.6] text-gray-500 sm:text-[13px]">
              <Gauge size={15} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
              {BALL_VALVES.note}
            </p>
          )}
        </div>
      </section>

      {/* 3 — Contacts */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <BadgeRow num="3" label="Контакти" />
          </div>
          <Reveal>
            <h2 className="mb-4 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)]">
              Замовити крани USC.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[15px] leading-[1.7] text-gray-600 sm:mb-12 sm:text-[16px]">
              Зателефонуйте або напишіть — допоможемо з підбором і надішлемо актуальні ціни.
              Монтажним організаціям і дистриб’юторам —{' '}
              <a
                href={homeHref('#dealers')}
                className="font-medium text-[#1E7FC2] underline underline-offset-2 hover:text-[#175f92]"
              >
                дилерські умови
              </a>
              .
            </p>
          </Reveal>
          <ContactGrid />
        </div>
      </section>

      {openType && (
        <TypeModal cat={BALL_VALVES} type={openType} onClose={() => setOpenType(null)} />
      )}
    </PageShell>
  )
}
