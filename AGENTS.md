# AGENTS.md

## Interaction preference

For small, clear changes and direct follow-up corrections, implement and verify
without asking for another approval round. Ask only when a decision is genuinely
ambiguous, risky, destructive, or requires new authority.

## Design system

`/design-system` (dev server only — `npm run dev`, then
http://localhost:5173/design-system) is the reference for this site's colour,
type, spacing, elevation, motion, layout, and accessibility rules. It is an
inventory of what already ships, not a proposal.

Read it before adding a colour, a font size, a radius, an easing curve, or a
z-index, and prefer a value that is already on it. When you do change one of
those values in `src/index.css`, update
`src/components/DesignSystemPage.tsx` in the same commit — the live component
specimens cannot drift, but the swatches, scales, and tables are transcriptions
and will.

## Shipping

`main` is the only branch that deploys. Merge into it and GitHub Actions builds
`dist/` and publishes it to rafaelmedina.me.

- **Never edit built output.** No hand-written CSS appended to the deployed
  assets, no patching hashed filenames, no committing a build. Change `src/` or
  `public/` and let the build produce the rest.
- Cut feature branches from `main` and merge back through a PR. CI runs lint,
  build, and Playwright on every PR.
- `public/CNAME` carries the custom domain. Losing it takes the site off
  rafaelmedina.me, so the deploy workflow fails rather than ship without it.

This repo used to keep source and built output on two unrelated branches, and
edits made directly to the deployed files were silently lost on the next build.
Do not reintroduce that pattern.

## Résumé

`public/rafael-medina-resume.pdf` is generated, not exported by hand. It used to
be a Figma export, which is how it drifted into advertising a role I had left and
an email address the site no longer uses. Edit the content in
`scripts/build-resume.mjs`, run `node scripts/build-resume.mjs`, and commit the
regenerated PDF.

Keep it in step with `src/data/cv.ts` (work history, dates, education) and
`siteLinks.email` in `src/data/portfolio.ts` (contact address) — a Playwright test
reads the shipped PDF and fails when those disagree. The script refuses to write a
second page.

## Planning Mode Rules

- In planning mode, any task related to design, animation/motion, or user flows must include an ASCII plan.
- Use plain ASCII characters only (`|`, `-`, `>`, `+`, `[]`, `()`), with no Unicode box-drawing symbols.
- Include the ASCII plan before implementation steps.
- Keep the plan concise and actionable, then follow with a numbered execution plan.

### ASCII Plan Template

```txt
[Goal]
  |
  +--> [Step 1]
  |       |
  |       +--> [Decision A?] --yes--> [Path A]
  |                         \--no--> [Path B]
  |
  +--> [Step 2]
  |
  +--> [Validation]
```
