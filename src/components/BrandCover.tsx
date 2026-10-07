import proteForest from '../assets/prote-forest.jpg'
import proteWordmark from '../assets/prote-wordmark.png'
import proteLogo from '../assets/prote-logo.png'
import kranyCover from '../assets/krany-cover.jpg'
import uscEmblem from '../assets/usc-emblem.webp'
import uscWordmark from '../assets/usc-wordmark.png'

/** Product-line cover — a wide photo with the brand lockup (round mark +
 *  wordmark) meeting on its lower edge. The parent needs the `group` class for
 *  the hover zoom and ~64px of top padding below for the overhanging lockup. */
export function BrandCover({
  cover,
  coverAlt,
  logo,
  logoAlt,
  wordmark,
  wordmarkAlt,
  size = 'lg',
}: {
  cover: string
  coverAlt: string
  logo: string
  logoAlt: string
  wordmark: string
  wordmarkAlt: string
  /** `md` — shorter cover for the half-width cards on the home page */
  size?: 'md' | 'lg'
}) {
  return (
    <div className="relative">
      <div
        className={`w-full overflow-hidden ${
          size === 'lg' ? 'h-[150px] sm:h-[210px] lg:h-[240px]' : 'h-[150px] sm:h-[180px]'
        }`}
      >
        <img
          src={cover}
          alt={coverAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="absolute -bottom-8 left-5 flex items-end gap-3 sm:-bottom-9 sm:left-8 sm:gap-4">
        <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:h-[92px] sm:w-[92px]">
          <img
            src={logo}
            alt={logoAlt}
            className="h-[60px] w-[60px] object-contain sm:h-[74px] sm:w-[74px]"
          />
        </span>
        <img src={wordmark} alt={wordmarkAlt} className="h-[24px] w-auto object-contain sm:h-[30px]" />
      </div>
    </div>
  )
}

/** PROTE partner line: USC mark × PROTE wordmark on the forest photo. */
export function ProteCover({ size }: { size?: 'md' | 'lg' }) {
  return (
    <BrandCover
      cover={proteForest}
      coverAlt="PROTE — технології для захисту довкілля"
      logo={proteLogo}
      logoAlt="USC — Ukrainian Santechnical Company"
      wordmark={proteWordmark}
      wordmarkAlt="PROTE"
      size={size}
    />
  )
}

/** USC ball valves: USC emblem × USC wordmark on the product photos. */
export function KranyCover({ size }: { size?: 'md' | 'lg' }) {
  return (
    <BrandCover
      cover={kranyCover}
      coverAlt="Кульові крани TM USC — фланцеві та приварні"
      logo={uscEmblem}
      logoAlt="USC — Ukrainian Santechnical Company"
      wordmark={uscWordmark}
      wordmarkAlt="USC"
      size={size}
    />
  )
}
