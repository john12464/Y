import { defineConfig, loadEnv } from 'vite'
import crypto from 'node:crypto'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const MAKE_WEBHOOK_URL = env.MAKE_WEBHOOK_URL
  const MAKE_WEBHOOK_SECRET = env.MAKE_WEBHOOK_SECRET
  const FORM_SECRET = env.FORM_SECRET

  const devContactProxy = {
    name: 'dev-contact-proxy',
    configureServer(server) {
      // Token issuance for dev
      server.middlewares.use('/api/form-token', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        if (!FORM_SECRET) {
          res.statusCode = 500
          res.end('Missing FORM_SECRET')
          return
        }
        const issuedAt = Math.floor(Date.now() / 1000)
        const nonce = crypto.randomBytes(16).toString('hex')
        const ua = req.headers['user-agent'] || ''
        const uaHash = crypto.createHash('sha256').update(ua).digest('hex')
        const payload = `${issuedAt}.${uaHash}.${nonce}`
        const signature = crypto.createHmac('sha256', FORM_SECRET).update(payload).digest('hex')
        const token = `${payload}.${signature}`
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ token }))
      })
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        if (!MAKE_WEBHOOK_URL || !MAKE_WEBHOOK_SECRET) {
          res.statusCode = 500
          res.end('Missing MAKE_WEBHOOK_URL/MAKE_WEBHOOK_SECRET')
          return
        }
        if (!FORM_SECRET) {
          res.statusCode = 500
          res.end('Missing FORM_SECRET')
          return
        }

        try {
          const bodyStr = await new Promise((resolve, reject) => {
            let data = ''
            req.on('data', (c) => { data += c })
            req.on('end', () => resolve(data))
            req.on('error', reject)
          })

          let body
          try { body = JSON.parse(bodyStr || '{}') } catch (e) {
            res.statusCode = 400
            res.end('Invalid JSON')
            return
          }

          if (body.hp_field) {
            res.statusCode = 204
            res.end()
            return
          }

          // Validate issued form token
          if (typeof body.form_token !== 'string') {
            res.statusCode = 400
            res.end('Missing form token')
            return
          }
          if (!verifyFormToken(body.form_token, FORM_SECRET, req.headers['user-agent'] || '')) {
            res.statusCode = 403
            res.end('Invalid form token')
            return
          }

          const hasName = typeof body.name === 'string' && body.name.trim().length >= 2
          const hasEmail = typeof body.email === 'string' && /.+@.+\..+/.test(body.email)
          const hasMessage = typeof body.message === 'string' && body.message.trim().length >= 10
          if (!hasName || !hasEmail || !hasMessage) {
            res.statusCode = 422
            res.end('Validation failed')
            return
          }

          const forwarded = {
            name: body.name,
            email: body.email,
            message: body.message,
            company: body.company ?? '',
            website: body.website ?? '',
            budget: typeof body.budget === 'number' ? body.budget : null,
            form_token: typeof body.form_token === 'string' ? body.form_token : '',
            submittedAt: new Date().toISOString(),
            userAgent: req.headers['user-agent'] || '',
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '',
          }

          const upstream = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': MAKE_WEBHOOK_SECRET,
            },
            body: JSON.stringify(forwarded),
          })

          if (!upstream.ok) {
            const text = await upstream.text().catch(() => '')
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Upstream webhook failed', status: upstream.status, body: text }))
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        } catch (err) {
          res.statusCode = 500
          res.end('Unexpected error')
        }
      })
    },
  }

  return {
    plugins: [react(), devContactProxy],
  }
})
