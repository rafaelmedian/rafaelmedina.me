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

Place the two controls in a vertical stack immediately outside the modal's right edge. Each control is a 44px circular button matching the existing white surface, subtle border, shadow, hover, focus, active, and disabled states.

Lock the control stack to the viewport's vertical center at `50vh`. Its vertical position must not be derived from the current card's height, media, or visible bounds. Keep the stack 16px from the modal's fixed horizontal edge.

Keep the modal horizontally centered and lock its top edge at approximately `8vh`, constrained by safe-area spacing. The modal top edge must not move when visitors change projects. Taller projects scroll inside the existing modal scroller; shorter projects end naturally without vertical recentering.

The modal and controls must remain stationary while project content transitions so neither the interaction target nor the content origin moves.

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

Update the gallery navigation enhancement and stylesheet already shipped by this static site. Remove card-height-based control positioning, expose the navigation controls at the approved fixed desktop position, lower and lock the modal's desktop top edge, and preserve the narrow-screen fallback.

No project data, gallery transition timing, analytics, media behavior, or modal content changes are included.

## Verification

- Open the first gallery project and confirm both controls are visible.
- Confirm Up selects the previous project and Down selects the next project.
- Confirm navigation wraps at both ends.
- Confirm the buttons retain identical viewport coordinates across projects with different card heights.
- Confirm the modal top edge retains identical viewport coordinates across projects with different card heights.
- Confirm the desktop modal begins at approximately `8vh`.
- Confirm keyboard shortcuts still work.
- Confirm focus labels and focus styles are present.
- Confirm controls remain reachable without horizontal clipping at narrow widths.
- Confirm closing the modal still works independently.
