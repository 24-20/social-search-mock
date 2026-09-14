import { useRef, useState } from 'react'
import { fileToDataUrl } from '../lib/files'

/**
 * URL field + click-to-pick + drag-and-drop + paste. Uploads never leave the
 * page: the file is read into a data: URL and kept in local state.
 */
export function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  async function take(files: FileList | null) {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    onChange(await fileToDataUrl(file))
  }

  const isUpload = value.startsWith('data:')

  return (
    <div className="ed-field">
      <span>{label}</span>
      <div className="ed-row" style={{ marginBottom: 6 }}>
        <input
          type="text"
          value={isUpload ? '' : value}
          placeholder={isUpload ? '(uploaded image)' : 'https://…'}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <button className="ed-btn" style={{ flex: '0 0 auto' }} onClick={() => onChange('')}>
            Clear
          </button>
        ) : null}
      </div>
      <div
        className={'ed-drop' + (over ? ' is-over' : '')}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          void take(e.dataTransfer.files)
        }}
        onPaste={(e) => void take(e.clipboardData.files)}
        tabIndex={0}
      >
        {isUpload ? 'Uploaded — click to replace' : 'Click, drop or paste an image'}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void take(e.target.files)}
      />
    </div>
  )
}
