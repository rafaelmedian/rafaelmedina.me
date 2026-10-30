import type { ProjectPage } from "../components/ProjectPage"

// Like the note page, a project must have its full narrative in hand before
// hydration matches the prerendered article. Home visits never load this slot.
let loaded: typeof ProjectPage | null = null
export const getProjectPage = () => loaded
export async function loadProjectPage() {
  loaded = (await import("../components/ProjectPage")).ProjectPage
}
