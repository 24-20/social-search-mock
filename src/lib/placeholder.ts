/**
 * Deterministic stand-in artwork, so an unedited card still reads as a card.
 * Everything here is generated locally — nothing is hotlinked.
 */

const PALETTE = [
  ['#1f2a44', '#3b1f44'],
  ['#0f3d3e', '#123c5a'],
  ['#3d1f2a', '#4a2a12'],
  ['#232323', '#3a3a3a'],
  ['#14304a', '#1d1240'],
  ['#3a2a0f', '#4a1f1f'],
  ['#12324a', '#0f4a3d'],
  ['#2a1240', '#4a1230'],
]

export function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const svg = (s: string) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`

/** A cover image placeholder at the given aspect, tinted from the seed. */
export function coverPlaceholder(seed: string, w: number, h: number): string {
  const [a, b] = PALETTE[hash(seed) % PALETTE.length]
  const id = `g${hash(seed) % 9999}`
  return svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>` +
      `</linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#${id})"/>` +
      `<g fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1">` +
      `<path d="M0 ${h * 0.7} L${w} ${h * 0.35}"/><path d="M0 ${h * 0.86} L${w} ${h * 0.5}"/>` +
      `</g>` +
      `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) * 0.13}" fill="rgba(255,255,255,0.10)"/>` +
      `<path d="M${w / 2 - Math.min(w, h) * 0.04} ${h / 2 - Math.min(w, h) * 0.06} ` +
      `L${w / 2 + Math.min(w, h) * 0.07} ${h / 2} ` +
      `L${w / 2 - Math.min(w, h) * 0.04} ${h / 2 + Math.min(w, h) * 0.06} Z" fill="rgba(255,255,255,0.55)"/>` +
      `</svg>`,
  )
}

const AVATAR_BG = ['#c2410c', '#0369a1', '#4d7c0f', '#7e22ce', '#b91c1c', '#0f766e', '#a16207', '#be185d']

/** A circular initial avatar — the same idea YouTube uses for accounts with no picture. */
export function avatarPlaceholder(name: string): string {
  const ch = (name.trim()[0] || '?').toUpperCase()
  const bg = AVATAR_BG[hash(name) % AVATAR_BG.length]
  return svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" fill="${bg}"/>` +
      `<text x="48" y="49" font-family="Roboto, Arial, sans-serif" font-size="46" fill="#fff" ` +
      `text-anchor="middle" dominant-baseline="central">${ch.replace(/[<>&]/g, '')}</text>` +
      `</svg>`,
  )
}
