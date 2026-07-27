# Desktop Card Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase portfolio mosaic cards to 420px tall on desktop without changing their existing responsive sizing below 900px.

**Architecture:** Load a focused override stylesheet after the compiled stylesheet. Add a desktop-only custom-property override at the existing 900px breakpoint; validate rendered heights in the browser because the compiled JavaScript supplies an inline custom property.

**Tech Stack:** Static HTML, compiled CSS, browser-computed style verification

## Global Constraints

- Viewports at or above 900px use 420px-tall mosaic rows.
- Viewports below 900px retain their existing responsive row sizing.
- Existing card gaps, flex proportions, media fitting, and JavaScript behavior remain unchanged.

---

### Task 1: Protect and update responsive mosaic card heights

**Files:**
- Create: `assets/desktop-card-height.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: the inline `--row-height` value and the existing `@media(min-width:900px)` stylesheet rules.
- Produces: a 420px desktop `.mosaic-row` override while preserving the existing inline responsive value below 900px.

- [x] **Step 1: Run the failing desktop browser check**

```js
const row = document.querySelector(".mosaic-row");
const card = document.querySelector(".mosaic-row-card");
({
  rowHeight: getComputedStyle(row).height,
  cardHeight: getComputedStyle(card).height,
});
```

- [x] **Step 2: Verify the existing desktop result fails the requirement**

At a 1440px viewport, load the local preview and run the check from Step 1.

Expected before implementation: both values are about `230.4px`, not `420px`.

- [x] **Step 3: Add and load the desktop custom-property override**

Create `assets/desktop-card-height.css`:

```css
@media (min-width: 900px) {
  .mosaic-row {
    --row-height: 420px !important;
  }
}
```

Load it after the compiled stylesheet in `index.html`:

```html
<link rel="stylesheet" crossorigin href="/assets/index-BjZ56see.css">
<link rel="stylesheet" href="/assets/desktop-card-height.css">
```

- [x] **Step 4: Run desktop and mobile browser checks**

At a 1440px viewport, confirm `.mosaic-row` and `.mosaic-row-card` both compute to `420px`. At a 390px viewport, confirm `.mosaic-row-item` and `.mosaic-row-card` remain `180px`. Check that images remain clipped inside rounded cards and adjacent desktop cards remain aligned.

- [x] **Step 5: Check the final diff**

Run:

```bash
git diff --check
git diff -- index.html assets/desktop-card-height.css
```

Expected: no whitespace errors and only the intended desktop override.

- [x] **Step 6: Commit**

```bash
git add index.html assets/desktop-card-height.css docs/superpowers/specs/2026-07-27-desktop-card-height-design.md docs/superpowers/plans/2026-07-27-desktop-card-height.md
git commit -m "Make desktop portfolio cards taller"
```
