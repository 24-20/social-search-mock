import { useEffect, useState } from 'react'
import type { AppState, Card, ShortCard } from '../types'
import { getState, reset, setState, updateTikTok, updateYouTube, useStore } from '../lib/store'
import { downloadJson } from '../lib/files'
import { coverPlaceholder } from '../lib/placeholder'
import { ImagePicker } from './ImagePicker'
import './editor.css'

type Route = 'youtube' | 'tiktok'

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  return (
    <label className="ed-field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function CardEditor({
  card,
  route,
  index,
  count,
  onPatch,
  onMove,
  onRemove,
}: {
  card: Card
  route: Route
  index: number
  count: number
  onPatch: (patch: Partial<Card>) => void
  onMove: (to: number) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  const preview = card.thumb || coverPlaceholder(card.id + card.channel, 80, 52)

  return (
    <div className="ed-card">
      <div className={'ed-card-head' + (card.visible ? '' : ' is-hidden')}>
        <input
          type="checkbox"
          checked={card.visible}
          title="Show this card"
          onChange={(e) => onPatch({ visible: e.target.checked })}
        />
        <img src={preview} alt="" />
        <span className="ed-card-title" onClick={() => setOpen((o) => !o)}>
          {card.title || '(untitled)'}
        </span>
        <button className="ed-mini" title="Move up" onClick={() => onMove(index - 1)} disabled={index === 0}>
          ↑
        </button>
        <button
          className="ed-mini"
          title="Move down"
          onClick={() => onMove(index + 1)}
          disabled={index === count - 1}
        >
          ↓
        </button>
        <button className="ed-mini" title="Edit" onClick={() => setOpen((o) => !o)}>
          {open ? '−' : '✎'}
        </button>
        <button className="ed-mini" title="Delete" onClick={onRemove}>
          ✕
        </button>
      </div>

      {open ? (
        <div className="ed-card-body">
          <ImagePicker
            label={route === 'youtube' ? 'Thumbnail (16:9)' : 'Cover (3:4)'}
            value={card.thumb}
            onChange={(v) => onPatch({ thumb: v })}
          />
          <Field
            label={route === 'youtube' ? 'Title' : 'Caption'}
            value={card.title}
            onChange={(v) => onPatch({ title: v })}
            textarea
          />

          <div className="ed-row">
            <Field label="Display name" value={card.channel} onChange={(v) => onPatch({ channel: v })} />
            <Field label="Handle" value={card.handle} onChange={(v) => onPatch({ handle: v })} />
          </div>

          <ImagePicker label="Avatar" value={card.avatar} onChange={(v) => onPatch({ avatar: v })} />

          <label className="ed-check">
            <input
              type="checkbox"
              checked={card.verified}
              onChange={(e) => onPatch({ verified: e.target.checked })}
            />
            Verified badge
          </label>

          {route === 'youtube' ? (
            <>
              <div className="ed-row">
                <Field label="Views line" value={card.views} onChange={(v) => onPatch({ views: v })} />
                <Field label="Age" value={card.age} onChange={(v) => onPatch({ age: v })} />
              </div>
              <div className="ed-row">
                <Field label="Duration" value={card.duration} onChange={(v) => onPatch({ duration: v })} />
                <Field label="Badge chip" value={card.badge} onChange={(v) => onPatch({ badge: v })} />
              </div>
              <Field
                label="Description snippet"
                value={card.description}
                onChange={(v) => onPatch({ description: v })}
                textarea
              />
              <div className="ed-row">
                <Field label="Likes" value={card.likes} onChange={(v) => onPatch({ likes: v })} />
                <Field label="Comments" value={card.comments} onChange={(v) => onPatch({ comments: v })} />
              </div>
              <p className="ed-note">
                YouTube search results show views and age only — likes and comments are stored on the card
                and exported, but the real page has nowhere to draw them.
              </p>
            </>
          ) : (
            <>
              <div className="ed-row">
                <Field label="Likes" value={card.likes} onChange={(v) => onPatch({ likes: v })} />
                <Field label="Comments" value={card.comments} onChange={(v) => onPatch({ comments: v })} />
              </div>
              <div className="ed-row">
                <Field label="Views" value={card.views} onChange={(v) => onPatch({ views: v })} />
                <Field label="Date" value={card.age} onChange={(v) => onPatch({ age: v })} />
              </div>
              <Field label="Corner pill" value={card.badge} onChange={(v) => onPatch({ badge: v })} />
              <p className="ed-note">
                The cover overlay draws whichever count the “Overlay metric” picker at the top is set to.
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

function blankCard(route: Route): Card {
  return {
    id: 'c' + Math.random().toString(36).slice(2, 9),
    visible: true,
    thumb: '',
    title: 'New card',
    channel: 'Channel',
    handle: '@channel',
    avatar: '',
    verified: false,
    views: route === 'youtube' ? '0 avspillinger' : '',
    likes: route === 'tiktok' ? '0' : '',
    comments: '',
    age: route === 'youtube' ? 'for 1 dag siden' : 'today',
    duration: route === 'youtube' ? '0:00' : '',
    badge: '',
    description: '',
  }
}

function ShortEditor({
  short,
  index,
  count,
  onPatch,
  onMove,
  onRemove,
}: {
  short: ShortCard
  index: number
  count: number
  onPatch: (p: Partial<ShortCard>) => void
  onMove: (to: number) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ed-card">
      <div className={'ed-card-head' + (short.visible ? '' : ' is-hidden')}>
        <input
          type="checkbox"
          checked={short.visible}
          onChange={(e) => onPatch({ visible: e.target.checked })}
        />
        <img src={short.thumb || coverPlaceholder(short.id + short.title, 40, 60)} alt="" />
        <span className="ed-card-title" onClick={() => setOpen((o) => !o)}>
          {short.title}
        </span>
        <button className="ed-mini" onClick={() => onMove(index - 1)} disabled={index === 0}>
          ↑
        </button>
        <button className="ed-mini" onClick={() => onMove(index + 1)} disabled={index === count - 1}>
          ↓
        </button>
        <button className="ed-mini" onClick={() => setOpen((o) => !o)}>
          {open ? '−' : '✎'}
        </button>
        <button className="ed-mini" onClick={onRemove}>
          ✕
        </button>
      </div>
      {open ? (
        <div className="ed-card-body">
          <ImagePicker label="Cover (9:16)" value={short.thumb} onChange={(v) => onPatch({ thumb: v })} />
          <Field label="Title" value={short.title} onChange={(v) => onPatch({ title: v })} textarea />
          <Field label="Views" value={short.views} onChange={(v) => onPatch({ views: v })} />
        </div>
      ) : null}
    </div>
  )
}

export default function Editor({ route }: { route: Route }) {
  const state = useStore()
  const [open, setOpen] = useState(true)

  // `e` toggles the panel so a screenshot can be taken without it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'e' || e.key === 'E') setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) {
    return (
      <button className="ed-toggle" onClick={() => setOpen(true)}>
        Edit ·<span style={{ opacity: 0.55 }}> e</span>
      </button>
    )
  }

  const yt = state.youtube
  const tt = state.tiktok
  const cards = route === 'youtube' ? yt.cards : tt.cards

  const patchCards = (next: Card[]) =>
    route === 'youtube'
      ? updateYouTube((y) => ({ ...y, cards: next }))
      : updateTikTok((t) => ({ ...t, cards: next }))

  async function importJson(file: File | undefined) {
    if (!file) return
    try {
      const text = await file.text()
      setState(JSON.parse(text) as AppState)
    } catch {
      alert('That file is not a mock export.')
    }
  }

  return (
    <aside className="ed">
      <div className="ed-head">
        <h2>Search mock editor</h2>
        <button className="ed-btn" onClick={() => setOpen(false)} title="Hide (e)">
          Hide
        </button>
      </div>

      <div className="ed-routes">
        <a href="/youtube" className={route === 'youtube' ? 'is-active' : ''}>
          /youtube
        </a>
        <a href="/tiktok" className={route === 'tiktok' ? 'is-active' : ''}>
          /tiktok
        </a>
      </div>

      <div className="ed-body">
        <div className="ed-section">
          <h3>Search</h3>
          <Field
            label="Query"
            value={route === 'youtube' ? yt.query : tt.query}
            onChange={(v) =>
              route === 'youtube'
                ? updateYouTube((y) => ({ ...y, query: v }))
                : updateTikTok((t) => ({ ...t, query: v }))
            }
          />

          {route === 'youtube' ? (
            <>
              <label className="ed-field">
                <span>Active filter chip</span>
                <select
                  value={yt.activeChip}
                  onChange={(e) => updateYouTube((y) => ({ ...y, activeChip: Number(e.target.value) }))}
                >
                  {yt.chips.map((c, i) => (
                    <option value={i} key={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Chips (comma separated)"
                value={yt.chips.join(', ')}
                onChange={(v) =>
                  updateYouTube((y) => ({ ...y, chips: v.split(',').map((s) => s.trim()).filter(Boolean) }))
                }
              />
              <label className="ed-check">
                <input
                  type="checkbox"
                  checked={yt.showGuide}
                  onChange={(e) => updateYouTube((y) => ({ ...y, showGuide: e.target.checked }))}
                />
                Show the left guide
              </label>
            </>
          ) : (
            <>
              <label className="ed-field">
                <span>Active tab</span>
                <select
                  value={tt.activeTab}
                  onChange={(e) => updateTikTok((t) => ({ ...t, activeTab: Number(e.target.value) }))}
                >
                  {tt.tabs.map((t, i) => (
                    <option value={i} key={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ed-field">
                <span>Overlay metric on covers</span>
                <select
                  value={tt.metric}
                  onChange={(e) =>
                    updateTikTok((t) => ({ ...t, metric: e.target.value as typeof t.metric }))
                  }
                >
                  <option value="likes">Likes (heart)</option>
                  <option value="comments">Comments (bubble)</option>
                  <option value="views">Views (play)</option>
                </select>
              </label>
              <Field
                label="“Others searched for” (comma separated)"
                value={tt.relatedSearches.join(', ')}
                onChange={(v) =>
                  updateTikTok((t) => ({
                    ...t,
                    relatedSearches: v.split(',').map((s) => s.trim()).filter(Boolean),
                  }))
                }
              />
              <label className="ed-check">
                <input
                  type="checkbox"
                  checked={tt.showSidebar}
                  onChange={(e) => updateTikTok((t) => ({ ...t, showSidebar: e.target.checked }))}
                />
                Show the side nav
              </label>
            </>
          )}
        </div>

        <div className="ed-section">
          <h3>Cards ({cards.filter((c) => c.visible).length}/{cards.length} shown)</h3>
          {cards.map((card, i) => (
            <CardEditor
              key={card.id}
              card={card}
              route={route}
              index={i}
              count={cards.length}
              onPatch={(patch) => patchCards(cards.map((c) => (c.id === card.id ? { ...c, ...patch } : c)))}
              onMove={(to) => patchCards(move(cards, i, to))}
              onRemove={() => patchCards(cards.filter((c) => c.id !== card.id))}
            />
          ))}
          <button className="ed-btn" onClick={() => patchCards([...cards, blankCard(route)])}>
            + Add card
          </button>
        </div>

        {route === 'youtube' ? (
          <div className="ed-section">
            <h3>Shorts shelf</h3>
            <label className="ed-field">
              <span>Position</span>
              <select
                value={yt.shortsAfter}
                onChange={(e) => updateYouTube((y) => ({ ...y, shortsAfter: Number(e.target.value) }))}
              >
                <option value={-1}>Hidden</option>
                {yt.cards.map((_, i) => (
                  <option value={i + 1} key={i}>
                    After result {i + 1}
                  </option>
                ))}
              </select>
            </label>
            {yt.shorts.map((sh, i) => (
              <ShortEditor
                key={sh.id}
                short={sh}
                index={i}
                count={yt.shorts.length}
                onPatch={(p) =>
                  updateYouTube((y) => ({
                    ...y,
                    shorts: y.shorts.map((x) => (x.id === sh.id ? { ...x, ...p } : x)),
                  }))
                }
                onMove={(to) => updateYouTube((y) => ({ ...y, shorts: move(y.shorts, i, to) }))}
                onRemove={() =>
                  updateYouTube((y) => ({ ...y, shorts: y.shorts.filter((x) => x.id !== sh.id) }))
                }
              />
            ))}
            <button
              className="ed-btn"
              onClick={() =>
                updateYouTube((y) => ({
                  ...y,
                  shorts: [
                    ...y.shorts,
                    {
                      id: 's' + Math.random().toString(36).slice(2, 9),
                      visible: true,
                      thumb: '',
                      title: 'New short',
                      views: '0 avspillinger',
                    },
                  ],
                }))
              }
            >
              + Add short
            </button>
          </div>
        ) : null}
      </div>

      <div className="ed-foot">
        <button className="ed-btn is-primary" onClick={() => setOpen(false)}>
          Screenshot mode
        </button>
        <button className="ed-btn" onClick={() => downloadJson('search-mock.json', getState())}>
          Export
        </button>
        <label className="ed-btn" style={{ cursor: 'pointer' }}>
          Import
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => void importJson(e.target.files?.[0])}
          />
        </label>
        <button
          className="ed-btn is-danger"
          onClick={() => {
            if (confirm('Throw away your edits and go back to the captured data?')) reset()
          }}
        >
          Reset
        </button>
      </div>
    </aside>
  )
}
