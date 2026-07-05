/**
 * Shared shape for every book in the 老树 shelf.
 * One "book" bundles three things visitors move between:
 *  - a shelf listing (千年书架 — a dot on the shared historical timeline)
 *  - a biography (书籍详情页 — the book's own life, node by node)
 *  - one fully-cultivated chapter to actually read (阅读页 — the time slider)
 * Chapters not yet cultivated are honest about it rather than faked.
 */

/** One stop in a book's biography timeline. */
export type BioNode = {
  /** year label as shown on the page, e.g. "前 400 前后" or "公元 868" */
  yl: string
  /** who/what this node is about */
  who: string
  story: string
  /** an anchored line of the scripture itself, quoted under the story */
  anchor?: string
  /** renders the "经文在此改变" variant-comparison box */
  special?: {
    heading: string
    left: { label: string; lines: string[] }
    right: { label: string; lines: string[] }
    linkLabel: string
  }
  /** the final "still being written" node showing live reader rings */
  today?: boolean
  /** cinnabar (vs. muted ink-light) dot + year color */
  cin?: boolean
  /** suppress the "与守树人细究此节" prompt (used on the `today` node) */
  noAsk?: boolean
}

/** A reader's ring left on a book's biography page. */
export type BioRing = {
  name: string
  badge: '注' | '疑' | '证' | '驳'
  tag: '入木' | '青芽'
  date: string
  text: string
}

/** One historical/reader layer inside a sentence's "地层" (strata) drawer. */
export type StrataLayer = {
  src: string
  yl: string
  year: number
  badge?: '注' | '疑' | '证' | '驳'
  tag?: '入木' | '青芽'
  /** an AI-curated base layer — foldable, rendered a shade quieter */
  ai?: boolean
  /** a reader's sprout — verdigris accent instead of cinnabar */
  sprout?: boolean
  /** "N 年后 · 接续 X" thread label shown above this layer */
  follow?: string
  sig?: string
  date?: string
  body: string
}

/** One run of a sentence, some of which carry a hoverable textual-variant footnote. */
export type CompareSegment = { text: string; hoverable?: boolean }

/** Words within a sentence that carry a hoverable textual-variant footnote. */
export type CompareSpan = {
  segments: CompareSegment[]
  /** year at/after which the comparison is unlockable */
  activeYear: number
  footnote: string
  /**
   * true when the hoverable segment is text ADDED after activeYear (e.g. a
   * colophon) and should stay hidden until then, rather than an in-place
   * variant (e.g. a character swap) that's always present, just inert.
   */
  appended?: boolean
}

export type ReadingSentence = {
  text: string
  /** year the earliest strata layer appears; null = no drawer for this sentence */
  earliest: number | null
  strata: StrataLayer[]
  compare?: CompareSpan
}

export type ReadingEvent = {
  y: number
  label: string
  cin?: boolean
  verd?: boolean
  /** only shown once displayYear has reached revealAt (a "sleeping" event) */
  hidden?: boolean
  revealAt?: number
}

/** The one chapter of a book that's been fully cultivated for /read. */
export type ReadingChapter = {
  id: string
  label: string
  min: number
  max: number
  events: ReadingEvent[]
  sentences: ReadingSentence[]
}

/** A book's position + card on the shared 千年书架 timeline. */
export type ShelfEntry = {
  id: string
  title: string
  /** year on the shared -600..2026 shelf axis */
  y: number
  w: string
  h: string
  fs: string
  line: string
  meta: string
  live: boolean
  seal?: boolean
}

export type Book = {
  id: string
  title: string
  category: string
  composedLabel: string
  tagline: string
  marginQuote: string
  entryLabel: string
  shelf: ShelfEntry
  bio: BioNode[]
  rings: BioRing[]
  chapter: ReadingChapter
}
