import { Facebook, Instagram } from 'lucide-react'

import { PHONE_PRIMARY, EMAIL, FACEBOOK_URL, INSTAGRAM_URL, formatPhone } from '../siteConfig'
import { HOME_URL, KRANY_URL, PROTE_URL, sectionHref, type PageId } from '../lib/paths'
import uscLogo from '../assets/usc-logo.jpg'

/** Quick-nav links repeated in the footer — same targets as the main nav's
 *  plain (non-catalog-jump) items, so both stay in sync by hand when the
 *  page structure changes. */
const footerLinks = (page: PageId) => [
  { label: 'Про компанію', href: page === 'home' ? '#top' : HOME_URL },
  { label: 'Кульові крани USC', href: KRANY_URL },
  { label: 'PROTE', href: PROTE_URL },
  { label: 'Інша продукція', href: sectionHref(page, '#full-catalog') },
  { label: 'Партнерам та дилерам', href: sectionHref(page, '#dealers') },
  { label: 'Сертифікати', href: sectionHref(page, '#certificates') },
  { label: 'Контакти', href: sectionHref(page, '#contact-details') },
]

export function Footer({ page }: { page: PageId }) {
  return (
    <footer className="relative bg-[#4A4D52] pb-8 pt-14 text-white sm:pt-16">
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1E7FC2] via-[#F5B915] to-[#1E7FC2]"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src={uscLogo} alt="USC" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-[15px] font-semibold text-white">
                USC — Ukrainian Santechnical Company
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-[1.65] text-gray-300">
              Український бренд трубопровідних систем та запірної арматури.
              Ексклюзивний представник PROTE в Україні.
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Навігація
            </p>
            <ul className="space-y-2.5">
              {footerLinks(page).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13.5px] text-gray-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Контакти
            </p>
            <ul className="space-y-2.5 text-[13.5px] text-gray-300">
              <li>
                <a
                  href={`tel:${PHONE_PRIMARY}`}
                  className="transition-colors hover:text-white"
                >
                  {formatPhone(PHONE_PRIMARY)}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li className="leading-[1.5]">03151, м. Київ, вул. Волинська, 48/50</li>
            </ul>
            {(FACEBOOK_URL || INSTAGRAM_URL) && (
              <div className="mt-5 flex items-center gap-2">
                {FACEBOOK_URL && (
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {INSTAGRAM_URL && (
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <span className="text-center text-[12px] text-gray-400 sm:text-left">
            © {new Date().getFullYear()} ТОВ «ЮСК.ПРО» (ЄДРПОУ 46315118). Усі права захищені.
          </span>
          <span className="text-[12px] text-gray-500">Лише краще обладнання</span>
        </div>
      </div>
    </footer>
  )
}
