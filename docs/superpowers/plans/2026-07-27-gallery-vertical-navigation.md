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

### Task 2: Lock the desktop modal and arrows to stable viewport anchors

**Files:**
- Modify: `index.html:77-79`
- Modify: `assets/gallery-vertical-navigation.js:63-95`
- Modify: `assets/gallery-vertical-navigation.css:1-31`
- Test: rendered browser geometry against `index.html`

**Interfaces:**
- Consumes: `.preview-gallery-shell`, `.preview-gallery-popup`, `.preview-gallery-rail`, and the existing narrow-screen toolbar media query.
- Produces: a desktop rail fixed at `50vh`, a modal top edge fixed at `8vh`, and a stable 16px horizontal gap between the modal and rail.

- [x] **Step 1: Record the failing geometry across different projects**

Serve the workspace and open the first project. Capture the modal and rail bounds, navigate to a project with a different card height, then capture them again:

```js
function geometry() {
  const popup = document.querySelector(".preview-gallery-popup").getBoundingClientRect();
  const rail = document.querySelector(".preview-gallery-rail").getBoundingClientRect();
  return {
    popupTop: popup.top,
    railTop: rail.top,
    railLeft: rail.left,
  };
}
```

Expected before the fix: `railTop` changes because `positionRail()` derives it from the current popup height.

- [x] **Step 2: Remove card-height-based vertical positioning**

Replace `positionRail(rail, gallery)` with horizontal-only positioning:

```js
function positionRail(rail, gallery) {
  const popup = gallery.querySelector(".preview-gallery-popup");
  if (!popup) return;

  const bounds = popup.getBoundingClientRect();
  rail.style.setProperty(
    "--preview-gallery-rail-left",
    `${bounds.right + 16}px`,
  );
}
```

Remove `observedPopup`, `popupSizeObserver`, and all `ResizeObserver` calls because project height must no longer influence the rail.

- [x] **Step 3: Lock the desktop anchors in CSS**

Update `assets/gallery-vertical-navigation.css`:

```css
.preview-gallery-shell {
  padding-top: max(8vh, env(safe-area-inset-top));
}

.preview-gallery-rail {
  top: 50vh;
}
```

Keep `left: var(--preview-gallery-rail-left, calc(50% + 288px))`, the 44px button dimensions inherited from the gallery, and `transform: translateY(-50%)`.

- [x] **Step 4: Preserve the narrow-screen layout**

Inside the existing narrow/coarse-pointer media query, restore the gallery's original top padding and continue hiding the external rail:

```css
@media (max-width: 720px), (hover: none), (pointer: coarse) {
  .preview-gallery-shell {
    padding-top: max(clamp(1rem, 5vh, 3rem), env(safe-area-inset-top));
  }

  .preview-gallery-rail {
    display: none;
  }
}
```

- [x] **Step 5: Run static verification**

Run:

```bash
node --check assets/gallery-vertical-navigation.js
rg -n 'gallery-vertical-navigation\\.(js|css)\\?v=2' index.html
rg -n 'ResizeObserver|visibleTop|visibleBottom|preview-gallery-rail-top' assets/gallery-vertical-navigation.js assets/gallery-vertical-navigation.css
git diff --check
```

Expected: `node --check` and `git diff --check` pass; the removed dynamic-positioning terms return no matches.

- [x] **Step 6: Verify stable desktop geometry**

At the default desktop viewport, compare projects 1, 3, 5, and 12:

- `.preview-gallery-popup` has the same `top` value for every project.
- `.preview-gallery-rail` has the same `top` and `left` values for every project.
- The rail center equals `window.innerHeight * 0.5`.
- The rail remains 16px from the modal's right edge.
- The modal top is within 1px of `window.innerHeight * 0.08`, subject to safe-area spacing.

- [x] **Step 7: Verify mobile remains unchanged**

At 390px by 844px:

- The external rail computes to `display: none`.
- The existing toolbar remains visible with Up/Down icons.
- Previous and next still wrap between `1 / 12` and `12 / 12`.
- The document width remains 390px.

- [ ] **Step 8: Commit the positioning fix**

```bash
git add index.html assets/gallery-vertical-navigation.js assets/gallery-vertical-navigation.css docs/superpowers/plans/2026-07-27-gallery-vertical-navigation.md
git commit -m "Stabilize gallery modal positioning"
```

