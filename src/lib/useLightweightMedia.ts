import { useSyncExternalStore } from "react"

type NetworkInformation = EventTarget & {
  saveData?: boolean
  effectiveType?: string
}

function getConnection() {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

let slowStartup: boolean | undefined

function observedSlowStartup() {
  if (slowStartup !== undefined) return slowStartup

  // The entry script has finished transferring before this code can run.
  // Use that existing request, not a speed-test download or CPU-dependent
  // hydration time. Ignore small files and cache hits. Keep this fallback
  // stable for this page visit so optional downloads cannot oscillate it.
  slowStartup = performance.getEntriesByType("resource").some(entry => {
    const resource = entry as PerformanceResourceTiming
    return resource.name.startsWith(`${location.origin}/`) && /\.js(?:\?|$)/.test(resource.name) &&
      resource.transferSize > 0 && resource.encodedBodySize >= 32000 &&
      resource.duration >= 1000 && resource.encodedBodySize / resource.duration < 150
  })
  return slowStartup
}

export function prefersLightweightMedia() {
  if (typeof navigator === "undefined") return true
  const connection = getConnection()
  if (navigator.onLine === false || connection?.saveData) return true
  if (connection?.effectiveType) return ["slow-2g", "2g", "3g"].includes(connection.effectiveType)
  return observedSlowStartup()
}

function subscribe(listener: () => void) {
  const connection = getConnection()
  connection?.addEventListener?.("change", listener)
  window.addEventListener("online", listener)
  window.addEventListener("offline", listener)
  return () => {
    connection?.removeEventListener?.("change", listener)
    window.removeEventListener("online", listener)
    window.removeEventListener("offline", listener)
  }
}

// Keep automatic requests off until hydration has read the actual connection.
const getServerSnapshot = () => true

export function useLightweightMedia() {
  return useSyncExternalStore(subscribe, prefersLightweightMedia, getServerSnapshot)
}
