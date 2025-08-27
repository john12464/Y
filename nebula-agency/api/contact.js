import { createHmac } from 'node:crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const secret = process.env.WEBHOOK_SECRET
  const webhookUrl = process.env.WEBHOOK_URL || 'https://hook.eu2.make.com/y97l9id2jgsztkupuxgc81o8uyurourk'

  if (!secret) {
    return res.status(500).json({ error: 'Server not configured: missing WEBHOOK_SECRET' })
  }

  let payload
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  // Basic validation
  const { name, email, message, company, website } = payload || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const enriched = {
    name,
    email,
    message,
    company: company || '',
    website: website || '',
    meta: {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || '',
      ip: (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString(),
      source: 'nebula-agency-site',
    },
  }

  const timestamp = Date.now().toString()
  const bodyString = JSON.stringify(enriched)
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${bodyString}`)
    .digest('hex')

  try {
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Token': secret,
        'X-Signature': signature,
        'X-Timestamp': timestamp,
        'X-Source': 'nebula-agency-site',
      },
      body: bodyString,
    })

    if (!resp.ok) {
      const text = await resp.text()
      return res.status(502).json({ error: 'Upstream webhook failed', details: text.slice(0, 500) })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Webhook request error' })
  }
}

