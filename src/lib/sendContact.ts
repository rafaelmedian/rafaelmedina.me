export type ContactMessage = { email: string; message: string; requestId: string }

export async function sendContact(payload: ContactMessage): Promise<void> {
  const endpoint = import.meta.env.VITE_CONTACT_API_URL ||
    (import.meta.env.DEV ? "http://127.0.0.1:8788/contact" : "")
  if (!endpoint) throw new Error("Email delivery is not connected yet. Please try again later.")
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error("Couldn't connect. Your message is still here; please retry.")
  }
  const result = await response.json().catch(() => null) as { sent?: boolean; error?: string } | null
  if (!response.ok || result?.sent !== true) {
    throw new Error(result?.error || "Couldn't send just now. Please retry.")
  }
}
