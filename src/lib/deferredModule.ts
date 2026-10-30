import { useCallback, useRef, useState } from "react"

/** Vite remembers a failed CSS preload. Repair the link explicitly before
 * presenting a module retried under a fresh JavaScript URL. */
function retryStylesheet(url: string) {
  return new Promise<void>((resolve, reject) => {
    const href = new URL(url, document.baseURI).href
    for (const link of document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')) {
      // Chromium can expose an empty sheet even after a failed request.
      // This URL is known to have failed, so do not treat sheet as success.
      if (link.href === href) link.remove()
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => { link.remove(); reject(new Error(`Unable to preload CSS for ${href}`)) }
    document.head.append(link)
  })
}

/** Cache successful loads and warmups, but let a failed request be retried.
 * As with the gallery, a new module-map key is needed after an import fails. */
export function createModuleLoader<T>(importModule: () => Promise<T>, chunkName: string) {
  let pending: Promise<T> | null = null
  let failedUrl: string | null = null
  let failedStyle: string | null = null
  let attempt = 0
  return () => {
    if (pending) return pending
    let request: Promise<T>
    if (failedUrl) {
      const retryUrl = new URL(failedUrl)
      retryUrl.searchParams.set("retry", String(++attempt))
      request = import(/* @vite-ignore */ retryUrl.href) as Promise<T>
    } else {
      request = importModule()
    }
    const withStyles = failedStyle
      ? Promise.all([request, retryStylesheet(failedStyle)]).then(([module]) => { failedStyle = null; return module })
      : request
    pending = withStyles.catch((error: unknown) => {
      pending = null
      const entry = performance.getEntriesByType("resource").reverse().find(entry => entry.name.includes(chunkName) && /\.js(?:\?|$)/.test(entry.name))
      if (entry) failedUrl = entry.name
      failedStyle = error instanceof Error ? /Unable to preload CSS for (.+)/.exec(error.message)?.[1] ?? null : null
      throw error
    })
    return pending
  }
}

export function useDeferredModule<T>(loader: () => Promise<T>) {
  const [module, setModule] = useState<T | null>(null)
  const [status, setStatus] = useState<"loading" | "error" | "reload" | undefined>()
  const failures = useRef(0)
  const loading = useRef(false)
  const load = useCallback(async () => {
    // A retried entry can still import a failed dependency under its cached
    // URL. Reloading clears that module map; another entry-only retry cannot.
    if (failures.current >= 2) {
      window.location.reload()
      return
    }
    if (loading.current) return
    loading.current = true
    setStatus("loading")
    try {
      const loaded = await loader()
      failures.current = 0
      setModule(loaded)
      setStatus(undefined)
    } catch {
      failures.current += 1
      setStatus(failures.current >= 2 ? "reload" : "error")
    } finally {
      loading.current = false
    }
  }, [loader])
  // Intent warms the module without mounting its hooks or changing the trigger.
  const warm = useCallback(() => { void loader().catch(() => undefined) }, [loader])
  return { module, status, load, warm }
}
