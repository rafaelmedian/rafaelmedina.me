export type SiteActivity = {
  /** UTC `YYYY-MM-DD` of the newest commit, or null when git was unreadable. */
  lastUpdated: string | null
}

declare const __SITE_ACTIVITY__: SiteActivity

// Replaced at build time by `define` in vite.config.ts, which reads it out of
// this repository's git log. See the note there for why it is not fetched.
export const siteActivity: SiteActivity = __SITE_ACTIVITY__
