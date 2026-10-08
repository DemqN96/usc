import { TELEGRAM_URL, VIBER_URL, WHATSAPP_URL } from '../siteConfig'
import { BRAND, TelegramIcon, ViberIcon, WhatsappIcon } from './BrandIcons'

/** Messengers on the primary phone, in the order clients in Ukraine reach
 *  for them. Hidden ones (empty URL) drop out. */
export const MESSENGERS = [
  { id: 'viber', label: 'Viber', href: VIBER_URL, Icon: ViberIcon, color: BRAND.viber },
  { id: 'telegram', label: 'Telegram', href: TELEGRAM_URL, Icon: TelegramIcon, color: BRAND.telegram },
  { id: 'whatsapp', label: 'WhatsApp', href: WHATSAPP_URL, Icon: WhatsappIcon, color: BRAND.whatsapp },
].filter((m) => m.href)

/** Web links open in a new tab; app links (viber://) hand off to the app. */
export const linkTarget = (href: string) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}
