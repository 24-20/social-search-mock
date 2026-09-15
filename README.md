# social-search-mock

Editable, pixel-faithful mock-ups of the **YouTube** and **TikTok** search
results pages, for building content-creation screenshots — "here's what my video
looks like in search" — without touching the real sites.

```bash
npm install
npm run dev
```

- <http://localhost:5175/youtube> — YouTube search results
- <http://localhost:5175/tiktok> — TikTok search results

It is a local mock and nothing more: no login, no form that collects anything,
and no network calls at all — every cover and avatar is drawn in the page.

## The target viewport

Both routes were measured against the live pages at a **1920 x 984 CSS pixel
layout viewport** — a 1280px-wide Chrome window at **67% zoom**, which is where
the reference tabs were sitting. Set the same zoom on localhost and the two line
up; the layouts are responsive below that, so narrower windows degrade the way
the real pages do (fewer grid columns, then the side nav drops out).

Because page zoom in Chrome is *per origin*, `localhost` starts at 100% even
when youtube.com is at 67%. Zoom the mock to 67% before comparing.

## What was copied, and how

Every number in `src/youtube/youtube.css` and `src/tiktok/tiktok.css` was read
off the live pages with `getComputedStyle` / `getBoundingClientRect` through the
Chrome extension, not eyeballed from a screenshot. The load-bearing ones:

| | YouTube | TikTok |
| --- | --- | --- |
| Page background | `#0f0f0f` | `#000` |
| Font | Roboto | TikTokFont → Arial fallback |
| Left rail | 240px guide, 204x40 entries, 10px radius | 240px nav, 208x40 rows, 32px icons |
| Header | 56px masthead; 536x40 input + 64x40 button + 40px mic | search pill in the nav, 208x40, 999px radius |
| Results column | 1280px block centred, 15px inset → 1250px at x=444 | 1056px grid at x=428 |
| Card | 500x281 thumb (r12), 16px gutter, 734px text column | 252x336 cover (r8), 16px column gap, 24px row gap |
| Title | 18px/26px w400 `#f1f1f1` | caption 14px/18px, one line |
| Secondary text | 12px/18px `#aaa` | 14px/18px `rgba(255,255,255,.88)` |
| Chips / tabs | 32px tall, r8, 14px/20px w500, 8px gap | 96px tabs, 24px gap, 2px `#fafafa` underline |

### Accuracy audit

Every value below was re-measured against the live pages side by side and the
clone was corrected until it matched. At the 1920px target both routes now agree
with the reference to within **1px** on every element checked; the 1px is the
scrollbar-width difference between the two pages, not a layout error.

Verified exact (position and size, in layout px at the 1920 target):

| | YouTube | TikTok |
| --- | --- | --- |
| Logo | `72,18 93x20` | `24,20 105x28` |
| Search field | `631,8 536x40` | `16,64 208x40` |
| Left rail entry | `12,68 204x40`, icon `24,76 24x24`, label at `x=72` | `16,116 208x40`, icon `20,120 32x32` |
| Result row / card | `444,112 1250x281`, pitch 297 | `428,84 252x394`, pitch 418 |
| Thumbnail / cover | `500x281`, radius 12 | `252x336`, radius 8 |
| Card internals | title `+516,0` h26 · meta `+26` · channel `+44` h51 · snippet `+95` · duration `+460,+253 32x20` | badge `+12,+12 68x24` · metric `+30,+307` · meta `+336 252x52` · avatar `+2,+368 20x20` |
| Chips / tabs | chip `444,66 48x32`, 8px gap | tab `444,20 96x40`, 24px gap |

**Fonts.** YouTube's Roboto is loaded from Google Fonts and measures *identically*
to the reference (a 57-character title renders 505.52px on both). TikTok ships a
proprietary `TikTokFont` that can't be redistributed, so the stack is
`TikTokFont, Mulish, Arial, …` — anyone who has the real face still gets it, and
Mulish is the closest free fallback: 0.55% width error against TikTokFont, where
the original Arial fallback was 4.5% off.

**Logos.** Both wordmarks are now the reference's own path data, read out of the
live DOM — YouTube's 9-path 93x20 mark (play button `#FF0033`) and TikTok's
3-path 105x28 mark (`#2DCCD3` / `#F1204A`). An earlier attempt to draw them from
memory rendered as garbage, which is exactly why they are measured, not guessed.

**Icons.** TikTok's *For You*, *Explore*, *Following* and *Friends* nav glyphs are
the reference's real paths. The remaining TikTok glyphs, and all of YouTube's
guide and masthead icons, are drawn to match the reference's outlined weight on
the same grid — their size and position are verified, their path data is not,
because YouTube's `yt-icon` module never populates under automation and TikTok's
lower nav icons were not worth the extraction cost. The verified badges *are*
real: TikTok's `#20D5EC` circle-and-check, and YouTube's grey check-circle.

Defects this pass found and fixed, worth listing because they were invisible by
eye and only showed up under measurement:

