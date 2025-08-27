const { createHmac } = require('node:crypto')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  const secret = process.env.WEBHOOK_SECRET
  const webhookUrl = process.env.WEBHOOK_URL || 'https://hook.eu2.make.com/y97l9id2jgsztkupuxgc81o8uyurourk'
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured: missing WEBHOOK_SECRET' }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { name, email, message, company, website } = payload || {}
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) }
  }

  const enriched = {
    name,
    email,
    message,
    company: company || '',
    website: website || '',
    meta: {
      timestamp: new Date().toISOString(),
      userAgent: event.headers['user-agent'] || '',
      ip: (event.headers['x-forwarded-for'] || '').toString(),
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
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream webhook failed', details: text.slice(0, 500) }) }
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Webhook request error' }) }
  }
}

