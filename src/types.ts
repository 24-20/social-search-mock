/** One result card. Both routes use the same shape so one editor drives both. */
export type Card = {
  id: string
  visible: boolean
  /** http(s) URL, data: URL from an upload, or '' for the generated placeholder. */
  thumb: string
  /** YouTube: video title. TikTok: caption. */
  title: string
  /** Display name of the channel / creator. */
  channel: string
  /** @handle — YouTube shows it on some surfaces, TikTok uses it as the name. */
  handle: string
  /** Avatar URL / data: URL, or '' for the generated initial avatar. */
  avatar: string
  verified: boolean
  views: string
  likes: string
  comments: string
  /** "5 months ago" on YouTube, "9-4" / "6d ago" on TikTok. */
  age: string
  /** YouTube only. */
  duration: string
  /** YouTube: the grey chip under the title. TikTok: the "Top liked" pill. */
  badge: string
  /** YouTube only: the two-line snippet under the channel row. */
  description: string
}

/** Which count the TikTok cover overlay shows. */
export type Metric = 'likes' | 'comments' | 'views'

export type ShortCard = {
  id: string
  visible: boolean
  thumb: string
  title: string
  views: string
}

export type YouTubeState = {
  query: string
  cards: Card[]
  shorts: ShortCard[]
  /** Index in `cards` after which the Shorts shelf is inserted. -1 hides it. */
  shortsAfter: number
  showGuide: boolean
  chips: string[]
  activeChip: number
}

export type TikTokState = {
  query: string
  cards: Card[]
  metric: Metric
  tabs: string[]
  activeTab: number
  relatedSearches: string[]
  showSidebar: boolean
}

export type AppState = {
  youtube: YouTubeState
  tiktok: TikTokState
}