### Task 3: Move the fixed controls upward and tighten bottom corners

**Files:**
- Modify: `index.html:77-79`
- Modify: `assets/gallery-vertical-navigation.css:1-39`
- Modify: `docs/superpowers/plans/2026-07-27-gallery-vertical-navigation.md`
- Test: rendered browser geometry and computed corner styles against `index.html`

**Interfaces:**
- Consumes: the fixed desktop modal top at `8vh`, `.preview-gallery-popup`, `.preview-gallery-card`, `.preview-gallery-rail`, and the narrow/coarse-pointer media query.
- Produces: a rail centered 128px below the fixed modal top plus 28px bottom corners shared by the popup and card.

- [x] **Step 1: Record the failing upper-anchor and radius checks**

Open a desktop project and capture:

```js
const popup = document.querySelector(".preview-gallery-popup");
const card = document.querySelector(".preview-gallery-card");
const rail = document.querySelector(".preview-gallery-rail");
const popupRect = popup.getBoundingClientRect();
const railRect = rail.getBoundingClientRect();

({
  railOffset: railRect.top + railRect.height / 2 - popupRect.top,
  popupBottomLeft: getComputedStyle(popup).borderBottomLeftRadius,
  cardBottomLeft: getComputedStyle(card).borderBottomLeftRadius,
});
```

Expected before the fix: `railOffset` is substantially larger than 128px and both bottom radii are larger than 28px.

- [x] **Step 2: Move the fixed rail to the upper card**

Define one shared desktop top custom property and derive both positions from it:

```css
:root {
  --preview-gallery-fixed-top: max(8vh, env(safe-area-inset-top));
}

.preview-gallery-shell {
  padding-top: var(--preview-gallery-fixed-top);
}

.preview-gallery-rail {
  top: calc(var(--preview-gallery-fixed-top) + 128px);
}
```

Keep `transform: translateY(-50%)`, so the center of the two-button stack—not its top edge—is exactly 128px below the modal top.

- [x] **Step 3: Reduce only the modal bottom corners**

Add:

```css
.preview-gallery-popup,
.preview-gallery-card {
  border-bottom-right-radius: 28px;
  border-bottom-left-radius: 28px;
}
```

Do not override the top corner radii.

- [x] **Step 4: Preserve the narrow-screen behavior**

Within the current narrow/coarse-pointer media query, leave the external rail hidden and retain the existing mobile top padding. The smaller 28px bottom corners remain active because they avoid clipping mismatches between popup and card.

- [x] **Step 5: Increment the focused asset cache key**

Update both focused asset URLs in `index.html` from `?v=2` to `?v=3`:

```html
<script type="module" src="/assets/gallery-vertical-navigation.js?v=3"></script>
<link rel="stylesheet" href="/assets/gallery-vertical-navigation.css?v=3">
```

- [x] **Step 6: Run static verification**

Run:

```bash
node --check assets/gallery-vertical-navigation.js
rg -n 'gallery-vertical-navigation\\.(js|css)\\?v=3' index.html
rg -n 'preview-gallery-fixed-top|128px|border-bottom-(right|left)-radius: 28px' assets/gallery-vertical-navigation.css
git diff --check
```

Expected: all required declarations are present and both commands exit successfully.

- [x] **Step 7: Verify desktop geometry and corners**

For projects 1, 3, 5, and 12, confirm:

- Modal top coordinates are identical.
- Rail top and left coordinates are identical.
- Rail center minus modal top is exactly 128px within 1px rounding tolerance.
- Popup and card bottom-left and bottom-right radii compute to 28px.
- Popup and card top radii remain larger than 28px.
- The rail remains 16px from the modal's right edge.

- [x] **Step 8: Verify the mobile regression**

At 390px by 844px, confirm:

- The external rail remains hidden.
- The existing toolbar remains visible.
- The document width remains 390px.
- The popup and card bottom radii compute to 28px without clipping.

- [ ] **Step 9: Commit the refinement**

```bash
git add index.html assets/gallery-vertical-navigation.css docs/superpowers/plans/2026-07-27-gallery-vertical-navigation.md
git commit -m "Refine gallery modal controls"
```
