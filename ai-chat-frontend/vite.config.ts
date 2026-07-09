import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/start-session': 'http://localhost:8000',
      '/chat': 'http://localhost:8000',
      '/finish-chat-link': 'http://localhost:8000',
      '/share': 'http://localhost:8000',
    },
  },
})