import type { ReactNode } from 'react'

import { PageBackground, ScrollProgress, ShaderBoundary, SocialRail } from './Chrome'
import { Footer } from './Footer'
import { useScrollToHash } from '../lib/hooks'
import type { PageId } from '../lib/paths'

/** Everything the pages have in common: animated background, scroll progress,
 *  the fixed social rail and the footer. Pages supply the sections between. */
export function PageShell({ page, children }: { page: PageId; children: ReactNode }) {
  useScrollToHash()
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
