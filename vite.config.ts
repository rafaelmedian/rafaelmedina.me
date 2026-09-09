import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-expect-error -- plain ESM helper shared with the build scripts, no types.
import { readSiteActivity } from './scripts/site-activity.mjs'

// The hero's "last updated" date is read from this repository's git log at build
// time rather than fetched: it only changes when a deploy happens, so a request
// per visit would buy nothing but a spinner and a failure state. Baking it also
// means the SSR prerender and the client agree instead of the line reflowing
// once a fetch lands. The contribution calendar beside it is a different thing
// with a different lifecycle -- see src/data/githubActivity.ts.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __SITE_ACTIVITY__: JSON.stringify(readSiteActivity()),
  },
})
