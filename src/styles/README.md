# Stylesheets

`../index.css` imports the site's styles in a deliberate order. Vite combines
these imports; component styles are not loaded on demand. Keep Tailwind first
and the global reduced-motion policy last.

- `base.css`: fonts, shared tokens, element defaults, and keyboard focus.
- `page-edge.css`: the bottom overscroll effect.
- `profile.css`: page shell, hero, avatar, first-load intro, and profile metadata.
- `navigation.css`: corner links, takeover close button, and mobile contents.
- `local-time.css`: local time, map, and résumé preview.
- `about.css`: About content and résumé layout.
- `work-history.css`: work-history popovers and inline company links.
- `contact.css`: contact pills, copy reaction, and social hover cards.
- `work-grid.css`: project rows, captions, media, and About takeover choreography.
- `personal-photos.css`: photo stack and carousel dialog.
- `preview-gallery.css`: project preview dialog.
- `booking.css`: the availability calendar-preview tooltip, booking dialog, and Cal.com frame.
- `writings.css`: writings folder tile, reader dialog, and its transitions.
- `standalone.css`: prerendered project pages and the 404.
- `reduced-motion.css`: the shared duration clamp and final visibility resets.

Responsive and component-specific reduced-motion rules stay in their component
file. The work-grid file owns the takeover's cross-component layout rules and
the crop properties shared with the preview gallery, so it follows the profile
and About styles. Preserve cascade order when moving shared selectors.

Row data sets `--row-height-input`; CSS resolves `--row-height` and can override
it at layout breakpoints without `!important`.

Tailwind maps its named utilities to the shared CSS tokens. The design-system
page reads root token values from computed styles and refreshes on CSS hot
updates. Its descriptions and component-specific exceptions remain handwritten.

Run `npm run lint`, `npm run test:design-system`, and `npm run test:e2e` when
changing shared styles. The token-reference test scans every source stylesheet.
