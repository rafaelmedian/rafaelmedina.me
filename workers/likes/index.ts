import type { D1Database } from "@cloudflare/workers-types"
import { writingIds } from "../../src/data/writingIds"

type Env = { DB: D1Database; ALLOWED_ORIGINS: string }
const noteIds = new Set<string>(writingIds)
const visitorPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? ""
    const allowed = env.ALLOWED_ORIGINS.split(",").includes(origin)
    const headers = new Headers({ "Cache-Control": "no-store", "Vary": "Origin" })
    if (allowed) {
      headers.set("Access-Control-Allow-Origin", origin)
      headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
      headers.set("Access-Control-Allow-Headers", "Content-Type, X-Visitor-ID")
    }
    const json = (body: unknown, status = 200) => Response.json(body, { status, headers })
    const path = new URL(request.url).pathname
    if (path === "/health" && request.method === "GET") return json({ ok: true })
    if (!allowed) return json({ error: "Origin not allowed" }, 403)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers })
    const match = /^\/notes\/([a-z0-9-]+)\/likes$/.exec(path)
    if (!match || !noteIds.has(match[1])) return json({ error: "Note not found" }, 404)
    if (!["GET", "PUT"].includes(request.method)) return json({ error: "Method not allowed" }, 405)
    const visitorId = request.headers.get("X-Visitor-ID") ?? ""
    if (!visitorPattern.test(visitorId)) return json({ error: "Invalid visitor" }, 400)
    const noteId = match[1]
    const summary = env.DB.prepare(`
      SELECT COUNT(*) AS count,
             COALESCE(MAX(visitor_id = ?), 0) AS liked
      FROM note_likes WHERE note_id = ?
    `).bind(visitorId, noteId)
    try {
      let row: { count: number; liked: number } | null
      if (request.method === "PUT") {
        if (!request.headers.get("Content-Type")?.startsWith("application/json")) return json({ error: "Expected JSON" }, 415)
        // Read at most a small JSON body before parsing it.
        const reader = request.body?.getReader()
        if (!reader) return json({ error: "Missing body" }, 400)
        let body = ""
        let bytes = 0
        const decoder = new TextDecoder()
        while (true) {
          const chunk = await reader.read()
          if (chunk.done) break
          bytes += chunk.value.byteLength
          if (bytes > 256) { await reader.cancel(); return json({ error: "Body too large" }, 413) }
          body += decoder.decode(chunk.value, { stream: true })
        }
        body += decoder.decode()
        let data: unknown
        try { data = JSON.parse(body) } catch { return json({ error: "Invalid JSON" }, 400) }
        if (!data || typeof data !== "object" || !("liked" in data) || typeof data.liked !== "boolean") return json({ error: "Expected liked boolean" }, 400)
        const mutation = data.liked
          ? env.DB.prepare("INSERT OR IGNORE INTO note_likes (note_id, visitor_id) VALUES (?, ?)")
          : env.DB.prepare("DELETE FROM note_likes WHERE note_id = ? AND visitor_id = ?")
        // The unique key makes retries safe; the transaction returns the saved total.
        const results = await env.DB.batch([mutation.bind(noteId, visitorId), summary])
        row = results[1].results[0] as { count: number; liked: number }
      } else {
        row = await summary.first<{ count: number; liked: number }>()
      }
      if (!row) throw new Error("Missing likes summary")
      return json({ count: row.count, liked: Boolean(row.liked) })
    } catch {
      return json({ error: "Likes are temporarily unavailable" }, 503)
    }
  },
}
