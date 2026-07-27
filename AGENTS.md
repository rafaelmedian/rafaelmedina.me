# AGENTS.md

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
