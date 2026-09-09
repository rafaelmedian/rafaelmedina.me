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
| `VITE_LIKES_API_URL` | Public URL of the shared-likes Worker. Not a secret. |

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

## Shared likes, locally

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
retries, unlikes, and failed saves.

## Shared likes, publicly

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
checks that notes use registered IDs. Changing an ID starts a separate count, so
IDs for archived pieces stay registered too.
