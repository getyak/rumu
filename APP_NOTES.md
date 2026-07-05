# 老树 · 我的树

The **我的树** (My Tree) personal-archive page from the 老树 design commission,
implemented as a real React + Vite + TypeScript app.

It's a port of the Claude Design prototype at `design/project/老树 · 我的树.dc.html`,
recreated pixel-for-pixel outside the proprietary `dc-runtime` format.

## What the page is

Each reader grows an abstract tree:

- **枝 (branches)** — chapters read, labelled with their number (十一, 八, 四十四…).
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
- The 四十四 sprout's annotation is the same one echoed in **周年回声** below — the tree and
  the memory are one story.

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
| `src/MyTree.tsx` | The page component and its branch data |
| `src/MyTree.css` | Page layout + hover affordances |
| `src/theme.css` | Design tokens (墨字朱批 palette), day/night themes, keyframes |

Sibling links (回到阅读, 回去看看, 接续一年前的自己) point at routes for pages that
are elsewhere in the commission and not built in this project.
