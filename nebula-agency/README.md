# Nebula Agency — React (Vite + JSX)

Professional, animated digital agency site with particles, galaxy hero, GSAP cubes, pages, and contact form.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

- Vercel: import this repo. The included `vercel.json` auto-builds and serves `dist/`.
- Netlify: drag-and-drop `dist/` or connect repo. Configured via `netlify.toml`.
- Docker: `docker build -t nebula-agency . && docker run -p 8080:80 nebula-agency`

## Structure

- `src/pages` — Home, About, Why Choose Us, Contact
- `src/components` — Navbar, Footer, Particles, Splash, TrustBar, Process, Testimonials
- `src/effects` — Galaxy shader (OGL)
- `src/animations` — Cubes (GSAP)

## Environment notes

- Animations are lazy-loaded and respect `prefers-reduced-motion`.
- Replace `public/logo.svg` with your brand asset.

---

# Nebula Agency — Static HTML/CSS/JS

Hand-authored, no-build static version in `../nebula-agency-static`.

## Preview locally

```bash
python3 -m http.server 8080 --directory ../nebula-agency-static
# open http://localhost:8080/nebula-agency-static/index.html
```

## Deploy

- Upload the `nebula-agency-static` folder to any static host (S3 + CloudFront, Netlify Drop, GitHub Pages).
- All animations via CDN (OGL, GSAP). No server required.

## Contact form -> Make.com -> Notion

This project includes a serverless endpoint that forwards form submissions to a Make.com webhook with a secret header. The Make scenario then creates a new row in a Notion database.

### 1) Configure environment variables

Create a `.env` (or configure variables in your hosting provider) with:

```
MAKE_WEBHOOK_URL=YOUR_MAKE_CUSTOM_WEBHOOK_URL
MAKE_WEBHOOK_SECRET=YOUR_LONG_RANDOM_SECRET
# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=YOUR_TURNSTILE_SECRET_KEY
VITE_TURNSTILE_SITE_KEY=YOUR_TURNSTILE_SITE_KEY
```

On Vercel, set these in Project Settings → Environment Variables. On Netlify, use Site settings → Environment variables.

### 2) Make.com scenario

1. Add a trigger: Webhooks → Custom webhook. Copy the webhook URL into `MAKE_WEBHOOK_URL`.
2. Immediately after, add a Filter that checks the secret header:
   - Left operand: `{{1.headers["x-webhook-secret"]}}`
   - Condition: equals
   - Right operand: `YOUR_LONG_RANDOM_SECRET` (must match `MAKE_WEBHOOK_SECRET`)
3. Add Notion → Create a Database Item.
   - Connect your Notion account and choose the target database.
   - Map fields from the webhook payload (sample below).

Payload sent to Make (keys):

```
name, email, message, company, website, budget, submittedAt, userAgent, ip
```

Recommended Notion property mapping:
- Name (Title): `name`
- Email (Email): `email`
- Message (Rich text): `message`
- Company (Rich text): `company`
- Website (URL/Rich text): `website`
- Budget (Number): `budget`
- Submitted At (Date): `submittedAt`
- User Agent (Rich text): `userAgent`
- IP (Rich text): `ip`

### 3) Frontend behavior

The form at `src/pages/Contact.jsx` posts to `/api/contact`. In production on Vercel, this resolves to the serverless function at `api/contact.js`, which:
- Verifies Cloudflare Turnstile token using `TURNSTILE_SECRET_KEY`
- Validates the input (name/email/message + honeypot)
- Adds the `X-Webhook-Secret` header set to `MAKE_WEBHOOK_SECRET`
- Forwards the JSON to `MAKE_WEBHOOK_URL`

### 4) Local development

- During `npm run dev`, a Vite middleware handles `POST /api/contact` and forwards to Make with the secret. Create `./.env`:

```
MAKE_WEBHOOK_URL=YOUR_MAKE_CUSTOM_WEBHOOK_URL
MAKE_WEBHOOK_SECRET=YOUR_LONG_RANDOM_SECRET
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Then:

```
npm run dev
```

In Make, click “Run once”, then submit the form locally.

### 5) Captcha notes (Cloudflare Turnstile)

- The widget is loaded via `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` in `index.html` and rendered invisibly in `Contact.jsx`.
- The response token is sent as `cf_turnstile_response` with the form payload.
- Server-side verification runs in both `api/contact.js` and the Vite dev proxy, failing requests with invalid/missing tokens.
- Use the test keys above locally; obtain production keys from Cloudflare Turnstile for your domain.
