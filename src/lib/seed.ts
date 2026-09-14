import type { AppState, Card, ShortCard } from '../types'

/**
 * Seeded from the live search pages for "axiom trading", captured 2026-09-14
 * through the Chrome extension at a 1920px layout viewport (a 1280px window at
 * 67% zoom). Counts and dates are the real ones; YouTube thumbnails come from
 * i.ytimg.com by video id, TikTok covers are signed and expire so those cards
 * start on generated placeholders — replace them in the editor.
 */

let n = 0
const id = () => `c${++n}`

const yt = (
  videoId: string,
  title: string,
  channel: string,
  views: string,
  age: string,
  duration: string,
  description: string,
  extra: Partial<Card> = {},
): Card => ({
  id: id(),
  visible: true,
  thumb: videoId ? `https://i.ytimg.com/vi/${videoId}/hq720.jpg` : '',
  title,
  channel,
  handle: '@' + channel.toLowerCase().replace(/[^a-z0-9]/g, ''),
  avatar: '',
  verified: false,
  views,
  likes: '',
  comments: '',
  age,
  duration,
  badge: '',
  description,
  ...extra,
})

const YT_CARDS: Card[] = [
  yt(
    'nSA0Mfor75c',
    'The ONLY Axiom Trading Tutorial You Need in 2026',
    'Crypto Vic',
    '70k avspillinger',
    'for 5 måneder siden',
    '22:26',
    'Axiom: https://axiom.trade/@cryptovic ***IMPORTANT: This is my referral link. I may earn commission if you sign up and trade with ...',
    { badge: 'Teksting', views: '70k avspillinger' },
  ),
  yt(
    '0m2IR52DvuY',
    'How to Trade Memecoins on Axiom (Complete Beginner Guide)',
    'VeyraTrade',
    '38k avspillinger',
    'for 2 måneder siden',
    '9:55',
    "Learn how to trade memecoins on Axiom with this complete beginner guide. I'll show you the basics of finding coins, managing ...",
  ),
  yt(
    't3wCZOWHWEI',
    'How to get started with memecoins (2026 GUIDE FOR AXIOM)',
    'Esee',
    '75k avspillinger',
    'for 3 uker siden',
    '8:15',
    'I was sick when I recorded this, so I kind of forgot a few things Join my Discord if you have any other questions ...',
  ),
  yt(
    'P1WjCGzIE2A',
    'How I Turned $50 into $500,000 Trading Memecoins (Full Scalping Guide)',
    'Setuh',
    '298k avspillinger',
    'for 9 måneder siden',
    '26:05',
    'The Scalping Strategy That Made Me $500000 In 5 Months (Full Guide) The Best Trading Platform - http://axiom.trade/@setuh ...',
    { verified: true },
  ),
  yt(
    'E6alfeehZ2k',
    'How I’d Grow a 0.1 SOL Account Using Axiom Pulse (Exact Strategy)',
    'sleeptradesmemes',
    '1,5k avspillinger',
    'for 1 måned siden',
    '9:05',
    'Trade On Axiom: https://axiom.trade/@sleepr AI Memecoin Callouts: https://discord.gg/6q5XfVH7aa Free ...',
  ),
  yt(
    'CGcsj81TPJo',
    'The BEST Axiom Settings for Memecoin Trading in 2026 🚀 (Full Setup)',
    'starwifpump',
    '32k avspillinger',
    'for 1 måned siden',
    '12:41',
    "If you're using Axiom to trade memecoins, having the right settings can make a huge difference in your results ...",
    { badge: '4K' },
  ),
  yt(
    '',
    'How To Make $1,000 a Day Using AXIOM Trading Bot (Full Tutorial)',
    'Nazza Crypto',
    '10k avspillinger',
    'for 1 år siden',
    '15:32',
    'In this video I break down the exact Axiom setup I use every single day, from wallet funding to the filters that keep the ...',
  ),
]

const short = (title: string, views: string): ShortCard => ({
  id: id(),
  visible: true,
  thumb: '',
  title,
  views,
})

const YT_SHORTS: ShortCard[] = [
  short('Cupsey Makes $9k PER DAY on Fees on Axiom', '39k avspillinger'),
  short('BY FAR The BEST Trading SET-UP | Axiom Pro | Axiom.trade/@tor', '36k avspillinger'),
  short('Best Settings For Finding Meme Coin Gems On AxiomTrade', '75k avspillinger'),
  short('🚀 Memecoin madness! Orangie just made 2 SOL in 2 minutes trading live on Axiom', '2,4k avspillinger'),
  short('How to Start Trading Memecoins on Axiom #Axiom #Solana #Memecoins', '2,3k avspillinger'),
  short('Axiom trading platform: the cheapest trading platform for memecoins', '621 avspillinger'),
  short('+$5,200 💸 #trading #cryptocurrency #memecrypto #crypto #memecoin #axiom', '26k avspillinger'),
  short('These Axiom Filters Prevent COUNTLESS Malicious Memecoin Bots! @OrangieWEB3', '12k avspillinger'),
  short('Best Axiom Pro Settings | Complete Guide [2025]', '58k avspillinger'),
  short('Orangie talks about the best filters to find 100x memecoins on axiom', '68k avspillinger'),
]

