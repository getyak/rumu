# rumu · 老树

> 一个千年经典的活体年轮库:AI 长出土壤,人类在上面刻下署名的批注,时间让它们入木。

不是读书 App,不是笔记工具,不是 AI 聊天产品 —— 更接近一座**可以走进去的、还在生长的碑林**。

This repository holds the 老树 product front-end. The first page implemented is
**我的树 (My Tree)** — a reader's personal archive, rendered as an abstract, slowly
growing tree.

## 我的树 (My Tree)

A reader may grow more than one tree — one per book. A switcher below the
reader's name moves between them without leaving the page. Two are grown so
far: **《道德经》** (老子, planted 2023) and **《源氏物语》** (紫式部, planted
2024), each with its own planting date, chapters, and annotations. Adding a
new themed book is a matter of adding one entry to `src/books.ts` — the page
component itself carries no book-specific content.

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
| `src/MyTree.tsx` | The 我的树 page component (book-agnostic) |
| `src/books.ts` | Per-book tree data — branches, annotations, echo. Add a book here. |
| `src/MyTree.css` | Page layout, the SVG tree, hover reveal, growth rings |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on this page |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Not yet built

`design/project/` holds prototypes for the rest of the product: 首页书架, 书籍详情页,
阅读页 (the design's stated priority — its "signature" screen with the time-slider),
落笔流程, 句子房间, 考据, 分享卡, 守树人. `我的树` links out to `/read` and `/inscribe`
as placeholders for those routes.
