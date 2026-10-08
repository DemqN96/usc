import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { Reveal, BadgeRow } from '../components/ui'
import { ConsentField, DirectContacts, MailFallbackNotice } from '../components/LeadParts'
import { leadMailto, sendLead, type LeadField } from '../lib/leads'

const SUBJECT = 'Заявка на дилерство з сайту USC'

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

export function DealersSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })
  /** `sent` — the endpoint took it; `mail` — handed to the visitor's mail app */
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mail' | 'error'>('idle')
  /** Consent to process personal data (Law of Ukraine "Про захист персональних
   *  даних" № 2297-VI) — required before the form may be submitted. */
  const [consent, setConsent] = useState(false)

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const fields: LeadField[] = [
    { key: 'name', label: 'Ім’я', value: form.name },
    { key: 'company', label: 'Компанія', value: form.company },
    { key: 'email', label: 'Email', value: form.email },
    { key: 'phone', label: 'Телефон', value: form.phone },
  ]

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    try {
      // To the CRM / form backend when VITE_FORM_ENDPOINT is set, otherwise via
      // the visitor's mail app — a lead is never reported as sent when it wasn't.
      setStatus(await sendLead('dealer', SUBJECT, fields))
    } catch (err) {
      console.error('Dealer form submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <section id="dealers" className="pb-12 pt-12 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-16">
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
            {status === 'mail' ? (
              <div className="flex h-full min-h-[280px] items-center justify-center">
                <MailFallbackNotice mailto={leadMailto(SUBJECT, fields)} />
              </div>
            ) : status === 'sent' ? (
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

                <ConsentField checked={consent} onChange={setConsent} disabled={status === 'sending'} />

                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">
                    Не вдалося надіслати заявку. Спробуйте ще раз або зв’яжіться з нами напряму:
                    <DirectContacts className="mt-3" />
                  </div>
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
    </section>
  )
}
