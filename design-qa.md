# Grid sheet design QA (historical)

This records an earlier Grid exploration. The final photo viewer opens only
on the full-screen Wall; the sheet geometry below is not the shipped design.

- Source visual truth: `.context/attachments/UhqG1s/CleanShot 2026-09-15 at 2.58.40 PM@2x.png`
- Implementation capture: `.context/grid-sheet-implementation-reference-viewport.png`
- Side-by-side comparison: `.context/grid-sheet-comparison.png`
- Viewport: 2396 x 634 CSS px at 2x density
- Source pixels: 4792 x 1268
- Implementation pixels: 4792 x 1268
- State: Personal Photos dialog open on Grid, reduced motion enabled

## Full-view comparison

The implementation carries over the reference's bottom-anchored white surface,
small side insets, rounded top corners, elevation, and visible page strip. The
reference exposes about 12% of the page; the implementation uses 10%, matching
the revised 90%-height direction while staying close to the reference.

## Fidelity surfaces

- Fonts and typography: Existing portfolio and toggle typography is preserved;
  the reference was used for sheet geometry rather than copied content.
- Spacing and layout rhythm: The sheet starts at 10dvh, ends at the viewport
  bottom, and is inset 4px on both sides. Its 24px top corners use the existing
  `--radius-lg` token.
- Controls and motion: A centred handle and top-right X sit on the sheet. The
  handle follows a downward pull, returns on a short pull, and dismisses after
  crossing the 120px / 18% threshold.
- Colors and visual tokens: The surface uses `--canvas`, the page remains under
  the existing dim backdrop, and elevation uses `--shadow-overlay`.
- Image quality and asset fidelity: Existing responsive personal-photo assets,
  crops, and print frames are unchanged.
- Copy and content: Existing Grid content and layout labels are unchanged.

A focused crop was not needed because the requested change is the full sheet
silhouette and viewport proportion, both legible in the normalized full view.

## Findings

No actionable P0, P1, or P2 differences remain. The two-percent difference in
page reveal preserves the site's existing spacing and radius tokens.

## Comparison history

No P0/P1/P2 issues were found in the normalized comparison, so no visual-fix
iteration was required.

## Verification

- Opened Grid and confirmed the sheet state in a browser-rendered capture.
- Confirmed zero browser console errors.
- Exercised Grid opening, layout switching, scrolling, photo selection,
  centering, release, and closing through the Playwright suites.

final result: passed
