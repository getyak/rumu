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

## 金剛經 · 一本书的传记

The second page implemented is a **书籍详情页** (book detail page) — a book's
biography, scrolling from its composition through the hands that carried it
forward, ending in the living 年轮 of today's readers. It ports the design's
`老树 · 道德经.dc.html` prototype into a reusable `BookPage` component, and
supplies it with real content for **《金刚经》** (the Diamond Sutra): from its
composition in India, through Kumārajīva's 402 CE translation and Xuanzang's
later retranslation, Huìnéng's awakening on hearing its central line, the 868
CE Dunhuang scroll — the oldest complete, dated printed book known to survive —
its 1900 rediscovery and 1907 removal to London, and on to today's readers'
own 注/疑/证/驳 annotations.

Visit it at `/books/jingangjing`, or follow the `金刚经` link from 我的树's nav.

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
| `src/BookPage.tsx` | The 书籍详情页 component — any book's biography timeline |
| `src/BookPage.css` | Page layout, timeline reveal, comparison aside, rings |
| `src/books/types.ts` | Shared `BookData` shape a book's data must supply |
| `src/books/diamondSutra.ts` | 《金刚经》's data — timeline, translation comparison, rings |
| `src/main.tsx` | Renders 我的树 at `/`, a book page at `/books/:slug` |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on the 我的树 page |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Not yet built

`design/project/` holds prototypes for the rest of the product: 首页书架
(the bookshelf home — no book is on it yet), 阅读页 (the design's stated
priority — its "signature" screen with the time-slider), 落笔流程, 句子房间, 考据,
分享卡, 守树人. `我的树` links out to `/read` and `/inscribe`, and the book page's
CTAs link to `/books/jingangjing/read` and `/books/jingangjing/compare`, all as
placeholders for those routes.
