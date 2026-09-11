import type { RateLimit } from "@cloudflare/workers-types"

export type ContactEnv = {
  ALLOWED_ORIGINS: string
  CONTACT_TO: string
  CONTACT_FROM?: string
  RESEND_API_KEY?: string
  CONTACT_LIMITER: RateLimit
}

const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/
const requestIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default {
  async fetch(request: Request, env: ContactEnv): Promise<Response> {
    const origin = request.headers.get("Origin") ?? ""
    const allowed = env.ALLOWED_ORIGINS.split(",").includes(origin)
    const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin" })
    if (allowed) {
      headers.set("Access-Control-Allow-Origin", origin)
      headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
      headers.set("Access-Control-Allow-Headers", "Content-Type")
    }
    const json = (body: unknown, status = 200) => Response.json(body, { status, headers })
    const path = new URL(request.url).pathname
    if (path === "/health" && request.method === "GET") return json({ ok: true })
    if (!allowed) return json({ error: "Origin not allowed" }, 403)
    if (path !== "/contact") return json({ error: "Not found" }, 404)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers })
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405)
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) return json({ error: "Expected JSON" }, 415)
    const reader = request.body?.getReader()
    if (!reader) return json({ error: "Missing message" }, 400)
    let body = ""
    let bytes = 0
    const decoder = new TextDecoder()
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      bytes += chunk.value.byteLength
      if (bytes > 12000) { await reader.cancel(); return json({ error: "Message too large" }, 413) }
      body += decoder.decode(chunk.value, { stream: true })
    }
    body += decoder.decode()
    let data: unknown
    try { data = JSON.parse(body) } catch { return json({ error: "Invalid message" }, 400) }
    if (!data || typeof data !== "object") return json({ error: "Invalid message" }, 400)
    const { email, message, requestId } = data as Record<string, unknown>
    if (typeof email !== "string" || email.length > 254 || !emailPattern.test(email.trim()) ||
        typeof message !== "string" || message.length > 2000 ||
        typeof requestId !== "string" || !requestIdPattern.test(requestId)) {
      return json({ error: "Check your email and message" }, 400)
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) {
      return json({ error: "Email delivery is not connected yet. Please try again later." }, 503)
    }
    try {
      // Anonymous form: a small per-IP limit protects the fixed recipient.
      const { success } = await env.CONTACT_LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") ?? "local" })
      if (!success) return json({ error: "Please wait a minute before trying again." }, 429)
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `website-contact/${requestId}`,
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: [env.CONTACT_TO],
          reply_to: email.trim(),
          subject: "A hello from your website",
          text: `Reply to: ${email.trim()}\n\n${message.trim() || "Hi Rafa, I’d like to keep in touch."}`,
        }),
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) return json({ error: "Couldn't send just now. Your message is saved here; please retry." }, 502)
      const result = await response.json() as { id?: string }
      if (!result.id) return json({ error: "Couldn't confirm delivery. Please retry." }, 502)
      return json({ sent: true }, 202)
    } catch {
      return json({ error: "Couldn't send just now. Your message is saved here; please retry." }, 502)
    }
  },
}
