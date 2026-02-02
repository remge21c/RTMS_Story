import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 파일 저장 API 플러그인
    {
      name: 'file-save-api',
      configureServer(server) {
        // JSON 저장 API
        server.middlewares.use('/api/save-scenes', async (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const data = JSON.parse(body)
                const filePath = path.resolve(__dirname, 'public/data/scenes.json')
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, error: String(error) }))
              }
            })
          } else {
            res.writeHead(405)
            res.end()
          }
        })

        // 이미지 저장 API
        server.middlewares.use('/api/save-image', async (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                const { filename, base64Data } = JSON.parse(body)
                const filePath = path.resolve(__dirname, 'public/images', filename)
                // Base64 데이터에서 헤더 제거
                const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
                fs.writeFileSync(filePath, Buffer.from(base64, 'base64'))
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, path: `/images/${filename}` }))
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, error: String(error) }))
              }
            })
          } else {
            res.writeHead(405)
            res.end()
          }
        })
      }
    }
  ],
})
