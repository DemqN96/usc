import { useEffect, useState, type CSSProperties } from 'react'
import { Mail, Phone, X } from 'lucide-react'

import { EMAIL, EMAILS, PHONE_PRIMARY, formatPhone } from '../siteConfig'
import { MESSENGERS, linkTarget } from './Messengers'

/* Pieces shared by the site's lead forms (dealer application, callback). */

/** Minimal, on-page notice about how a form's personal data is processed —
 *  makes the checkbox consent an *informed* consent per the Law of Ukraine
 *  "Про захист персональних даних" (№ 2297-VI, ст. 8, 12). Intentionally
 *  short: a lead form, not a full privacy-policy document. */
export function PrivacyModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
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
              Заповнюючи форму на сайті, ви передаєте{' '}
              <span className="font-medium text-gray-900">ТОВ «ЮСК.ПРО»</span> (ЄДРПОУ
              46315118, 03151, м. Київ, вул. Волинська, 48/50, офіс 516) свої
              персональні дані: ім’я та вказані контакти (телефон, email), а також назву
              компанії — якщо ви її вказали.
            </p>
            <p>
              Дані використовуються виключно для розгляду вашої заявки та зворотного
              зв’язку з вами. Ми не передаємо їх третім особам, окрім сервісів, що
              технічно забезпечують доставку заявки до нашого відділу продажів.
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
              <a href={`tel:${PHONE_PRIMARY}`} className="font-medium text-[#1E7FC2] hover:underline">
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

/** Required consent checkbox with a link to the processing notice. */
export function ConsentField({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <label className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-gray-600">
        <input
          required
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#1E7FC2] focus:ring-[#1E7FC2] disabled:opacity-60"
        />
        <span>
          Я даю згоду на обробку моїх персональних даних відповідно до Закону України «Про
          захист персональних даних».{' '}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="font-medium text-[#1E7FC2] underline underline-offset-2 hover:text-[#175f92]"
          >
            Детальніше
          </button>
        </span>
      </label>
      {open && <PrivacyModal onClose={() => setOpen(false)} />}
    </>
  )
}

/** Direct ways to reach USC: call, messengers, email. */
export function DirectContacts({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      <a
        href={`tel:${PHONE_PRIMARY}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-gray-900 ring-1 ring-gray-200 transition-colors hover:ring-[#1E7FC2]"
      >
        <Phone size={14} className="text-[#1E7FC2]" />
        {formatPhone(PHONE_PRIMARY)}
      </a>
      {MESSENGERS.map(({ id, label, href, Icon, color }) => (
        <a
          key={id}
          href={href}
          {...linkTarget(href)}
          className="group/m inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-[var(--brand)] hover:text-white hover:ring-transparent"
          style={{ '--brand': color } as CSSProperties}
        >
          <Icon size={14} className="text-[var(--brand)] transition-colors group-hover/m:text-white" />
          {label}
        </a>
      ))}
      {EMAILS.map((e) => (
        <a
          key={e}
          href={`mailto:${e}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:ring-[#1E7FC2]"
        >
          <Mail size={14} className="text-[#1E7FC2]" />
          {e}
        </a>
      ))}
    </div>
  )
}

/** Shown when a lead went to the visitor's mail app instead of the server:
 *  the letter still has to be sent, so say it plainly and offer other ways. */
export function MailFallbackNotice({ mailto }: { mailto: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Mail size={44} className="mb-4 text-[#1E7FC2]" />
      <p className="text-[17px] font-semibold text-gray-900">Залишився один крок</p>
      <p className="mt-2 max-w-sm text-[14px] leading-[1.6] text-gray-600">
        Ми відкрили лист із вашою заявкою у поштовій програмі — перевірте його й
        натисніть «Надіслати». Лист не відкрився?{' '}
        <a href={mailto} className="font-medium text-[#1E7FC2] underline underline-offset-2">
          Відкрити ще раз
        </a>{' '}
        або зв’яжіться з нами напряму:
      </p>
      <DirectContacts className="mt-4" />
    </div>
  )
}
