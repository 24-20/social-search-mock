import { useState } from 'react'
import type { Card, ShortCard } from '../types'
import { useStore, updateYouTube } from '../lib/store'
import { GUIDE_SECTIONS } from '../lib/seed'
import { avatarPlaceholder, coverPlaceholder } from '../lib/placeholder'
import {
  BellIcon,
  CreateIcon,
  DotsIcon,
  FilterIcon,
  GuideIcon,
  MenuIcon,
  MicIcon,
  SearchIcon,
  ShortsIcon,
  VerifiedIcon,
  YouTubeLogo,
} from './icons'
import './youtube.css'

function Thumb({ card }: { card: Card }) {
  const [failed, setFailed] = useState(false)
  const src =
    card.thumb && !failed ? card.thumb : coverPlaceholder(card.id + card.channel, 500, 281)
  return (
    <div className="yt-thumb">
      <img src={src} alt="" onError={() => setFailed(true)} draggable={false} />
      {card.duration ? <span className="yt-duration">{card.duration}</span> : null}
    </div>
  )
}

function VideoRow({ card }: { card: Card }) {
  return (
    <div className="yt-video">
      <Thumb card={card} />
      <div className="yt-info">
        <div className="yt-title-row">
          <h3 className="yt-title">{card.title}</h3>
          <button className="yt-menu" aria-label="Handlingsmeny">
            <DotsIcon />
          </button>
        </div>
        <div className="yt-metaline">
          {card.views}
          {card.views && card.age ? <span className="sep">•</span> : null}
          {card.age}
        </div>
        <div className="yt-channel">
          <img src={card.avatar || avatarPlaceholder(card.channel)} alt="" />
          <span className="yt-channel-name">
            {card.channel}
            {card.verified ? <VerifiedIcon size={14} /> : null}
          </span>
        </div>
        {card.description ? <div className="yt-desc">{card.description}</div> : null}
        {card.badge ? (
          <div className="yt-badges">
            <span className="yt-badge">{card.badge}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ShortTile({ short }: { short: ShortCard }) {
  const [failed, setFailed] = useState(false)
  const src = short.thumb && !failed ? short.thumb : coverPlaceholder(short.id + short.title, 237, 356)
  return (
    <div className="yt-short">
      <div className="yt-short-cover">
        <img src={src} alt="" onError={() => setFailed(true)} draggable={false} />
      </div>
      <div className="yt-short-meta">
        <h3 className="yt-short-title">{short.title}</h3>
        <div className="yt-short-views">{short.views}</div>
      </div>
    </div>
  )
}

export default function YouTube() {
  const { youtube: s } = useStore()
  const cards = s.cards.filter((c) => c.visible)
  const shorts = s.shorts.filter((c) => c.visible)
  const cut = s.shortsAfter < 0 ? cards.length + 1 : Math.min(s.shortsAfter, cards.length)

  return (
    <div className="yt">
      <header className="yt-masthead">
        <div className="yt-masthead-start">
          <button className="yt-icon-btn" aria-label="Meny">
            <MenuIcon />
          </button>
          <a className="yt-logo" href="#">
            <YouTubeLogo />
          </a>
        </div>

        <div className="yt-masthead-center">
          <div className="yt-search">
            <div className="yt-search-box">
              <input
                value={s.query}
                placeholder="Søk"
                onChange={(e) => updateYouTube((y) => ({ ...y, query: e.target.value }))}
              />
            </div>
            <button className="yt-search-submit" aria-label="Søk">
              <SearchIcon size={24} />
            </button>
            <button className="yt-voice" aria-label="Søk med stemmen">
              <MicIcon size={24} />
            </button>
          </div>
        </div>

        <div className="yt-masthead-end">
          <button className="yt-create">
            <CreateIcon size={24} />
            Opprett
          </button>
          <button className="yt-icon-btn" aria-label="Varsler">
            <BellIcon />
          </button>
          <button className="yt-avatar-btn" aria-label="Kontomeny">
            <span>S</span>
          </button>
        </div>
      </header>

      <div className="yt-body">
        {s.showGuide ? (
          <nav className="yt-guide">
            {GUIDE_SECTIONS.map((section, i) => (
              <div className="yt-guide-section" key={i}>
                {section.title ? <div className="yt-guide-title">{section.title}</div> : null}
                {section.items.map((item) => (
                  <div className="yt-guide-entry" key={item}>
                    <span className="yt-guide-icon">
                      {section.title === 'Abonnementer' ? (
                        <img className="yt-guide-avatar" src={avatarPlaceholder(item)} alt="" />
                      ) : (
                        <GuideIcon name={item} />
                      )}
                    </span>
                    <span className="yt-guide-label">{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        ) : null}

        <main className="yt-main">
          <div className="yt-col">
            <div className="yt-chipbar">
              <div className="yt-chips">
                {s.chips.map((chip, i) => (
                  <button
                    key={chip}
                    className={'yt-chip' + (i === s.activeChip ? ' is-active' : '')}
                    onClick={() => updateYouTube((y) => ({ ...y, activeChip: i }))}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <button className="yt-filter">
                <FilterIcon size={24} />
                Filtre
              </button>
            </div>

            {cards.slice(0, cut).map((c) => (
              <VideoRow card={c} key={c.id} />
            ))}

            {s.shortsAfter >= 0 && shorts.length ? (
              <section className="yt-shelf">
                <div className="yt-shelf-header">
                  <span className="yt-shelf-icon">
                    <ShortsIcon />
                  </span>
                  <h2>Shorts</h2>
                </div>
                <div className="yt-shelf-grid">
                  {shorts.map((sh) => (
                    <ShortTile short={sh} key={sh.id} />
                  ))}
                </div>
              </section>
            ) : null}

            {cards.slice(cut).map((c) => (
              <VideoRow card={c} key={c.id} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
