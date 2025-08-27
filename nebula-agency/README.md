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
- Validates the input (name/email/message + honeypot)
- Adds the `X-Webhook-Secret` header set to `MAKE_WEBHOOK_SECRET`
- Forwards the JSON to `MAKE_WEBHOOK_URL`

### 4) Local development

- Vite dev server does not run serverless functions. Use `vercel dev` for local API testing:

```bash
npm i -g vercel
vercel dev
```

Then open the app at the URL shown by Vercel (the API will be available at `/api/contact`).
