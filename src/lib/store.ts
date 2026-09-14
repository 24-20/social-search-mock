import { useSyncExternalStore } from 'react'
import type { AppState } from '../types'
import { seedState } from './seed'

const KEY = 'social-search-mock/v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as AppState
    // Shallow-merge onto the seed so a state saved by an older build still boots.
    const base = seedState()
    return {
      youtube: { ...base.youtube, ...parsed.youtube },
      tiktok: { ...base.tiktok, ...parsed.tiktok },
    }
  } catch {
    return seedState()
  }
}

let state: AppState = load()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Quota — an editor full of uploaded data: URLs can exceed it. The page
    // keeps working, it just won't survive a reload.
  }
}

export function getState(): AppState {
  return state
}

export function setState(next: AppState) {
  state = next
  emit()
}

export function update(fn: (draft: AppState) => AppState) {
  setState(fn(state))
}

export function updateYouTube(fn: (yt: AppState['youtube']) => AppState['youtube']) {
  update((s) => ({ ...s, youtube: fn(s.youtube) }))
}

export function updateTikTok(fn: (tt: AppState['tiktok']) => AppState['tiktok']) {
  update((s) => ({ ...s, tiktok: fn(s.tiktok) }))
}

export function reset() {
  setState(seedState())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useStore(): AppState {
  return useSyncExternalStore(subscribe, getState, getState)
}
