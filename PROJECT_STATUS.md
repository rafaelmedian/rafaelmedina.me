# Project Status

Last updated: 2026-07-19

## Current state

- The homepage renders `SimpleFeed` (`src/App.tsx` → `src/components/SimpleFeed.tsx`): profile hero with live Punta Cana clock, company history, and the selected-work mosaic (`showProjects` is on).
- All card content and site links live in `src/data/portfolio.ts`.
- `/styleguide` renders `StyleguidePage` in dev only; it is not deployed as a static route in production.
- `npm run build` and `npm run lint` both pass.

## Branch layout

- `gh-pages` — default branch; holds only the **built** site (Vite `dist/` output plus `CNAME`). Deploys are commits/PRs to this branch.
- `rafaelmedian/site-polish-source` — current **source** branch (this Vite + React + TypeScript app).
- `archive/*` — retired history, including the pre-2026 Jekyll site (`archive/2020-12-21-master`) and the previous source branch (`archive/2026-04-21-main`).

## Not currently used

`InfiniteCanvasBoard`, `SiteHeader`, `SiteFooter`, `PortfolioGrid`, and `HoverVideoLink` are kept in `src/components/` but are not rendered by `App`. The infinite-canvas experience described in older versions of this file was replaced by the `SimpleFeed` mosaic.

## Known follow-ups

- `src/assets/profile-photo.png` is ~960 kB — worth compressing.
- Confirm `hey@rafaelmedina.me` receives mail (copy changed from the old `hello@` address).
