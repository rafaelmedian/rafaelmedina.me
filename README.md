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

Copy `.env.example` to `.env` for optional analytics configuration
(`VITE_GA_MEASUREMENT_ID`). The Punta Cana location card loads a minimal
OpenStreetMap tile view on demand and keeps a bundled map screenshot as its fallback.

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

## Shared note likes

The site stays on GitHub Pages. `workers/likes/` provides a separate Cloudflare
Worker and D1 database for shared likes. `VITE_LIKES_API_URL` is the public Worker
URL, not a secret.

The reader does not currently show a like control. The Worker, its database, the
client in `src/lib/noteLikes.ts`, and `NoteLikeButton` are all kept and still
tested, so the control can be restored by mounting it in the reader again. Until
then nothing on the site writes to the database.

Each browser stores a random anonymous visitor ID. D1 stores one row per note and
visitor, so retries and concurrent requests cannot add duplicate likes; an unlike
only removes that visitor's row. Counts refresh when a note opens, every 15 seconds
while visible, and on returning to the page. Old browser-only likes are not imported
as public engagement. This is one like per browser, not verified person: clearing
storage or using another browser creates another identity. No names or email
addresses are collected. This is not a bot-proof voting system.

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
the actual local D1 database, including independent browser sessions, retries,
unlikes, and failed saves.

To activate shared likes publicly:

1. Sign in with `npx wrangler login`.
2. Create the database with `npx wrangler d1 create rafaelmedina-note-likes --config workers/likes/wrangler.jsonc`.
3. Replace `local-note-likes` in `workers/likes/wrangler.jsonc` with the returned
   database ID. The ID is configuration, not a credential.
4. Run `npm run likes:migrate:remote`, then `npm run likes:deploy`.
5. Set the GitHub repository variable `VITE_LIKES_API_URL` to the deployed Worker
   URL. Merge the site changes through a PR to `main` to build with that URL.
   Set the same URL in `.env` if local development should use the public database.

Never delete the D1 database when redeploying: it holds the shared counts. Deploy
Worker changes with `npm run likes:deploy`; site builds do not deploy the Worker.
When adding notes, add their stable IDs to `src/data/writingIds.ts` and redeploy
the Worker so its allowlist recognizes them. The article data's `WritingId` type
checks that notes use registered IDs. Changing an ID starts a separate count.

## Writing selection

The public articles and notes live in `src/data/writings.ts`. Pieces held for
later are preserved in [the writing archive](docs/archive/writings.md), with
their original content, IDs, and image references. The archive is not shipped
with the site. Keep archived IDs registered to preserve saved likes.
