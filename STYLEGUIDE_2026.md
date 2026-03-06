# Portfolio 2026 Styleguide (v0)

## Direction
- Tone: editorial + product-lab mosaic
- Layout: card wall with soft corners and grayscale depth
- Accent strategy: one electric accent for interactions (`#706EFF`) and one positive signal (`#00A41B`)

## Color Tokens
- `--p26-canvas`: `#E6E7EB`
- `--p26-card`: `#DFE1E6`
- `--p26-surface`: `#F9FAFC`
- `--p26-ink`: `#1F1F41`
- `--p26-muted`: `#747AA0`
- `--p26-accent`: `#706EFF`
- `--p26-positive`: `#00A41B`
- `--p26-border`: `rgb(31 31 65 / 0.1)`

## Typography
- Display/UI: `Instrument Sans` (400, 500, 600, 700)
- Technical labels: `IBM Plex Mono` (400, 500)
- Sizing baseline:
  - Hero title: `1.2rem` to `1.65rem`
  - Card headings: `1rem` to `1.2rem`
  - Body copy: `0.8rem` to `0.92rem`
  - Eyebrow/meta: `0.62rem` to `0.74rem`

## Spacing and Shape
- Grid: `12 columns`
- Card radius: `1.45rem`
- Internal card padding: `0.7rem` to `1rem`
- Section rhythm: `1rem` vertical spacing between major blocks

## Components Started
- Profile intro card
- Visual preview cards (dashboard, phone, table)
- Note and social widget cards
- Resume snapshot section
- Scheduling strip (intro + mini calendar + time slots)

## Next Design Iteration
1. Replace placeholder copy with final portfolio narrative.
2. Align each card size exactly to the final Figma geometry.
3. Add section-level motion (stagger in + hover depth) with reduced-motion fallback.
4. Build reusable card primitives (`FeatureCard`, `MediaCard`, `MetaCard`) to reduce CSS duplication.
