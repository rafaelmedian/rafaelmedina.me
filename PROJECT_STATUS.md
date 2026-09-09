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

## Shared likes

The notes reader mounts `NoteLikeButton` when `VITE_LIKES_API_URL` is set and a
note is open. Without a configured URL, it remains hidden. Every tap counts up to a
per-visitor cap (`src/data/likeLimits.ts`), batched into one write per pause in
the tapping. Browser coverage now checks optimistic spam counting, persistence,
the cap, failed saves, and idle reading without polling. Queued taps flush on
page hide and note exit; writes use keepalive so navigation does not abort
saves. Regression coverage includes reloads before the debounce, overlapping
saves on departure, and the previous client's API contract;
`tests/e2e/shared-likes.spec.ts` separately exercises the local D1 API.

The original 2026-09-09 reachability audit found no other unreachable TypeScript
modules or stylesheets (declarations and assets excluded). That was module
reachability, not an audit of every export or CSS selector.

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

The [2026-09-09 image audit](docs/image-audit-2026-09-09.md) inventories 125 public
images totaling 5.32 MB and checks mobile/desktop requests. Its follow-up implements responsive photo variants: the sheet now fetches
251 KB on mobile and 696 KB on desktop at 2× density, down from 1.54 MB. The
email confirmation is down from 159 KB to 61 KB; slow/data-saving connections
use reaction stills. The report retains unreferenced cleanup candidates.
The media follow-up passes lint, build, 308 end-to-end tests, and 11
design-system tests.

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

## Likes activation

Live as of 2026-09-09. The D1 database exists, its ID is committed in
`workers/likes/wrangler.jsonc`, the migration is applied remotely, and the Worker
is deployed at `https://rafaelmedina-note-likes.rafaelmedina.workers.dev`. The
`VITE_LIKES_API_URL` repository variable and the `CLOUDFLARE_API_TOKEN` /
`CLOUDFLARE_ACCOUNT_ID` secrets are set, so the `main` deployment applies pending
migrations and deploys the Worker before publishing the site.

Verified directly against the deployed service on 2026-09-09: `/health` returned
`{"ok":true}`; a like round-trip on `a-song-we-all-know` went 0 → 1 → 0 across
`GET`, `PUT true`, `GET`, `PUT false`; a disallowed `Origin` returned 403 and an
unregistered note ID returned 404. The test like was removed afterwards. That
exercises the API, not the site's own build — the reader's use of it is covered by
the Playwright suite, and by the first production deploy that ships with the
variable set.

Earlier verification of the client: lint, Worker type-check, production build, and
all **304 Playwright tests** passed after restoring the control. The configured
client bundle is 517.39 kB minified (168.87 kB gzip); the existing bundle-size
warning remains. A production build without the API URL also passed a browser
check — the note opens with no like control and no likes requests.

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
