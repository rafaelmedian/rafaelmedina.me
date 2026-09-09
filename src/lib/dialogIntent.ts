type DialogDestination = "writing" | "photos" | "gallery" | "about" | "booking"

let latestIntent = 0
const listeners = new Set<(destination: DialogDestination) => void>()

// Downloads may finish after another dialog was selected. Keep the module
// cached, but only let the most recent activation open its deferred reader.
export function beginDialogIntent(destination: DialogDestination) {
  const intent = ++latestIntent
  listeners.forEach(listener => listener(destination))
  return () => intent === latestIntent
}

export function subscribeDialogIntent(listener: (destination: DialogDestination) => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

if (typeof window !== "undefined") {
  // History supplies its own destination, including any newly selected note.
  window.addEventListener("popstate", () => { latestIntent += 1 })
}
