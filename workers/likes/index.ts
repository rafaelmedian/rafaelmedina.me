import type { D1Database } from "@cloudflare/workers-types"
import { maxNoteLikesPerVisitor } from "../../src/data/likeLimits"
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
      SELECT COALESCE(SUM(count), 0) AS count,
             COALESCE((SELECT count FROM note_likes WHERE note_id = ?1 AND visitor_id = ?2), 0) AS visitorLikes
      FROM note_likes WHERE note_id = ?1
    `).bind(noteId, visitorId)
    try {
      let row: { count: number; visitorLikes: number } | null
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
        if (!data || typeof data !== "object") return json({ error: "Expected like payload" }, 400)
        let mutation
        if ("increment" in data) {
          if (!Number.isSafeInteger(data.increment) || (data.increment as number) < 1
            || (data.increment as number) > maxNoteLikesPerVisitor) {
            return json({ error: `Expected increment between 1 and ${maxNoteLikesPerVisitor}` }, 400)
          }
          // Clamp atomically even when simultaneous tabs submit increments.
          mutation = env.DB.prepare(`
            INSERT INTO note_likes (note_id, visitor_id, count) VALUES (?1, ?2, MIN(?3, ?4))
            ON CONFLICT(note_id, visitor_id) DO UPDATE SET count = MIN(count + ?3, ?4)
          `).bind(noteId, visitorId, data.increment, maxNoteLikesPerVisitor)
        } else if ("liked" in data && typeof data.liked === "boolean") {
          // The Worker deploys before the site; already-open tabs keep this
          // toggle contract. Repeated true writes preserve any accumulated taps.
          mutation = data.liked
            ? env.DB.prepare("INSERT OR IGNORE INTO note_likes (note_id, visitor_id) VALUES (?, ?)").bind(noteId, visitorId)
            : env.DB.prepare("DELETE FROM note_likes WHERE note_id = ? AND visitor_id = ?").bind(noteId, visitorId)
        } else {
          return json({ error: "Expected increment or liked boolean" }, 400)
        }
        const results = await env.DB.batch([mutation, summary])
        row = results[1].results[0] as { count: number; visitorLikes: number }
      } else {
        row = await summary.first<{ count: number; visitorLikes: number }>()
      }
      if (!row) throw new Error("Missing likes summary")
      return json({ count: row.count, visitorLikes: row.visitorLikes, liked: row.visitorLikes > 0 })
    } catch {
      return json({ error: "Likes are temporarily unavailable" }, 503)
    }
  },
}
