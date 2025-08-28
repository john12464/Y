import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { FORM_SECRET } = process.env
  if (!FORM_SECRET) {
    res.status(500).json({ error: 'Server misconfiguration: missing FORM_SECRET' })
    return
  }

  // Token payload: issued at, user agent hash, and a random nonce
  const issuedAt = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(16).toString('hex')
  const ua = req.headers['user-agent'] || ''
  const uaHash = crypto.createHash('sha256').update(ua).digest('hex')

  const payload = `${issuedAt}.${uaHash}.${nonce}`
  const signature = crypto.createHmac('sha256', FORM_SECRET).update(payload).digest('hex')
  const token = `${payload}.${signature}`

  res.status(200).json({ token })
}

