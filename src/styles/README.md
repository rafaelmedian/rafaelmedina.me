# Stylesheets

`../index.css` imports the site's styles in a deliberate order. Vite combines
these imports; component styles are not loaded on demand. Keep Tailwind first
and the global reduced-motion policy last.

- `base.css`: fonts, shared tokens, element defaults, and keyboard focus.
- `page-edge.css`: the bottom overscroll effect.
- `profile.css`: page shell, hero, avatar, first-load intro, and profile metadata
  (including the location line's copy-to-clipboard address).
- `navigation.css`: corner links, takeover close button, and mobile contents.
- `local-time.css`: local time, map, and résumé preview.
- `about.css`: About content and résumé layout.
- `about-intro.css`: deferred introduction video, circle-to-player morph, glass action badge, minimal email and text replies, and shared mobile TOC dock.
- `work-history.css`: work-history popovers and inline company links.
- `contact.css`: contact pills, the booking pill, and social hover cards.
- `work-grid.css`: project rows, captions, media, and About takeover choreography.
- `resume-tile.css`: folded-paper résumé tile artwork, reader modal, and responsive interaction.
- `resume-content.css`: company logos, work history entries, and selected project screenshots in the reader.
- `likes.css`: the like pill shared by the notes reader and the project preview.
- `personal-photos.css`: photo stack and carousel dialog.
- `preview-gallery.css`: project preview dialog.
- `booking.css`: the hint tooltip shared by the booking pill and the address,
  the booking dialog, and the Cal.com frame.
- `writings.css`: writings folder tile, reader dialog, and its transitions.
- `standalone.css`: prerendered project pages and the 404.
- `reduced-motion.css`: the shared duration clamp and final visibility resets.

Responsive and component-specific reduced-motion rules stay in their component
file. The work-grid file owns the takeover's cross-component layout rules and
the crop properties shared with the preview gallery, so it follows the profile
and About styles. Preserve cascade order when moving shared selectors.

`src/data/portfolio.ts` owns the grid's semantic source and reading order: its
named opening, portraits, offset, and closing groups assign each tile a CSS area
and desktop width share. `work-grid.css` owns both compositions: independent,
container-relative group heights on desktop, and the explicit two-column area
map used after group wrappers become `display: contents` below 900px. Keep those
area names and the data order in step when adding or moving a tile.

The grid and its desktop breathing room stay naturally sized. A `ResizeObserver`
copies that rendered height to the sticky stage's offset, while a separate
normal-flow `100dvh` spacer gives the About takeover its scrolling distance.
Do not replace either with a row-count height formula.

Tailwind maps its named utilities to the shared CSS tokens. The design-system
page reads root token values from computed styles and refreshes on CSS hot
updates. Its descriptions and component-specific exceptions remain handwritten.

Run `npm run lint`, `npm run test:design-system`, and `npm run test:e2e` when
changing shared styles. The token-reference test scans every source stylesheet.
