import type { MouseEventHandler, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { useInView } from '../lib/hooks'

/* A rolling text label used on CTA buttons */
export function TextRoll({ children }: { children: string }) {
  return (
    <span className="text-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

/** Primary call to action — yellow pill with a rolling label and an arrow
 *  disc. The look (gradient, glow, lift on hover, periodic glint, optional
 *  pulse) is `.usc-cta` in index.css. */
export function Cta({
  href,
  children,
  onClick,
  size = 'md',
  pulse = false,
  className = '',
}: {
  href: string
  children: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  /** `lg` — the hero's main button */
  size?: 'md' | 'lg'
  /** a halo that swells around the button now and then */
  pulse?: boolean
  className?: string
}) {
  const lg = size === 'lg'
  return (
    <a
      href={href}
      onClick={onClick}
      className={`usc-cta group/cta inline-flex items-center gap-3 rounded-full py-2.5 pl-6 pr-2.5 font-semibold text-gray-900 ${
        lg ? 'text-[15px] sm:gap-4 sm:py-3 sm:pl-8 sm:pr-3 sm:text-[17px]' : 'text-[14px] sm:pl-7 sm:text-[15px]'
      } ${pulse ? 'usc-cta--pulse' : ''} ${className}`}
    >
      <TextRoll>{children}</TextRoll>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(122,80,0,0.28)] transition-transform duration-500 group-hover/cta:-rotate-45 ${
          lg ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-8 w-8 sm:h-9 sm:w-9'
        }`}
      >
        <ArrowRight size={lg ? 20 : 17} strokeWidth={2.25} className="text-gray-900" />
      </span>
    </a>
  )
}

/* On-brand valve / flame mark (replaces the original starburst-compass) */
export function ValveMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.5 2c.4 1.9-.3 3.2-1.3 4.4-1 1.2-2.2 2.4-2.2 4.3a3.9 3.9 0 0 0 7.8.2c0-1-.3-1.8-.7-2.6.9.5 1.6 1.5 1.9 2.8.7 3-1.2 6.1-4.3 6.9-3.1.8-6.3-1-7.1-4-.6-2.3.2-4.3 1.5-5.9C13.8 6 14.2 4 13.5 2Z" />
    </svg>
  )
}

/** Fades a section into place the first time it scrolls into view. Purely
 *  CSS-driven (transform/opacity) so it costs nothing extra to host. Once
 *  revealed the transform is `none` (not `translate(0)`): any transform would
 *  make this wrapper the containing block of `position: fixed` children, and
 *  the catalog's modals and bottom sheet live inside it. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  id,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
  as?: 'div' | 'article'
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      id={id}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
        inView ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export function BadgeRow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E7FC2] text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(30,127,194,0.35)]">
        {num}
      </span>
      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 sm:text-[12px] sm:tracking-[0.16em]">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
    </div>
  )
}

/** Height-animated disclosure. The content stays mounted; while closed it is
 *  hidden from sight, the tab order and assistive tech (via `visibility`,
 *  which flips only after the closing transition has finished). */
export function Collapse({
  open,
  id,
  labelledBy,
  children,
}: {
  open: boolean
  id?: string
  labelledBy?: string
  children: ReactNode
}) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`grid transition-[grid-template-rows,opacity,visibility] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
        open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}
