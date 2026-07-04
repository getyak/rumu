/**
 * Per-book tree data for 我的树.
 *
 * Each book a reader has grown is its own tree: a trunk drawn in the same
 * 440×360 space, with branches (chapters read) and leaves (annotations left).
 * Adding a new book/theme means adding one entry here — the page component
 * itself carries no book-specific content.
 */

export type LeafKind = '' | 'cinnabar' | 'verdigris'
export type BranchState = '入木' | '青芽' | '读过'

export type Branch = {
  id: string
  /** short label shown on the branch itself */
  label: string
  /** full chapter name for the caption */
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
  /** the anchored line of scripture/text */
  source?: string
  /** the annotation itself */
  note?: string
  /** cinnabar signature + date */
  sign?: string
  /** a verdigris "someone continued you" thread hangs off this branch */
  thread?: { d: string; at: { x: number; y: number }; label: string }
}

export type Echo = {
  /** which branch id this echo recalls */
  branchId: string
  lead: string
  quote: string
  ask: string
}

export type Book = {
  id: string
  /** title shown in captions and the switcher */
  title: string
  /** short line under the title in the switcher */
  subtitle: string
  planted: string
  branches: Branch[]
  echo: Echo
}

const DAODEJING: Book = {
  id: 'daodejing',
  title: '道德经',
  subtitle: '老子 · 约公元前 4 世纪',
  planted: '种于 2023 年冬',
  branches: [
    {
      id: 'ch11',
      label: '十一',
      chapter: '第十一章',
      d: 'M 220 250 Q 276 234 332 231',
      w: 1.5,
      leaf: 'cinnabar',
      leafAt: { x: 332, y: 231 },
      labelAt: { x: 342, y: 235, anchor: 'start' },
      drawDelay: '0.9s',
      leafDelay: '1.7s',
      state: '入木',
      genre: '证',
      source: '当其无,有器之用。',
      note: '学陶那年最废的一只碗,是我捏得最厚的那只——几乎没有「无」,盛不下什么。',
      sign: '沈一苇 · 2023 冬',
      thread: { d: 'M 332 231 L 374 205', at: { x: 378, y: 201 }, label: '陈拾 · 3 年后接续' },
    },
    {
      id: 'ch8',
      label: '八',
      chapter: '第八章',
      d: 'M 220 214 Q 168 202 116 196',
      w: 1.4,
      leaf: '',
      labelAt: { x: 106, y: 200, anchor: 'end' },
      drawDelay: '1.15s',
      leafDelay: '1.7s',
      state: '读过',
      source: '上善若水。',
    },
    {
      id: 'ch44',
      label: '四十四',
      chapter: '第四十四章',
      d: 'M 221 176 Q 268 166 312 162',
      w: 1.3,
      leaf: 'verdigris',
      leafAt: { x: 312, y: 162 },
      labelAt: { x: 322, y: 166, anchor: 'start' },
      drawDelay: '1.4s',
      leafDelay: '2.0s',
      state: '青芽',
      genre: '证',
      source: '知足不辱,知止不殆。',
      note: '辞掉第二份工作的那晚我写:知道停在哪里,比知道去哪里难。',
      sign: '沈一苇 · 2025 春',
    },
    {
      id: 'ch22',
      label: '二十二',
      chapter: '第二十二章',
      d: 'M 220 146 Q 178 138 138 134',
      w: 1.2,
      leaf: '',
      labelAt: { x: 128, y: 138, anchor: 'end' },
      drawDelay: '1.65s',
      leafDelay: '2.2s',
      state: '读过',
      source: '曲则全,枉则直。',
    },
    {
      id: 'ch64',
      label: '六十四',
      chapter: '第六十四章',
      d: 'M 221 116 Q 256 108 288 105',
      w: 1.1,
      leaf: '',
      labelAt: { x: 298, y: 109, anchor: 'start' },
      drawDelay: '1.9s',
      leafDelay: '2.4s',
      state: '读过',
      source: '千里之行,始于足下。',
    },
  ],
  echo: {
    branchId: 'ch44',
    lead: '一年前的你,在「知足不辱,知止不殆」之下写过一枚青芽。',
    quote: '辞掉第二份工作的那晚我写:知道停在哪里,比知道去哪里难。',
    ask: '现在的你,还这么读吗?',
  },
}

