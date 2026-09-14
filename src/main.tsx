import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import YouTube from './youtube/YouTube'
import TikTok from './tiktok/TikTok'
import Editor from './editor/Editor'
import './styles.css'

function usePath(): string {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const onPop = () => setPath(location.pathname)
    window.addEventListener('popstate', onPop)
    // Intercept in-app links so /youtube ↔ /tiktok doesn't reload the bundle.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.button !== 0) return
      const href = a.getAttribute('href') || ''
      if (href === '/youtube' || href === '/tiktok') {
        e.preventDefault()
        history.pushState(null, '', href)
        setPath(href)
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])
  return path
}

function App() {
  const path = usePath()

  if (path.startsWith('/youtube')) {
    return (
      <>
        <YouTube />
        <Editor route="youtube" />
      </>
    )
  }
  if (path.startsWith('/tiktok')) {
    return (
      <>
        <TikTok />
        <Editor route="tiktok" />
      </>
    )
  }
  return (
    <div className="landing">
      <div>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Search-page mocks</h1>
        <p>
          <a href="/youtube">/youtube</a> — YouTube search results
          <br />
          <a href="/tiktok">/tiktok</a> — TikTok search results
        </p>
        <p style={{ color: '#888', fontSize: 13 }}>Press “e” on either route to show or hide the editor.</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
