import { useEffect, useRef, useState } from 'react'

export function useKyivTime() {
  const [time, setTime] = useState(() => formatKyiv())
  useEffect(() => {
    const id = setInterval(() => setTime(formatKyiv()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatKyiv() {
  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Kyiv',
  }).format(new Date())
}

/** Fires once when the wrapped element scrolls into view. Used to drive the
 *  scroll-reveal animation below without re-triggering on every re-render. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px', ...options },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

/** The URL hash without "#", decoded. A malformed escape (`#%`) must not be
 *  able to crash the page, so it falls back to the raw text. */
export function readHash(): string {
  const raw = window.location.hash.slice(1)
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/** Scrolls to the element named by the URL hash once the page has rendered.
 *  The pages are client-rendered, so the browser's own anchor scroll runs
 *  before its target exists, and layout keeps settling for a moment after
 *  (images, reveal animations) — so the position is re-applied a couple of
 *  times, until the user takes over scrolling. */
export function useScrollToHash() {
  useEffect(() => {
    const id = readHash()
    if (!id) return
    let userScrolled = false
    const onUser = () => {
      userScrolled = true
    }
    const align = () => {
      if (userScrolled) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    const events = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const
    events.forEach((e) => window.addEventListener(e, onUser, { passive: true, once: true }))
    const raf = requestAnimationFrame(align)
    const timers = [350, 900].map((ms) => window.setTimeout(align, ms))
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      events.forEach((e) => window.removeEventListener(e, onUser))
    }
  }, [])
}

/** Grid column count at the current width — mirrors Tailwind's `sm` (640px)
 *  and `lg` (1024px) breakpoints, for layouts that must group items by row. */
export function useColumns() {
  const read = (): 1 | 2 | 3 =>
    window.matchMedia('(min-width: 1024px)').matches
      ? 3
      : window.matchMedia('(min-width: 640px)').matches
        ? 2
        : 1
  const [cols, setCols] = useState<1 | 2 | 3>(read)
  useEffect(() => {
    const queries = ['(min-width: 640px)', '(min-width: 1024px)'].map((q) => window.matchMedia(q))
    const update = () => setCols(read())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])
  return cols
}
