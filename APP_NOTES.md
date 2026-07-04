# 老树 · 我的树 & 首页书架

The **我的树** (My Tree) personal-archive page and the **首页书架** (Bookshelf)
timeline page from the 老树 design commission, implemented as a real React +
Vite + TypeScript app.

我的树 is a port of the Claude Design prototype at
`design/project/老树 · 我的树.dc.html`, recreated pixel-for-pixel outside the
proprietary `dc-runtime` format. 首页书架 is a port of
`design/project/老树 · 首页书架.dc.html`. 我的树 was originally hardcoded to a
single book (道德经); it's now generic over a `Book` (see `src/books/`), driven
by the `/tree/:bookId` route, so the shelf can link into any planted book's
tree. A second book, **《心经》** (the Buddhist Heart Sutra), was added this way
end to end: shelf entry, five annotated branches, and its own 周年回声.

## What the page is

Each reader grows an abstract tree:

- **枝 (branches)** — chapters/passages read, labelled either by chapter number
  (道德经: 十一, 八, 四十四…) or a two-character theme tag for a book with no
  chapters (心经: 色空, 五蕴, 空相…).
- **叶 (leaves)** — annotations left. A **朱砂 (cinnabar)** leaf is 入木 — enshrined,
  set alongside the ancients. A **青绿 (verdigris)** leaf is 青芽 — a sprout still
  awaiting time and peers.
- **细线 (thread)** — a dashed verdigris line where someone continued your line across
  the years ("陈拾 · 3 年后接续").
- Below the tree: the **周年回声 (anniversary echo)** — last year's writing, asked back
  to you today.

Per the design bible there are **no counts anywhere** — quantity is expressed by form,
never by a number badge. The one accent colour is cinnabar, used sparingly.

The tree is a **hand-drawn SVG that draws itself on** as it grows: the trunk draws up
from the root, branches extend outward in sequence, and leaves fade in. Faint **年轮
(growth rings)** sit at the root, echoing the product mark. After growth the tree holds a
barely-there idle sway. **Hover or focus any branch** to quietly surface what was written
there — the anchored line of scripture, the annotation, its 注/疑/证/驳 genre, and a dated
cinnabar signature — shown as an inline caption, never a bubble. A **夜读 / 昼读** toggle
switches to the "reading by lamplight" dark atmosphere. Everything respects
`prefers-reduced-motion`, and the sway/grain quiet down accordingly.

Design notes, all inside the 禁则 (no counts, no gradients, no glow, cinnabar sparingly):

- Quantity is shown by **form** (branches, leaves, rings), never a number badge.
- **Cinnabar** marks the human hand: signatures, the active/hovered branch, genre badges.
- The tree's one 青芽 sprout's annotation is the same one echoed in **周年回声** below — the
  tree and the memory are one story. (道德经: 第四十四章; 心经: 「诸法空相」句.)

## 首页书架 (Bookshelf)

`/` lays every book on a horizontal timeline positioned by the age of its text
(`MIN=-600` to `MAX=2026`), not a grid — a book from 400 BCE sits far from one
from 1980. Planked spines grow up from the timeline on load (`growUp`); a live
book is an `<a>` into `/tree/:bookId`, a not-yet-planted one is an inert span
with lowered opacity. Hovering any plank raises a caption card with its teaser
line and a "已生长约 N 年 · M 层年轮" meta line, matching the same 无计数原则 as
我的树 — these are decorative age/rings, not user-facing counts of anything.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Structure

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Router: `/` → Bookshelf, `/tree/:bookId` → MyTree |
| `src/Bookshelf.tsx` / `.css` | The 首页书架 timeline page |
| `src/MyTree.tsx` / `.css` | The 我的树 page, generic over a `Book` |
| `src/books/types.ts` | `Book` / `Branch` / `ShelfEntry` data model |
| `src/books/daodejing.ts`, `src/books/xinjing.ts` | Per-book data |
| `src/books/index.ts` | `BOOKS`, `PLACEHOLDER_BOOKS`, `getBook()` |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |

Sibling links (回到阅读, 回去看看, 接续一年前的自己, 考据) point at routes for pages
that are elsewhere in the commission and not built in this project. Visiting
`/tree/:bookId` for a placeholder (not-yet-planted) book id shows a small
"这本书还没有种下" state with a link back to the shelf, instead of a blank tree.
