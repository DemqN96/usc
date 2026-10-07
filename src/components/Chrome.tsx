import { Component, useEffect, useState, type ReactNode } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'
import { Phone, Instagram, Facebook } from 'lucide-react'

import { PHONE_PRIMARY, FACEBOOK_URL, INSTAGRAM_URL } from '../siteConfig'

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

/* Fixed vertical social rail — stays in place while scrolling */
export function SocialRail() {
  const items = [
    { href: `tel:${PHONE_PRIMARY}`, label: 'Зателефонувати', Icon: Phone, external: false },
    INSTAGRAM_URL && { href: INSTAGRAM_URL, label: 'Instagram', Icon: Instagram, external: true },
    FACEBOOK_URL && { href: FACEBOOK_URL, label: 'Facebook', Icon: Facebook, external: true },
  ].filter(Boolean) as {
    href: string
    label: string
    Icon: typeof Phone
    external: boolean
  }[]
  return (
    <div className="fixed right-2.5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-4 sm:gap-2.5">
      {items.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1E7FC2] shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all hover:bg-[#1E7FC2] hover:text-white sm:h-11 sm:w-11"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  )
}
