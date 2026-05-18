# Faithful Cleaning TX

Marketing site for Faithful Cleaning TX — a solo cleaning business based in Leander, Texas, serving Williamson and Travis counties.

## Stack

- **Static HTML / CSS / JS** — no build step. Drop into any static host.
- **Hosting:** Cloudflare Pages (custom domain to be mapped).
- **Form backend:** n8n workflow at `https://n8n.cloudpublica.org/webhook/faithful-cleaning-lead` → Gmail send to `faithfulcleaningtx@gmail.com`.
- **Fonts:** Cormorant Garamond + Inter (Google Fonts).
- **Stock photography:** Pexels (free, commercial use OK). Photographers credited in footer.

## Structure

```
.
├── index.html          ← single-page site, anchored sections
├── css/styles.css
├── js/main.js          ← nav, reveal-on-scroll, before/after sliders, form
├── assets/img/
│   ├── originals/      ← her raw photos (not deployed if .gitignored later)
│   ├── stock/          ← raw Pexels downloads
│   └── optimized/      ← responsive WebP + JPEG (800w, 1600w) — served files
├── robots.txt
├── sitemap.xml
└── _headers            ← Cloudflare Pages cache + security headers
```

## Local preview

```bash
cd FaithfulCleaning
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to Cloudflare Pages

1. Connect this GitHub repo to a new Cloudflare Pages project.
2. **Build command:** *(leave blank)*
3. **Build output directory:** `/`
4. Push to `main` → CF Pages auto-deploys.
5. Map custom domain in the Pages dashboard.

## Form workflow (n8n)

Webhook URL: `https://n8n.cloudpublica.org/webhook/faithful-cleaning-lead`
Posts JSON. n8n workflow uses Gmail OAuth credential (`LzOjNuaZndMNblo3`) to send the lead to `faithfulcleaningtx@gmail.com`.

## SEO

- LocalBusiness JSON-LD with full service catalog and area-served list
- OpenGraph + Twitter card meta
- Sitemap + robots.txt
- Semantic headings, alt text on every image, skip-to-content link
- Click-to-call (`tel:`) link surfaces on desktop & mobile + floating mobile FAB

## Accessibility

- Skip link, focus-visible outlines, ARIA labels on icon-only controls
- Before/after sliders are keyboard-operable (← →)
- Reduced-motion media query honored
- Color contrast meets WCAG AA against the deep-teal background

## Credits

- Logo: Faithful Cleaning TX
- Stock photos: Pexels — ClickerHappy (#349749), Burst (#545034), cottonbro studio (#7407947)
- Before/after photography: real Faithful Cleaning TX client homes, shared with permission
