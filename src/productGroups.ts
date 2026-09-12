/**
 * Grouping rules for the flat price-list categories.
 *
 * `products.ts` is auto-generated from the retail price list, so it must stay a
 * faithful dump of it. This file sits on top: it folds dozens of near-identical
 * rows ("Відвід кований d 15 х 2,5", "d 20 х 2,8", …) into a single product card
 * whose modal shows the description plus a parsed size table.
 *
 * Adding a rule never loses data — anything a category's rules don't match ends
 * up in the "Інше" bucket, so a regenerated price list degrades gracefully.
 */
import type { ProductCategory } from './products'

export type ProductGroup = {
  id: string
  name: string
  blurb?: string
  image?: string
  /** Table head for the size list. */
  columns: string[]
  /** One row per price-list position, cells aligned with `columns`. */
  rows: string[][]
}

type Rule = {
  id: string
  name: string
  blurb?: string
  image?: string
  columns: string[]
  /** Cheap pre-filter; `parse` still decides. Rules are tried in order. */
  match: RegExp
  parse: (item: string) => string[] | null
}

/* ------------------------------------------------------------------ */
/* Rules                                                               */
/* ------------------------------------------------------------------ */

const BENDS_RULES: Rule[] = [
  {
    id: 'vidvid-kovanyy',
    name: 'Відвід кований',
    blurb:
      'Відвід сталевий кований 90° для різьбових з’єднань трубопроводів. Використовується для зміни напрямку траси у системах водо- і газопостачання та опалення. Постачається упаковками.',
    columns: ['Діаметр d, мм', 'Товщина стінки, мм', 'Упаковка, шт.'],
    match: /^Відвід кований/i,
    parse: (s) => {
      const m = s.match(/^Відвід кований\s*d\s*(\d+)\s*[хx]\s*([\d,]+)\s*\(\s*(\d+)\s*шт/i)
      return m ? [`d ${m[1]}`, m[2].trim(), m[3]] : null
    },
  },
  {
    id: 'mufta-stalna',
    name: 'Муфта стальна',
    blurb:
      'Муфта сталева різьбова для з’єднання двох труб в один прямий відрізок. Виготовляється за ГОСТ 8966-75 та у скорочених виконаннях. Ду15–Ду80.',
    columns: ['Ду', 'Довжина L, мм', 'Товщина стінки, мм', 'Стандарт'],
    match: /^Муфта стальна/i,
    parse: (s) => {
      const m = s.match(/^Муфта стальна\s*Ду(\d+)\s*L=\s*(\d+)\s*[xх]\s*([\d,]+)\s*(.*)$/i)
      return m ? [`Ду${m[1]}`, m[2], m[3].trim(), m[4].trim() || '—'] : null
    },
  },
  {
    id: 'zgin',
    name: 'Згін',
    blurb:
      'Згін сталевий — короткий відрізок труби з довгою та короткою різьбою, що дає змогу розібрати з’єднання без різання труби. Комплектується у складі згін-муфта-контргайка. d15–d80.',
    columns: ['Діаметр d, мм', 'Довжина L, мм', 'Упаковка, шт.'],
    match: /^Згін/i,
    parse: (s) => {
      const m = s.match(/^Згін\s*d\s*(\d+)\s*\(\s*(\d+)\s*шт\.?\s*\)\s*L\s*=?\s*(\d+)/i)
      return m ? [`d ${m[1]}`, m[3], m[2]] : null
    },
  },
  {
    id: 'rizba-dvostoronnya',
    name: 'Різьба двухстороння (бочата)',
    blurb:
      'Двостороння різьба (бочата) — короткий патрубок із зовнішньою різьбою з обох боків для з’єднання двох муфтових елементів. d15–d80.',
    columns: ['Діаметр d, мм', 'Довжина L, мм'],
    match: /^Різьба двухстороння/i,
    parse: (s) => {
      const m = s.match(/^Різьба двухстороння\s*d\s*(\d+)\D*L\s*=?\s*(\d+)/i)
      return m ? [`d ${m[1]}`, m[2]] : null
    },
  },
  {
    id: 'rizba-dovga',
    name: 'Різьба довга',
    blurb:
      'Довга різьба (сгінна) — патрубок із подовженою зовнішньою різьбою, що дозволяє «набігти» муфтою й розібрати вузол. d15–d80.',
    columns: ['Діаметр d, мм', 'Довжина L, мм', 'Упаковка, шт.'],
    match: /^Різьба довга/i,
    parse: (s) => {
      const m = s.match(/^Різьба довга\s*d\s*(\d+)\s*\(\s*(\d+)\s*шт\.?\s*\)\s*L\s*=?\s*(\d+)/i)
      return m ? [`d ${m[1]}`, m[3], m[2]] : null
    },
  },
  {
    id: 'rizba',
    name: 'Різьба коротка',
    blurb:
      'Коротка різьба — патрубок із зовнішньою різьбою для приєднання арматури до трубопроводу. d15–d80.',
    columns: ['Діаметр d, мм', 'Довжина L, мм', 'Упаковка, шт.'],
    match: /^Різьба\s*d/i,
    parse: (s) => {
      const m = s.match(/^Різьба\s*d\s*(\d+)\s*\(\s*(\d+)\s*шт\.?\s*\)\s*L\s*=?\s*(\d+)/i)
      return m ? [`d ${m[1]}`, m[3], m[2]] : null
    },
  },
]

const REDUCERS_RULES: Rule[] = [
  {
    id: 'perehid-manometr',
    name: 'Перехід під манометр',
    blurb:
      'Перехідник для встановлення манометра, коли різьба приладу не збігається з різьбою бобишки або відбірного пристрою. Метричні та трубні різьби, внутрішні та зовнішні.',
    columns: ['Приєднання 1', 'Приєднання 2'],
    match: /^Перехід під манометр/i,
    parse: (s) => {
      const rest = s.replace(/^Перехід під манометр\s*/i, '').trim()
      if (rest.includes(' - ')) {
        const [a, b] = rest.split(' - ')
        return [a.trim(), b.trim()]
      }
      const m = rest.match(/^(.*?(?:вн|зв))\s+(.+)$/i)
      return m ? [m[1].trim(), m[2].trim()] : [rest, '—']
    },
  },
  {
    id: 'bobyshka',
    name: 'Бобишка',
    blurb:
      'Бобишка — приварний штуцер для монтажу манометра або термометра на трубопровід чи посудину. Виконання під ключ s24 / s32, довжини L35–L50 мм.',
    columns: ['Виконання'],
    match: /^Бобишка/i,
    parse: (s) => [s.replace(/^Бобишка\s*/i, '').trim()],
  },
  {
    id: 'zaglushka',
    name: 'Заглушка стальна',
    blurb:
      'Заглушка сталева різьбова для герметичного закриття вільного кінця труби або невикористаного відводу. Внутрішня та зовнішня різьба, d15–d20.',
    columns: ['Діаметр d, мм', 'Різьба'],
    match: /^Заглушка стальна/i,
    parse: (s) => {
      const m = s.match(/^Заглушка стальна\s*d\s*(\d+)\s*(вн|зв)/i)
      return m ? [`d ${m[1]}`, m[2].toLowerCase() === 'вн' ? 'внутрішня' : 'зовнішня'] : null
    },
  },
]

const TAPPING_RULES: Rule[] = [
  {
    id: 'vrizniy-homut',
    name: 'Хомут врізний універсальний',
    blurb:
      'Універсальний врізний хомут із нержавіючої сталі для влаштування відводу від діючого трубопроводу без зупинки подачі. Відведення — фланець DN50–250 або різьба 2″, довжина корпусу L200–500 мм.',
    columns: ['DN труби, мм'],
    match: /^DN труби/i,
    parse: (s) => {
      const m = s.match(/(\d+)/)
      return m ? [m[1]] : null
    },
  },
]

const KMCH_RULES: Rule[] = [
  {
    id: 'kmch-all',
    name: 'КМЧ — кріпильно-монтажні частини',
    blurb:
      'Комплект кріпильно-монтажних частин для встановлення лічильника газу чи регулятора: різьбові з’єднання, прокладки та кріплення. Типорозміри 3/4″–2″ і DN32–DN50.',
    columns: ['Типорозмір'],
    match: /^КМЧ/i,
    parse: (s) => [s.replace(/^КМЧ\s*/i, '').trim()],
  },
]

/** "Ящик монтажний ВОГ до лічильника газу G-4 (…) — 390x180x420" */
const boxParse = (s: string): string[] | null => {
  const [head, dims] = s.split(' — ')
  if (!dims) return null
  const purpose = head
    .replace(/^Ящик монтажний\s*(ВОГ\s*)?/i, '')
    .replace(/^до\s*/i, '')
    .trim()
  return [purpose.charAt(0).toUpperCase() + purpose.slice(1), dims.trim()]
}

const BOXES_RULES: Rule[] = [
  {
    id: 'yashchyk-vog',
    name: 'Ящик монтажний ВОГ',
    blurb:
      'Ящик монтажний ВОГ — вузол обліку газу в зборі: корпус із оцинкованого металу з порошковим фарбуванням, розрахований на розміщення лічильника разом із регулятором або байпасом із кранів. Для G-4…G-25.',
    columns: ['Призначення', 'Габарити Ш×Г×В, мм'],
    match: /^Ящик монтажний ВОГ/i,
    parse: boxParse,
  },
  {
    id: 'yashchyk',
    name: 'Ящик монтажний',
    blurb:
      'Ящик монтажний із оцинкованого металу з порошковим фарбуванням для захисту лічильника або регулятора газу від опадів і механічних пошкоджень. Вертикальні та горизонтальні виконання, G-4…G-10.',
    columns: ['Призначення', 'Габарити Ш×Г×В, мм'],
    match: /^Ящик монтажний/i,
    parse: boxParse,
  },
]

/** "Адаптер фронтальний 3\4ʺ 92 мм" */
const adapterParse = (s: string): string[] | null => {
  const m = s.match(/^Адаптер\s+(?:фронтальний|боковий)\s+(.+?)\s+(\d+)\s*мм\s*$/i)
  return m ? [m[1].replace(/\\/g, '/').trim(), m[2]] : null
}

const ADAPTERS_RULES: Rule[] = [
  {
    id: 'adapter-frontalnyy',
    name: 'Адаптер фронтальний',
    blurb:
      'Фронтальний адаптер для приєднання побутового лічильника газу, коли підводка виконана спереду. Типорозміри 3/4″–1 1/4″, міжосьова відстань 92 і 100 мм.',
    columns: ['Різьба', 'Міжосьова відстань, мм'],
    match: /^Адаптер фронтальний/i,
    parse: adapterParse,
  },
  {
    id: 'adapter-bokovyy',
    name: 'Адаптер боковий',
    blurb:
      'Боковий адаптер для приєднання побутового лічильника газу при боковій підводці. Типорозміри 3/4″–1 1/4″, міжосьова відстань 100 мм.',
    columns: ['Різьба', 'Міжосьова відстань, мм'],
    match: /^Адаптер боковий/i,
    parse: adapterParse,
  },
]

/* ------------------------------------------------------------------ */

/** Categories not listed here keep their flat one-card-per-position grid. */
const RULES: Record<string, Rule[]> = {
  bends: BENDS_RULES,
  reducers: REDUCERS_RULES,
  tapping: TAPPING_RULES,
  kmch: KMCH_RULES,
  boxes: BOXES_RULES,
  adapters: ADAPTERS_RULES,
}

/**
 * Positions duplicated across categories in the price list. "Переходи, бобишки,
 * заглушки" repeats the whole Згін / Різьба range that already lives in
 * "Відводи, муфти, згони, різьби", differing only in spacing ("L=70" vs "L 70").
 * They are hidden here, not deleted, so the generated file stays untouched.
 */
const DUPLICATES: Record<string, RegExp[]> = {
  /* `\b` is ASCII-only — it never matches after a Cyrillic letter. */
  reducers: [/^Згін\s/i, /^Різьба\s/i],
}

/**
 * Fold a category's flat item list into product groups.
 * Returns `null` when the category should keep its current flat rendering
 * (its positions are genuinely distinct products, usually with own photos).
 */
export function groupCategory(cat: ProductCategory): ProductGroup[] | null {
  const rules = RULES[cat.id]
  if (!rules || !cat.items?.length) return null

  const dupes = DUPLICATES[cat.id] ?? []
  const buckets = new Map<string, string[][]>()
  const rest: string[] = []

  for (const item of cat.items) {
    if (dupes.some((re) => re.test(item))) continue
    const rule = rules.find((r) => r.match.test(item))
    const row = rule?.parse(item) ?? null
    if (!rule || !row) {
      rest.push(item)
      continue
    }
    const rows = buckets.get(rule.id)
    if (rows) rows.push(row)
    else buckets.set(rule.id, [row])
  }

  const groups: ProductGroup[] = rules
    .filter((r) => buckets.has(r.id))
    .map((r) => ({
      id: r.id,
      name: r.name,
      blurb: r.blurb,
      image: r.image ?? cat.image,
      columns: r.columns,
      rows: buckets.get(r.id) as string[][],
    }))

  if (rest.length) {
    groups.push({
      id: 'other',
      name: 'Інші позиції',
      blurb: 'Позиції категорії, що не входять до наведених вище груп.',
      image: cat.image,
      columns: ['Найменування'],
      rows: rest.map((s) => [s]),
    })
  }

  return groups.length ? groups : null
}

/** Memoised per category — the rules are pure, the price list never changes. */
const cache = new Map<string, ProductGroup[] | null>()
export function getGroups(cat: ProductCategory): ProductGroup[] | null {
  if (!cache.has(cat.id)) cache.set(cat.id, groupCategory(cat))
  return cache.get(cat.id) ?? null
}
