import { PageShell } from '../components/PageShell'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Catalog } from '../sections/Catalog'
import { DealersSection } from '../sections/Dealers'
import { ContactsSection } from '../sections/Contacts'

export function HomePage() {
  return (
    <PageShell page="home">
      <Hero />
      <About />
      <Catalog />
      <DealersSection />
      <ContactsSection />
    </PageShell>
  )
}
