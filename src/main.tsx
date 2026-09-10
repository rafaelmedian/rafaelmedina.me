import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadWritingPage } from './lib/writingPageSlot.ts'
import { writingAtPath } from './lib/projectMetadata.ts'
import { startAnalytics } from './lib/analytics.ts'

startAnalytics()

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

// A note's article is not in this bundle, and `/notes/<id>/` is prerendered
// with it. Fetch the module before hydrating so App's first client render can
// produce the same markup that is already on screen; hydrating without it would
// throw the prerendered article away and rebuild it a moment later. The wait
// costs one request on the one route that needs it, and the page is painted
// throughout. Everywhere else this is a straight hydrate.
if (root.hasChildNodes() && writingAtPath(window.location.pathname)) void loadWritingPage().then(start, start)
else start()
