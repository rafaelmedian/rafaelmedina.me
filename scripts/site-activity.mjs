import { execFileSync } from "node:child_process"

/**
 * When this checkout last had a commit land on it, read at build time.
 *
 * Only the date: the contribution calendar beside it comes from
 * `src/data/githubActivity.ts`, which covers the whole GitHub profile rather
 * than this one repository. That split is deliberate — the date has to be true
 * of the deploy that is happening right now, and a shallow CI checkout still
 * answers that correctly, while the calendar is a committed artefact.
 */
export function readSiteActivity(cwd = process.cwd()) {
  try {
    // %cI is the committer date, which is when the work landed on this history.
    // Author dates travel with a cherry-pick or a rebase and would date the
    // deploy to whenever the patch was first written.
    const lastUpdated = execFileSync("git", ["log", "-1", "--pretty=format:%cI"], {
      cwd,
      encoding: "utf8",
    }).trim()

    return { lastUpdated: lastUpdated ? lastUpdated.slice(0, 10) : null }
  } catch {
    // No git (a tarball build, a vendored copy): the page leaves the clause out
    // entirely rather than inventing a date.
    return { lastUpdated: null }
  }
}
