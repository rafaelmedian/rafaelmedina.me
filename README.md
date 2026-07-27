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

## Testing

```sh
npm run test:e2e   # Playwright; builds and serves the site itself
```

## Deployment

`main` is the only branch that ships. Merging into it triggers
`.github/workflows/deploy.yml`, which runs `npm run build` and publishes `dist/`
to GitHub Pages. Nothing is copied by hand.

```
PR ──► CI (lint · build · e2e) ──► merge to main ──► Deploy ──► rafaelmedina.me
```

**Never edit built output.** Everything the site serves is generated from `src/`
and `public/`. The custom domain ships as `public/CNAME`, and the deploy fails
loudly if it ever goes missing.

See `PROJECT_STATUS.md` for the branch layout.
