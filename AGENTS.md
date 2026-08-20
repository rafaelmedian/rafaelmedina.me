# AGENTS.md

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