/**
 * 《源氏物语》— 紫式部,约成书于 1008 年前后,五十四帖。
 * Chapters kept by their canonical 帖名 rather than a number, since that's
 * how the work is read and cited. Source lines are this reader's own
 * rendering of well-known passages, not a copyrighted translation.
 */
const GENJI: Book = {
  id: 'genji',
  title: '源氏物语',
  subtitle: '紫式部 · 约公元 1008 年',
  planted: '种于 2024 年秋',
  branches: [
    {
      id: 'kiritsubo',
      label: '桐壺',
      chapter: '第一帖 · 桐壺',
      d: 'M 220 250 Q 280 240 344 220',
      w: 1.5,
      leaf: 'cinnabar',
      leafAt: { x: 344, y: 220 },
      labelAt: { x: 354, y: 224, anchor: 'start' },
      drawDelay: '0.9s',
      leafDelay: '1.7s',
      state: '入木',
      genre: '证',
      source: '世间少有的容色,却也不是最尊贵的身份。',
      note: '我妈总说她一碗水端平,可我小时候就知道:弟弟感冒她请假守着,我感冒她只留一张退烧药的字条。桐壺更衣的恩宠也是这样——不是不爱,是爱不匀。',
      sign: '沈一苇 · 2024 秋',
      thread: { d: 'M 344 220 L 386 198', at: { x: 390, y: 194 }, label: '陆声 · 2 年后接续' },
    },
    {
      id: 'wakamurasaki',
      label: '若紫',
      chapter: '第五帖 · 若紫',
      d: 'M 220 214 Q 160 198 100 188',
      w: 1.4,
      leaf: '',
      labelAt: { x: 90, y: 192, anchor: 'end' },
      drawDelay: '1.15s',
      leafDelay: '1.7s',
      state: '读过',
      source: '看那雀儿,竟被犬君放跑了。',
    },
    {
      id: 'hotaru',
      label: '蛍',
      chapter: '第二十五帖 · 蛍',
      d: 'M 221 176 Q 272 164 320 156',
      w: 1.3,
      leaf: 'verdigris',
      leafAt: { x: 320, y: 156 },
      labelAt: { x: 330, y: 160, anchor: 'start' },
      drawDelay: '1.4s',
      leafDelay: '2.0s',
      state: '青芽',
      genre: '疑',
      source: '正史不过如实录一隅,物语反倒把心事写全了。',
      note: '写公众号第三年,我越写越怕——我记的到底是那年真发生的事,还是我现在希望它发生的样子?源氏说物语比正史更真,我疑心他只是在给自己找台阶。',
      sign: '沈一苇 · 2025 春',
    },
    {
      id: 'minori',
      label: '御法',
      chapter: '第四十帖 · 御法',
      d: 'M 220 146 Q 172 134 128 126',
      w: 1.2,
      leaf: '',
      labelAt: { x: 118, y: 130, anchor: 'end' },
      drawDelay: '1.65s',
      leafDelay: '2.2s',
      state: '读过',
      source: '秋风一乱,才知露水原来这样轻。',
    },
    {
      id: 'yumenoukihashi',
      label: '夢浮橋',
      chapter: '第五十四帖 · 夢浮橋',
      d: 'M 221 116 Q 260 106 296 100',
      w: 1.1,
      leaf: '',
      labelAt: { x: 306, y: 104, anchor: 'start' },
      drawDelay: '1.9s',
      leafDelay: '2.4s',
      state: '读过',
      source: '故事讲到这里,没有说完,就断了。',
    },
  ],
  echo: {
    branchId: 'hotaru',
    lead: '一年前的你,在「物语反倒把心事写全了」之下写过一枚青芽。',
    quote: '我记的到底是那年真发生的事,还是我现在希望它发生的样子?源氏说物语比正史更真,我疑心他只是在给自己找台阶。',
    ask: '现在的你,还这么疑吗?',
  },
}

export const BOOKS: Record<string, Book> = {
  daodejing: DAODEJING,
  genji: GENJI,
}

export const BOOK_ORDER = ['daodejing', 'genji']

export const LEAF_COLOR: Record<Exclude<LeafKind, ''>, string> = {
  cinnabar: 'var(--cinnabar)',
  verdigris: 'var(--verdigris)',
}
