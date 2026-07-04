/**
 * Shared data model for a book's 我的树 (My Tree) page.
 * A book is read by growing branches (chapters/passages read) and leaves
 * (annotations left on them). See MyTree.tsx for how this renders.
 */

export type LeafKind = '' | 'cinnabar' | 'verdigris'
export type BranchState = '入木' | '青芽' | '读过'

export type Thread = {
  /** SVG path for the dashed verdigris continuation line */
  d: string
  at: { x: number; y: number }
  /** who continued this branch, and when */
  label: string
}

export type Branch = {
  id: string
  /** short label shown on the branch (chapter numeral, or a two-character theme tag) */
  label: string
  /** longer chapter/passage reference used in the detail caption */
  chapter: string
  /** SVG path drawn on as the branch grows */
  d: string
  /** stroke width — upper (younger) branches read thinner */
  w: number
  leaf: LeafKind
  leafAt?: { x: number; y: number }
  labelAt: { x: number; y: number; anchor: 'start' | 'end' }
  drawDelay: string
  leafDelay: string
  state: BranchState
  /** 注/疑/证/驳 — only annotated branches carry a genre */
  genre?: string
  /** the anchored line of scripture */
  source?: string
  /** the annotation itself */
  note?: string
  /** cinnabar signature + date */
  sign?: string
  /** a verdigris "someone continued you" thread hangs off this branch */
  thread?: Thread
}

/** 周年回声 — last year's writing, asked back to the reader today. */
export type Echo = {
  lead: string
  quote: string
  ask: string
}

/** Where a book sits on the 首页书架 (bookshelf) timeline. */
export type ShelfEntry = {
  /** vertical spine text */
  shortTitle: string
  /** year on the timeline; negative is BCE */
  year: number
  width: string
  height: string
  fontSize: string
  /** carries a cinnabar seal dot — at least one 入木 leaf exists */
  seal: boolean
  /** teaser line shown on the hover card */
  line: string
  /** decorative "grown for / rings" meta line */
  meta: string
  /** whether the book has a real page (vs. "即将种下" placeholder) */
  live: boolean
}

export type Book = {
  id: string
  /** full title, e.g. 《道德经》 */
  title: string
  readerName: string
  /** e.g. "种于 2023 年冬" */
  plantedLabel: string
  branches: Branch[]
  echo: Echo
  shelf: ShelfEntry
}

/** A book on the shelf that hasn't been planted yet — shelf display only, no tree page. */
export type ShelfPlaceholder = {
  id: string
  shelf: ShelfEntry
}
