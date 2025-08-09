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
