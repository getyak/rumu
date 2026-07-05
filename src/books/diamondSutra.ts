import type { BookData } from './types'

/**
 * 《金剛經》(金刚般若波罗蜜经, the Vajracchedikā Prajñāpāramitā Sūtra) —
 * a Mahāyāna Buddhist sutra composed in India within the Prajñāpāramitā
 * corpus, framed as a dialogue between the Buddha and his disciple
 * Subhūti. Its Chinese transmission runs through Kumārajīva's 402 CE
 * translation, the Chan/Zen tradition (Huìnéng's awakening on hearing
 * its central line), and the 868 CE Dunhuang scroll — the oldest complete,
 * dated printed book known to survive.
 */
export const diamondSutra: BookData = {
  slug: 'jingangjing',
  shelfCategory: '書架 · 佛典',
  title: '金剛經',
  sideQuote: '是法平等,无有高下',
  metaLine: '约成书于公元前 1 世纪 · 五千余言 · 汉译已逾 1,600 年 · 现存最早刻本刻于 868 年',
  heroQuote: '五千余言,只讲一件事:凡所有相,皆是虚妄。',
  ctaLabel: '读一读须菩提与佛陀的这场问答 →',
  ctaHref: '/books/jingangjing/read',
  footerLine: '越老的书,年轮越厚。',
  timeline: [
    {
      id: 'jetavana',
      year: '约前 1 世纪',
      who: '祇树给孤独园的问答',
      story:
        '在舍卫城外的祇园,须菩提问佛陀:发愿救度众生的心,要如何安住,如何降伏?这场问答后来被记下,成为《般若经》系统中最凝练的一卷——般若智慧的"金刚",能断一切执念。作者始终无名,是历代僧团共同持诵、共同打磨出的一卷经。',
      anchor: '凡所有相,皆是虚妄。若见诸相非相,即见如来。',
    },
    {
      id: 'kumarajiva',
      year: '公元 402',
      who: '鸠摩罗什译场',
      story:
        '龟兹高僧鸠摩罗什半生辗转,被后凉、后秦两代权力争夺,晚年才在长安逍遥园主持译经,座下僧众数百人。他译笔简净流畅,把这卷梵文经文译成汉地千年来诵读最多的佛典——多数中国人认识《金刚经》,认识的正是他的文字。',
      anchor: '一切有为法,如梦幻泡影,如露亦如电,应作如是观。',
    },
    {
      id: 'xuanzang',
      year: '约公元 660',
      who: '玄奘重译',
      story:
        '玄奘西行十七年,带回大量梵本,晚年主持译出六百卷《大般若经》,其中收有他自己的《金刚经》译本——更贴近梵文原貌,连结尾偈子的譬喻数目都与罗什本不同。可是僧俗诵习已成习惯,这个更"准确"的译本,始终没能取代那个更早、更美的声音。',
      cinnabar: true,
      special: true,
    },
    {
      id: 'huineng',
      year: '约 7 世纪',
      who: '慧能闻经而悟',
      story:
        '相传岭南樵夫慧能卖柴市中,偶闻人诵此经至"应无所住而生其心"一句,心中豁然。他北上黄梅求法,后成禅宗六祖。《坛经》记下这一刻——一个不识字的樵夫,由一句经文改变一生,禅宗由此重新以《金刚经》为宗。',
      anchor: '应无所住,而生其心。',
    },
    {
      id: 'wangjie',
      year: '868',
      who: '王玠印造此经',
      story:
        '唐懿宗咸通九年四月十五日,一位叫王玠的信众出资,请人刻版印造此经,"普施"于人,只为替过世的双亲祈福。卷末题记留下了他的名字与日期——这一卷,后来被认作现存最早、有明确纪年的完整印刷品。',
    },
    {
      id: 'sealed',
      year: '约 11 世纪',
      who: '藏经洞封存',
      story:
        '不知因何缘故——避战乱,或只是清理旧藏——敦煌莫高窟的一间侧室被砌墙封死,数万卷写本、印本连同这卷《金刚经》一起,在黑暗与干燥里沉睡下来,近千年无人知晓。',
    },
    {
      id: 'wangyuanlu',
      year: '1900',
      who: '王圆箓发现藏经洞',
      story:
        '看管莫高窟的道士王圆箓无意中发现墙后中空,凿开一看,满室经卷。他没有意识到自己打开的是什么——这一室文书,后来重写了整个敦煌学与中古史的写法。',
    },
    {
      id: 'stein',
      year: '1907',
      who: '斯坦因携经卷西去',
      story:
        '匈牙利裔英国探险家斯坦因抵达敦煌,以极低的代价从王圆箓手中换得大批写本印本,其中就有这卷 868 年的《金刚经》。它们被装箱运往伦敦,今天仍藏于大英图书馆——这卷经离开了它写成、印下、封存的土地,至今未归。',
      cinnabar: true,
    },
    {
      id: 'muller',
      year: '1894',
      who: 'Max Müller 英译',
      story:
        '牛津学者马克斯·缪勒据一份日本所藏梵文抄本,把《金刚经》译成英文,收入他主编的《东方圣书》丛书——那时敦煌的这卷经文还封在墙后六年,西方世界已经先一步读到了它梵文的原初面貌。',
    },
    {
      id: 'suzuki',
      year: '20 世纪中叶',
      who: '铃木大拙与西渡的禅',
      story:
        '铃木大拙等学者把禅宗介绍给西方,"应无所住而生其心"一句被反复引用,成为战后欧美知识分子理解"东方智慧"的一个入口——一句唐代樵夫听懂的话,几百年后,又讲给了大洋彼岸的陌生人。',
    },
    {
      id: 'idp',
      year: '2010',
      who: '大英图书馆数字化公开',
      story:
        '大英图书馆将 868 年的这卷经文高清扫描,全文公开于国际敦煌项目网站——任何人,任何地方,都能放大看清王玠请人刻下的每一个字。印本流传的初衷"普施于人",在一千一百多年后,以另一种方式实现了。',
    },
    {
      id: 'today',
      year: '今 · 2026',
      who: '这本书仍在被写下',
      story: '时间线的最后一站,是正在生长的年轮。最近入木与新生的批注:',
      cinnabar: true,
      today: true,
      noAsk: true,
    },
  ],
  comparison: {
    label: '经文在此改变',
    columns: ['鸠摩罗什,公元 402', '玄奘,约公元 660'],
    rows: [
      ['一切有为法,如梦幻泡影', '梵本原有九喻:星、翳、灯、幻'],
      ['如露亦如电,应作如是观。', '露、泡、梦、电、云——玄奘译笔更贴近梵本'],
    ],
    note: '六喻传诵一千六百年,九喻更贴近梵文原貌,却从未走进香火。',
    cta: { label: '对照两种译本逐字读 →', href: '/books/jingangjing/compare' },
  },
  rings: [
    {
      name: '沈一苇',
      genre: '证',
      state: '入木',
      date: '2024',
      text: '把攒了十年的书全部捐掉那天,才明白"应无所住"不是不能拥有,是不必被拥有的东西定住。',
    },
    {
      name: '周菡',
      genre: '疑',
      state: '青芽',
      date: '2025',
      text: '如果一切相都是虚妄,那我此刻的难过,算不算相?',
    },
    {
      name: '陈拾',
      genre: '疑',
      state: '青芽',
      date: '2026',
      text: '念念不住,是不是也包括不必抓住"无所住"这件事本身?',
    },
  ],
}
