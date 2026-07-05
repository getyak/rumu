# 入木 · Rumu · 老树

> **千年经典的活体年轮库。AI 长出主干，人类刻下署名的年轮，时间让它们入木。**
>
> A living annotation grove for canonical books: AI grows the trunk, humans carve the rings, time drives them into the wood.

入木不是一个内容站,也不是一个论坛。不是读书 App,不是笔记工具,不是 AI 聊天产品——更接近一座**可以走进去的、还在生长的碑林**。在 AI 洪水里,仍然亲自读的人,在一句话的两千年里,留下自己那一圈不可磨灭的年轮。

- **免登录看全部**:阅读、地层、故事,对所有人(和所有机器)开放。
- **落笔有门槛**:抄经解锁 → 锚定选体 → 苏格拉底守门 → 时间与同侪确认「入木」。
- **AI 只有结构,没有声音**:AI 长主干、做向导、挖故事、连图谱,但作者永不开口,AI 永不替你读书。

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

## 文档

产品的完整设计见 [`docs/`](./docs/):

| 文档 | 内容 |
|------|------|
| [00 概览](./docs/00-overview.md) | 一页读懂入木 |
| [01 愿景与命题](./docs/01-vision-and-thesis.md) | 为什么做、名字的含义、GEO 分发论题 |
| [02 信息架构](./docs/02-information-architecture.md) | 免登录、时间书架、书籍传记页 |
| [03 产品形态](./docs/03-product-form.md) | 阅读页、时间滑杆、句子房间、故事集 |
| [04 AI 与 Agent](./docs/04-ai-and-agents.md) | AI 铁律、五个接入点、守树人 |
| [05 社区与质量](./docs/05-community-and-quality.md) | 五层归属、留存玩法、倒逼优质评论 |
| [06 设计委托书](./docs/06-design-brief.md) | 「墨字朱批」视觉系统(给设计的 prompt) |

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
| `docs/` | Product definition: vision, information architecture, product form, AI rules, community, design brief. |

## Not yet built

`design/project/` also holds prototypes for 落笔流程 (writing an annotation),
考据, 分享卡, and 守树人 (the AI companion). Their entry points in the built
pages (抄录本章, 在此落笔, 与守树人细究此节, 留下名字…) are present as honest,
inert stubs — clicking them reveals the "读是自由的,落笔需要一个名字" prompt
rather than a fake flow.
