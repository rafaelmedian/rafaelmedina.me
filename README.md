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

Copy `.env.example` to `.env` for optional analytics/map configuration
(`VITE_GA_MEASUREMENT_ID`, `VITE_APPLE_MAPS_SNAPSHOT_URL`). Generate the complete,
signed Punta Cana snapshot URL with [Apple's Create a Map tool](https://developer.apple.com/maps/create-a-map/);
without it, the location card falls back to its illustrated Dominican Republic map.

Google Analytics only loads when `VITE_GA_MEASUREMENT_ID` is set at build time. In
CI it comes from the `VITE_GA_MEASUREMENT_ID` repo variable; leave it unset locally
and nothing is tracked in dev.

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
