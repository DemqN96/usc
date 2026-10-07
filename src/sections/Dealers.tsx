import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'

import { PHONE_PRIMARY, EMAIL, FORM_ENDPOINT, formatPhone } from '../siteConfig'
import { Reveal, BadgeRow } from '../components/ui'

const DEALER_BENEFITS = [
  {
    title: 'Дилерські ціни',
    desc: 'Спеціальні умови та гнучка знижкова політика для партнерів.',
  },
  {
    title: 'Продукція зі складу',
    desc: 'Наявність ходових типорозмірів TM USC та обладнання PROTE.',
  },
  {
    title: 'Технічна підтримка',
    desc: 'Допомога з підбором арматури, кресленнями та документацією.',
  },
]

/** Minimal, on-page notice about how the dealer form's personal data is
 *  processed — makes the checkbox consent an *informed* consent per the Law
 *  of Ukraine "Про захист персональних даних" (№ 2297-VI, ст. 8, 12). This is
 *  intentionally short: a lead form, not a full privacy-policy document. */
function PrivacyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Обробка персональних даних"
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pr-14 sm:p-8 sm:pr-16">
          <h4 className="text-[17px] font-semibold text-gray-900 sm:text-[19px]">
            Обробка персональних даних
          </h4>
          <div className="mt-4 space-y-3 text-[13.5px] leading-[1.7] text-gray-600">
            <p>
              Заповнюючи цю форму, ви передаєте{' '}
              <span className="font-medium text-gray-900">ТОВ «ЮСК.ПРО»</span> (ЄДРПОУ
              46315118, 03151, м. Київ, вул. Волинська, 48/50, офіс 516) свої
              персональні дані: ім’я, назву компанії, email та номер телефону.
            </p>
            <p>
              Дані використовуються виключно для розгляду вашої заявки на
              партнерство чи дилерство та зворотного зв’язку з вами. Ми не передаємо
              їх третім особам, окрім сервісів, що технічно забезпечують доставку
              заявки до нашого відділу продажів.
            </p>
            <p>
              Обробка здійснюється на підставі вашої згоди відповідно до Закону
              України «Про захист персональних даних» № 2297-VI. Ви маєте право
              будь-коли відкликати згоду, а також отримати, виправити чи вимагати
              видалення своїх даних — для цього напишіть на{' '}
              <a href={`mailto:${EMAIL}`} className="font-medium text-[#1E7FC2] hover:underline">
                {EMAIL}
              </a>{' '}
              або зателефонуйте на{' '}
              <a
                href={`tel:${PHONE_PRIMARY}`}
                className="font-medium text-[#1E7FC2] hover:underline"
              >
                {formatPhone(PHONE_PRIMARY)}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DealersSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  /** Consent to process personal data (Law of Ukraine "Про захист персональних
   *  даних" № 2297-VI) — required before the form may be submitted. */
  const [consent, setConsent] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    try {
      // Deliver the lead to the CRM / form backend. The destination is set via
      // VITE_FORM_ENDPOINT (see .env.example), so the CRM can be swapped without
      // code changes. While the endpoint is empty we succeed optimistically.
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...form,
            source: 'USC landing — dealer application',
            submittedAt: new Date().toISOString(),
          }),
        })
        if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
      } else if (import.meta.env.DEV) {
        console.warn('VITE_FORM_ENDPOINT is not set — the application was not delivered.')
      }
      setStatus('success')
    } catch (err) {
      console.error('Dealer form submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <section id="dealers" className="pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8">
          <BadgeRow num="3" label="Партнерам та дилерам" />
        </div>
        <Reveal>
          <h2 className="mb-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 text-[clamp(1.5rem,4vw,3.2rem)] sm:mb-16">
            Станьте офіційним <br className="hidden sm:block" />
            дилером USC.
          </h2>
        </Reveal>

        <Reveal delay={80} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Benefits */}
          <div>
            <p className="mb-8 max-w-md text-[15px] font-medium leading-[1.6] text-gray-800 sm:text-[17px]">
              Запрошуємо до співпраці монтажні організації, дистриб’юторів та
              роздрібні мережі. Заповніть форму — ми опрацюємо заявку й
              повернемось із відповіддю.
            </p>
            <ul className="space-y-5">
              {DEALER_BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">{b.title}</p>
                    <p className="text-[13px] text-gray-600">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-[#F5F5F5] p-6 sm:p-8">
            {status === 'success' ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                <CheckCircle2 size={48} className="mb-4 text-[#1E7FC2]" />
                <p className="text-[18px] font-semibold text-gray-900">Заявку надіслано!</p>
                <p className="mt-2 max-w-xs text-[14px] text-gray-600">
                  Дякуємо. Ми зв’яжемось із вами найближчим часом за вказаними
                  контактами.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    disabled={status === 'sending'}
                    placeholder="Ім’я / контактна особа"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                  <input
                    required
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={update('company')}
                    disabled={status === 'sending'}
                    placeholder="Компанія (ФОП / ТОВ)"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    disabled={status === 'sending'}
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={status === 'sending'}
                    placeholder="Телефон"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-gray-600">
                  <input
                    required
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={status === 'sending'}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#1E7FC2] focus:ring-[#1E7FC2] disabled:opacity-60"
                  />
                  <span>
                    Я даю згоду на обробку моїх персональних даних відповідно до
                    Закону України «Про захист персональних даних».{' '}
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(true)}
                      className="font-medium text-[#1E7FC2] underline underline-offset-2 hover:text-[#175f92]"
                    >
                      Детальніше
                    </button>
                  </span>
                </label>

                {status === 'error' && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">
                    Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте
                    нам за вказаними контактами.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending' || !consent}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#4A4D52] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#3a3d42] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight size={15} className="text-[#4A4D52]" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-gray-400">
                  Менеджер USC зв’яжеться з вами для оформлення договору.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </section>
  )
}
