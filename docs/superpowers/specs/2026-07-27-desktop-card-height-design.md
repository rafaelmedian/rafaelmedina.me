# Desktop Card Height Design

## Goal

Increase every portfolio mosaic card row to 420px on desktop while preserving the existing mobile card height.

## Design

The mosaic uses a shared `.mosaic-row` height for desktop layouts and a separate `.mosaic-row-item` height inside the existing `max-width: 699.98px` mobile breakpoint. Change the desktop fallback height from `320px` to `420px`. Leave the mobile fallback at `240px`.

This keeps cards within each row aligned, preserves the current flex proportions and gaps, and avoids adding per-card or JavaScript sizing logic.

## Responsive Behavior

- Viewports wider than 699.98px: mosaic rows and their cards are 420px tall.
- Viewports at or below 699.98px: cards remain 240px tall and continue stacking vertically.
- Card media retains its current cover or contain behavior.

## Verification

- Confirm the compiled stylesheet declares a 420px default for `.mosaic-row`.
- Confirm the mobile breakpoint still declares 240px for `.mosaic-row-item`.
- Preview the page at desktop and mobile widths to verify computed card heights and check for overflow or layout regressions.
