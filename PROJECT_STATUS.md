# Project Status

Last audited: 2026-09-09 against `53a3274`.

## Current state

- The homepage renders `SimpleFeed` (`src/App.tsx` → `src/components/SimpleFeed.tsx`): profile hero, company history, selected-work mosaic, résumé gallery slide, notes reader, and About section. There is no longer a `showProjects` switch.
- The corner holds the contact address. Punta Cana time appears in About and the hero's location hover card; the hero also shows the repository's build-time last-updated date.
- Project cards, grid composition, and site links live in `src/data/portfolio.ts`; work history lives in `src/data/cv.ts`, and articles and notes in `src/data/writings.ts`.
- `/design-system` renders `DesignSystemPage` in dev only, with `/styleguide` retained as an alias. Its component and stylesheet are excluded from production builds.
- `/work/<slug>/` and `/resume/` are prerendered as readable standalone pages and hydrate into the preview gallery.

## Audit verification

Fresh local checks on 2026-09-09:

- `npm run lint` — passed, including CSS linting.
- `npm run likes:check` — passed.
- `npm run test:e2e` — build passed; **302 tests passed** with no retries.
- `npm run test:design-system` — **11 tests passed** with no retries.

The build reports a bundle-size warning, recorded below. These checks cover the
local source and local likes Worker; they do not establish production mailbox
delivery or a deployed likes service. No manual browser review was performed.

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

A branch is not a single commit. Work is split into a series of commits, one per
coherent change, each with a title and a description of what it fixes and why;
the PR body lists those changes in order. `AGENTS.md` holds the full format —
this is the layout note, not the spec.

The repo squash-merges with `squash_merge_commit_message: COMMIT_MESSAGES`, so
those commit messages are concatenated into the body of the single commit that
lands on `main`. Every commit on `main` since #65 — the last merge commit — is
one squash per PR, and the reasoning inside it survives only as far as the branch
commits carried it. A branch that was one "Implement X" commit leaves `git log` and
`git blame` with nothing to say.

## Retained inactive code

`src/components/NoteLikeButton.tsx` and `src/lib/noteLikes.ts` are intentionally
retained but unreachable from the app entry points: the notes reader has no like
control. A static import traversal from `src/main.tsx` and
`src/entry-server.tsx`, including dev-only dynamic imports, found no other
unreachable TypeScript modules or stylesheets (declarations and assets excluded).
This is module reachability, not an audit of every export or CSS selector.

The likes Worker is still exercised by `tests/e2e/shared-likes.spec.ts`. Those
tests call the API directly; they do not cover the unmounted button or client.
Restoring likes is deferred feature work, not an unfinished public control.

The infinite-canvas experience described in older versions of this file was
replaced by the `SimpleFeed` mosaic; its components (`InfiniteCanvasBoard`,
`PortfolioGrid`, `PortfolioCard`, `ProjectDialog`, `SiteHeader`, `SiteFooter`,
`HoverVideoLink`) were deleted on 2026-07-30 along with their CSS. Recover from
git history rather than re-adding stubs.

## Theming

There is no theme system. `:root` in `src/styles/base.css` holds the shared
token set and the site is always light. The `[data-theme="dark"]` token block and the matching
`data-theme="light"` attribute on the root `<div>` in `App.tsx` were removed on
2026-07-30 — the dark block had no way to activate, so it was shipping to every
visitor as dead bytes. Adding dark mode means reintroducing both halves, not just
the CSS.

`src/index.css` is now the ordered stylesheet entry point; see
`src/styles/README.md` for ownership and cascade rules.

Note that `.mosaic-contact-pill-dark` is unrelated: it is a live style for the
booking pill in `AvailabilityBooking`, rendered by `ContactActionRow`, not a
theme hook.

## Images

Previously completed image optimizations (not a claim that every current asset
has been audited):

- `favicon-512.png` — 404 kB -> 288 kB, losslessly (`oxipng -o max --strip safe`,
  verified pixel-identical). It must stay PNG: `index.html` declares
  `type="image/png"` and `site.webmanifest` lists it as an icon.
- `profile-header.png` -> `profile-header.jpg` — 1,051 kB -> 144 kB. It is a
  photograph whose only reference is the JSON-LD `image` field, so PNG was the
  wrong format. If you replace it, keep it JPEG and keep the reference in
  `index.html` in sync.

## Remaining follow-ups

- **Confirm mailbox delivery.** Contact is `hey@rafaelmedina.me`, set in
  `siteLinks.email`. The résumé generator and PDF agree with it, verified by
  the passing suite. Actual receipt still needs a mailbox-side check; source
  consistency does not prove delivery. An address change must update
  `siteLinks.email`, `scripts/build-resume.mjs`, and the test's `contactEmail`
  constant, then regenerate the PDF.
- **Investigate the entry bundle warning.** The audited build's main client
  chunk is 514.56 kB minified (167.84 kB gzip), above Vite's 500 kB warning
  threshold. The build passes. Profile the bundle before choosing what to
  lazy-load; the warning alone does not establish a user-visible slowdown.

## Deferred feature work

- **Shared likes**, only if the feature is restored: mount `NoteLikeButton` in
  the reader, restore browser coverage of the button/client, and complete or
  verify the production setup in `README.md`. The checked-in Worker config
  still uses the placeholder D1 ID `local-note-likes`. The audit tested the
  local service and did not inspect remote Cloudflare resources or repository
  variables.

## Closed or maintenance-only items

- **Old entrance-test follow-up is obsolete.** The test named "hides every work
  card at first paint" was removed in `31f9803` (#115). Its replacement in
  `tests/e2e/avatar-intro.spec.ts` holds the portrait request to inspect the
  pre-reveal state and checks `data-avatar-intro` phases. The current suite
  passes; this single run is not a guarantee against all timing flakes.
- **Mobile address fallback is implemented.** Below 700px CSS hides the corner
  and shows the hero location-line address. Keep that fallback when adding
  corner controls; it is an existing constraint, not outstanding work.
- **GitHub calendar is current for this audit.** `src/data/githubActivity.ts`
  has `fetchedOn: "2026-09-09"`. Regenerate when stale using
  `scripts/build-github-activity.mjs`; the hero's repository date is separately
  computed at build time. Generated-asset maintenance is documented in
  `AGENTS.md`.
