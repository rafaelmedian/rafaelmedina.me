import { track as trackVercelAnalyticsEvent } from "@vercel/analytics"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __analyticsStarted?: boolean
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const VERCEL_ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === "true"
const VERCEL_ANALYTICS_BASEPATH = import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH?.trim()
const VERCEL_ANALYTICS_CLIENT_CONFIG = import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG?.trim()
const GOOGLE_TAG_SRC = "https://www.googletagmanager.com/gtag/js"

function isBrowserAnalyticsContext() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function isGoogleAnalyticsEnabled() {
  return isBrowserAnalyticsContext() && Boolean(GA_MEASUREMENT_ID)
}

export function shouldEnableVercelAnalytics() {
  return Boolean(VERCEL_ANALYTICS_ENABLED || VERCEL_ANALYTICS_BASEPATH || VERCEL_ANALYTICS_CLIENT_CONFIG)
}

function hasClientEventTracking() {
  return isBrowserAnalyticsContext() && (isGoogleAnalyticsEnabled() || shouldEnableVercelAnalytics())
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

function trackGoogleAnalyticsEvent(
  eventName: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  if (!isGoogleAnalyticsEnabled() || !window.gtag) return
  window.gtag("event", eventName, params)
}

export function trackEvent(eventName: string, params: Record<string, string | number | boolean | null | undefined> = {}) {
  trackGoogleAnalyticsEvent(eventName, params)

  if (!shouldEnableVercelAnalytics()) return
  trackVercelAnalyticsEvent(eventName, params)
}

export function trackPageView() {
  trackGoogleAnalyticsEvent("page_view", getPageViewPayload())
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
  if (!hasClientEventTracking() || window.__analyticsStarted) return

  if (isGoogleAnalyticsEnabled()) {
    ensureGoogleTagScript()
    ensureGoogleTagClient()
  }
  attachAnalyticsListeners()
  if (isGoogleAnalyticsEnabled()) {
    trackPageView()
  }
  window.__analyticsStarted = true
}
