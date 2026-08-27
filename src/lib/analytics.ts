declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __analyticsStarted?: boolean
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const GOOGLE_TAG_SRC = "https://www.googletagmanager.com/gtag/js"

function isBrowserAnalyticsContext() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function isGoogleAnalyticsEnabled() {
  return isBrowserAnalyticsContext() && Boolean(GA_MEASUREMENT_ID)
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
    // Must push the `arguments` object, not a rest-param array. gtag.js only
    // treats `[object Arguments]` entries in dataLayer as commands; a plain
    // array is read as a generic dataLayer push and silently ignored, so
    // nothing is ever sent to Google.
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
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

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  if (!isGoogleAnalyticsEnabled() || !window.gtag) return
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

// gtag.js is ~90 KB gzipped and evaluates on arrival, so injecting it at
// startup competes with hydration and the LCP images on slow connections.
// The stub client queues every gtag() call in dataLayer until the script
// arrives, so nothing recorded before then is lost.
function scheduleGoogleTagScript() {
  const inject = () => {
    if (typeof window.requestIdleCallback === "function")
      window.requestIdleCallback(() => ensureGoogleTagScript(), { timeout: 4000 })
    else window.setTimeout(ensureGoogleTagScript, 1500)
  }

  if (document.readyState === "complete") inject()
  else window.addEventListener("load", inject, { once: true })
}

export function startAnalytics() {
  if (!isGoogleAnalyticsEnabled() || window.__analyticsStarted) return

  ensureGoogleTagClient()
  attachAnalyticsListeners()
  trackPageView()
  scheduleGoogleTagScript()
  window.__analyticsStarted = true
}
