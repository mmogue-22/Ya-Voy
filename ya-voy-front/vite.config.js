import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3033,
        proxy: {
            '/api': {
                target: 'http://localhost:3022',
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})