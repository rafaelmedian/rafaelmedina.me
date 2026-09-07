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
those values in `src/styles/`, update any affected descriptions and exceptions in
`src/components/DesignSystemPage.tsx` in the same commit. Shared token values are
read from computed CSS and the specimens use real components; component-specific
values and explanatory prose still need to be kept in step.

`src/index.css` is the ordered stylesheet entry point. Shared tokens and base
rules live in `src/styles/base.css`; component files own their responsive rules.
Keep the Tailwind reset first and the global reduced-motion policy last. See
`src/styles/README.md` for ownership and cascade details. `npm run lint` includes
CSS linting.

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

## Commits and pull requests

A PR is a sequence of commits, each one a change that stands on its own, and its
body is the list of those changes. Both apply to every agent working here —
Claude and Codex read this same file, and the format below is the shared one.

### Commits

Split the work as you go, one commit per coherent change: the refactor that
makes room for the feature, the feature, the test that guards it, the
regenerated asset. Do not finish the task and wrap it all in a single
"Implement X". Each commit carries:

- **A title** in the imperative present, under ~65 characters, naming the change
  rather than the files — "Scale preview `sizes` to each tile's share of its
  row", not "Update portfolio.ts".
- **A description** saying what was wrong or missing and why this is the fix.
  The measurement, threshold, or failure that motivated it belongs here, not in
  the PR body alone. Wrap at 72 columns. A commit ships without a body only when
  the title is genuinely the whole story.
- **The `Co-Authored-By:` trailer** for the agent that wrote it.

Keep each commit building and passing on its own where the change allows it, so
a later `git bisect` lands somewhere useful.

### Pull request body

Open with a paragraph on what the PR changes and why. Then list the changes in
the order they land, one entry per commit, each with a one- or two-sentence
summary in plain language — enough that the list alone explains the PR without
opening the diff. Close with what was verified: lint, build, the Playwright
count, and anything checked by hand in a browser.

The repo squash-merges and keeps the individual commit messages as the squashed
body, so the commits written on a branch become the permanent record on `main`.
That is what lets `git log` and `git blame` answer why a value is what it is;
one "Implement X" commit erases that reasoning for good, and no PR description
brings it back.

## Résumé

`public/rafael-medina-resume.pdf` is generated, not exported by hand. It used to
be a Figma export, which is how it drifted into advertising a role I had left and
an address the site had already moved off. Edit the content in
`scripts/build-resume.mjs`, run `node scripts/build-resume.mjs`, and commit the
regenerated PDF. The rule is that the PDF matches the site, not that any
particular address is wrong: whatever `siteLinks.email` says today is what
belongs on the résumé.

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
