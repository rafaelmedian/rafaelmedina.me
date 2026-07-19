# rafaelmedina.me

Personal portfolio of Rafael Medina — a single-page Vite + React + TypeScript app deployed to GitHub Pages at [rafaelmedina.me](https://rafaelmedina.me/).

## Development

```sh
npm install
npm run dev      # local dev server
npm run lint     # eslint
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

Copy `.env.example` to `.env` for optional analytics/map configuration (`VITE_GA_MEASUREMENT_ID`, `VITE_ENABLE_VERCEL_ANALYTICS`, `VITE_MAPBOX_TOKEN`).

## Structure

- `src/data/portfolio.ts` — all site copy, links, and work-preview card data.
- `src/components/SimpleFeed.tsx` — the homepage (profile hero + work mosaic).
- `src/components/StyleguidePage.tsx` — dev-only styleguide at `/styleguide`.
- `public/Projects/` — work preview images and videos.

## Deployment

The site is served from the `gh-pages` branch, which contains only the built output (`npm run build` → `dist/`) plus the `CNAME` file. Source lives on `rafaelmedian/site-polish-source`; see `PROJECT_STATUS.md` for the full branch layout.
