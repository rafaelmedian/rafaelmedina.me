# Gallery Vertical Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visible Up and Down project-navigation buttons beside the portfolio gallery modal, with a safe narrow-screen fallback.

**Architecture:** Load a focused progressive-enhancement module and stylesheet from `index.html`, leaving the minified single-line application bundle intact. The module adds an external Up/Down rail while the dialog is open and dispatches the gallery's existing keyboard events, preserving wraparound, sound, and vertical transitions; narrow screens reuse and rotate the gallery's existing toolbar controls.

**Tech Stack:** Static HTML, generated React 19 JavaScript bundle, Base UI Dialog, Lucide SVG icons, generated CSS, Chrome browser verification.

## Global Constraints

- Do not add dependencies or change project data.
- Keep each navigation target at 44px by 44px.
- Label the controls “Previous preview” and “Next preview.”
- Preserve `ArrowUp ArrowLeft` and `ArrowDown ArrowRight` keyboard shortcuts.
- Preserve wraparound navigation, sound, transition timing, media behavior, analytics, and modal content.
- Keep the control rail stationary while project content transitions.
- Prevent horizontal viewport clipping on narrow screens.

---

### Task 1: Render and position vertical gallery navigation

**Files:**
- Create: `assets/gallery-vertical-navigation.js`
- Create: `assets/gallery-vertical-navigation.css`
- Modify: `index.html:77-79`
- Test: browser interaction against `index.html`

**Interfaces:**
- Consumes: existing `ArrowUp`, `ArrowDown`, `ArrowLeft`, and `ArrowRight` gallery keyboard handling plus the `.preview-gallery-shell` and `.preview-gallery-popup` DOM contracts.
- Produces: a body-level `.preview-gallery-rail` with `.preview-gallery-nav-prev` and `.preview-gallery-nav-next` controls while the dialog is open.

- [ ] **Step 1: Record the failing structural checks**

Run before creating the enhancement files:

```bash
rg -n 'preview-gallery-rail' assets/gallery-vertical-navigation.js assets/gallery-vertical-navigation.css
```

Expected: the enhancement files do not exist, confirming the visible rail is absent.

- [ ] **Step 2: Add the navigation enhancement module**

Create `assets/gallery-vertical-navigation.js` with:

```js
const GALLERY_SELECTOR = ".preview-gallery-shell";
const RAIL_CLASS = "preview-gallery-rail";

function navigate(key) {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      code: key,
      bubbles: true,
      cancelable: true,
    }),
  );
}
```

- [ ] **Step 3: Render and synchronize the rail**

Build native 44px buttons with these exact attributes:

```jsx
<div className="preview-gallery-rail" aria-label="Preview navigation">
  <button
    type="button"
    className="preview-gallery-nav preview-gallery-nav-prev"
    aria-label="Previous preview"
    aria-keyshortcuts="ArrowUp ArrowLeft"
    onClick={() => q(-1)}
    disabled={e.length <= 1}
  >
    <ChevronUp aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
  </button>
  <button
    type="button"
    className="preview-gallery-nav preview-gallery-nav-next"
    aria-label="Next preview"
    aria-keyshortcuts="ArrowDown ArrowRight"
    onClick={() => q(1)}
    disabled={e.length <= 1}
  >
    <ChevronDown aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
  </button>
</div>
```

Use `MutationObserver` to add the rail to `document.body` while `.preview-gallery-shell` exists and remove it when the dialog closes. Use `ResizeObserver` plus scroll/resize listeners to keep CSS custom properties aligned to the live `.preview-gallery-popup` bounds.

- [ ] **Step 4: Position the navigation rail on wide screens**

Add these rules to `assets/gallery-vertical-navigation.css`:

```css
.preview-gallery-rail {
  position: fixed;
  z-index: 71;
  top: var(--preview-gallery-rail-top, 50%);
  left: var(--preview-gallery-rail-left, calc(50% + 288px));
  display: flex;
  flex-direction: column;
  gap: .45rem;
  transform: translateY(-50%);
}
```

The rail is outside `.preview-gallery-card`, so the card's transition transform cannot move it.

- [ ] **Step 5: Reuse the narrow-screen toolbar**

At narrow or coarse-pointer viewports, hide the external rail and rotate the existing previous/next toolbar icons:

```css
@media (max-width: 720px), (hover: none), (pointer: coarse) {
  .preview-gallery-rail {
    display: none;
  }

  .preview-gallery-toolbar .preview-gallery-nav-prev .preview-gallery-nav-icon,
  .preview-gallery-toolbar .preview-gallery-nav-next .preview-gallery-nav-icon {
    transform: rotate(90deg);
  }
}
```

Keep the existing `.preview-gallery-nav` dimensions, focus, hover, active, and disabled rules unchanged.

- [ ] **Step 6: Run static verification**

Run:

```bash
node --check assets/gallery-vertical-navigation.js
rg -n 'preview-gallery-rail|Previous preview|Next preview' assets/gallery-vertical-navigation.js assets/gallery-vertical-navigation.css
git diff --check
```

Expected: both icons, the rail, labels, and keyboard shortcuts are present; `git diff --check` exits successfully.

- [ ] **Step 7: Verify desktop interaction in Chrome**

Serve the workspace:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`, select the first project, and verify:

- Two stacked circular controls appear just outside the modal's right edge.
- Up changes `1 / 12` to `12 / 12`; Down returns it to `1 / 12`.
- The card transitions vertically while the controls stay stationary.
- ArrowUp/ArrowLeft and ArrowDown/ArrowRight still navigate.
- Tab focus reaches both controls and their focus style is visible.
- Escape and backdrop click still close the modal.

- [ ] **Step 8: Verify the narrow-screen fallback**

At a 390px by 844px viewport, reopen the gallery and verify:

- Both controls remain fully visible.
- Neither the modal nor the controls causes horizontal scrolling.
- Both 44px controls respond to pointer input.
- The modal content remains vertically scrollable.

- [ ] **Step 9: Commit the implementation**

```bash
git add index.html assets/gallery-vertical-navigation.js assets/gallery-vertical-navigation.css docs/superpowers/plans/2026-07-27-gallery-vertical-navigation.md
git commit -m "Add vertical gallery navigation"
```
