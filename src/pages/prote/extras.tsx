import { Download, FileText } from 'lucide-react'

import { DOCS_URL } from '../../lib/paths'

import vodokanal from '../../assets/prote-vodokanal.jpg'
import vodokanal2 from '../../assets/prote-vodokanal-2.jpg'
import atest from '../../assets/atest-protequest12.jpg'

/* Extra, technology-specific blocks inside an expanded PROTE panel. */

/* ------------------------------------------------------------------ */
/* PROTE-QUEST                                                         */
/* ------------------------------------------------------------------ */

const QUEST_STAGES = [
  {
    n: 'I',
    title: 'Очищення мережі від осадів',
    meta: 'кілька циклів по 3–6 місяців',
    text: 'Препарат проникає в зовнішні шари осадів і змінює їхню структуру, а осад виноситься потоком води під час систематичного промивання мережі.',
  },
  {
    n: 'II',
    title: 'Підтримання результату та захист системи',
    meta: '',
    text: 'Антикорозійний захист трубопроводів і запобігання повторній появі осадів.',
  },
]

const QUEST_DOCS = [
  {
    href: `${DOCS_URL}protequest12-hygienic-certificate-pzh.pdf`,
    title: 'Гігієнічний атест PZH',
    meta: 'PROTEQUEST®12 · № B.BK.60110.1135.2025 · чинний до 17.07.2028',
    thumb: atest,
  },
  {
    href: `${DOCS_URL}protequest12-safety-data-sheet-pl.pdf`,
    title: 'Карта характеристик (SDS)',
    meta: 'PROTEQUEST®12 · польською · оновлено 23.06.2025',
    thumb: '',
  },
]

const QUEST_PHOTOS = [
  {
    src: vodokanal,
    alt: 'Оператор налаштовує вузол дозування PROTE-QUEST у насосній станції водоканалу',
  },
  {
    src: vodokanal2,
    alt: 'Ємність приготування та дозувальний насос PROTE-QUEST, підключені до трубопроводу',
  },
]

