import type { AppState, Card, ShortCard } from '../types'

/**
 * Seeded from the live search pages for "axiom trading", captured 2026-09-14
 * through the Chrome extension at a 1920px layout viewport (a 1280px window at
 * 67% zoom). Titles, handles and dates are the captured ones; view counts are
 * dialled up into the millions for the shot.
 *
 * Covers are real thumbnails cropped out of screen captures and served from
 * public/thumbs; creator pictures are stock money/Miami/crypto shots in
 * public/avatars. Nothing is hotlinked and nothing expires. Drop your own image
 * on a card in the editor to replace one.
 */

let n = 0
const id = () => `c${++n}`

const yt = (
  thumb: string,
  avatar: string,
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
  thumb: `/thumbs/${thumb}.jpg`,
  title,
  channel,
  handle: '@' + channel.toLowerCase().replace(/[^a-z0-9]/g, ''),
  avatar: `/avatars/${avatar}.jpg`,
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

/** Two results, then the Shorts shelf, then one more. */
const YT_CARDS: Card[] = [
  yt(
    'yt-1',
    'pfp-2',
    'The ONLY Axiom Trading Tutorial You Need in 2026',
    'Crypto Vic',
    '2.4M views',
    '5 months ago',
    '22:26',
    'Axiom: https://axiom.trade/@cryptovic ***IMPORTANT: This is my referral link. I may earn commission if you sign up and trade with ...',
    { badge: 'CC' },
  ),
  yt(
    'yt-2',
    'pfp-1',
    'How I Turned $50 into $500,000 Trading Memecoins (Full Scalping Guide)',
    'Setuh',
    '8.7M views',
    '9 months ago',
    '26:05',
    'The Scalping Strategy That Made Me $500000 In 5 Months (Full Guide) The Best Trading Platform - http://axiom.trade/@setuh ...',
    { verified: true },
  ),
  yt(
    'yt-3',
    'pfp-9',
    'The BEST Axiom Settings for Memecoin Trading in 2026 🚀 (Full Setup)',
    'starwifpump',
    '4.6M views',
    '1 month ago',
    '12:41',
    "If you're using Axiom to trade memecoins, having the right settings can make a huge difference in your results ...",
    { badge: '4K' },
  ),
]

const short = (thumb: string, title: string, views: string): ShortCard => ({
  id: id(),
  visible: true,
  thumb: `/thumbs/${thumb}.jpg`,
  title,
  views,
})

/** Exactly one row — the shelf grid is five wide at the target viewport. */
const YT_SHORTS: ShortCard[] = [
  short('short-1', 'Cupsey Makes $9k PER DAY on Fees on Axiom', '2.7M views'),
  short('short-2', 'BY FAR The BEST Trading SET-UP | Axiom Pro | Axiom.trade/@tor', '1.9M views'),
  short('short-3', 'Best Settings For Finding Meme Coin Gems On AxiomTrade', '3.1M views'),
  short('short-4', '🚀 Memecoin madness! Orangie just made 2 SOL in 2 minutes trading live on Axiom', '5.4M views'),
  short('short-5', 'How to Start Trading Memecoins on Axiom #Axiom #Solana #Memecoins', '1.1M views'),
]

const tt = (
  thumb: string,
  avatar: string,
  caption: string,
  user: string,
  views: string,
  likes: string,
  age: string,
  verified = false,
  badge = '',
): Card => ({
  id: id(),
  visible: true,
  thumb: `/thumbs/${thumb}.jpg`,
  title: caption,
  channel: user,
  handle: '@' + user.toLowerCase().replace(/[^a-z0-9._]/g, ''),
  avatar: `/avatars/${avatar}.jpg`,
  verified,
  views,
  likes,
  comments: '',
  age,
  duration: '',
  badge,
  description: '',
})

const TT_CARDS: Card[] = [
  tt('tt-1', 'pfp-3', 'My biggest trade yet (All documented on my profile)', 'PvP', '12.4M', '1.9M', '9-4', true, 'Top liked'),
  tt(
    'tt-2',
    'pfp-7',
    'Held this coin for 11 seconds and made 7 figures 😭 #memecoin #trading #solana',
    'miamimarv',
    '8.9M',
    '1.2M',
    '9-1',
    false,
    'Top liked',
  ),
  tt(
    'tt-3',
    'pfp-6',
    'Most iconic moment in memecoin history 😭 #memecoin #trading #solana #axiom',
    'Ԛwerty',
    '9.6M',
    '1.4M',
    '9-2',
    true,
    'Top liked',
  ),
  tt('tt-4', 'pfp-5', 'Holy glaze 😭 #memecoin #trading #crypto #axiom #kimchi', 'degenjuls', '3.2M', '486.2K', '6d ago'),
  tt(
    'tt-5',
    'pfp-10',
    'memecoins are so insane 😭 #memecoin #trading #kimchi #crypto #axiom',
    'Kіmchi',
    '5.3M',
    '742.8K',
    '6d ago',
    true,
  ),
  tt('tt-6', 'pfp-8', 'pushing 400-700k now #memecoins #solana #cented', 'Cented7', '2.6M', '311.5K', '5d ago'),
  tt('tt-7', 'pfp-4', '#fyp #trade #memecoins #trading #axiom', 'tapeflow.sol', '4.1M', '529.4K', '9-1'),
]


export function seedState(): AppState {
  n = 0
  return {
    youtube: {
      query: 'axiom trading',
      cards: JSON.parse(JSON.stringify(YT_CARDS)),
      shorts: JSON.parse(JSON.stringify(YT_SHORTS)),
      shortsAfter: 2,
      showGuide: true,
      chips: ['All', 'Shorts', 'Unwatched', 'Watched', 'Videos', 'Recently uploaded', 'Live'],
      activeChip: 0,
    },
    tiktok: {
      query: 'axiom trading',
      cards: JSON.parse(JSON.stringify(TT_CARDS)),
      metric: 'views',
      tabs: ['Top', 'Users', 'Videos', 'LIVE', 'Photo'],
      activeTab: 0,
      relatedSearches: ['axiom', 'axiom trade', 'axiom pulse', 'memecoin trading'],
      showSidebar: true,
    },
  }
}

/** No subscription list: those rows are avatars and real names, and they are
 *  the first thing anyone recognises in a screenshot. */
export const GUIDE_SECTIONS: { title?: string; items: string[] }[] = [
  { items: ['Home', 'Shorts', 'Subscriptions'] },
  {
    title: 'You',
    items: ['Your channel', 'History', 'Playlists', 'Watch later', 'Liked videos', 'Your videos', 'Downloads', 'Show more'],
  },
  { title: 'More from YouTube', items: ['YouTube Premium', 'YouTube TV', 'YouTube Music', 'YouTube Kids'] },
  { title: 'Explore', items: ['Music', 'Movies & TV', 'Live', 'Show more'] },
]

/** The reference groups these with a hairline after Friends and after LIVE. */
export const TT_NAV: string[][] = [
  ['For You', 'Explore', 'Following', 'Friends'],
  ['Shop', 'Short dramas', 'LIVE'],
  ['Messages', 'Activity', 'Upload', 'Profile', 'More'],
]
