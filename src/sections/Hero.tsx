import { SiteNav } from '../components/Nav'
import { Cta } from '../components/ui'

import uscLogoSplash from '../assets/usc-logo-splash.webp'

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col">
      <SiteNav page="home" />

      {/* Main brand mark — the USC emblem on its water splash, centred in the
          open space and blended into the background */}
      <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center px-6 py-3">
        <div className="usc-hero-mark animate-mark-in">
          <img
            src={uscLogoSplash}
            alt="USC — Ukrainian Santechnical Company"
            width={1017}
            height={986}
            className="h-[clamp(190px,42vh,480px)] w-auto object-contain"
          />
          <span className="usc-flame-glow" aria-hidden="true" />
        </div>
      </div>

      {/* Description — centred under the mark */}
      <div className="relative z-20 w-full">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 pb-12 text-center sm:px-8 sm:pb-14 lg:px-12 lg:pb-[clamp(2.5rem,7vh,5rem)]">
          <p
            className="animate-hero-in mb-4 text-[13px] tracking-wide text-gray-900 sm:mb-6 sm:text-[14px]"
            style={{ animationDelay: '120ms' }}
          >
            USC — Ukrainian Santechnical Company
          </p>
          <h1
            className="animate-hero-in font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.4rem,min(5vw,7.4vh),4.2rem)]"
            style={{ animationDelay: '240ms' }}
          >
            Сталева кульова арматура <br className="hidden sm:block" />
            для опалення, газу <br className="hidden sm:block" />
            та спеціальних застосувань.
          </h1>

          <div
            className="animate-hero-in mt-7 flex justify-center sm:mt-10"
            style={{ animationDelay: '420ms' }}
          >
            <Cta href="#catalog" size="lg" pulse>
              Перейти до каталогу
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
