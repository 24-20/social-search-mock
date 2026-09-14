import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// appType 'spa' (the default) serves index.html for /youtube and /tiktok.
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: false },
})
