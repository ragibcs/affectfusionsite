# Deploying the AffectFusion Research Website (`site/`)

The [site/](file:///run/media/ragib/hdd2/final-thesis/site) folder is a **100% static, zero-build-step** academic research website. It works directly when opened locally in any browser (`file:///.../site/index.html`) and deploys in under 2 minutes to any static host.

---

## Option 1 — Preview Locally (Instant)
Double-click `site/index.html`, or run a local web server:
```bash
cd /run/media/ragib/hdd2/final-thesis/site
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

## Option 2 — Deploy Free on GitHub Pages (Recommended)
1. Copy the contents of `site/` into a `docs/` folder (or a `gh-pages` branch) in your repository `https://github.com/ragibcs/AffectFusion`.
2. On GitHub, go to **Settings → Pages → Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` → folder `/docs` (or `gh-pages` → `/ (root)`)
3. Save — within ~1 minute your thesis site will be live at **`https://ragibcs.github.io/AffectFusion/`**!

## Option 3 — Drag-and-Drop on Netlify / Cloudflare Pages / Vercel
- **Netlify Drop:** Go to `https://app.netlify.com/drop` and drag the entire `site/` folder onto the page — instant HTTPS URL in 10 seconds!
- **Cloudflare Pages / Vercel:** Upload the `site/` directory with Build Command = *(empty)* and Output Directory = `.`.
