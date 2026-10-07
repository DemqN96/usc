import { Award, ShieldCheck } from 'lucide-react'

import { PageShell } from '../../components/PageShell'
import { SiteNav } from '../../components/Nav'
import { ProteCover } from '../../components/BrandCover'
import { BadgeRow, Reveal } from '../../components/ui'
import { ContactGrid } from '../../sections/Contacts'
import { PROTE_AWARDS_NOTE, PROTE_STATS } from './content'
import { TechExplorer } from './TechExplorer'

/* The PROTE partner page: who PROTE is, the six technologies (expandable),
 * and how to get in touch. USC is PROTE's exclusive representative in Ukraine. */

export function ProtePage() {
  return (
    <PageShell page="prote">
      <div id="top">
        <SiteNav page="prote" />
      </div>

      {/* 1 — Intro */}
      <section className="pb-14 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <BadgeRow num="1" label="Партнерська лінійка" />
          </div>
          <Reveal>
            <h1 className="mb-10 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,6vw,3.6rem)] sm:mb-14">
              Технології PROTE для води, <br className="hidden sm:block" />
              осаду та довкілля.
            </h1>
          </Reveal>

          <Reveal
            as="article"
            delay={80}
            className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <ProteCover strip="band" />

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
        </div>
      </section>

      {/* 2 — Technologies */}
      <section id="technologies" className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8">
            <BadgeRow num="2" label="Технології PROTE" />
          </div>
          <Reveal>
            <h2 className="mb-4 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)]">
              Шість технологій PROTE.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[15px] leading-[1.7] text-gray-600 sm:mb-12 sm:text-[16px]">
              Натисніть на картку — нижче відкриється короткий опис технології.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <TechExplorer />
          </Reveal>

          <p className="mt-5 flex items-start gap-2 text-[12px] leading-[1.6] text-gray-500 sm:text-[13px]">
            <Award size={15} className="mt-0.5 shrink-0 text-[#F5B915]" />
            <span>{PROTE_AWARDS_NOTE}</span>
          </p>
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
              Обговорімо ваш проєкт.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[15px] leading-[1.7] text-gray-600 sm:mb-12 sm:text-[16px]">
              Зателефонуйте або напишіть нам — розповімо про технології PROTE та їх
              впровадження на вашому об’єкті.
            </p>
          </Reveal>
          <ContactGrid />
        </div>
      </section>
    </PageShell>
  )
}
