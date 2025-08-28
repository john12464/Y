export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const { MAKE_WEBHOOK_URL, MAKE_WEBHOOK_SECRET, FORM_SECRET } = process.env
    if (!MAKE_WEBHOOK_URL || !MAKE_WEBHOOK_SECRET) {
      res.status(500).json({ error: 'Server misconfiguration: missing webhook env' })
      return
    }
    if (!FORM_SECRET) {
      res.status(500).json({ error: 'Server misconfiguration: missing FORM_SECRET' })
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

    // Validate form token (HMAC signed)
    if (typeof body.form_token !== 'string') {
      res.status(400).json({ error: 'Missing form token' })
      return
    }
    const isTokenValid = verifyFormToken(body.form_token, FORM_SECRET, req.headers['user-agent'] || '')
    if (!isTokenValid) {
      res.status(403).json({ error: 'Invalid form token' })
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
      form_token: body.form_token,
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

function verifyFormToken(token, secret, userAgent) {
  try {
    const parts = token.split('.')
    if (parts.length !== 4) return false
    const [issuedAtStr, uaHash, nonce, signature] = parts
    const issuedAt = parseInt(issuedAtStr, 10)
    if (!Number.isFinite(issuedAt)) return false
    // 15 minutes expiry
    if (Math.floor(Date.now() / 1000) - issuedAt > 15 * 60) return false
    const expectedUaHash = (await import('crypto')).createHash('sha256').update(userAgent).digest('hex')
    if (uaHash !== expectedUaHash) return false
    const payload = `${issuedAt}.${uaHash}.${nonce}`
    const actualSig = (await import('crypto')).createHmac('sha256', secret).update(payload).digest('hex')
    return cryptoSafeEqual(signature, actualSig)
  } catch {
    return false
  }
}

function cryptoSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

