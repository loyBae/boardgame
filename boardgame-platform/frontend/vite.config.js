import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
	  host: '0.0.0.0', // 외부에서 접근 가능하도록 설정
	  port: 5173,
	  strictPort: true,
  },
})

