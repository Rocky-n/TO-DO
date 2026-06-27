import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import the Tailwind plugin
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add it to the plugins array
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        todo: resolve(__dirname, 'todo.html')
      }
    }
  }
})