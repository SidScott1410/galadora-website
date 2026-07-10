# Galadora Technologies — Website

[![Deploy Status](https://img.shields.io/badge/deploy-live-brightgreen)](https://galadora.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-proprietary-lightgrey)](./LICENSE)

**Galadora Technologies** builds and operates distributed, air-gapped AI infrastructure for enterprises and governments — sovereign-capable, power-ready, and built from first principles.

> Infrastructure for the Inference Era.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.6 |
| Styling | Tailwind CSS 4 + CSS Modules |
| Build | Vite 7 |
| UI Components | shadcn/ui + Radix UI |
| Routing | Wouter |
| Animation | Framer Motion + CSS transitions |
| Package Manager | pnpm |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
git clone https://github.com/galadora/galadora-website.git
cd galadora-website
pnpm install
```

### Development

```bash
pnpm dev
```

Opens at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
```

Output is written to `dist/public/`. The build is a fully static SPA — drop the contents of `dist/public/` onto any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3 + CloudFront).

### Preview Production Build

```bash
pnpm preview
```

---

## Project Structure

```
galadora-website/
├── client/
│   ├── index.html              ← Entry point with full SEO meta, JSON-LD, OG tags
│   ├── public/
│   │   ├── robots.txt          ← Crawler + AI bot permissions
│   │   ├── sitemap.xml         ← XML sitemap for Google/Bing
│   │   ├── llms.txt            ← LLM/AI agent discoverability (llmstxt.org standard)
│   │   ├── manifest.json       ← PWA manifest
│   │   ├── favicon.png         ← 192×192 favicon
│   │   └── apple-touch-icon.png
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx        ← Hero page (video bg, carousel, nav overlay)
│       │   ├── Home.module.css ← All hero styles (desktop + tablet + mobile)
│       │   └── NotFound.tsx
│       ├── components/         ← Shared UI components (shadcn/ui)
│       ├── contexts/           ← ThemeProvider
│       ├── App.tsx             ← Router
│       └── main.tsx            ← Entry
├── server/                     ← Placeholder (static build only)
├── shared/                     ← Shared types/constants
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Deployment

### Vercel / Netlify / Cloudflare Pages

1. Connect your GitHub repository.
2. Set build command: `pnpm build`
3. Set output directory: `dist/public`
4. Deploy.

No environment variables are required for the static build.

### GitHub Pages

```bash
pnpm build
# Copy dist/public contents to your gh-pages branch
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install && pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist/public /usr/share/nginx/html
EXPOSE 80
```

---

## SEO & Discoverability

This project is fully optimized for search engine and AI agent discoverability:

- **Google / Bing**: `robots.txt`, `sitemap.xml`, canonical URLs, JSON-LD structured data (Organization, WebSite, WebPage schemas)
- **Social sharing**: Open Graph tags (Facebook, LinkedIn, Slack) and Twitter/X Card tags
- **AI agents**: `llms.txt` (llmstxt.org standard), explicit `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` permissions in `robots.txt`
- **PWA**: `manifest.json` with icons, theme color, and screenshot
- **Accessibility**: WCAG 2.1 AA — `<main>` landmark, `aria-label`, `aria-current`, focus rings, skip link, `prefers-reduced-motion`

---

## Updating Content

All placeholder content is in `client/src/pages/Home.tsx`. Key constants at the top of the file:

```ts
const VIDEO_URL  = "...";   // Replace with your custom video URL
const LOGO_WHITE = "...";   // Replace with your logo URL
const COMPANIES  = [...];   // Team background companies
```

Update `client/index.html` for meta title, description, and canonical URL before going live.

---

## License

Proprietary — Galadora Technologies. All rights reserved.
