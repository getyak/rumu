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

## 一本经的传记 (Book Biography)

A second page, reachable from 我的树's nav (`心经 · 一本经的传记`) or directly at
`/book/heart-sutra`: the **书籍详情页** design — a book's biography — implemented
for the **心经 (Heart Sutra)**, the shortest and most-repeated text in the
Mahayana canon.

Where 我的树 is one reader's private archive, this page is a book's public
history: a vertical timeline from its Indian Prajñāpāramitā roots through
Kumārajīva's 402 CE translation, Xuanzang's 649 CE definitive version, Huairen's
672 CE Wang Xizhi calligraphy stele, anonymous Dunhuang manuscripts, Edward
Conze's 1948 critical Sanskrit edition, its adoption into Western Zen practice,
Jan Nattier's 1992 "Chinese apocryphal text" hypothesis (rendered as a
side-by-side **经文在此改变**, "the text changes here", comparison — the same
device the design uses for the *Tao Te Ching*'s Mawangdui silk manuscripts),
Thich Nhat Hanh's 2014 retranslation, and finally today's still-growing **年轮**
of readers' annotations.

The component (`src/BookBio.tsx`) is book-agnostic — it renders whatever
`BookBioData` (`src/books/types.ts`) it's given. Adding another themed book
(a Western philosophy text, 源氏物语, or anything else) is a matter of writing
a new `src/books/*.ts` data file and a route in `src/main.tsx`; no page code
needs to change.

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
| `src/BookBio.tsx` | The 一本书的传记 page — book-agnostic; renders a `BookBioData` |
| `src/BookBio.css` | Its layout: hero, timeline, 经文在此改变 comparison, growth rings |
| `src/books/types.ts` | The `BookBioData` shape a themed book plugs in |
| `src/books/heartSutra.ts` | Content for 心经 (Heart Sutra) — the first themed book |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |
| `APP_NOTES.md` | Detailed notes on this page |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Not yet built

`design/project/` holds prototypes for the rest of the product: 首页书架, 书籍详情页,
阅读页 (the design's stated priority — its "signature" screen with the time-slider),
落笔流程, 句子房间, 考据, 分享卡, 守树人. `我的树` links out to `/read` and `/inscribe`
as placeholders for those routes.
