import { useEffect, type ReactNode } from 'react'

import { PageBackground, ScrollProgress, ShaderBoundary, SocialRail } from './Chrome'
import { Footer } from './Footer'
import { useScrollToHash } from '../lib/hooks'
import { initAnalytics } from '../lib/analytics'
import type { PageId } from '../lib/paths'

/** Everything the pages have in common: animated background, scroll progress,
 *  the fixed social rail, the footer and analytics. Pages supply the sections between. */
export function PageShell({ page, children }: { page: PageId; children: ReactNode }) {
  useScrollToHash()
  useEffect(() => initAnalytics(), [])
  return (
    <main>
      <ShaderBoundary>
        <PageBackground />
      </ShaderBoundary>
      <ScrollProgress />
      <SocialRail />
      {children}
      <Footer page={page} />
    </main>
  )
}
