import { useState } from 'react'
import type { Card } from '../types'
import { useStore, updateTikTok } from '../lib/store'
import { TT_NAV } from '../lib/seed'
import { avatarPlaceholder, coverPlaceholder } from '../lib/placeholder'
import {
  TTCollapse,
  TTComment,
  TTHeart,
  TTMobile,
  TTPlay,
  TTRefresh,
  TTSearch,
  TTVerified,
  TT_NAV_ICONS,
  TikTokLogo,
} from './icons'
import './tiktok.css'

const METRIC_ICON = { likes: TTHeart, comments: TTComment, views: TTPlay }

function GridCard({ card, metric }: { card: Card; metric: 'likes' | 'comments' | 'views' }) {
  const [failed, setFailed] = useState(false)
  const src = card.thumb && !failed ? card.thumb : coverPlaceholder(card.id + card.channel, 252, 336)
  const Icon = METRIC_ICON[metric]
  const value = card[metric]

  return (
    <div className="tt-card">
      <div className="tt-cover">
        <img src={src} alt="" onError={() => setFailed(true)} draggable={false} />
        {card.badge ? <div className="tt-cover-badge">{card.badge}</div> : null}
        <div className="tt-cover-metric">
          <Icon />
          <strong>{value || '0'}</strong>
        </div>
      </div>
      <div className="tt-meta">
        <div className="tt-caption">{card.title}</div>
        <div className="tt-user-row">
          <img src={card.avatar || avatarPlaceholder(card.channel)} alt="" />
          <span className="tt-user-name">{card.channel}</span>
          {card.verified ? <TTVerified size={14} /> : null}
          <span className="tt-date">{card.age}</span>
        </div>
      </div>
    </div>
  )
}

export default function TikTok() {
  const { tiktok: s } = useStore()
  const cards = s.cards.filter((c) => c.visible)

  return (
    <div className="tt">
      {s.showSidebar ? (
        <nav className="tt-nav">
          <div className="tt-nav-fixed">
            <div className="tt-logo-row">
              <TikTokLogo />
              <TTCollapse />
            </div>
            <label className="tt-search-pill">
              <TTSearch />
              <input
                value={s.query}
                placeholder="Search"
                onChange={(e) => updateTikTok((t) => ({ ...t, query: e.target.value }))}
              />
            </label>
          </div>

          <div className="tt-nav-scroll">
            {TT_NAV.map((group, gi) => (
              <div key={gi}>
                {gi > 0 ? <div className="tt-nav-sep" /> : null}
                {group.map((name) => {
                  const Icon = TT_NAV_ICONS[name]
                  const isUpload = name === 'Upload'
                  return (
                    <div className={'tt-nav-item' + (isUpload ? ' is-active' : '')} key={name}>
                      <span className="tt-nav-icon">{Icon ? <Icon size={32} /> : null}</span>
                      <span>{name}</span>
                      {isUpload ? <button className="tt-post-btn">Post video</button> : null}
                    </div>
                  )
                })}
              </div>
            ))}

          </div>
        </nav>
      ) : null}

      <main className="tt-main">
        <div className="tt-topright">
          <button aria-label="Refresh">
            <TTRefresh />
          </button>
          <button aria-label="Get app">
            <TTMobile />
          </button>
          <div className="tt-divider" />
          <button className="tt-me" aria-label="Profile">
            <img src={avatarPlaceholder('Stian')} alt="" />
          </button>
        </div>

        <div className="tt-search-body">
          <div className="tt-content">
            <div className="tt-tabs">
              <div className="tt-tabbar">
                {s.tabs.map((t, i) => (
                  <button
                    key={t}
                    className={'tt-tab' + (i === s.activeTab ? ' is-active' : '')}
                    onClick={() => updateTikTok((x) => ({ ...x, activeTab: i }))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="tt-grid">
              {cards.map((c) => (
                <GridCard card={c} metric={s.metric} key={c.id} />
              ))}
            </div>
          </div>

          <aside className="tt-rail">
            <p className="tt-rail-title">Others searched for</p>
            {s.relatedSearches.map((r) => (
              <div key={r}>
                <span className="tt-rail-chip">
                  <TTSearch size={16} />
                  {r}
                </span>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  )
}
