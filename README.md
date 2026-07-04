# rumu · 老树

> 一个千年经典的活体年轮库:AI 长出土壤,人类在上面刻下署名的批注,时间让它们入木。

不是读书 App,不是笔记工具,不是 AI 聊天产品 —— 更接近一座**可以走进去的、还在生长的碑林**。

This repository holds the 老树 product front-end. The pages implemented so far are
**首页书架 (Bookshelf)** — a timeline of every planted book — and, per book,
**我的树 (My Tree)** — a reader's personal archive, rendered as an abstract, slowly
growing tree.

## 首页书架 (Bookshelf)

The home page (`/`) lays every book on a timeline by the age of its text, not a
grid. Two books are planted (live) and walkable:

- **《道德经》** (Taoism, ~5th century BCE)
- **《心经》** (Buddhism, the Heart Sutra, Xuanzang's 7th-century translation)

论语 and 庄子 sit on the same timeline as **即将种下** (soon to be planted)
placeholders — ghosts of a growing library, not yet clickable. Hovering any plank
shows a teaser card; clicking a live one walks into that book's 我的树.

## 我的树 (My Tree)

Each reader grows a tree:

- **枝 (branches)** — chapters read, labelled with their number (十一, 八, 四十四…).
- **叶 (leaves)** — annotations left. A **朱砂 (cinnabar)** leaf is **入木** (enshrined,
  set alongside the ancients); a **青绿 (verdigris)** leaf is **青芽** (a sprout, still
  awaiting time and peers).
- **细线 (thread)** — a dashed verdigris line where someone continued your line across
  the years.
- **年轮 (growth rings)** at the root, echoing the product mark.

The tree is a hand-drawn SVG that draws itself on as it grows. Hover or focus any branch
to quietly surface what was written there — the scripture line, the annotation, its
注/疑/证/驳 genre, and a dated cinnabar signature. Below the tree sits the **周年回声
(anniversary echo)**, and a **夜读 / 昼读** toggle switches to the "reading by lamplight"
dark atmosphere. Everything respects `prefers-reduced-motion`.

Per the design bible there are **no counts anywhere** — quantity is expressed by form,
never a number badge — and cinnabar, the colour of the human hand, is used sparingly.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build
```

## Layout

| Path | What |
| --- | --- |
| `src/Bookshelf.tsx` | The 首页书架 (`/`) timeline page |
| `src/Bookshelf.css` | Its layout, timeline ticks, plank hover cards |
| `src/MyTree.tsx` | The 我的树 (`/tree/:bookId`) page — generic, driven by a `Book` |
| `src/MyTree.css` | Page layout, the SVG tree, hover reveal, growth rings |
| `src/books/types.ts` | Shared `Book` / `Branch` / `ShelfEntry` data model |
| `src/books/daodejing.ts` | 《道德经》's branches, annotations, shelf entry |
| `src/books/xinjing.ts` | 《心经》's branches, annotations, shelf entry |
| `src/books/index.ts` | Book registry (`BOOKS`, `PLACEHOLDER_BOOKS`, `getBook`) |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on these pages |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Adding a book

A book is just an entry in `src/books/`: a `Book` (title, reader, planted date,
branches with their annotations, the anniversary echo, and a shelf entry for the
timeline) registered in `src/books/index.ts`. A book without a real tree yet can
be added to `PLACEHOLDER_BOOKS` instead — it shows on the shelf as **即将种下**
and isn't clickable until it has real branch data.

## Not yet built

`design/project/` holds prototypes for the rest of the product: 书籍详情页,
阅读页 (the design's stated priority — its "signature" screen with the time-slider),
落笔流程, 句子房间, 考据, 分享卡, 守树人. `我的树` links out to `/read` and `/inscribe`
as placeholders for those routes.
