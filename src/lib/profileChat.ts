import { visitorId } from "./likes"

export type ProfileChatRole = "user" | "assistant"

export type ProfileChatMessage = {
  id: string
  role: ProfileChatRole
  content: string
}

const apiUrl = import.meta.env.VITE_LIKES_API_URL?.replace(/\/$/, "")

export async function askProfileChat(
  email: string,
  messages: ProfileChatMessage[],
  signal: AbortSignal,
) {
  if (!apiUrl) throw new Error("The chat is unavailable right now.")
  const response = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Visitor-ID": visitorId(),
    },
    body: JSON.stringify({
      email,
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
    signal,
    cache: "no-store",
  })
  const value: unknown = await response.json().catch(() => null)
  if (!response.ok || !value || typeof value !== "object" || !("answer" in value)
    || typeof value.answer !== "string") {
    const message = value && typeof value === "object" && "error" in value && typeof value.error === "string"
      ? value.error
      : "The chat is unavailable right now."
    throw new Error(message)
  }
  return value.answer
}
