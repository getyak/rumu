/**
 * Shared shape for a "书籍详情页" (一本书的传记 — a book's biography):
 * a scrollable timeline of who carried the text forward, ending in the
 * living 年轮 of readers' own annotations. Ported from the design's
 * 老树 · 道德经.dc.html prototype, generalised so any book can supply
 * its own data.
 */

export type TimelineNode = {
  id: string
  /** the year/era label shown on the left rail */
  year: string
  /** who this node belongs to (a person, a discovery, an edition) */
  who: string
  /** the story prose for this node */
  story: string
  /** an anchored line of scripture, set off in its own block */
  anchor?: string
  /** render the year in cinnabar — marks a pivotal node */
  cinnabar?: boolean
  /** render the `comparison` aside directly after this node */
  special?: boolean
  /** render the `rings` (readers' annotations) block after this node */
  today?: boolean
  /** hide the "与守树人细究此节" prompt (the `today` node has its own CTA instead) */
  noAsk?: boolean
}

export type RingNote = {
  name: string
  genre: '注' | '疑' | '证' | '驳'
  state: '入木' | '青芽'
  date: string
  text: string
}

export type Comparison = {
  /** small cinnabar label, e.g. "经文在此改变" */
  label: string
  columns: [string, string]
  rows: [string, string][]
  note: string
  cta: { label: string; href: string }
}

export type BookData = {
  slug: string
  /** 書架 · 佛典 — the shelf category shown above the title */
  shelfCategory: string
  title: string
  /** short vertical accent quote beside the hero title */
  sideQuote: string
  metaLine: string
  heroQuote: string
  ctaLabel: string
  ctaHref: string
  timeline: TimelineNode[]
  comparison: Comparison
  rings: RingNote[]
  footerLine: string
}
