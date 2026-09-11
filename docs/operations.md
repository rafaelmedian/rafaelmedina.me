# Operations

Runbook for the one person who maintains this site. The
[README](../README.md) describes what the project is; this file is how it is
worked on. `AGENTS.md` holds the commit and PR conventions.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on :5173, with the dev-only `/design-system` page |
| `npm run build` | `tsc -b`, client build into `dist/`, SSR build into `.ssr/`, then `scripts/prerender.mjs` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint over the repo plus `lint:css` |
| `npm run lint:css` | Stylelint over `src/**/*.css` |
| `npm run test:e2e` | Builds the site, then runs the Playwright suite against the preview server |
| `npm run test:design-system` | Playwright suite for `/design-system`, which needs its own dev server |
| `npm run likes:check` | Type-checks the Cloudflare Worker |

The two Playwright suites cannot share a server: `/design-system` only exists in
dev. CI runs both, and runs the second even when the first fails, so one round
reports every failure. Playwright also starts the local likes Worker and points
the test build at it.

## Environment

| Variable | Effect |
| --- | --- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics. Unset means the code is tree-shaken away and nothing is tracked. In CI it comes from the repo variable of the same name. |
| `VITE_LIKES_API_URL` | Public URL of the shared likes and profile-chat Worker. Not a secret. |

Both are inlined by Vite **at build time**, so they have to be set for the build,
not for the server that serves it. `.env.example` has the shape of both.

## Generated assets

Some files under `public/` are generated but committed, deliberately kept out of
`npm run build` so a build never needs a browser or ffmpeg:

```sh
node scripts/build-resume.mjs                 # public/rafael-medina-resume.pdf + preview PNG
node scripts/build-og-image.mjs               # public/og-image.png, shot from a built dist/
node scripts/build-github-activity.mjs        # src/data/githubActivity.ts
node scripts/build-writing-marks.mjs          # public/writings/marks/ pencil marks
node scripts/generate-preview-variants.mjs    # -480w/-960w webp siblings
node scripts/generate-video-posters.mjs       # poster frames for preview videos
node scripts/optimize-video-previews.mjs      # re-encoded preview videos
```

Run the relevant one after editing its source, then commit the result. The résumé
is rendered from `src/data/cv.ts` — it is not a Figma export any more, so it stops
drifting from the live site. The social card is a screenshot of the homepage, so
it needs a fresh `npm run build` before it and a re-run after any change to the
header or the first row of the work grid.

## Portfolio API, locally

```sh
npm run likes:migrate:local
npm run likes:dev
```

In a separate terminal, start the site with the local API:

```sh
VITE_LIKES_API_URL=http://127.0.0.1:8787 npm run dev
```

The local database persists under `.wrangler/` and is gitignored. Shared-like
tests use the actual local D1 database, including independent browser sessions,
batched increments, the per-visitor cap, and failed saves.

The same Worker serves `POST /chat`. The avatar asks for an email before the
first question, keeps the conversation in that browser, and sends only the
email and latest ten messages to the Worker. D1 stores the email against the
anonymous visitor ID for a 12-question daily cap; it does not store chat
messages. Workers AI answers from a prompt assembled from `src/data/cv.ts`,
`src/data/services.ts`, and `src/data/faq.ts`, plus a short selected-work
summary in `src/data/profileChatContext.ts`.

Notes and projects are separate collections — `/notes/<id>/likes` and
`/projects/<id>/likes`, counted in `note_likes` and `project_likes`. The path
segment picks the table, and each ID is only valid under its own collection, so
liking a project can never show up on a note. `src/data/writingIds.ts` and
`src/data/projectIds.ts` are the registries the Worker checks; a project's ID is
typed into `PortfolioCard`, so adding a card without registering it fails the
build rather than 404ing at runtime.

The default API port 8787 and preview port 4174 can be occupied by another
checkout. Set `E2E_PORT` to an unused preview port and `LIKES_API_URL` to give
the Worker a port of its own — the
Playwright config starts the Worker there, the build is pointed at it, and the
direct API tests call it:

```sh
E2E_PORT=4184 LIKES_API_URL=http://127.0.0.1:8791 npm run test:e2e
```

## Portfolio API, publicly

