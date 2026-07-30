# Project Status

Last updated: 2026-07-30

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

## Dead code

None currently. Every file under `src/` is reachable from `src/main.tsx` or
`src/entry-server.tsx`.

The infinite-canvas experience described in older versions of this file was
replaced by the `SimpleFeed` mosaic; its components (`InfiniteCanvasBoard`,
`PortfolioGrid`, `PortfolioCard`, `ProjectDialog`, `SiteHeader`, `SiteFooter`,
`HoverVideoLink`) were deleted on 2026-07-30 along with their CSS. Recover from
git history rather than re-adding stubs.

## Theming

There is no theme system. `:root` in `src/index.css` holds the only token set and
the site is always light. The `[data-theme="dark"]` token block and the matching
`data-theme="light"` attribute on the root `<div>` in `App.tsx` were removed on
2026-07-30 — the dark block had no way to activate, so it was shipping to every
visitor as dead bytes. Adding dark mode means reintroducing both halves, not just
the CSS.

Note that `.mosaic-contact-pill-dark` is unrelated: it is a live style for the
dark-filled contact pill in `ContactActionRow`, not a theme hook.

## Images

`public/` images are compressed as tightly as their format allows:

- `favicon-512.png` — 404 kB -> 288 kB, losslessly (`oxipng -o max --strip safe`,
  verified pixel-identical). It must stay PNG: `index.html` declares
  `type="image/png"` and `site.webmanifest` lists it as an icon.
- `profile-header.png` -> `profile-header.jpg` — 1,051 kB -> 144 kB. It is a
  photograph whose only reference is the JSON-LD `image` field, so PNG was the
  wrong format. If you replace it, keep it JPEG and keep the reference in
  `index.html` in sync.

## Known follow-ups

- Confirm `hey@rafaelmedina.me` receives mail (copy changed from the old `hello@` address).
- `tests/e2e/portfolio-polish.spec.ts:430` ("hides every work card at first
  paint") races the entrance animation and fails on a loaded machine — it failed
  3/3 on an untouched `main` checkout while other workspaces were building. It is
  flaky, not a regression; worth making it wait on a deterministic signal.
