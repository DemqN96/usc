import { useEffect, useState } from 'react'
import { ArrowRight, Award, Check, ChevronDown, X } from 'lucide-react'

import { Collapse, TextRoll } from '../../components/ui'
import { readHash, useColumns } from '../../lib/hooks'
import { PROTE_TECHS, type ProteTech } from './content'
import { PosExtras, QuestExtras } from './extras'

/* Six technology cards; a click opens a short "about this technology" panel
 * right under the card's row (one panel at a time). The open panel is mirrored
 * in the URL hash — `/prote/#prote-pos` opens PROTE-POS — so links from the
 * home page land on the right panel. */

const GRID_COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' } as const

const slugFromHash = () => {
  const h = readHash()
  return PROTE_TECHS.some((t) => t.slug === h) ? h : null
}

export function TechExplorer() {
  const cols = useColumns()
  const [active, setActive] = useState<string | null>(slugFromHash)

  /* In-page hash links (e.g. a nav click while already on the page) */
  useEffect(() => {
    const onHash = () => {
      const slug = slugFromHash()
      if (slug) setActive(slug)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toggle = (slug: string) => {
    const next = active === slug ? null : slug
    setActive(next)
    const { pathname, search } = window.location
    window.history.replaceState(null, '', next ? `#${next}` : `${pathname}${search}`)
  }

  /* The panel belongs under the *row* of its card, so group cards by row */
  const rows: ProteTech[][] = []
  for (let i = 0; i < PROTE_TECHS.length; i += cols) rows.push(PROTE_TECHS.slice(i, i + cols))

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} className={ri > 0 ? 'mt-4' : ''}>
          <div className={`grid gap-4 ${GRID_COLS[cols]}`}>
            {row.map((t) => (
              <TechCard
                key={t.slug}
                tech={t}
                open={active === t.slug}
                onToggle={() => toggle(t.slug)}
              />
            ))}
          </div>
          {row.map((t) => (
            <Collapse
              key={t.slug}
              open={active === t.slug}
              id={`panel-${t.slug}`}
              labelledBy={`${t.slug}-title`}
            >
              <TechPanel tech={t} onClose={() => toggle(t.slug)} />
            </Collapse>
          ))}
        </div>
      ))}
    </div>
  )
}

function TechCard({
  tech,
  open,
  onToggle,
}: {
  tech: ProteTech
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      id={tech.slug}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`panel-${tech.slug}`}
      className={`group flex flex-col rounded-2xl bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(30,127,194,0.14)] sm:p-6 ${
        open
          ? 'shadow-[0_10px_30px_rgba(30,127,194,0.14)] ring-2 ring-[#1E7FC2]/40'
          : 'shadow-[0_2px_10px_rgba(0,0,0,0.05)]'
      }`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1E7FC2]">
        {tech.tag}
      </span>
      <span className="mt-2 block text-[16px] font-semibold text-gray-900 sm:text-[17px]">
        {tech.name}
      </span>
      <span className="mt-2 block text-[13px] leading-[1.65] text-gray-600 sm:text-[14px]">
        {tech.desc}
      </span>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-semibold text-[#1E7FC2]">
        {open ? 'Згорнути' : 'Детальніше'}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </span>
    </button>
  )
}

function TechPanel({ tech, onClose }: { tech: ProteTech; onClose: () => void }) {
  return (
    <article className="relative mt-4 overflow-hidden rounded-2xl border border-[#1E7FC2]/15 bg-white">
      <button
        type="button"
        onClick={onClose}
        aria-label={`Згорнути ${tech.name}`}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <X size={18} />
      </button>

      <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1fr_200px] lg:gap-10">
        <div className="min-w-0 lg:order-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1E7FC2]">
            {tech.tag}
          </span>
          <h3
            id={`${tech.slug}-title`}
            className="mt-1 text-[22px] font-semibold leading-tight text-gray-900 sm:text-[26px]"
          >
            {tech.name}
          </h3>

          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.65] text-gray-800 sm:text-[16px]">
            {tech.lead}
          </p>
          <ul className="mt-5 space-y-3">
            {tech.points.map((p) => (
              <li key={p} className="flex gap-3 text-[14px] leading-[1.6] text-gray-600">
                <Check size={17} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="order-first lg:order-2">
          <img
            src={tech.image}
            alt={tech.imageAlt}
            loading="lazy"
            className="h-28 w-28 rounded-full object-cover shadow-[0_6px_20px_rgba(0,0,0,0.12)] ring-1 ring-black/5 lg:h-[200px] lg:w-[200px]"
          />
        </figure>
      </div>

      {tech.slug === 'prote-quest' && <QuestExtras />}
      {tech.slug === 'prote-pos' && <PosExtras />}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-gray-100 px-5 py-4 sm:px-8">
        {tech.awards ? (
          <ul className="flex flex-wrap items-center gap-2">
            {tech.awards.map((a) => (
              <li
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B915]/20 px-3 py-1 text-[11.5px] font-medium text-[#7a5d08]"
              >
                <Award size={13} className="shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}
        <a
          href="#contact-details"
          className="group inline-flex items-center gap-3 rounded-full bg-[#F5B915] py-2 pl-5 pr-2 text-[13px] font-medium text-gray-900 transition-colors hover:bg-[#e0a70f] sm:text-[14px]"
        >
          <TextRoll>Залишити запит</TextRoll>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
            <ArrowRight size={15} className="text-gray-900" />
          </span>
        </a>
      </div>
    </article>
  )
}
