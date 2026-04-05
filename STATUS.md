# Status Audit

Last updated: 2026-04-05

## Current Snapshot

- The current homepage renders [`SimpleFeed`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx), not the older infinite-canvas experience still described in [`PROJECT_STATUS.md`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/PROJECT_STATUS.md).
- The root route currently passes `showProjects={false}` in [`src/App.tsx:28`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/App.tsx#L28), so the selected-work board is hidden on `/` even though the component and preview data exist.
- `npm run build` passes.
- `npm run lint` fails with 2 errors.
- There is an in-progress metadata/SEO pass in the worktree: modified [`.gitignore`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/.gitignore), modified [`index.html`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/index.html), and new files under [`public/`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/public).
- Browser-based visual QA was partially blocked by a Playwright session lock, so this audit is based on source review plus local build/lint verification.

## Verified Checks

- `npm run build`
  - Pass
  - Production output includes:
  - JS bundle: `363.53 kB` (`104.14 kB` gzip)
  - CSS bundle: `63.01 kB` (`13.42 kB` gzip)
  - Profile image asset: `961.91 kB`
- `npm run lint`
  - Fail
  - [`src/components/SimpleFeed.tsx:86`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L86): `react-hooks/set-state-in-effect`
  - [`src/components/WorkedWithCompaniesInline.tsx:9`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/WorkedWithCompaniesInline.tsx#L9): `react-refresh/only-export-components`

## Audit Findings

### Product / Content

- Homepage work is effectively disabled on [`src/App.tsx:28`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/App.tsx#L28). If the main portfolio should showcase selected work, the current root route is incomplete.
- Placeholder editorial cards still ship inside [`src/components/SimpleFeed.tsx:368`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L368):
  - `"LLMs for house plants?"` at [`src/components/SimpleFeed.tsx:371`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L371)
  - `"Blogging about plants"` at [`src/components/SimpleFeed.tsx:414`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L414)
- Preview items still use generic titles like `"Shot Preview 21"` in [`src/data/portfolio.ts`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/data/portfolio.ts), which weakens gallery labels, alt text, and overall polish.
- Preview card CTA fields are still effectively placeholders: many preview entries have `ctaHref: "#"` and empty labels in [`src/data/portfolio.ts`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/data/portfolio.ts).

### Code Quality / Maintainability

- Lint is not green, so the project does not currently pass its basic quality gate.
- Documentation is out of sync:
  - [`README.md`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/README.md) is still mostly the Vite starter README.
  - [`PROJECT_STATUS.md`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/PROJECT_STATUS.md) still documents the earlier canvas branch instead of the current feed-based site.
- There is no test script in [`package.json`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/package.json), so there is no automated regression coverage beyond lint/build.

### Accessibility / UX Polish

- Multiple above-the-fold and dialog images render without explicit `width` and `height`, which risks layout shift and misses a guideline baseline:
  - [`src/components/SimpleFeed.tsx:267`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L267)
  - [`src/components/SimpleFeed.tsx:404`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L404)
  - [`src/components/SimpleFeed.tsx:435`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L435)
  - [`src/components/PreviewGalleryDialog.tsx:110`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/PreviewGalleryDialog.tsx#L110)
- The gallery popup removes the outline at [`src/index.css:1752`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/index.css#L1752). This may be acceptable if Base UI fully manages focus styles, but it should be visually verified.
- Fallback copy such as `"Preview coming soon"` in [`src/components/SimpleFeed.tsx:407`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L407) and `"Project preview"` in [`src/components/SimpleFeed.tsx:438`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L438) should be intentionally productized or removed before launch.

### Performance

- The profile image dominates the build output at `~962 kB`, making it the clearest optimization target.
- The main JS bundle is not alarming yet, but at `~364 kB` pre-gzip it is worth rechecking after content cleanup and any future feature additions.

## Prioritized TODO

### P0

- [ ] Decide whether the homepage should show selected work; if yes, enable the project board from [`src/App.tsx:28`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/App.tsx#L28).
- [ ] Fix both lint blockers in [`src/components/SimpleFeed.tsx:86`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L86) and [`src/components/WorkedWithCompaniesInline.tsx:9`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/WorkedWithCompaniesInline.tsx#L9).
- [ ] Replace the placeholder copy in [`src/components/SimpleFeed.tsx:371`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L371) and [`src/components/SimpleFeed.tsx:414`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/components/SimpleFeed.tsx#L414) with real content or remove those cards.

### P1

- [ ] Give preview entries real titles and intentional metadata in [`src/data/portfolio.ts`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/data/portfolio.ts).
- [ ] Remove `ctaHref: "#"` placeholders or redesign preview cards so they do not pretend to have missing destinations.
- [ ] Rewrite [`README.md`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/README.md) for the actual portfolio app.
- [ ] Update [`PROJECT_STATUS.md`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/PROJECT_STATUS.md) so it matches the current product direction.
- [ ] Compress or replace [`src/assets/profile-photo.png`](/Users/rafaelmedina/Documents/Code/rafaelmedina.me/src/assets/profile-photo.png).

### P2

- [ ] Add explicit image dimensions or otherwise reserve layout space for key images and dialog media.
- [ ] Run a real browser QA pass on desktop and mobile once the Playwright session issue is cleared:
  - reduced-motion behavior
  - preview gallery keyboard and touch navigation
  - focus states in the dialog
  - root route visual hierarchy
- [ ] Add a lightweight release checklist or CI gate for `lint`, `build`, and visual smoke checks.
- [ ] Decide whether to archive or remove stale infinite-canvas code and notes if that direction is no longer active.
