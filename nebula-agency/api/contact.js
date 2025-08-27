export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const { MAKE_WEBHOOK_URL, MAKE_WEBHOOK_SECRET, TURNSTILE_SECRET_KEY } = process.env
    if (!MAKE_WEBHOOK_URL || !MAKE_WEBHOOK_SECRET) {
      res.status(500).json({ error: 'Server misconfiguration: missing webhook env' })
      return
    }

    const body = req.body ?? (await readJson(req))
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid JSON' })
      return
    }

    // Basic honeypot check (aligns with frontend hp_field)
    if (body.hp_field) {
      res.status(204).end()
      return
    }

    // Turnstile verification (server-side)
    const captchaToken = typeof body.cf_turnstile_response === 'string' ? body.cf_turnstile_response : ''
    if (!captchaToken) {
      res.status(400).json({ error: 'Missing captcha token' })
      return
    }
    if (!TURNSTILE_SECRET_KEY) {
      res.status(500).json({ error: 'Server misconfiguration: missing TURNSTILE_SECRET_KEY' })
      return
    }
    const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: captchaToken }).toString(),
    })
    const verifyJson = await verifyResp.json().catch(() => ({ success: false }))
    if (!verifyJson?.success) {
      res.status(403).json({ error: 'Captcha verification failed' })
      return
    }

    // Minimal validation
    const hasName = typeof body.name === 'string' && body.name.trim().length >= 2
    const hasEmail = typeof body.email === 'string' && /.+@.+\..+/.test(body.email)
    const hasMessage = typeof body.message === 'string' && body.message.trim().length >= 10
    if (!hasName || !hasEmail || !hasMessage) {
      res.status(422).json({ error: 'Validation failed' })
      return
    }

    const forwarded = {
      name: body.name,
      email: body.email,
      message: body.message,
      company: body.company ?? '',
      website: body.website ?? '',
      budget: typeof body.budget === 'number' ? body.budget : null,
      // Metadata useful in Make/Notion
      submittedAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '',
    }

    const resp = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': MAKE_WEBHOOK_SECRET,
      },
      body: JSON.stringify(forwarded),
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      res.status(502).json({ error: 'Upstream webhook failed', status: resp.status, body: text })
      return
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error' })
  }
}

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

