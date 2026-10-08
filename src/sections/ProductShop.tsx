import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown, Check, X, Gauge } from 'lucide-react'

import { PRODUCT_CATEGORIES, type ProductCategory, type ProductType } from '../products'
import { getGroups, type ProductGroup } from '../productGroups'
import { catCount, typeSizeCount, plural } from '../lib/catalog'
import { CATEGORY_JUMP_EVENT } from '../lib/paths'
import { Cta, ValveMark } from '../components/ui'
import { KRANY_SPECS, KV } from '../kranySpecs'
import { track } from '../lib/analytics'

type SelectedProduct = { cat: ProductCategory; item: string }
type SelectedType = { cat: ProductCategory; type: ProductType }
type SelectedGroup = { cat: ProductCategory; group: ProductGroup }

/* Shop-style catalogue: category rail + clickable product-card grid */
/** Mobile category picker — bottom sheet matching the main menu. */
function CategorySheet({
  categories,
  activeId,
  onPick,
  onClose,
}: {
  categories: ProductCategory[]
  activeId: string
  onPick: (id: string) => void
  onClose: () => void
}) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    /* Bring the current category into view on short screens */
    activeRef.current?.scrollIntoView({ block: 'nearest' })
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Оберіть категорію"
    >
      <div
        className="animate-menu-fade absolute inset-0 bg-gray-900/50 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div className="animate-slide-up absolute inset-x-0 bottom-0 mx-2 mb-2 flex max-h-[78vh] flex-col overflow-hidden rounded-[26px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.22)]">
        <div className="flex justify-center pb-1 pt-3">
          <span className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 pb-2 pt-1">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Оберіть категорію
          </h4>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          >
            <X size={17} />
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
          {categories.map((c) => {
            const isActive = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  ref={isActive ? activeRef : undefined}
                  onClick={() => onPick(c.id)}
                  aria-current={isActive}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left transition-colors ${
                    isActive ? 'bg-[#1E7FC2] text-white' : 'text-gray-700 active:bg-gray-50'
                  }`}
                >
                  <span className="flex w-4 shrink-0 justify-center">
                    {isActive && <Check size={15} />}
                  </span>
                  <span
                    className={`min-w-0 flex-1 text-[14.5px] leading-[1.3] ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {c.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1E7FC2]/10 text-[#1E7FC2]'
                    }`}
                  >
                    {catCount(c)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function ProductShop({
  categories = PRODUCT_CATEGORIES,
}: {
  categories?: ProductCategory[]
}) {
  /* `?cat=<id>` lets other pages (their nav) open the catalog on a category */
  const [activeId, setActiveId] = useState(() => {
    const cat = new URLSearchParams(window.location.search).get('cat')
    return categories.find((c) => c.id === cat)?.id ?? categories[0].id
  })
  const [item, setItem] = useState<SelectedProduct | null>(null)
  const [openType, setOpenType] = useState<SelectedType | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<SelectedGroup | null>(null)
  const active = categories.find((c) => c.id === activeId) ?? categories[0]
  const groups = getGroups(active)

  /* Nav links (desktop dropdown + mobile sheet) dispatch this to jump straight
   * to a category instead of just scrolling to the top of the catalog. */
  useEffect(() => {
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (categories.some((c) => c.id === id)) setActiveId(id)
    }
    window.addEventListener(CATEGORY_JUMP_EVENT, onJump)
    return () => window.removeEventListener(CATEGORY_JUMP_EVENT, onJump)
  }, [categories])

  return (
    <div className="lg:grid lg:grid-cols-[248px_1fr] lg:gap-8">
      {/* Category navigation — horizontal chips on mobile, sidebar on desktop */}
      <aside className="mb-6 lg:mb-0">
        {/* Mobile: one row that opens a full category sheet */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-transform active:scale-[0.99] lg:hidden"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] leading-none text-gray-400">Категорія</span>
            <span className="mt-1 block truncate text-[15px] font-semibold text-gray-900">
              {active.name}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#1E7FC2]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1E7FC2]">
            {catCount(active)}
          </span>
          <ChevronDown size={16} className="shrink-0 text-gray-400" />
        </button>

        <ul className="hidden overflow-hidden rounded-2xl bg-white p-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)] lg:block">
          {categories.map((c) => {
            const isActive = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  aria-current={isActive}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] leading-[1.3] transition-colors ${
                    isActive
                      ? 'bg-[#1E7FC2] font-medium text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="min-w-0">{c.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1E7FC2]/10 text-[#1E7FC2]'
                    }`}
                  >
                    {catCount(c)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Product grid for the active category */}
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-gray-900 sm:text-[19px]">{active.name}</h3>
          <span className="shrink-0 text-[13px] text-gray-500">
            {active.types
              ? `${active.types.length} типів приєднання`
              : groups
                ? `${groups.length} ${plural(groups.length, 'позиція', 'позиції', 'позицій')} · ${groups.reduce((n, g) => n + g.rows.length, 0)} типорозмірів`
                : `${active.items?.length ?? 0} позицій`}
          </span>
        </div>

        {active.types ? (
          /* Connection-type cards: one per type, opens the size list */
          <TypeCards cat={active} onOpen={(t) => setOpenType({ cat: active, type: t })} />
        ) : groups ? (
          /* Grouped cards: near-identical price-list rows folded into one product */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setOpenGroup({ cat: active, group: g })}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                  {g.image ? (
                    <img
                      src={g.image}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
                  )}
                </span>
                <span className="flex flex-1 flex-col p-3 sm:p-4">
                  <span className="text-[13px] font-semibold leading-[1.35] text-gray-900 sm:text-[14px]">
                    {g.name}
                  </span>
                  <span className="mt-1 text-[12px] text-gray-500">
                    {g.rows.length}{' '}
                    {plural(g.rows.length, 'типорозмір', 'типорозміри', 'типорозмірів')}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                    Дивитись розміри
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {(active.items ?? []).map((it, i) => {
              const key = `${active.id}-${i}`
              const itImg = active.itemImages?.[it] ?? active.image
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setItem({ cat: active, item: it })}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                >
                  <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                    {itImg ? (
                      <img
                        src={itImg}
                        alt={it}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-3 sm:p-4">
                    <span className="line-clamp-3 text-[12.5px] font-medium leading-[1.4] text-gray-800 sm:text-[13px]">
                      {it}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                      Детальніше
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {active.note && (
          <p className="mt-5 flex items-start gap-2 text-[12.5px] leading-[1.5] text-gray-500">
            <Gauge size={14} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
            {active.note}
          </p>
        )}
      </div>

      {pickerOpen && (
        <CategorySheet
          categories={categories}
          activeId={activeId}
          onPick={(id) => {
            setActiveId(id)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
      {item && <ProductModal product={item} onClose={() => setItem(null)} />}
      {openGroup && (
        <GroupModal
          cat={openGroup.cat}
          group={openGroup.group}
          onClose={() => setOpenGroup(null)}
        />
      )}
      {openType && (
        <TypeModal cat={openType.cat} type={openType.type} onClose={() => setOpenType(null)} />
      )}
    </div>
  )
}

/** Connection-type cards of a category (ball valves): photo, size count, and
 *  a click that opens the size table. Used by the catalog and the valves page. */
export function TypeCards({
  cat,
  onOpen,
  className = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4',
}: {
  cat: ProductCategory
  onOpen: (type: ProductType) => void
  className?: string
}) {
  return (
    <div className={className}>
      {(cat.types ?? []).map((t) => {
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onOpen(t)}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <span className="flex aspect-square items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <ValveMark className="h-10 w-10 fill-current text-[#1E7FC2]/25" />
              )}
            </span>
            <span className="flex flex-1 flex-col p-3 sm:p-4">
              <span className="text-[13px] font-semibold leading-[1.35] text-gray-900 sm:text-[14px]">
                {t.name}
              </span>
              <span className="mt-1 text-[12px] text-gray-500">
                {typeSizeCount(t)} типорозмірів
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1E7FC2]">
                Дивитись розміри
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* Product detail dialog — opened by clicking a product card */
function ProductModal({
  product,
  onClose,
}: {
  product: SelectedProduct
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={product.item}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          {(() => {
            const img = product.cat.itemImages?.[product.item] ?? product.cat.image
            return img ? (
              <img
                src={img}
                alt={product.item}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <ValveMark className="h-16 w-16 fill-current text-[#1E7FC2]/25" />
            )
          })()}
        </div>
        <div className="p-5 sm:p-6">
          <span className="text-[12px] font-medium text-[#1E7FC2]">{product.cat.name}</span>
          <h4 className="mt-1 text-[16px] font-semibold leading-[1.35] text-gray-900 sm:text-[17px]">
            {product.item}
          </h4>
          {product.cat.note && (
            <p className="mt-3 text-[13px] leading-[1.6] text-gray-500">{product.cat.note}</p>
          )}
          <Cta href="#contact-details" onClick={onClose} className="mt-5">
            Залишити запит
          </Cta>
        </div>
      </div>
    </div>
  )
}

/* Grouped-product dialog — photo, description and the parsed size table */
function GroupModal({
  cat,
  group,
  onClose,
}: {
  cat: ProductCategory
  group: ProductGroup
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={group.name}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-modal-in relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header — photo + description */}
        <div className="border-b border-gray-100 p-5 pr-14 sm:flex sm:gap-5 sm:p-6 sm:pr-16">
          <div className="mb-4 flex h-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 p-3 sm:mb-0 sm:h-32 sm:w-32">
            {group.image ? (
              <img
                src={group.image}
                alt={group.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            ) : (
              <ValveMark className="h-12 w-12 fill-current text-[#1E7FC2]/25" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-[#1E7FC2]">{cat.name}</span>
            <h4 className="mt-1 text-[17px] font-semibold leading-[1.3] text-gray-900 sm:text-[19px]">
              {group.name}
            </h4>
            {group.blurb && (
              <p className="mt-2 text-[13px] leading-[1.6] text-gray-500">{group.blurb}</p>
            )}
          </div>
        </div>

        {/* Scrollable size table */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gray-800">Доступні типорозміри</span>
            <span className="text-[12px] text-gray-400">{group.rows.length} шт.</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  {group.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-gray-100">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-3 py-1.5 ${
                          ci === 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                        } ${cell.length <= 12 ? 'whitespace-nowrap' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cat.note && (
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.5] text-gray-500">
              <Gauge size={14} className="mt-0.5 shrink-0 text-[#1E7FC2]" />
              {cat.note}
            </p>
          )}

          <Cta href="#contact-details" onClick={onClose} className="mt-6">
            Залишити запит
          </Cta>
        </div>
      </div>
    </div>
  )
}

/* Connection-type dialog — lists every available size for the chosen type */
export function TypeModal({
  cat,
  type,
  onClose,
}: {
  cat: ProductCategory
  type: ProductType
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => track('view_size_table', { type: type.name, category: cat.name }), [type.name, cat.name])

  /* Ball valves carry the catalog's dimension tables and drawing */
  const specs = cat.id === 'ball-valves' ? KRANY_SPECS[type.id] : undefined
  const cols = specs?.columns ?? []
  const legend = cols.filter((c) => c.hint)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={type.name}
    >
      <div className="animate-overlay-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`animate-modal-in relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          !specs ? 'max-w-2xl' : cols.length > 11 ? 'max-w-6xl' : 'max-w-5xl'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Scrollable body: description (+ drawing and legend), then the size tables */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div
            className={`border-b border-gray-100 p-5 pr-14 sm:p-6 sm:pr-16 ${
              specs ? 'md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:gap-8' : ''
            }`}
          >
            <div>
              <span className="text-[12px] font-medium text-[#1E7FC2]">{cat.name}</span>
              <h4 className="mt-1 text-[17px] font-semibold leading-[1.3] text-gray-900 sm:text-[19px]">
                {type.name}
              </h4>
              {type.blurb && (
                <p className="mt-2 text-[13px] leading-[1.6] text-gray-500">{type.blurb}</p>
              )}
              {legend.length > 0 && (
                <dl className="mt-4 grid grid-cols-1 gap-x-5 gap-y-1 text-[12px] leading-[1.45] sm:grid-cols-2">
                  {legend.map((c) => (
                    <div key={c.key} className="flex gap-1.5">
                      <dt className="w-6 shrink-0 font-semibold text-gray-900">{c.key}</dt>
                      <dd className="text-gray-500">{c.hint}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {specs && (
              <figure className="mt-4 md:mt-0">
                <img
                  src={specs.scheme}
                  alt={`Креслення: ${type.name.toLowerCase()} — позначення розмірів`}
                  className="max-h-[200px] w-full rounded-xl border border-gray-100 bg-white object-contain p-2"
                />
                <figcaption className="mt-1.5 text-[11px] text-gray-400">
                  Креслення з каталогу USC 2026
                </figcaption>
              </figure>
            )}
          </div>

          <div className="px-5 py-4 sm:px-6">
            {specs && (
              <p className="mb-3 text-[12px] text-gray-500">
                Розміри — у мм, маса — у кг, Kv — пропускна здатність, м³/год.
              </p>
            )}
            {type.variants.map((v, vi) => {
              const bore = v.label.startsWith('Завуж') ? 'СП' : v.label.startsWith('Повн') ? 'ПП' : ''
              const withKv = !!specs && bore !== ''
              return (
                <div key={vi} className={vi > 0 ? 'mt-6' : ''}>
                  {v.label && (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-800">{v.label}</span>
                      <span className="text-[12px] text-gray-400">{v.sizes.length} шт.</span>
                    </div>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full border-collapse text-left text-[12.5px]">
                      <thead>
                        <tr className="bg-gray-50 text-[11px] text-gray-500">
                          <th className="sticky left-0 bg-gray-50 px-3 py-2 font-medium uppercase tracking-wide">DN</th>
                          <th className="px-3 py-2 font-medium uppercase tracking-wide">PN</th>
                          <th className="px-3 py-2 font-medium uppercase tracking-wide">Артикул</th>
                          {cols.map((c) =>
                            c.key === 'm' ? (
                              <th key={c.key} className="whitespace-nowrap px-2.5 py-2 text-center font-medium">Маса, кг</th>
                            ) : (
                              <th key={c.key} title={c.hint} className="whitespace-nowrap px-2.5 py-2 text-center text-[12px] font-semibold text-gray-700">
                                {c.key}
                              </th>
                            ),
                          )}
                          {withKv && <th className="whitespace-nowrap px-2.5 py-2 text-center font-medium">Kv</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {v.sizes.map((s, si) => {
                          const reductor = !!s.code && s.code.includes('.302')
                          const row = specs?.rows[`${bore}:${s.dn}:${s.pn}`]
                          const onRequest = !!row && row[0] === 'за запитом'
                          const kv = KV[s.dn]?.[bore as 'СП' | 'ПП']
                          return (
                            <tr key={si} className="border-t border-gray-100">
                              <td className="sticky left-0 whitespace-nowrap bg-white px-3 py-1.5 font-medium text-gray-900">
                                DN{s.dn}
                              </td>
                              <td className="whitespace-nowrap px-3 py-1.5 text-gray-600">PN{s.pn}</td>
                              <td className="whitespace-nowrap px-3 py-1.5">
                                <span className="font-mono text-[11.5px] text-gray-700">{s.code}</span>
                                {reductor && (
                                  <span className="ml-2 whitespace-nowrap rounded bg-[#F5B915]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#8a6d0b]">
                                    редуктор
                                  </span>
                                )}
                              </td>
                              {specs &&
                                (onRequest ? (
                                  <td colSpan={cols.length} className="px-2.5 py-1.5 text-center text-gray-500">
                                    за запитом
                                  </td>
                                ) : (
                                  (row ?? Array(cols.length).fill('—')).map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`whitespace-nowrap px-2.5 py-1.5 text-center tabular-nums ${
                                        cols[ci]?.key === 'm' ? 'font-medium text-gray-900' : 'text-gray-600'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))
                                ))}
                              {withKv && (
                                <td className="whitespace-nowrap px-2.5 py-1.5 text-center tabular-nums text-gray-600">
                                  {kv ?? '—'}
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}

            <Cta href="#contact-details" onClick={onClose} className="mt-6">
              Залишити запит
            </Cta>
          </div>
        </div>
      </div>
    </div>
  )
}
