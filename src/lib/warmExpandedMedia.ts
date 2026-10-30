import { prefersLightweightMedia } from "./useLightweightMedia"

// A tile shows a small loop or a sized image, and opening it asks for the full
// file. Warming fetches that file ahead of the click, so the expanded view has
// it ready, without the first load paying for it. The browser's HTTP cache does
// the rest: the gallery requests the same URL.
//
// Long enough that a visitor who leaves at once downloads none of this, and
// that it stays out of the cold-load budgets in tests/performance.
const startDelay = 8000

type Entry = { source: string; urgent: boolean }

const seen = new Set<string>()
const queue: Entry[] = []
let started = false
let paused = false
let current: { entry: Entry; controller: AbortController } | null = null

function pump() {
  if (current || paused || !queue.length) return
  if (!started && !queue[0].urgent) return
  // Checked per file: a connection can drop mid-visit.
  if (prefersLightweightMedia()) {
    queue.length = 0
    return
  }

  const entry = queue.shift()!
  const controller = new AbortController()
  current = { entry, controller }
  // One at a time and low priority, so this never competes with what is on screen.
  void fetch(entry.source, { priority: "low", signal: controller.signal })
    // The body has to be read to the end for the cache to keep it.
    .then((response) => response.arrayBuffer())
    .catch(() => {
      // Aborted files go back in line. A failed one is left for the gallery,
      // which has its own loading state and retry.
      if (controller.signal.aborted) queue.unshift(entry)
    })
    .finally(() => {
      current = null
      pump()
    })
}

/** Queues a tile's full file. `urgent` is a hover or focus: it goes first, and needn't wait for the delay. */
export function warmExpandedMedia(source: string, urgent = false) {
  if (seen.has(source)) {
    const index = queue.findIndex((entry) => entry.source === source)
    if (!urgent || index < 0) return
    const [entry] = queue.splice(index, 1)
    entry.urgent = true
    queue.unshift(entry)
  } else {
    seen.add(source)
    if (urgent) queue.unshift({ source, urgent })
    else queue.push({ source, urgent })
  }
  pump()
}

/** Steps aside while the gallery is open: it is loading what the visitor is looking at. */
export function pauseExpandedMediaWarming(nextPaused: boolean) {
  paused = nextPaused
  if (paused) current?.controller.abort()
  else pump()
}

export function startExpandedMediaWarming() {
  const begin = () => window.setTimeout(() => {
    started = true
    pump()
  }, startDelay)
  if (document.readyState === "complete") begin()
  else window.addEventListener("load", begin, { once: true })
}
