# rumu · 老树

> 一个千年经典的活体年轮库:AI 长出土壤,人类在上面刻下署名的批注,时间让它们入木。

不是读书 App,不是笔记工具,不是 AI 聊天产品 —— 更接近一座**可以走进去的、还在生长的碑林**。

This repository holds the 老树 product front-end: a shelf of books (`/`), each with
its own biography (`/book/:id`) and one cultivated chapter to actually read
(`/book/:id/read`), plus a reader's personal archive (`/my-tree`).

Two books are live:

- **道德經** — ported from the design handoff, at `/book/daodejing`.
- **金剛經** — the 佛家 (Buddhist) book added alongside it: Kumārajīva's 402
  translation, the Sixth Patriarch's awakening at "应无所住而生其心", the 868
  Dunhuang scroll (the earliest dated complete printed book known to survive),
  and Kerouac copying its closing gāthā into his notebooks. At
  `/book/diamondSutra`, reading chapter 第三十二分 · 应化非真分.

`论语`, `庄子`, `Meditations`, and `源氏物語` sit on the shelf as honest "待种下"
ghosts — not yet cultivated, per the product's own rule that emptiness should
read as room to grow, not a bug to hide.

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
| `src/MyTree.tsx` | The 我的树 page component + its branch/annotation data |
| `src/MyTree.css` | Page layout, the SVG tree, hover reveal, growth rings |
| `src/books/types.ts` | Shared `Book` shape: shelf card, biography timeline, one cultivated reading chapter |
| `src/books/daodejing.ts`, `src/books/diamondSutra.ts` | The two live books' full content |
| `src/books/registry.ts` | `books` + `comingSoon` (the shelf's "待种下" ghosts) |
| `src/pages/Bookshelf.tsx` | `/` — 千年书架, books on a shared historical axis |
| `src/pages/BookDetail.tsx` | `/book/:id` — 书籍详情页, a book's biography timeline |
| `src/pages/Reading.tsx` | `/book/:id/read` — 阅读页, the time slider + sentence-strata drawer |
| `src/components/Header.tsx`, `src/hooks/useNightMode.ts` | Shared brand/nav bar and 夜读/昼读 toggle |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on 我的树 specifically |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. |

## Not yet built

`design/project/` also holds prototypes for 落笔流程 (writing an annotation),
考据, 分享卡, and 守树人 (the AI companion). Their entry points in the built
pages (抄录本章, 在此落笔, 与守树人细究此节, 留下名字…) are present as honest,
inert stubs — clicking them reveals the "读是自由的,落笔需要一个名字" prompt
rather than a fake flow.
