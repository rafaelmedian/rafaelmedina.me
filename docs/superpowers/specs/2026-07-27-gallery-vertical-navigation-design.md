# Gallery Vertical Navigation

## Goal

Add visible previous and next controls to the portfolio gallery so visitors can move between projects without relying on keyboard shortcuts or swipe gestures.

## Interaction

- Show an Up arrow for the previous project and a Down arrow for the next project.
- Preserve the gallery's existing wraparound navigation.
- Preserve the existing Up/Down and Left/Right keyboard shortcuts.
- Reuse the existing vertical project transition and navigation sounds.
- Keep the controls disabled only when the gallery contains one project.

## Desktop Layout

Place the two controls in a vertical stack immediately outside the modal's right edge and center the stack against the visible gallery card. Each control is a 44px circular button matching the existing white surface, subtle border, shadow, hover, focus, active, and disabled states.

The controls must remain stationary while project content transitions so the interaction target does not move.

## Narrow-Screen Layout

When there is not enough room beside the modal, place the controls within the modal toolbar. This avoids viewport clipping and preserves comfortable touch targets. The close control remains visually distinct from project navigation.

## Accessibility

- Use native buttons.
- Label the controls “Previous preview” and “Next preview.”
- Advertise the Up/Left and Down/Right keyboard shortcuts through `aria-keyshortcuts`.
- Preserve visible keyboard focus styles.
- Use decorative SVG icons hidden from assistive technology.
- Keep the 44px touch target size.

## Implementation Scope

Update the generated gallery JavaScript and stylesheet already shipped by this static site. Replace the current left/right chevrons with up/down chevrons, expose the navigation controls in the approved desktop position, and add the narrow-screen fallback.

No project data, gallery transition timing, analytics, media behavior, or modal content changes are included.

## Verification

- Open the first gallery project and confirm both controls are visible.
- Confirm Up selects the previous project and Down selects the next project.
- Confirm navigation wraps at both ends.
- Confirm the buttons stay fixed while the card transitions vertically.
- Confirm keyboard shortcuts still work.
- Confirm focus labels and focus styles are present.
- Confirm controls remain reachable without horizontal clipping at narrow widths.
- Confirm closing the modal still works independently.
