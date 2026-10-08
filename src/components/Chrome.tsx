import { Component, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'
import { Phone, Instagram, Facebook, MessageCircle, X } from 'lucide-react'

import { PHONE_PRIMARY, FACEBOOK_URL, INSTAGRAM_URL } from '../siteConfig'
import { MESSENGERS, linkTarget } from './Messengers'

/* ------------------------------------------------------------------ */
/* Page chrome shared by every page: progress bar, background, social  */
/* ------------------------------------------------------------------ */

/** Thin brand-gradient bar pinned to the very top, filling with scroll
 *  progress — a small, static-only touch of "app" polish. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = document.documentElement
        const max = el.scrollHeight - el.clientHeight
        setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#1E7FC2] to-[#F5B915] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export class ShaderBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  render() {
    return this.state.err ? null : this.props.children
  }
}

export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <MeshGradient
        className="h-full w-full"
        colors={['#ffffff', '#f7fbfe', '#eef6fc', '#d6eaf8']}
        distortion={0.8}
        swirl={0.35}
        grainMixer={0}
        grainOverlay={0.05}
        speed={0.3}
      />
    </div>
  )
}

const RAIL_BUTTON =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand)] shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all hover:bg-[var(--brand)] hover:text-white sm:h-11 sm:w-11'

/* Fixed vertical rail — phone, messengers and socials, stays in place while
 * scrolling. On phones only the call button and a "write to us" toggle show,
 * so the stack doesn't cover the content; the toggle unfolds the rest. */
export function SocialRail() {
  const [open, setOpen] = useState(false)
  const extra = [
    ...MESSENGERS.map((m) => ({ href: m.href, label: m.label, icon: <m.Icon size={19} />, color: m.color })),
    INSTAGRAM_URL && { href: INSTAGRAM_URL, label: 'Instagram', icon: <Instagram size={18} />, color: '#1E7FC2' },
    FACEBOOK_URL && { href: FACEBOOK_URL, label: 'Facebook', icon: <Facebook size={18} />, color: '#1E7FC2' },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode; color: string }[]
  return (
    <div className="fixed right-2.5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-4 sm:gap-2.5">
      <a
        href={`tel:${PHONE_PRIMARY}`}
        aria-label="Зателефонувати"
        className={RAIL_BUTTON}
        style={{ '--brand': '#1E7FC2' } as CSSProperties}
      >
        <Phone size={18} />
      </a>
      {extra.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Сховати месенджери' : 'Написати в месенджер'}
          className={`${RAIL_BUTTON} sm:hidden`}
          style={{ '--brand': '#1E7FC2' } as CSSProperties}
        >
          {open ? <X size={18} /> : <MessageCircle size={18} />}
        </button>
      )}
      {extra.map(({ href, label, icon, color }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...linkTarget(href)}
          className={`${RAIL_BUTTON} ${open ? '' : 'max-sm:hidden'}`}
          style={{ '--brand': color } as CSSProperties}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
