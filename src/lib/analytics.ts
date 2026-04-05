declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __analyticsStarted?: boolean
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const GOOGLE_TAG_SRC = "https://www.googletagmanager.com/gtag/js"

function isAnalyticsEnabled() {
  return typeof window !== "undefined" && typeof document !== "undefined" && Boolean(GA_MEASUREMENT_ID)
}

function ensureGoogleTagScript() {
  if (!GA_MEASUREMENT_ID) return

  const existingScript = document.querySelector<HTMLScriptElement>(`script[data-analytics-id="${GA_MEASUREMENT_ID}"]`)
  if (existingScript) return

  const script = document.createElement("script")
  script.async = true
  script.src = `${GOOGLE_TAG_SRC}?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
  script.dataset.analyticsId = GA_MEASUREMENT_ID
  document.head.appendChild(script)
}

function ensureGoogleTagClient() {
  if (!GA_MEASUREMENT_ID) return

  window.dataLayer = window.dataLayer ?? []
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  window.gtag("js", new Date())
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false,
  })
}

function getPageViewPayload() {
  return {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  }
}

export function trackEvent(eventName: string, params: Record<string, string | number | boolean | null | undefined> = {}) {
  if (!isAnalyticsEnabled() || !window.gtag) return
  window.gtag("event", eventName, params)
}

export function trackPageView() {
  trackEvent("page_view", getPageViewPayload())
}

function trackLinkClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return

  const anchor = target.closest("a")
  if (!(anchor instanceof HTMLAnchorElement)) return

  const href = anchor.getAttribute("href")
  if (!href) return

  const absoluteUrl = anchor.href || href
  const isMailtoLink = href.startsWith("mailto:")
  const isDownloadLink = anchor.hasAttribute("download")
  const isHashLink = href.startsWith("#")
  const sameOrigin = absoluteUrl.startsWith(window.location.origin)
  const isOutboundLink = !sameOrigin && !isMailtoLink && !isHashLink

  if (!isMailtoLink && !isDownloadLink && !isOutboundLink) return

  const linkText = anchor.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || undefined

  trackEvent("click", {
    link_type: isMailtoLink ? "mailto" : isDownloadLink ? "download" : "outbound",
    link_url: absoluteUrl,
    link_text: linkText,
  })
}

function attachAnalyticsListeners() {
  window.addEventListener("popstate", trackPageView)
  window.addEventListener("hashchange", trackPageView)
  document.addEventListener("click", trackLinkClick)
}

export function startAnalytics() {
  if (!isAnalyticsEnabled() || window.__analyticsStarted) return

  ensureGoogleTagScript()
  ensureGoogleTagClient()
  attachAnalyticsListeners()
  trackPageView()
  window.__analyticsStarted = true
}
