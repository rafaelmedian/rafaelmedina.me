# Project Status

Last updated: 2026-07-27

## Current state

- The homepage renders `SimpleFeed` (`src/App.tsx` → `src/components/SimpleFeed.tsx`): profile hero with live Punta Cana clock, company history, and the selected-work mosaic (`showProjects` is on).
- All card content and site links live in `src/data/portfolio.ts`.
- `/styleguide` renders `StyleguidePage` in dev only; it is not deployed as a static route in production.
- `npm run lint`, `npm run build`, and `npm run test:e2e` all pass.

## Branch layout

- `main` — default branch and the **only** branch that deploys. Holds this
  source app; GitHub Actions builds it and publishes to Pages on every push.
- `archive/*` — retired history, including the pre-2026 Jekyll site
  (`archive/2020-12-21-master`) and older source branches.
- `pre-ci-deploy` (tag) — the last hand-published `gh-pages` tree, kept as a
  rollback reference.

Feature branches are cut from `main` and merged back via PR. There is no longer
a split between a "source" branch and a "built output" branch — that split is
exactly what let the two drift apart.

## Not currently used

`InfiniteCanvasBoard`, `SiteHeader`, `SiteFooter`, `PortfolioGrid`, and `HoverVideoLink` are kept in `src/components/` but are not rendered by `App`. The infinite-canvas experience described in older versions of this file was replaced by the `SimpleFeed` mosaic.

## Known follow-ups

- `src/assets/profile-photo.png` is ~960 kB — worth compressing.
- Confirm `hey@rafaelmedina.me` receives mail (copy changed from the old `hello@` address).