const tt = (
  caption: string,
  user: string,
  likes: string,
  age: string,
  badge = '',
  verified = true,
): Card => ({
  id: id(),
  visible: true,
  thumb: '',
  title: caption,
  channel: user,
  handle: '@' + user.toLowerCase().replace(/[^a-z0-9._]/g, ''),
  avatar: '',
  verified,
  views: '',
  likes,
  comments: '',
  age,
  duration: '',
  badge,
  description: '',
})

const TT_CARDS: Card[] = [
  tt('My biggest trade yet (All documented on my profile)', 'PvP', '49K', '9-4', 'Top liked'),
  tt('Held this coin for 11 seconds and made 7 figures 😭 #memecoin #trading #solana', 'Ԛwerty', '19.1K', '9-1', 'Top liked'),
  tt('Most iconic moment in memecoin history 😭 #memecoin #trading #solana #axiom', 'Ԛwerty', '26.9K', '9-2', 'Top liked'),
  tt('Holy glaze 😭 #memecoin #trading #crypto #axiom #kimchi', 'Ԛwerty', '9637', '6d ago'),
  tt('memecoins are so insane 😭 #memecoin #trading #kimchi #crypto #axiom', 'Kіmchi', '13.3K', '6d ago'),
  tt('pushing 400-700k now #memecoins #solana #cented', 'Cented7', '789', '5d ago'),
  tt('#fyp #trade #memecoins #trading #axiom', 'Yas1.1', '9319', '9-1'),
  tt('BEST preset fees to use trading on axiom', 'miyagii', '10.8K', '8-11'),
  tt('5 things you NEED trading memecoins on Axiom', 'tradewithzee', '5524', '3d ago'),
  tt(
    'The 14th day of papertrading in axiom, look in my bio for settings and community of memecoins',
    'Sonvest',
    '7785',
    '2d ago',
  ),
  tt('Memecoins are so back.', 'solanadegen', '1645', '9-3'),
  tt('Axiom Pulse explained in 30 seconds #axiom #solana', 'chartsbyleo', '3211', '4d ago'),
]

export function seedState(): AppState {
  n = 0
  return {
    youtube: {
      query: 'axiom trading',
      cards: JSON.parse(JSON.stringify(YT_CARDS)),
      shorts: JSON.parse(JSON.stringify(YT_SHORTS)),
      shortsAfter: 3,
      showGuide: true,
      chips: ['Alle', 'Shorts', 'Ikke sett', 'Sett', 'Videoer', 'Nylig lastet opp', 'Direkte'],
      activeChip: 0,
    },
    tiktok: {
      query: 'axiom trading',
      cards: JSON.parse(JSON.stringify(TT_CARDS)),
      metric: 'likes',
      tabs: ['Top', 'Users', 'Videos', 'LIVE', 'Photo'],
      activeTab: 0,
      relatedSearches: ['axiom', 'axiom trade', 'axiom pulse', 'memecoin trading'],
      showSidebar: true,
    },
  }
}

export const GUIDE_SECTIONS: { title?: string; items: string[] }[] = [
  { items: ['Startside', 'Shorts', 'Abonnementer'] },
  {
    title: 'Abonnementer',
    items: ['Mark Builds Brands', 'StevenBridges', 'IShowSpeed', 'Scizza', 'TOGI', 'Fireship', 'Green Code', 'Vis mer'],
  },
  {
    title: 'Deg',
    items: ['Kanalen din', 'Logg', 'Spillelister', 'Se senere', 'Likte videoer', 'Videoene dine', 'Nedlastinger', 'Vis mer'],
  },
  { title: 'Mer fra YouTube', items: ['YouTube Premium', 'YouTube TV', 'YouTube Music', 'YouTube Kids'] },
  { title: 'Utforsk', items: ['Musikk', 'Filmer og TV', 'Direkte', 'Vis mer'] },
]

/** The reference groups these with a hairline after Friends and after LIVE. */
export const TT_NAV: string[][] = [
  ['For You', 'Explore', 'Following', 'Friends'],
  ['Shop', 'Short dramas', 'LIVE'],
  ['Messages', 'Activity', 'Upload', 'Profile', 'More'],
]

export const TT_FOLLOWING: { name: string; handle: string }[] = [
  { name: 'Stian Berdal', handle: 'berdalstian' },
  { name: 'loxystudyy', handle: 'loxystudyy' },
  { name: 'Sawyer', handle: 'studywithsawyer' },
  { name: 'Ivan Tong', handle: 'ivanintubing' },
  { name: 'Proppy.no', handle: 'proppy.no' },
]
