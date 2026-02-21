console.log('--- API SERVER STARTING ---')
/**
 * local-api-server.js
 *
 * Minimal HTTP dev server that shims Vercel serverless functions locally.
 * Run with:  node local-api-server.js
 *
 * The Vite dev server (vite.config.js) proxies /api/* here on port 3001.
 * This file is NOT deployed to Vercel.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Load .env manually (no dotenv dependency needed) ─────────────────────────
function loadEnv() {
    const envPath = path.join(__dirname, '.env')
    if (!fs.existsSync(envPath)) return
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx === -1) continue
        const key = trimmed.slice(0, eqIdx).trim()
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
        if (key && !(key in process.env)) {
            process.env[key] = value
        }
    }
}
loadEnv()

// ── Import handlers (lazy — after env is loaded) ─────────────────────────────
const { default: weatherHandler } = await import('./api/weather.js')
const { default: geoHandler } = await import('./api/geo.js')

const routes = {
    '/api/weather': weatherHandler,
    '/api/geo': geoHandler,
}

const PORT = 3001

// ── Simple req/res shim so Vercel-style handlers work as-is ──────────────────
function createShims(req, res, query) {
    const mockReq = { method: req.method, query, url: req.url }

    const mockRes = {
        _sent: false,
        status(code) {
            if (!this._sent) res.statusCode = code
            return this
        },
        json(body) {
            if (this._sent) return
            this._sent = true
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
        },
    }

    return { mockReq, mockRes }
}

// ── Server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    const url = new URL(req.url, `http://localhost:${PORT}`)
    const handler = routes[url.pathname]

    if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not found' }))
        return
    }

    const query = Object.fromEntries(url.searchParams.entries())
    const { mockReq, mockRes } = createShims(req, res, query)

    try {
        await handler(mockReq, mockRes)
    } catch (err) {
        console.error('[API Error]', err.message)
        if (!mockRes._sent) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal server error' }))
        }
    }
})

server.listen(PORT, () => {
    console.log(`✅  Local API server → http://localhost:${PORT}`)
    console.log('    Routes: /api/weather  /api/geo')
})
