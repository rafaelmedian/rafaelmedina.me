import { useCallback, useRef, useState } from "react"

/** Cache successful loads and warmups, but let a failed request be retried.
 * As with the gallery, a new module-map key is needed after an import fails. */
export function createModuleLoader<T>(importModule: () => Promise<T>, chunkName: string) {
  let pending: Promise<T> | null = null
  let failedUrl: string | null = null
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
    pending = request.catch((error: unknown) => {
      pending = null
      const entry = performance.getEntriesByType("resource").reverse().find(entry => entry.name.includes(chunkName))
      if (entry) failedUrl = entry.name
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
