# Desktop Card Height Design

## Goal

Increase every portfolio mosaic card row to 420px on desktop while preserving the existing mobile card height.

## Design

The mosaic supplies each row with an inline responsive `--row-height` custom property. Load a focused override stylesheet after the compiled bundle and set `--row-height` to `420px` with sufficient priority at `min-width: 900px`. Leave the existing responsive row sizing untouched below 900px.

This keeps cards within each row aligned, preserves the current flex proportions and gaps, and avoids adding per-card or JavaScript sizing logic.

## Responsive Behavior

- Viewports at or above 900px: mosaic rows and their cards are 420px tall.
- Viewports below 900px: existing responsive sizing remains unchanged; at a 390px mobile viewport, cards remain 180px tall and continue stacking vertically.
- Card media retains its current cover or contain behavior.

## Verification

- Confirm computed `.mosaic-row` and `.mosaic-row-card` heights are 420px at a 1440px viewport.
- Confirm computed `.mosaic-row-item` and `.mosaic-row-card` heights remain 180px at a 390px viewport.
- Preview the page at desktop and mobile widths to verify computed card heights and check for overflow or layout regressions.
