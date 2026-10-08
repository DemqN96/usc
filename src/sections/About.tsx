import { Reveal, Cta, BadgeRow } from '../components/ui'

import zavodBalls from '../assets/zavod1.jpg'
import aboutKran from '../assets/about-kran.jpg'
import uscEmblem from '../assets/usc-emblem.webp'

/** Key figures — working conditions and service life from the USC catalog (p. 4). */
const FIGURES = [
  { value: '30', unit: 'років', label: 'термін служби крана' },
  { value: '25 000', unit: 'циклів', label: 'ресурс «відкрито — закрито»' },
  { value: '4,0', unit: 'МПа', label: 'максимальний робочий тиск' },
  { value: '−40…+200', unit: '°C', label: 'температура робочого середовища' },
  { value: 'DN15–700', unit: '', label: 'діаметри кульових кранів' },
  { value: 'ISO 9001', unit: '', label: 'система управління якістю (2015)' },
]

/** Where USC valves work — the catalog's list of industries and media (p. 4). */
const APPLICATIONS = [
  'Тепломережі',
  'Природний газ',
  'Нафтопродукти та ПММ',
  'Зріджені вуглеводневі гази',
  'Житлово-комунальне господарство',
  'Нафтопереробна та газова промисловість',
]

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

export function About() {
  const CtaButton = (
    <Cta href="#catalog" className="self-start">
      Дивитися продукцію
    </Cta>
  )

  return (
    // overflow: clip (not hidden) clips the decorative wash without breaking the sticky imagery
    <section className="relative overflow-hidden pb-12 pt-16 supports-[overflow:clip]:overflow-clip sm:pb-14 sm:pt-20 lg:pb-16 lg:pt-32">
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

            {/* USC in figures */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:grid-cols-3 sm:p-8">
              {FIGURES.map((f) => (
                <div key={f.label} className="min-w-0">
                  <dt className="whitespace-nowrap text-[22px] font-semibold leading-none tracking-[-0.01em] text-gray-900 sm:text-[28px]">
                    {f.value}
                    {f.unit && (
                      <span className="ml-1 text-[13px] font-medium tracking-normal text-[#1E7FC2] sm:text-[14px]">
                        {f.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-2 text-[12.5px] leading-[1.45] text-gray-500 sm:text-[13px]">{f.label}</dd>
                </div>
              ))}
            </dl>

            {/* Applications */}
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Сфери застосування
              </p>
              <ul className="flex flex-wrap gap-2">
                {APPLICATIONS.map((a) => (
                  <li
                    key={a}
                    className="rounded-full bg-[#1E7FC2]/[0.07] px-3.5 py-1.5 text-[13px] font-medium text-[#175f92]"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Imagery — sticks alongside the text when the text column is the taller one */}
          <div className="flex flex-col gap-4 sm:flex-row lg:sticky lg:top-28 lg:flex-col lg:self-start">
            <div className="group aspect-[438/346] w-full overflow-hidden rounded-2xl sm:w-1/2 lg:w-full">
              <img
                src={zavodBalls}
                alt="Сталеві кулі для запірної арматури TM USC"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="group aspect-[438/346] w-full overflow-hidden rounded-2xl sm:w-1/2 lg:w-full">
              <img
                src={aboutKran}
                alt="Сталевий кульовий кран TM USC із фланцевим приєднанням"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        {/* Closing statement — a brand band that bridges into the catalog */}
        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-3xl bg-[#0f2a44] px-6 py-10 sm:mt-16 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div
              className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#1E7FC2]/50 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-[#F5B915]/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between gap-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-[12px]">
                  Український виробник запірної арматури
                </p>
                <p className="mt-4 max-w-[28ch] text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[40px]">
                  Український характер. Європейська інженерія.{' '}
                  <span className="text-[#F5B915]">Надійність, що працює поколіннями.</span>
                </p>
              </div>
              <span className="hidden h-40 w-40 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_10px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.35)] md:flex lg:h-48 lg:w-48">
                <img src={uscEmblem} alt="" className="h-[82%] w-[82%] object-contain" />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
