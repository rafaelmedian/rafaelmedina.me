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

let scheduled = false

export function startClarity() {
  if (!CLARITY_PROJECT_ID || typeof window === "undefined" || typeof document === "undefined") return
  if (scheduled || document.querySelector("script[data-clarity]")) return
  scheduled = true

  // Preserve Clarity's standard queue until its asynchronous tracker arrives.
  window.clarity ??= function () {
    const client = window.clarity!
    client.q ??= []
    // eslint-disable-next-line prefer-rest-params
    client.q.push(arguments)
  }

  // Keep the standard queue available immediately, but let critical content
  // finish before the recorder downloads and starts observing the document.
  const inject = () => {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`
    script.dataset.clarity = CLARITY_PROJECT_ID
    document.head.appendChild(script)
  }
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(inject, { timeout: 4000 })
    else window.setTimeout(inject, 1500)
  }
  if (document.readyState === "complete") schedule()
  else window.addEventListener("load", schedule, { once: true })
}
