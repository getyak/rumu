# rumu · 老树

> 一个千年经典的活体年轮库:AI 长出土壤,人类在上面刻下署名的批注,时间让它们入木。

不是读书 App,不是笔记工具,不是 AI 聊天产品 —— 更接近一座**可以走进去的、还在生长的碑林**。

This repository holds the 老树 product front-end. The first page implemented is
**我的树 (My Tree)** — a reader's personal archive, rendered as an abstract, slowly
growing tree.

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

## 千年书架 · 源氏物語

A second book is now fully implemented end to end, alongside 我的树:

- **`/books`** — 千年书架, a small bookshelf listing every book on the site (道德經,
  still a placeholder; 源氏物語, live).
- **`/books/genji`** — 源氏物語's book biography (「一本书的传记」): a real textual
  history from 紫式部's 1008 diary entry, through the 青表纸本/河内本 manuscript
  split, 本居宣长's 物哀 theory, the Waley/Seidensticker/Tyler English translations,
  down to today's reader annotations (入木/青芽 rings).
- **`/books/genji/read`** — the reading page for 第一帖「桐壺」: the same signature
  time-slider interaction as the design's 阅读页, dragged or stepped across 1000–2026,
  opening a sentence into a "地层" (stratum) drawer of annotations that reveal
  themselves as the slider passes their year — commentary (四辻善成, 本居宣长),
  translations, and reader annotations, plus a hover-revealed 青表纸本/河内本
  wording-variant comparison.

There is no server-side routing — `src/router.tsx` is a tiny client-side path
router (no dependency added) used only to switch between these pages.

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
| `src/MyTree.tsx` | The 我的树 page component + its branch/annotation data |
| `src/MyTree.css` | Page layout, the SVG tree, hover reveal, growth rings |
| `src/router.tsx` | Minimal client-side path router + `<Link>` |
| `src/Header.tsx` / `.css` | Shared header chrome for the bookshelf/book/reader pages |
| `src/Bookshelf.tsx` / `.css` | `/books` — 千年书架 |
| `src/BookGenji.tsx` / `.css` | `/books/genji` — 源氏物語's book biography |
| `src/GenjiReader.tsx` / `.css` | `/books/genji/read` — 源氏物語 reading page + time slider |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on this page |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Not yet built

`design/project/` also holds prototypes for 道德經's own book/reading pages,
落笔流程, 句子房间, 考据, 分享卡, 守树人. `我的树` links out to `/read` and `/inscribe`
as placeholders for those routes; the bookshelf's 道德經 card is likewise still a
placeholder pending its own port.
