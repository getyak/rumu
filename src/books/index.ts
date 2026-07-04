import type { Book, ShelfPlaceholder } from './types'
import { daodejing } from './daodejing'
import { xinjing } from './xinjing'

export type { Book, Branch, LeafKind, BranchState, Echo, ShelfEntry } from './types'

/** Every book with a real 我的树 page, keyed by id (used in the /tree/:bookId route). */
export const BOOKS: Record<string, Book> = {
  [daodejing.id]: daodejing,
  [xinjing.id]: xinjing,
}

export function getBook(id: string | undefined): Book | undefined {
  return id ? BOOKS[id] : undefined
}

/** Books shown on 首页书架 that haven't been planted yet — shelf display only. */
export const PLACEHOLDER_BOOKS: ShelfPlaceholder[] = [
  {
    id: 'lunyu',
    shelf: {
      shortTitle: '論語',
      year: -480,
      width: '26px',
      height: '212px',
      fontSize: '14px',
      seal: false,
      line: '半部,治天下。',
      meta: '已生长约 2,500 年 · 待种下',
      live: false,
    },
  },
  {
    id: 'zhuangzi',
    shelf: {
      shortTitle: '莊子',
      year: -300,
      width: '20px',
      height: '192px',
      fontSize: '13px',
      seal: false,
      line: '谬悠之说,荒唐之言,无端崖之辞。',
      meta: '已生长约 2,300 年 · 待种下',
      live: false,
    },
  },
]

/** All books in shelf-display order, live and not-yet-planted alike. */
export const SHELF_BOOKS = [
  ...Object.values(BOOKS).map((b) => ({ id: b.id, shelf: b.shelf })),
  ...PLACEHOLDER_BOOKS,
]
