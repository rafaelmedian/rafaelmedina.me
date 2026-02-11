# AGENTS.md

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
