type ClarityClient = {
  (...args: unknown[]): void
  q?: IArguments[]
}

declare global {
  interface Window {
    clarity?: ClarityClient
  }
}

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim()

export function startClarity() {
  if (!CLARITY_PROJECT_ID || typeof window === "undefined" || typeof document === "undefined") return
  if (document.querySelector("script[data-clarity]")) return

  // Preserve Clarity's standard queue until its asynchronous tracker arrives.
  window.clarity ??= function () {
    const client = window.clarity!
    client.q ??= []
    // eslint-disable-next-line prefer-rest-params
    client.q.push(arguments)
  }

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`
  script.dataset.clarity = CLARITY_PROJECT_ID
  document.head.appendChild(script)
}
