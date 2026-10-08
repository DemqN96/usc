import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle2, PhoneCall, X } from 'lucide-react'

import { ConsentField, DirectContacts, MailFallbackNotice } from './LeadParts'
import { leadMailto, sendLead, type LeadField } from '../lib/leads'

const SUBJECT = 'Замовлення дзвінка з сайту USC'

/** "Замовити дзвінок": name + phone delivered like every other lead, plus the
 *  direct ways to reach USC right now. Rendered into <body> so no ancestor of
 *  the header can trap the fixed overlay. */
export function CallbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mail' | 'error'>('idle')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const fields: LeadField[] = [
    { key: 'name', label: 'Ім’я', value: name },
    { key: 'phone', label: 'Телефон', value: phone },
    { key: 'page', label: 'Сторінка', value: window.location.href },
  ]

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    try {
      setStatus(await sendLead('callback', SUBJECT, fields))
    } catch (err) {
      console.error('Callback request failed:', err)
      setStatus('error')
    }
  }

  const input =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-900 outline-none transition-colors focus:border-[#1E7FC2] disabled:opacity-60'

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Замовити дзвінок"
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {status === 'sent' ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <CheckCircle2 size={48} className="mb-4 text-[#1E7FC2]" />
            <p className="text-[18px] font-semibold text-gray-900">Дякуємо!</p>
            <p className="mt-2 max-w-xs text-[14px] text-gray-600">
              Менеджер USC передзвонить вам найближчим часом.
            </p>
          </div>
        ) : status === 'mail' ? (
          <div className="py-2">
            <MailFallbackNotice mailto={leadMailto(SUBJECT, fields)} />
          </div>
        ) : (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E7FC2]/10 text-[#1E7FC2]">
              <PhoneCall size={20} />
            </span>
            <h4 className="mt-4 text-[19px] font-semibold text-gray-900">Замовити дзвінок</h4>
            <p className="mt-1.5 text-[13.5px] leading-[1.6] text-gray-500">
              Залиште номер — менеджер USC передзвонить і допоможе з підбором.
            </p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'sending'}
                placeholder="Ім’я"
                className={input}
              />
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === 'sending'}
                placeholder="Телефон"
                className={input}
              />
              <ConsentField checked={consent} onChange={setConsent} disabled={status === 'sending'} />
              {status === 'error' && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">
                  Не вдалося надіслати. Зателефонуйте або напишіть нам — контакти нижче.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending' || !consent}
                className="usc-cta group/cta flex w-full items-center justify-center gap-3 rounded-full py-3 text-[15px] font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Надсилаємо…' : 'Чекаю на дзвінок'}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(122,80,0,0.28)] transition-transform duration-500 group-hover/cta:-rotate-45">
                  <ArrowRight size={16} className="text-gray-900" />
                </span>
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-3 text-center text-[12px] text-gray-500">Або зв’яжіться з нами зараз:</p>
              <DirectContacts />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
