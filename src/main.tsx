import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadWritingPage } from './lib/writingPageSlot.ts'
import { revealGalleryEntry } from './lib/galleryEntry.ts'
import { getProjectPage, loadProjectPage } from './lib/projectPageSlot.ts'
import { projectAtPath, writingAtPath } from './lib/projectMetadata.ts'
import { startAnalytics } from './lib/analytics.ts'
import { startClarity } from './lib/clarity.ts'
import { loadPreviewGallery } from './lib/previewGalleryModule.ts'

startAnalytics()
startClarity()

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

function start() {
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}

const waits: Promise<unknown>[] = []
const note = writingAtPath(window.location.pathname)
const project = projectAtPath(window.location.pathname)
if (project) waits.push(loadProjectPage())
// A note's article is not in this bundle, and `/notes/<id>/` is prerendered
// with it. Fetch the module before hydrating so App's first client render can
// produce the same markup that is already in the document; hydrating without
// it would throw the prerendered article away and rebuild it a moment later.
if (root.hasChildNodes() && note) waits.push(loadWritingPage())
// A gallery address -- a project, the résumé, the notes, a note -- opens its
// dialog as soon as the feed mounts, and the page is held back until it does
// (lib/galleryEntry). Hydrating before the dialog's chunk is here renders the
// feed with the dialog suspended, and React then holds a revealed boundary
// back for up to 300ms. Wait for it instead, so both land in one commit; the
// feed's retry path still covers a fetch that failed. A note's reader is warmed
// alongside -- it arrives through a state update of its own, so it need not
// hold hydration up.
if (document.documentElement.dataset.galleryEntry) {
  waits.push(loadPreviewGallery())
  if (note) void import("./components/WritingsReader.tsx").catch(() => undefined)
}
// The first-load intro holds the grid out of layout until the full stylesheet is
// in. Hydrating before that would have it measure a grid with no size.
if (window.pageStylesReady) waits.push(window.pageStylesReady)
// Everywhere else this is a straight hydrate.
if (waits.length) void Promise.allSettled(waits).then(() => {
  // A failed prerequisite must not hydrate a homepage over useful project
  // HTML, especially for published projects with no grid/gallery item.
  if (project && root.hasChildNodes() && !getProjectPage()) {
    revealGalleryEntry()
    return
  }
  start()
})
else start()