- Every `font:` shorthand in the TikTok CSS ended in `inherit`, which is not a
  valid family — the whole declaration was being dropped, so the entire route
  rendered at the inherited 16px/normal/400 instead of its intended sizes.
- The kebab button was stretching the YouTube title row to 32px, pushing the
  metadata line and everything under it 6px down.
- The duration pill was `rgba(0,0,0,.8)` with letter-spacing; the reference is
  `rgba(0,0,0,.6)` with none.
- The result badge was the wrong colour, radius and padding, and the seed shipped
  a made-up `Tutorial` chip — the real page shows a captions chip and `4K`.
- "Create" is a 109x40 labelled pill, not a round icon button, and the avatar
  block is 54px wide — together these put the whole masthead-end cluster 13px off.
- The search field had an inset shadow the reference doesn't have; the TikTok
  side nav had a divider the reference doesn't have.
- TikTok's nav glyphs were solid fills against the reference's outlines, and the
  nav was missing the two group separators.

Two deltas are reproduced empirically rather than derived: TikTok reserves ~8px
of extra right gutter (which puts the content column at x=428, not 432), and its
card box is 394px tall against 336+52=388 of content — 6px I could not attribute
to any padding, margin or min-height on their node. Both are matched so the grid
lands where the reference's does.

Promoted / ad rows on the live YouTube page are left out on purpose; they are
personalised noise and nobody mocking up a thumbnail wants them in the shot.

## Editing

Press **`e`** anywhere on either route to show or hide the editor, or use the
button in the bottom-right corner. "Screenshot mode" is just the hidden state —
nothing of the editor renders, so a full-page capture is clean.

Per route you can change:

- **The query** — types straight into the real search UI in the header / nav.
- **Which cards show, and in what order** — checkbox to hide, `↑` `↓` to reorder,
  `✕` to delete, "Add card" for a blank one.
- **Per card**: thumbnail, title/caption, display name, handle, avatar, verified
  badge, views, likes, comments, date/age, duration, badge chip, and (YouTube)
  the description snippet.
- **YouTube only**: the filter chips and which one is active, the left guide on
  or off, and the Shorts shelf — its tiles, and which result it sits after.
- **TikTok only**: the active tab, the "Others searched for" rail, the side nav
  on or off, and which count the cover overlay draws (likes, comments or views,
  each with the matching icon).

Thumbnails and avatars take a URL, or a **click / drag-drop / paste** of a local
image. Uploads are read into a `data:` URL and stay in the page — nothing is
sent anywhere.

Everything is saved to `localStorage` as you type. **Export** writes the whole
state to JSON, **Import** reads one back (handy for keeping several mock-ups
side by side), and **Reset** returns to the captured seed data.

### Where a field has nowhere to go

YouTube search results show views and age, and no engagement counts at all. The
`likes` and `comments` fields are still on every card — they are editable and
they survive export — but the YouTube route has no place to draw them, because
the real page doesn't. On TikTok the cover overlay is a single count, so the
"Overlay metric" picker chooses which of the three it shows.

## Seed data

Both routes start from the real "axiom trading" results as captured on
2026-09-14. Titles, handles and dates are the captured ones; the UI text is
English throughout, and everything is editable.

What is deliberately not the capture:

- **View counts are boosted.** Every card reads in the millions — `2.4M views`
  on YouTube, `12.4M` on TikTok, with the cover overlay set to views rather
  than likes.
- **The result set is trimmed** to what fits one screenshot: two YouTube
  results, the Shorts shelf, one more result under it, and seven TikTok cards.
- **The sidebars carry no accounts.** YouTube's subscription rows and TikTok's
  "Following accounts" block are gone — they are avatars and real names, and
  they are the first thing anyone recognises in a screenshot.

Covers are real thumbnails cropped out of screen captures and served from
`public/thumbs` (`yt-*` 16:9, `short-*` and `tt-*` vertical). Creator pictures
are stock money / Miami / crypto shots in `public/avatars`. Nothing is
hotlinked, so no URL expires and no third-party request lands in the shot. A
card with an empty `thumb` or `avatar` falls back to the generated gradient
cover and the initial-letter avatar.

Creators are deliberately mixed: seven different TikTok accounts rather than
one posting three of the seven, and the verified check is on three of them, not
all — a grid where every account is verified reads as staged.

## Layout

```
src/
  main.tsx              path-based router: /youtube, /tiktok
  types.ts              the Card shape both routes share
  lib/store.ts          tiny useSyncExternalStore store + localStorage
  lib/seed.ts           the captured data
  lib/placeholder.ts    fallback covers and initial avatars
  youtube/              YouTube.tsx, youtube.css, icons.tsx
  tiktok/               TikTok.tsx, tiktok.css, icons.tsx
  editor/               Editor.tsx, ImagePicker.tsx, editor.css
public/thumbs/          the cropped cover images
public/avatars/         the creator pictures
```

The editor is deliberately not styled like either site, so it can never be
mistaken for part of the clone in a screenshot.
