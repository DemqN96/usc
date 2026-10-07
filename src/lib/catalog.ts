import type { ProductCategory, ProductType } from '../products'
import { getGroups } from '../productGroups'

/** Number of clickable product cards shown for a category. */
export const catCount = (c: ProductCategory) =>
  c.types ? c.types.length : getGroups(c)?.length ?? c.items?.length ?? 0

export const typeSizeCount = (t: ProductType) =>
  t.variants.reduce((n, v) => n + v.sizes.length, 0)

/** Ukrainian plural form: 1 позиція / 2–4 позиції / 5+ позицій. */
export const plural = (n: number, one: string, few: string, many: string) => {
  const d = n % 10
  const dd = n % 100
  if (d === 1 && dd !== 11) return one
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return few
  return many
}
