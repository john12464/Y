import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const MAKE_WEBHOOK_URL = env.MAKE_WEBHOOK_URL
  const MAKE_WEBHOOK_SECRET = env.MAKE_WEBHOOK_SECRET

  const devContactProxy = {
    name: 'dev-contact-proxy',
    configureServer(server) {
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

          // Turnstile verification (server-side during dev)
          const captchaToken = typeof body.cf_turnstile_response === 'string' ? body.cf_turnstile_response : ''
          const secretKey = env.TURNSTILE_SECRET_KEY
          if (!captchaToken) {
            res.statusCode = 400
            res.end('Missing captcha token')
            return
          }
          if (!secretKey) {
            res.statusCode = 500
            res.end('Missing TURNSTILE_SECRET_KEY')
            return
          }
          try {
            const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ secret: secretKey, response: captchaToken }).toString(),
            })
            const verifyJson = await verifyResp.json().catch(() => ({ success: false }))
            if (!verifyJson?.success) {
              res.statusCode = 403
              res.end('Captcha verification failed')
              return
            }
          } catch (e) {
            res.statusCode = 502
            res.end('Captcha verification error')
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
