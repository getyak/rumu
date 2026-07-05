import type { Book } from './types'
import { daodejing } from './daodejing'
import { diamondSutra } from './diamondSutra'
import { xinjing } from './xinjing'
import { genji } from './genji'

export const books: Book[] = [daodejing, diamondSutra, xinjing, genji]

export function getBook(id: string | undefined): Book | undefined {
  return books.find((b) => b.id === id)
}

/** A book not yet planted — shown as a ghost on the shelf, per the design's honesty about what isn't built yet. */
export type ComingSoonEntry = {
  id: string
  title: string
  y: number
  w: string
  h: string
  fs: string
  line: string
  meta: string
}

export const comingSoon: ComingSoonEntry[] = [
  { id: 'lunyu', title: '論語', y: -480, w: '26px', h: '212px', fs: '14px', line: '半部,治天下。', meta: '已生长约 2,500 年 · 待种下' },
  { id: 'zhuangzi', title: '莊子', y: -300, w: '20px', h: '192px', fs: '13px', line: '谬悠之说,荒唐之言,无端崖之辞。', meta: '已生长约 2,300 年 · 待种下' },
  {
    id: 'meditations',
    title: 'Meditations',
    y: 170,
    w: '18px',
    h: '178px',
    fs: '12px',
    line: '身外之物,不能定义你的判断。',
    meta: '马可·奥勒留 · 已生长约 1,850 年 · 待种下',
  },
]
