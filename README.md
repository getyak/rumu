# rumu · 老树

> 一个千年经典的活体年轮库:AI 长出土壤,人类在上面刻下署名的批注,时间让它们入木。

不是读书 App,不是笔记工具,不是 AI 聊天产品 —— 更接近一座**可以走进去的、还在生长的碑林**。

This repository holds the 老树 product front-end. Two pages are implemented:
**我的树 (My Tree)** — a reader's personal archive, rendered as an abstract, slowly
growing tree — and **源氏物语 (The Tale of Genji)** — a book's "biography" told as a
scroll-revealed timeline of its thousand-year transmission.

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

## 源氏物语 · 一本书的传记

A book detail page ported from the same pattern as the unbuilt `design/project/老树
· 道德经.dc.html` prototype, but for a different theme: Murasaki Shikibu's 11th-century
*Tale of Genji*, generally regarded as the world's first great novel.

The book is told as a vertical timeline — twelve real, dateable moments in its
transmission, from the earliest textual trace (a 1008 diary entry) through the split
into two rival manuscript lineages (青表纸本 vs 河内本, ~1225–1255), Motoori Norinaga's
"物哀" (mono no aware), Arthur Waley's and Royall Tyler's English translations, and
Yamato Waki's fourteen-year manga adaptation. Nodes reveal on scroll
(`IntersectionObserver`, honouring `prefers-reduced-motion`). The final node, "this
book is still being written," carries reader annotations in the same 朱砂/青绿
(入木/青芽) convention as 我的树. Visit `/genji` (linked from 我的树's nav).

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
| `src/Genji.tsx` | The 源氏物语 book-biography page component + its timeline/ring data |
| `src/Genji.css` | Page layout, timeline reveal, comparison box, reader rings |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, shared header/nav chrome |
| `src/main.tsx` | Renders `MyTree` at `/`, `Genji` at `/genji` — a plain path switch, no router dependency yet |
| `APP_NOTES.md` | Detailed notes on this page |
| `design/` | The original Claude Design handoff bundle — chat transcript + all page prototypes. The source of truth for the pages not yet built. |

## Not yet built

`design/project/` holds prototypes for the rest of the product: 首页书架, 阅读页 (the
design's stated priority — its "signature" screen with the time-slider), 落笔流程,
句子房间, 考据, 分享卡, 守树人. `我的树` and `源氏物语` link out to `/read`, `/inscribe`
and `/kaoju` as placeholders for those routes.
