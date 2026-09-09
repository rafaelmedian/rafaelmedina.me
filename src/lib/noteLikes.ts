export type NoteLikes = { count: number; visitorLikes: number }
const apiUrl = import.meta.env.VITE_LIKES_API_URL?.replace(/\/$/, "")
const visitorStorageKey = "rafaelmedina:likes-visitor"
const visitorPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let sessionVisitorId: string | undefined

function visitorId() {
  if (sessionVisitorId) return sessionVisitorId
  try {
    const stored = localStorage.getItem(visitorStorageKey)
    if (stored && visitorPattern.test(stored)) return (sessionVisitorId = stored)
  } catch { /* Keep a session identity when storage is unavailable. */ }
  sessionVisitorId = crypto.randomUUID()
  try { localStorage.setItem(visitorStorageKey, sessionVisitorId) } catch { /* Session only. */ }
  return sessionVisitorId
}

export async function requestNoteLikes(noteId: string, signal: AbortSignal, increment?: number): Promise<NoteLikes> {
  if (!apiUrl) throw new Error("Likes are unavailable right now.")
  const response = await fetch(`${apiUrl}/notes/${encodeURIComponent(noteId)}/likes`, {
    method: increment === undefined ? "GET" : "PUT",
    headers: { "X-Visitor-ID": visitorId(), ...(increment === undefined ? {} : { "Content-Type": "application/json" }) },
    body: increment === undefined ? undefined : JSON.stringify({ increment }),
    signal,
    keepalive: increment !== undefined,
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Likes are unavailable right now.")
  const value: unknown = await response.json()
  if (!value || typeof value !== "object" || !("count" in value) || !("visitorLikes" in value)
    || !Number.isSafeInteger(value.count) || (value.count as number) < 0
    || !Number.isSafeInteger(value.visitorLikes) || (value.visitorLikes as number) < 0) {
    throw new Error("Likes are unavailable right now.")
  }
  return value as NoteLikes
}
