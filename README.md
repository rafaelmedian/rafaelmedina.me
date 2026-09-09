# rafaelmedina.me

Personal portfolio of Rafael Medina — a single-page Vite + React + TypeScript app deployed to GitHub Pages at [rafaelmedina.me](https://rafaelmedina.me/).

## Development

```sh
npm install
npm run dev      # local dev server
npm run lint     # ESLint + Stylelint
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

Copy `.env.example` to `.env` for optional analytics configuration
(`VITE_GA_MEASUREMENT_ID`). The Punta Cana location card loads a minimal
OpenStreetMap tile view on demand and keeps a bundled map screenshot as its fallback.

Google Analytics only loads when `VITE_GA_MEASUREMENT_ID` is set at build time. In
CI it comes from the `VITE_GA_MEASUREMENT_ID` repo variable; leave it unset locally
and nothing is tracked in dev.

## Structure

- `src/data/portfolio.ts` — site links, grid composition, and work-preview card data.
- `src/data/cv.ts` and `src/data/writings.ts` — work history and reader content.
- `src/components/SimpleFeed.tsx` — the homepage (profile hero + work mosaic).
- `src/components/DesignSystemPage.tsx` — dev-only reference at `/design-system` (`/styleguide` is an alias).
- `src/index.css` — ordered stylesheet imports; shared tokens live in `src/styles/base.css`.
- `public/Projects/` — work preview images and videos.

## Testing

```sh
npm run test:e2e           # Playwright; builds and serves the site itself
npm run test:design-system # Playwright against the dev-only reference page
npm run likes:check        # type-check the likes Worker
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

Branches are split into a series of commits, one per coherent change, and the PR
body lists them. `AGENTS.md` holds that convention in full; it is the single set of
instructions every agent on this repo reads.

See `PROJECT_STATUS.md` for the branch layout.

## Shared note likes

The site stays on GitHub Pages. `workers/likes/` provides a separate Cloudflare
Worker and D1 database for shared likes. `VITE_LIKES_API_URL` is the public Worker
URL, not a secret.

The reader shows the existing like control when `VITE_LIKES_API_URL` is set.
Without it, the control is hidden. Each browser stores a random anonymous visitor
ID; D1 stores one row per note and visitor, so retries cannot duplicate likes.
Counts refresh when a note opens and when the reader returns to a visible tab or
focuses the window. There is no background polling. Failed saves preserve the last
confirmed count and show an error; the rest of the reader remains usable.

Use **Cloudflare Workers Free**, not Workers Paid, to keep this service free.
As checked on 2026-09-09, it includes 100,000 Worker requests/day; D1 includes
5 million rows read/day, 100,000 rows written/day, and 5 GB total storage.
These are account-wide limits, not a visitor allowance. Counting likes scans
that note's rows, so a request can consume multiple row reads. On the Free plan,
exhausted daily quotas cause errors until reset rather than overage charges.
See [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/).

No visitor accounts, scheduled jobs, or server upkeep are required. One browser
is not one verified person: clearing storage creates another identity, and this
is not bot-proof voting. Old browser-only likes are not imported. No names or
email addresses are collected.

For local development, run:

```sh
npm run likes:migrate:local
npm run likes:dev
```

In a separate terminal, start the site with the local API:

```sh
VITE_LIKES_API_URL=http://127.0.0.1:8787 npm run dev
```

The local database persists under `.wrangler/` and is gitignored. Playwright starts
the local Worker and connects the test build automatically. Shared-like tests use
the actual local D1 database directly, covering independent visitor IDs,
concurrent retries, repeated unlikes, and rejected requests. Browser tests also
cover save/reload/unlike, failed saves, and the absence of idle polling.

One-time setup (keep the account on Workers Free; the site stays on GitHub Pages
and the API uses a free `workers.dev` address, with no DNS move):

1. Sign in with `npx wrangler login`.
2. Create the database with `npx wrangler d1 create rafaelmedina-note-likes --config workers/likes/wrangler.jsonc`.
3. Replace `local-note-likes` in `workers/likes/wrangler.jsonc` with the returned
   database ID. The ID is configuration, not a credential.
4. Run `npm run likes:migrate:remote`, then `npm run likes:deploy`.
5. Create a Cloudflare API token scoped to this account with **Workers Scripts:
   Edit** and **D1: Edit** permissions. Add it to GitHub repository Actions
   secrets as `CLOUDFLARE_API_TOKEN`, and add the account ID as
   `CLOUDFLARE_ACCOUNT_ID`. Enter secrets in GitHub settings, not source files
   or chat. See [Cloudflare's GitHub Actions guide](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
6. Set the GitHub repository variable `VITE_LIKES_API_URL` to the deployed Worker
   URL. Merge the site changes through a PR to `main` to build with that URL.
   Set the same URL in `.env` if local development should use the public database.

Never delete the D1 database when redeploying: it holds the shared counts.
Once configured, the main-branch deployment applies pending migrations and
updates the Worker before publishing the site. New notes therefore require no
separate manual Worker deployment. Cloudflare failures stop the deployment and
leave the previously published site in place. For local/manual recovery,
`npm run likes:migrate:remote` and `npm run likes:deploy` remain available.
When adding notes, add their stable IDs to `src/data/writingIds.ts`. The article data's `WritingId` type
checks that notes use registered IDs. Changing an ID starts a separate count.

## Writing selection

The public articles and notes live in `src/data/writings.ts`. Pieces held for
later are preserved in [the writing archive](docs/archive/writings.md), with
their original content, IDs, and image references. The archive is not shipped
with the site. Keep archived IDs registered to preserve saved likes.
