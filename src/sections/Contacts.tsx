import { Phone, Mail, MapPin, Facebook, FileText, ShieldCheck, Award, Download } from 'lucide-react'

import { PHONE_PRIMARY, EMAIL, FACEBOOK_URL, formatPhone } from '../siteConfig'
import { Reveal, BadgeRow } from '../components/ui'
import { DOCS_URL } from '../lib/paths'
import atest from '../assets/atest-protequest12.jpg'

const CERTIFICATES = [
  { icon: Award, title: 'ISO 9001:2015', desc: 'Система управління якістю' },
  { icon: ShieldCheck, title: 'Сертифікати відповідності', desc: 'На продукцію TM USC' },
  { icon: FileText, title: 'Технічні паспорти', desc: 'Для кожного типорозміру' },
]

export function ContactsSection() {
  return (
    <section
      id="contacts"
      className="relative overflow-hidden pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28"
    >
      {/* Soft depth wash — decorative only */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#1E7FC2]/[0.05] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="4" label="Сертифікати та контакти" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
            Якість, підтверджена <br className="hidden sm:block" />
            документально.
          </h2>
        </Reveal>

        {/* Certificates */}
        <Reveal
          delay={80}
          id="certificates"
          className="mb-14 scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {CERTIFICATES.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
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
          {/* A real document: PROTE's hygienic certificate (watermarked copy) */}
          <a
            href={`${DOCS_URL}protequest12-hygienic-certificate-pzh.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <img
              src={atest}
              alt=""
              loading="lazy"
              className="h-[62px] w-[44px] shrink-0 rounded-md object-cover object-top shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
            />
            <div>
              <p className="text-[15px] font-semibold text-gray-900">Гігієнічний атест PZH</p>
              <p className="mt-1 text-[13px] text-gray-600">
                PROTEQUEST®12 (PROTE), чинний до 17.07.2028
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                <Download size={13} />
                Відкрити PDF
              </span>
            </div>
          </a>
        </Reveal>

        {/* Contacts */}
        <ContactGrid />
      </div>
    </section>
  )
}

/** Phone / email / address (+ Facebook) cards. Shared by the home page and the
 *  PROTE page; `#contact-details` is the nav's "Контакти" target on both. */
export function ContactGrid() {
  return (
    <Reveal
      delay={140}
      id="contact-details"
      className="scroll-mt-24 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6"
    >
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        <Phone size={22} className="text-[#1E7FC2]" />
        <span className="text-[13px] text-gray-500">Телефон</span>
        <a
          href={`tel:${PHONE_PRIMARY}`}
          className="text-[15px] font-semibold text-gray-900 transition-colors hover:text-[#1E7FC2]"
        >
          {formatPhone(PHONE_PRIMARY)}
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
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
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
    </Reveal>
  )
}