export function QuestExtras() {
  return (
    <div className="space-y-8 border-t border-gray-100 p-5 sm:p-8">
      {/* How it works */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Як це працює
        </h4>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2">
          {QUEST_STAGES.map((s) => (
            <li key={s.n} className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E7FC2] text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(30,127,194,0.35)]">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold leading-[1.3] text-gray-900">
                    {s.title}
                  </p>
                  {s.meta && <p className="mt-0.5 text-[12px] text-gray-500">{s.meta}</p>}
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-[1.6] text-gray-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-10">
        <div className="min-w-0 space-y-8">
          {/* Safety */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Безпечність
            </h4>
            <p className="mt-3 max-w-[64ch] text-[14px] leading-[1.65] text-gray-600">
              Сертифікована та добре перевірена суміш ортофосфатів і поліфосфатів для мереж
              питного водопостачання. 2 літри води, очищеної за допомогою PROTE-QUEST,
              містять 1–2 мг фосфору — для порівняння, добова норма для дорослої людини
              становить 700 мг.
            </p>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Документи
            </h4>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {QUEST_DOCS.map((d) => (
                <li key={d.href}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#1E7FC2]/30 hover:shadow-[0_8px_24px_rgba(30,127,194,0.12)]"
                  >
                    {d.thumb ? (
                      <img
                        src={d.thumb}
                        alt=""
                        loading="lazy"
                        className="h-[72px] w-[52px] shrink-0 rounded-md object-cover object-top shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
                      />
                    ) : (
                      <span className="flex h-[72px] w-[52px] shrink-0 items-center justify-center rounded-md bg-[#1E7FC2]/10 text-[#1E7FC2]">
                        <FileText size={24} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-[1.3] text-gray-900">
                        {d.title}
                      </span>
                      <span className="mt-1 block text-[12px] leading-[1.45] text-gray-500">
                        {d.meta}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                        <Download size={13} />
                        Відкрити PDF
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Photos from a water utility (published with the supplier's consent) */}
        <figure>
          <div className="grid grid-cols-2 gap-3">
            {QUEST_PHOTOS.map((p) => (
              <div key={p.src} className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <figcaption className="mt-2.5 text-[12px] leading-[1.5] text-gray-500">
            Об’єкт водоканалу: вузол приготування та дозування розчину PROTE-QUEST.
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PROTE-POS                                                           */
/* ------------------------------------------------------------------ */

/** Stages as listed on the PROTE-POS slide ("Як працює технологія?"). */
const POS_STAGES = [
  'Хімічний реактор',
  'Завантаження',
  'Гранулювання',
  'Сушіння',
  'Дезінфекція',
  'Пакування',
]

const NBSP = '\u00a0'

/* Example calculation — figures from the "Інвестиційний проєкт ОМД"
 * presentation (organomineral fertilizer plant, 6 000 kg/day of broiler
 * litter). Kept as a worked example, not a PROTE-POS guarantee. */
const CALC_MAIN = [
  { label: 'Обсяг виробництва', value: '479,1', unit: 'т/рік' },
  { label: 'Ціна реалізації ОМД', value: `26${NBSP}000`, unit: 'грн/т' },
  { label: 'Річна виручка', value: `12${NBSP}456${NBSP}600`, unit: 'грн' },
]

export function PosExtras() {
  return (
    <div className="space-y-8 border-t border-gray-100 p-5 sm:p-8">
      {/* Process stages */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Етапи процесу
        </h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {POS_STAGES.map((s) => (
            <li
              key={s}
              className="rounded-full bg-[#1E7FC2]/10 px-3.5 py-1.5 text-[12.5px] font-medium text-[#175f92]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Commercial calculation example */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          Приклад комерційного розрахунку
        </h4>
        <p className="mt-3 max-w-[70ch] text-[14px] leading-[1.65] text-gray-600">
          Завод органомінеральних добрив (ОМД): переробка 6{NBSP}000 кг/день бройлерного
          посліду, вихід готового продукту — 1{NBSP}451,7 кг/день.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {CALC_MAIN.map((c) => (
            <div key={c.label} className="rounded-2xl bg-gray-50 p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                {c.label}
              </p>
              <p className="mt-2 text-[24px] font-semibold leading-none text-gray-900 sm:text-[28px]">
                {c.value}
                <span className="ml-1.5 text-[13px] font-medium text-gray-500">{c.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-[#4A4D52] p-5 text-white sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
            Прогнозована EBITDA
          </p>
          <p className="mt-2 text-[30px] font-semibold leading-none sm:text-[40px]">
            4{NBSP}610{NBSP}310
            <span className="ml-2 text-[14px] font-medium text-white/60">грн/рік</span>
          </p>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#1E7FC2]/[0.07] p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#175f92]">
              Необхідний CAPEX (обладнання + ПНР)
            </p>
            <p className="mt-2 text-[24px] font-semibold leading-none text-gray-900 sm:text-[28px]">
              17{NBSP}700{NBSP}000
              <span className="ml-1.5 text-[13px] font-medium text-gray-500">грн</span>
            </p>
            <p className="mt-1.5 text-[12px] text-gray-500">≈ 411{NBSP}600 EUR</p>
          </div>
          <div className="rounded-2xl bg-[#F5B915]/20 p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a5d08]">
              Окупність проєкту
            </p>
            <p className="mt-2 text-[24px] font-semibold leading-none text-gray-900 sm:text-[28px]">
              3,8
              <span className="ml-1.5 text-[13px] font-medium text-gray-500">року</span>
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-[76ch] text-[12.5px] leading-[1.6] text-gray-500">
          Витрати на логістику сировини — 0 грн: переробка на території птахофабрики. Це
          приклад розрахунку; фактичні показники залежать від сировини, потужності та ціни
          реалізації.
        </p>
      </div>
    </div>
  )
}