Configured on 2026-09-09 and verified against the deployed service. What is in
place:

| Piece | Value |
| --- | --- |
| Worker | `rafaelmedina-note-likes`, at `https://rafaelmedina-note-likes.rafaelmedina.workers.dev` |
| D1 database | `rafaelmedina-note-likes`, ID committed in `workers/likes/wrangler.jsonc` |
| Repo variable | `VITE_LIKES_API_URL` — the Worker URL. Public, not a secret. |
| Repo secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |

Merging to `main` now applies pending D1 migrations and deploys the Worker
*before* publishing the site, so a newly published note ID is already accepted by
the API when the page that links it goes live. A Cloudflare failure stops the
deployment and leaves the previously published site in place. The step is gated on
`VITE_LIKES_API_URL` being set; with the variable set but the secrets missing it
fails loudly rather than silently skipping.

Use **Cloudflare Workers Free**. As checked on 2026-09-11 it includes 200,000
Worker requests/day, while Workers AI includes 10,000 free Neurons/day. D1 has
its own included row and storage limits. These are account-wide limits, not a
per-visitor allowance; the chat's 12-question cap protects the shared AI pool.
Exhausting a daily Free-plan quota returns errors until reset rather than billing
overage. See
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
and [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

### Redoing the setup from scratch

Only needed on a new Cloudflare account.

1. Sign in with `npx wrangler login`.
2. Create the database with `npx wrangler d1 create rafaelmedina-note-likes --config workers/likes/wrangler.jsonc`.
3. Put the returned database ID into `workers/likes/wrangler.jsonc`, replacing the
   existing one. The ID is configuration, not a credential, and it is committed.
4. Run `npm run likes:migrate:remote`, then `npm run likes:deploy`. The deploy
   prints the public URL. The `workers.dev` subdomain is an account-wide choice
   made once, entered as a bare label — not a URL.
5. Create a Cloudflare API token from the **Edit Cloudflare Workers** template
   plus **Account → D1 → Edit**. Add it as the `CLOUDFLARE_API_TOKEN` Actions
   secret and the account ID as `CLOUDFLARE_ACCOUNT_ID`. Enter secrets in GitHub
   settings, never in source files. See
   [Cloudflare's GitHub Actions guide](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
6. Set the repository variable `VITE_LIKES_API_URL` to the deployed URL. Do this
   *after* the secrets exist, or the next deploy fails on the missing credentials.
   Set the same URL in `.env` to develop against the public database — note that
   writes there change real counts.

### Checking the deployed service

`/health` answers any origin. Every other route requires an allowed `Origin` and a
UUIDv4 visitor ID:

```sh
W=https://rafaelmedina-note-likes.rafaelmedina.workers.dev
VID=$(uuidgen | tr 'A-Z' 'a-z')

curl -s "$W/health"
curl -s -X PUT "$W/notes/a-song-we-all-know/likes" \
  -H "Origin: https://rafaelmedina.me" -H "Content-Type: application/json" \
  -H "X-Visitor-ID: $VID" -d '{"increment":1}'
```

Every like counts: a `PUT` adds `increment` (1 to the cap in
`src/data/likeLimits.ts`) to that visitor's tally for the note, clamped at the
cap. The API also retains the previous `{liked: true/false}` toggle contract
and the response's `liked` boolean because the Worker deploys before the site
and existing tabs may still run the previous client. A legacy `true` is
idempotent and preserves an existing tally; `false` removes that visitor's
whole tally. The current reader only sends increments. A
`403` means the `Origin` is not in `ALLOWED_ORIGINS`; a `404` means
the note ID is not in `src/data/writingIds.ts`.

Never delete the D1 database when redeploying: it holds the shared counts. For
manual recovery, `npm run likes:migrate:remote` and `npm run likes:deploy` remain
available.

When adding notes, add their stable IDs to `src/data/writingIds.ts`. The Worker
imports that list as its allowlist, so a note absent from it returns 404 — the
`main` deployment redeploys the Worker for you, but a manually deployed Worker
needs `npm run likes:deploy`. The article data's `WritingId` type checks that
notes use registered IDs. Changing an ID starts a separate count, so IDs for
archived pieces stay registered too.
