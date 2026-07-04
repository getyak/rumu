/**
 * Shared shape for a book's "一本书的传记" (biography) page — ported from the
 * Claude Design prototype `design/project/老树 · 道德经.dc.html`. Any book
 * (a scripture, a philosophy, a novel) plugs into <BookBio> by providing one
 * of these; the component itself carries no book-specific content.
 */

export type TimelineNode = {
  /** year / era label shown in the left rail (e.g. "公元 649 年") */
  year: string
  /** who this moment belongs to */
  who: string
  /** the story of this moment, in prose */
  story: string
  /** an anchored line of the text itself, quoted under the story */
  anchor?: string
  /** marks a turning point — rendered in cinnabar rather than muted ink */
  turning?: boolean
  /** "经文在此改变" — a side-by-side comparison of two versions of the text */
  compare?: {
    columns: [string, string]
    rows: [string, string][]
    linkLabel: string
    linkHref: string
  }
  /** the final "today" node — annotations replace the story as living growth */
  today?: boolean
}

export type Ring = {
  name: string
  genre: '注' | '疑' | '证' | '驳'
  state: '入木' | '青芽'
  date: string
  text: string
}

export type BookBioData = {
  slug: string
  title: string
  /** e.g. "書架 · 般若" */
  shelfLabel: string
  /** vertical decorative line beside the hero title */
  epigraph: string
  /** meta line under the title: origin, length, age */
  colophon: string
  /** the one-line thesis under the colophon */
  lead: string
  ctaLabel: string
  ctaHref: string
  biographyLabel: string
  nodes: TimelineNode[]
  rings: Ring[]
  footerLine: string
}
