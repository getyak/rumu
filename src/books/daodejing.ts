import type { Book } from './types'

/**
 * 道德經 — ported from the design handoff
 * (design/project/老树 · 道德经.dc.html + 老树 · 阅读页.dc.html).
 * This is the book already alluded to throughout 我的树; here it gets its
 * shelf card, its biography, and its one cultivated chapter to actually read.
 */
export const daodejing: Book = {
  id: 'daodejing',
  title: '道德經',
  category: '書架 · 道家',
  composedLabel: '约成书于公元前 400 年 · 五千言 · 已生长约 2,400 年 · 137 层年轮',
  tagline: '五千字,两千年读不尽。',
  marginQuote: '有之以为利,无之以为用',
  entryLabel: '进入第十一章,亲自读 →',
  shelf: {
    id: 'daodejing',
    title: '道德經',
    y: -400,
    w: '38px',
    h: '236px',
    fs: '16px',
    line: '五千字,两千年读不尽。',
    meta: '已生长约 2,400 年 · 137 层年轮',
    live: true,
    seal: true,
  },
  bio: [
    {
      yl: '前 400 前后',
      who: '守藏史出关',
      story:
        '传说周室的守藏史老聃西出函谷,关令尹喜请他留书。他写下五千言,不知所终。传说无从核证——但这五千字,真的留了下来。',
      anchor: '道可道,非常道。',
    },
    {
      yl: '前 300 前后',
      who: '郭店楚简',
      story:
        '现存最早的《老子》抄在竹简上,随一位无名的教书人下葬。仅今本三分之一,字句与后世多有不同——书的童年,和我们读到的它,并不是同一副面孔。',
    },
    {
      yl: '汉',
      who: '河上公章句',
      story:
        '一位传说住在河边的隐士,把它读成养生之书:治身与治国同理。此后近千年,多数中国人经由他的句读认识老子。',
    },
    {
      yl: '公元 240',
      who: '王弼注',
      story:
        '二十三岁的王弼以「无」统摄全书,注成次年病逝。此后近两千年,通行本几乎都循他的底本流传——一个年轻人的读法,成了这本书的正文。',
      anchor: '毂所以能统三十辐者,无也。',
    },
    {
      yl: '唐',
      who: '敦煌写本',
      story:
        '藏经洞封存着数百件《老子》写卷,出自无名抄经生之手。有人抄错了字,有人在卷尾记下当天的天气——普通人的笔迹,第一次大规模进入这本书的历史。',
    },
    {
      yl: '1893',
      who: '托尔斯泰',
      story:
        '晚年的托尔斯泰读到《道德经》,着手节译成俄文,把「无为」抄进日记。一位写了百万字的人,晚年信服了五千字。',
    },
    {
      yl: '1934',
      who: 'Arthur Waley 英译',
      story:
        '汉学家 Waley 译出 The Way and Its Power,英语世界第一次读到有严格学术依据的《道德经》。此后西方的每一个译本,都要先回答:同不同意 Waley。',
    },
    {
      yl: '1968',
      who: 'George Harrison《The Inner Light》',
      story:
        '他把第四十七章谱成《The Inner Light》,作为单曲 B 面发行——两千三百岁的句子,进了当年的排行榜。',
      anchor: '不出户,知天下;不窥牖,见天道。',
    },
    {
      yl: '1973',
      who: '马王堆帛书出土',
      story:
        '长沙马王堆三号汉墓打开,两卷帛书《老子》重见天日,抄写于公元前二世纪。人们发现:最早的它,和读了两千年的它,不完全是同一本书。',
      cin: true,
      special: {
        heading: '经文在此改变',
        left: { label: '读了两千年的通行本', lines: ['道可道,非常道', '三十辐,共一毂', '道经在前,德经在后'] },
        right: { label: '前 168 年下葬的帛书本', lines: ['道可道也,非恒道也', '卅辐,同一毂', '德经在前,道经在后'] },
        linkLabel: '在阅读页把时间拖过 1973,亲眼看经文改变 →',
      },
    },
    {
      yl: '1997',
      who: 'Ursula K. Le Guin 英译',
      story:
        '小说家 Le Guin 断续用了四十年完成她的英译。她不识古汉语,靠逐字对照与直觉把它译成诗;序言里她说,这是她读了一生的书。',
      anchor: '"where the wheel isn’t / is where it’s useful."',
    },
    {
      yl: '今 · 2026',
      who: '这本书仍在被写下',
      story: '时间线的最后一站,是正在生长的年轮。最近入木与新生的批注:',
      today: true,
      cin: true,
      noAsk: true,
    },
  ],
  rings: [
    {
      name: '沈一苇',
      badge: '证',
      tag: '入木',
      date: '2023',
      text: '站在腾空的房间中央忽然明白:这三年住的从来不是墙和柜子,是它们围出来的那块空。搬走那天,我才第一次读懂。',
    },
    {
      name: '周菡',
      badge: '疑',
      tag: '青芽',
      date: '2025',
      text: '杯壁是利,杯空是用——那手握住杯子的时候,握住的是利,还是用?',
    },
    {
      name: '陈拾',
      badge: '疑',
      tag: '青芽',
      date: '2026',
      text: '空,要被围起来、被需要,才成其为用?',
    },
  ],
  chapter: {
    id: 'ch11',
    label: '第十一章',
    min: -600,
    max: 2026,
    events: [
      { y: -400, label: '前 400 前后 · 《老子》约成书' },
      { y: -168, label: '前 168 · 帛书随葬马王堆,沉睡待醒', hidden: true, revealAt: 1973, verd: true },
      { y: 100, label: '汉 · 河上公章句' },
      { y: 240, label: '公元 240 · 王弼注' },
      { y: 1893, label: '1893 · 托尔斯泰节译《道德经》' },
      { y: 1906, label: '1906 · 冈仓天心《茶之书》引此章' },
      { y: 1934, label: '1934 · Arthur Waley 英译' },
      { y: 1939, label: '1939 · Frank Lloyd Wright 引老子论建筑' },
      { y: 1973, label: '1973 · 马王堆帛书出土,经文改写', cin: true },
      { y: 1997, label: '1997 · Le Guin 英译' },
      { y: 2023, label: '2023 · 沈一苇「证」入木' },
      { y: 2026, label: '2026 · 今,青芽初生' },
    ],
    sentences: [
      {
        text: '三十辐,共一毂,当其无,有车之用。',
        earliest: 240,
        compare: {
          segments: [
            { text: '三十', hoverable: true },
            { text: '辐,' },
            { text: '共', hoverable: true },
            { text: '一毂,当其无,有车之用。' },
          ],
          activeYear: 1973,
          footnote: '通行本「三十辐,共一毂」 · 帛书甲本「卅辐,同一毂」 · 前 168 年下葬,1973 年重见',
        },
        strata: [
          {
            src: '王弼《老子注》',
            yl: '公元 240',
            year: 240,
            badge: '注',
            body: '毂所以能统三十辐者,无也。以其无能受物之故,故能以寡统众也。',
          },
          {
            src: 'Arthur Waley',
            yl: '1934',
            year: 1934,
            badge: '注',
            body: '他以 "the space where there is nothing" 译「无」:用之所在,恰是一无所有之处。英语世界由此第一次系统读到此章。',
          },
          {
            src: '帛书对照',
            yl: '1973',
            year: 1973,
            ai: true,
            body: '长沙马王堆三号汉墓出土帛书甲、乙本,抄写于公元前二世纪,此句作「卅辐同一毂」。「卅」为「三十」合文;「同」与「共」义近而字异。经文的通行面貌与最早写本自此可对照。',
          },
          {
            src: 'Ursula K. Le Guin',
            yl: '1997',
            year: 1997,
            badge: '注',
            body: '"where the wheel isn’t / is where it’s useful." 她将此章题为 The uses of not。',
          },
          {
            src: '沈一苇',
            yl: '2023',
            year: 2023,
            badge: '证',
            tag: '入木',
            sig: '沈一苇',
            date: '2023 年 12 月',
            body: '去年冬天清空合租屋搬走,家具送人,只剩一只行李箱。站在腾空的房间中央忽然明白:这三年住的从来不是墙和柜子,是它们围出来的那块空。当其无,有室之用——搬走那天,我才第一次读懂。',
          },
          {
            src: '陈拾',
            yl: '2026',
            year: 2026,
            badge: '疑',
            tag: '青芽',
            sprout: true,
            follow: '3 年后 · 接续 沈一苇',
            sig: '陈拾',
            date: '2026 年 4 月',
            body: '可若那房间从此一直空着,不住人、不放箱子,这「无」还有用吗?无之为用,是不是必须以有为边界——空,要被围起来、被需要,才成其为用?',
          },
        ],
      },
      { text: '埏埴以为器,当其无,有器之用。', earliest: null, strata: [] },
      {
        text: '凿户牖以为室,当其无,有室之用。',
        earliest: 1906,
        strata: [
          {
            src: '冈仓天心《茶之书》',
            yl: '1906',
            year: 1906,
            badge: '证',
            body: '他借此章向西方讲茶室:真正的房间不在屋顶与四壁,而在其间的虚空。茶室因此别名「空之屋」——只在其中放入此刻需要之物,余皆留白。',
          },
          {
            src: 'Frank Lloyd Wright',
            yl: '1939',
            year: 1939,
            badge: '证',
            body: '他在伦敦演讲中说,建筑的实在不是墙与屋顶,而是其中可居的空间——"the space within to be lived in"。并承认:这个思想,老子比他早说了两千多年。',
          },
        ],
      },
      {
        text: '故有之以为利,无之以为用。',
        earliest: 100,
        strata: [
          {
            src: '河上公《老子章句》',
            yl: '汉',
            year: 100,
            badge: '注',
            body: '虚空者乃可用盛受万物,故曰虚无能制有形。道者空也。',
          },
          {
            src: '注家源流',
            yl: '',
            year: 100,
            ai: true,
            body: '「有」「无」在此并非对立:车、器、室三喻皆言器物因中空而成其用。历代注家于「利」「用」之分各有侧重——或以「利」属形、「用」属空,或以二者互为条件,不可偏废。',
          },
          {
            src: '苏辙《老子解》',
            yl: '约 1100',
            year: 1100,
            badge: '注',
            body: '非有则无以致其用,非无则有以施其利。有无相资,而后器成。',
          },
          {
            src: '周菡',
            yl: '2025',
            year: 2025,
            badge: '疑',
            tag: '青芽',
            sprout: true,
            sig: '周菡',
            date: '2025 年 8 月',
            body: '「利」与「用」到底怎么分?杯壁是利,杯空是用——那手握住杯子的时候,握住的是利,还是用?',
          },
        ],
      },
    ],
  },
}
