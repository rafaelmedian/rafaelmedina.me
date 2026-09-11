type PreviewGalleryModule = typeof import("../components/PreviewGalleryDialog")

let galleryModulePromise: Promise<PreviewGalleryModule> | null = null
let galleryModule: PreviewGalleryModule | null = null
// Browsers cache failed module imports for the page lifetime. Keep the emitted
// chunk URL so a later interaction can retry it under a fresh module-map key.
let failedGalleryModuleUrl: string | null = null
let galleryRetryAttempt = 0

function findGalleryModuleUrl() {
  if (typeof performance === "undefined") return null
  const entries = performance.getEntriesByType("resource")
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const url = entries[index]?.name
    if (url?.includes("PreviewGalleryDialog")) return url
  }
  return null
}

/** The gallery's chunk: the feed's lazy dialog, its hover prefetch, and a shared link's head start. */
export function loadPreviewGallery() {
  if (galleryModulePromise) return galleryModulePromise

  let modulePromise: Promise<PreviewGalleryModule>
  if (failedGalleryModuleUrl) {
    const retryUrl = new URL(failedGalleryModuleUrl)
    retryUrl.searchParams.set("retry", String(++galleryRetryAttempt))
    failedGalleryModuleUrl = null
    modulePromise = import(/* @vite-ignore */ retryUrl.href) as Promise<PreviewGalleryModule>
  } else {
    modulePromise = import("../components/PreviewGalleryDialog")
  }

  galleryModulePromise = modulePromise.then((module) => {
    galleryModule = module
    return module
  }, (error: unknown) => {
    galleryModulePromise = null
    failedGalleryModuleUrl = findGalleryModuleUrl()
    throw error
  })
  return galleryModulePromise
}

/** The chunk once it has arrived, so a render can use it without waiting a tick. */
export const loadedPreviewGallery = () => galleryModule
