import { Reveal, Cta, BadgeRow } from '../components/ui'

import zavodBalls from '../assets/zavod1.jpg'
import aboutKran from '../assets/about-kran.jpg'

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
    <section className="relative overflow-hidden pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32">
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
            <div className="group aspect-[438/346] w-full overflow-hidden rounded-2xl sm:w-1/2 lg:w-full">
              <img
                src={aboutKran}
                alt="Сталевий кульовий кран TM USC із фланцевим приєднанням"
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
