import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import { ExternalLink } from "lucide-react"

import { AboutPanel } from "./AboutPanel"
import { ContactActionRow } from "./ContactActionRow"
import { homeRows, type PortfolioCard, type SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"

type PreviewGalleryModule = typeof import("./PreviewGalleryDialog")

let galleryModulePromise: Promise<PreviewGalleryModule> | null = null
// Browsers cache failed module imports for the page lifetime. Keep the emitted
// chunk URL so a later interaction can retry it under a fresh module-map key.
let failedGalleryModuleUrl: string | null = null
let galleryRetryAttempt = 0

function findGalleryModuleUrl() {
  if (typeof performance === "undefined") return null
  const entries = performance.getEntriesByType("resource")
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const url = entries[index]?.name
    if (url?.includes("PreviewGalleryDialog")) return url
  }
  return null
}

function loadPreviewGallery() {
  if (galleryModulePromise) return galleryModulePromise

  let modulePromise: Promise<PreviewGalleryModule>
  if (failedGalleryModuleUrl) {
    const retryUrl = new URL(failedGalleryModuleUrl)
    retryUrl.searchParams.set("retry", String(++galleryRetryAttempt))
    failedGalleryModuleUrl = null
    modulePromise = import(/* @vite-ignore */ retryUrl.href) as Promise<PreviewGalleryModule>
  } else {
    modulePromise = import("./PreviewGalleryDialog")
  }

  galleryModulePromise = modulePromise.catch((error: unknown) => {
    galleryModulePromise = null
    failedGalleryModuleUrl = findGalleryModuleUrl()
    throw error
  })
  return galleryModulePromise
}

const PreviewGalleryDialog = lazy(() =>
  loadPreviewGallery().then((module) => ({ default: module.PreviewGalleryDialog })),
)

type SiteProfile = {
  name: string
  title: string
  photo: string
}

type SimpleFeedProps = {
  cards: PortfolioCard[]
  profile: SiteProfile
  links: SiteLinks
}

type RowFit = "cover" | "contain"

type RowVideoMediaProps = {
  source: string
  poster?: string
  label: string
  width?: number
  height?: number
  prefersReducedMotion: boolean
}

const puntaCanaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Santo_Domingo",
  timeZoneName: "short",
})

declare global {
  var __PRERENDERED_AT__: number | undefined
}

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

// Support never changes for the life of the document, so there is nothing to
// subscribe to.
const subscribeToNothing = () => () => {}
const hasIntersectionObserver = () => typeof window !== "undefined" && "IntersectionObserver" in window
// The server assumes support so the prerendered markup ships no video `src` and
// the mosaic stays lazy. A browser without it corrects on hydration, which is
// what useSyncExternalStore is for.
const hasIntersectionObserverOnServer = () => true

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
}

// Data Saver and 2g are the cases where an autoplaying loop is a liability
// rather than a flourish: the poster already carries the frame, and the videos
// are the heaviest thing on the page by a wide margin.
function prefersLightweightMedia() {
  if (typeof navigator === "undefined") return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (!connection) return false
  return (
    Boolean(connection.saveData) ||
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g"
  )
}

// The gallery is the point of the mosaic, but its chunk is the heaviest thing
// we ship after the media itself. Fetching it on intent -- a hover, or the
// pointerdown that precedes a tap -- keeps it off the initial load without
// making the click wait for it.
function prefetchPreviewGallery() {
  if (prefersLightweightMedia()) return
  void loadPreviewGallery().catch(() => undefined)
}

function RowVideoMedia({
  source,
  poster,
  label,
  width,
  height,
  prefersReducedMotion,
}: RowVideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const supportsIntersectionObserver = useSyncExternalStore(
    subscribeToNothing,
    hasIntersectionObserver,
    hasIntersectionObserverOnServer,
  )
  // Without a poster there is nothing to fall back to, so the video loads even
  // on a metered connection.
  const holdForLightweightMedia = Boolean(poster) && prefersLightweightMedia()
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // With no observer to flip the state, `src` would stay undefined for the whole
  // session and only the poster would ever show -- so fall back to loading up
  // front instead.
  const loadNow = shouldLoad || (!supportsIntersectionObserver && !holdForLightweightMedia)
  const visibleNow = isVisible || !supportsIntersectionObserver

  useEffect(() => {
    const video = videoRef.current
    if (!video || !supportsIntersectionObserver || holdForLightweightMedia) return

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          loadObserver.disconnect()
        }
      },
      { rootMargin: "400px 0px" },
    )
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )

    loadObserver.observe(video)
    visibilityObserver.observe(video)
    return () => {
      loadObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [holdForLightweightMedia, supportsIntersectionObserver])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!prefersReducedMotion && loadNow && visibleNow) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [loadNow, prefersReducedMotion, visibleNow])

  return (
    <video
      ref={videoRef}
      src={loadNow ? source : undefined}
      poster={poster}
      width={width}
      height={height}
      muted
      loop={!prefersReducedMotion}
      playsInline
      preload={loadNow && !prefersReducedMotion ? "metadata" : "none"}
      aria-label={label}
      className="mosaic-row-media"
      data-loaded={poster || loaded ? "true" : "false"}
      onLoadedData={() => setLoaded(true)}
    />
  )
}

// Each 1600x1200 shot-small source has `-480w`/`-960w` siblings generated next
// to it. Grid tiles render at most ~446 CSS px (measured at 1440px and wider,
// where the mosaic stops growing), so the full-size file is ~3.6x oversampled at
// 1x and ~1.8x at 2x. The gallery dialog keeps loading the original.
const previewVariantWidths = [480, 960]
const hasPreviewVariants = (source: string) => /_shot-small-\d+\.jpg$/.test(source)

// Measured tile widths: 317px at 390vw, 228px at 768, 393px at 1280, 446px at
// 1440 and up.
const previewSizes = "(max-width: 520px) 82vw, (max-width: 1400px) 31vw, 446px"

function buildPreviewSrcSet(source: string, intrinsicWidth?: number) {
  if (!hasPreviewVariants(source)) return undefined

  const stem = source.slice(0, -".jpg".length)
  const candidates = previewVariantWidths.map((width) => `${stem}-${width}w.jpg ${width}w`)
  if (intrinsicWidth) candidates.push(`${source} ${intrinsicWidth}w`)
  return candidates.join(", ")
}

type RowImageMediaProps = {
  source: string
  label: string
  width?: number
  height?: number
  eager: boolean
}

// Owns its own loaded flag on purpose. Hoisting it into SimpleFeed meant every
// one of the ~11 images re-rendered the entire mosaic when it decoded, which
// re-ran the row/tile tree eleven times during load.
function RowImageMedia({ source, label, width, height, eager }: RowImageMediaProps) {
  const [loaded, setLoaded] = useState(false)
  const srcSet = buildPreviewSrcSet(source, width)

  return (
    <img
      src={source}
      srcSet={srcSet}
      sizes={srcSet ? previewSizes : undefined}
      alt={label}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      className="mosaic-row-media"
      data-loaded={loaded ? "true" : "false"}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth > 0) setLoaded(true)
      }}
      ref={(el) => {
        // A cached image can finish before React attaches onLoad.
        if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
      }}
    />
  )
}

function defaultFitForCard(card: PortfolioCard): RowFit {
  const ratio = card.previewAspectRatio
  if (ratio == null) return "cover"
  return ratio > 1.45 || ratio < 0.82 ? "contain" : "cover"
}

function formatPuntaCanaLocalTime(date = new Date()) {
  return puntaCanaTimeFormatter.format(date).replace(/\s?([AP])M(?=\s|$)/, (_, meridiem: string) => `${meridiem.toLowerCase()}m`)
}

function openPreview(card: PortfolioCard, previewIndex: number, setSelectedWorkPreviewIndex: (value: number) => void) {
  trackEvent("work_preview_open", {
    preview_id: card.id,
    preview_title: card.title,
    preview_index: previewIndex + 1,
    preview_placement: "grid",
  })
  setSelectedWorkPreviewIndex(previewIndex)
}

function LiveTimeLabel({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  const [displayedLabel, setDisplayedLabel] = useState(label)
  const [incomingLabel, setIncomingLabel] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion || label === displayedLabel) return

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    const frameId = window.requestAnimationFrame(() => {
      setIncomingLabel(label)
      setIsAnimating(true)
      animationTimeoutRef.current = window.setTimeout(() => {
        setDisplayedLabel(label)
        setIncomingLabel(null)
        setIsAnimating(false)
        animationTimeoutRef.current = null
      }, 240)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }
    }
  }, [displayedLabel, label, reducedMotion])

  const resolvedLabel = reducedMotion ? label : displayedLabel
  const resolvedIncomingLabel = reducedMotion ? null : incomingLabel
  const resolvedAnimatingState = reducedMotion ? false : isAnimating

  return (
    // No aria-live: this is ambient info, and a live region would re-announce
    // the time to screen readers on every minute tick for the whole session.
    <span className={`mosaic-live-time ${resolvedAnimatingState ? "is-animating" : ""}`}>
      <span className="mosaic-live-time-track">
        <span className="mosaic-live-time-value mosaic-live-time-value-current">{resolvedLabel}</span>
        {resolvedIncomingLabel ? <span className="mosaic-live-time-value mosaic-live-time-value-next">{resolvedIncomingLabel}</span> : null}
      </span>
    </span>
  )
}

function SocialCorner({ links }: { links: SiteLinks }) {
  const socialLinks = [
    { label: "Download Resume", href: links.resumePdf, external: true },
  ]

  return (
    <nav className="mosaic-social-corner" aria-label="Social links">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          className="mosaic-social-link"
          onClick={() => {
            trackEvent("social_link_click", {
              social_label: link.label,
              social_href: link.href,
              social_placement: "top_corner",
            })
          }}
        >
          {link.label}
          {link.external ? (
            <ExternalLink
              className="mosaic-social-link-external-icon"
              size={12}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          ) : null}
        </a>
      ))}
    </nav>
  )
}

export function SimpleFeed({ cards, profile, links }: SimpleFeedProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)
  const [lastWorkPreviewIndex, setLastWorkPreviewIndex] = useState(0)
  const [hasOpenedWorkPreview, setHasOpenedWorkPreview] = useState(false)
  const previewCardNodesRef = useRef(new Map<number, HTMLButtonElement>())
  const firstHiddenWorkCardRef = useRef<HTMLButtonElement | null>(null)
  const shouldFocusRevealedWorkRef = useRef(false)
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() =>
    formatPuntaCanaLocalTime(new Date(globalThis.__PRERENDERED_AT__ ?? Date.now())),
  )
  const [hasCompletedWorkIntro, setHasCompletedWorkIntro] = useState(false)
  const [showAllWork, setShowAllWork] = useState(false)
  const rowsRender = useMemo(() => {
    let previewIndex = 0
    return homeRows.map((row) => {
      const items = row.items.flatMap((item) => {
        const card = cards.find((candidate) => candidate.id === item.cardId)
        if (!card) return []
        const currentIndex = previewIndex++
        return [
          {
            card,
            span: item.span ?? 1,
            width: item.width,
            fit: item.fit ?? defaultFitForCard(card),
            mediaMaxHeight: item.mediaMaxHeight,
            previewIndex: currentIndex,
          },
        ]
      })
      return { id: row.id, height: row.height, gap: row.gap, items }
    })
  }, [cards])

  const flatWorkCards = useMemo(
    () => rowsRender.flatMap((row) => row.items.map((item) => item.card)),
    [rowsRender],
  )
  const initiallyVisibleWorkCount = rowsRender[0]?.items.length ?? 0
  const hiddenWorkCount = Math.max(flatWorkCards.length - initiallyVisibleWorkCount, 0)
  const selectedWorkPreviewIndex = activeWorkPreviewIndex ?? Math.min(lastWorkPreviewIndex, Math.max(flatWorkCards.length - 1, 0))
  const setSelectedWorkPreviewIndex = (index: number) => {
    setLastWorkPreviewIndex(index)
    setActiveWorkPreviewIndex(index)
    setHasOpenedWorkPreview(true)
  }

  // The gallery grows out of (and shrinks back into) the card it represents, so
  // it needs that card's live geometry at open and close time.
  const getPreviewOriginRect = useCallback((index: number) => {
    const node = previewCardNodesRef.current.get(index)
    if (!node) return null

    const rect = node.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null

    // A card scrolled out of view would send the gallery flying off-screen, so
    // only anchor to cards the viewer can actually see.
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
    return onScreen ? rect : null
  }, [])

  const renderRowMedia = (
    card: PortfolioCard,
    source = card.image,
    label = card.title,
    eager = false,
  ) => {
    if (isVideoPreviewSource(source)) {
      return (
        <RowVideoMedia
          source={source}
          poster={card.previewPoster}
          label={label}
          width={card.previewWidth}
          height={card.previewHeight}
          prefersReducedMotion={prefersReducedMotion}
        />
      )
    }
    return (
      <RowImageMedia
        key={source}
        source={source}
        label={label}
        width={card.previewWidth}
        height={card.previewHeight}
        eager={eager}
      />
    )
  }

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
      // Reduced motion suppresses animationend, so retire the one-shot marker
      // here before a later preference change can start the intro mid-session.
      if (mediaQuery.matches) setHasCompletedWorkIntro(true)
    }
    syncPreference()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPreference)
      return () => mediaQuery.removeEventListener("change", syncPreference)
    }

    mediaQuery.addListener(syncPreference)
    return () => mediaQuery.removeListener(syncPreference)
  }, [])

  useEffect(() => {
    if (!showAllWork || !shouldFocusRevealedWorkRef.current) return

    shouldFocusRevealedWorkRef.current = false
    firstHiddenWorkCardRef.current?.focus()
  }, [showAllWork])

  useEffect(() => {
    let intervalId: number | undefined
    let timeoutId: number | undefined

    const updatePuntaCanaTime = () => {
      setPuntaCanaTimeLabel(formatPuntaCanaLocalTime())
    }

    updatePuntaCanaTime()
    const scheduleLiveUpdate = () => {
      const msUntilNextMinute = 60_000 - (Date.now() % 60_000)
      timeoutId = window.setTimeout(() => {
        updatePuntaCanaTime()
        intervalId = window.setInterval(updatePuntaCanaTime, 60_000)
      }, msUntilNextMinute)
    }

    scheduleLiveUpdate()

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  const scrollToAbout = () => {
    trackEvent("about_scroll", { about_scroll_trigger: "avatar" })
    const aboutPanel = document.getElementById("about-panel")
    if (!aboutPanel) return

    aboutPanel.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    aboutPanel.focus({ preventScroll: true })
  }

  return (
    <section className="mosaic-shell">
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <SocialCorner links={links} />
      <header id="about" className="mosaic-hero">
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div className="mosaic-profile-info">
            <button
              type="button"
              className="mosaic-avatar mosaic-avatar-coin mosaic-avatar-button"
              aria-label={`Read about ${profile.name}`}
              onClick={scrollToAbout}
            >
              <div className="mosaic-avatar-coin-inner">
                <img src={profile.photo} width="208" height="208" alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-front" loading="eager" decoding="async" />
                <img src={profile.photo} width="208" height="208" alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-back" loading="eager" decoding="async" />
              </div>
              <span className="mosaic-avatar-hint" aria-hidden="true">
                <svg
                  className="mosaic-avatar-hint-arrow"
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M33 5C23 4 11 7 4 15" />
                  <path d="M4 15 10.8 13.4M4 15 6.5 8.5" />
                </svg>
                <span className="mosaic-avatar-hint-label">read about me</span>
              </span>
            </button>
            <div className="mosaic-profile-meta">
              <h2>{profile.name}</h2>
              <p className="mosaic-profile-subtitle">{profile.title}</p>
            </div>
          </div>
          <WorkedWithCompaniesInline variant="profile" />
          <p className="mosaic-profile-location">
            Punta Cana & NYC <span aria-hidden="true">·</span> Local time:{" "}
            <LiveTimeLabel label={puntaCanaTimeLabel} reducedMotion={prefersReducedMotion} />
          </p>
          {/* One wrapper, one stagger slot: availability and the contact
              actions land together in the hero cascade. */}
          <div className="mosaic-profile-contact">
            <ContactActionRow
              email={links.email}
              contactHref={`mailto:${links.email}`}
              linkedinHref={links.linkedin}
              xHref={links.x}
            />
            <p className="mosaic-profile-availability">
              <span className="mosaic-availability-dot" aria-hidden="true" />
              Available for work
            </p>
          </div>
        </div>
      </header>

      <>
          <article id="work" className="mosaic-work">
              <h2 className="sr-only">Selected work</h2>
              {/* No `prefersReducedMotion` here on purpose: it is false on the
                  server and on the first client render, so a JS gate would flash
                  before the effect syncs. Reduced motion is handled in CSS. */}
              <div
                className={`mosaic-rows${hasCompletedWorkIntro ? "" : " mosaic-work-intro"}`}
                role="group"
                aria-label="Selected work previews"
                id="selected-work-previews"
                data-mobile-expanded={showAllWork}
              >
                {rowsRender.map((row, rowIndex) => {
                  const rowStyle = {
                    ...(row.height ? { "--row-height": row.height } : {}),
                    ...(row.gap ? { "--row-gap": row.gap } : {}),
                  } as CSSProperties
                  const eagerRow = rowIndex === 0
                  return (
                    <div
                      key={row.id}
                      className={`mosaic-row${rowIndex > 0 ? " mosaic-row-mobile-extra" : ""}`}
                      style={rowStyle}
                    >
                      {row.items.map((item, itemIndex) => {
                        const itemKey = `${item.card.id}-${item.previewIndex}`
                        const itemStyle = {
                          "--row-span": item.span,
                          // Feeds the first-load stagger in `.mosaic-work-intro`.
                          // Inert without that class, so set unconditionally.
                          "--work-intro-row": rowIndex,
                          "--work-intro-col": itemIndex,
                          ...(item.width ? { flex: `0 0 ${item.width}` } : {}),
                          ...(item.mediaMaxHeight ? { "--row-media-max-height": item.mediaMaxHeight } : {}),
                        } as CSSProperties
                        return (
                          <div
                            key={itemKey}
                            className={`mosaic-row-item mosaic-row-item-fit-${item.fit}`}
                            style={itemStyle}
                            onAnimationEnd={
                              rowIndex === rowsRender.length - 1 &&
                              itemIndex === row.items.length - 1
                                ? (event) => {
                                    if (event.target === event.currentTarget) {
                                      setHasCompletedWorkIntro(true)
                                    }
                                  }
                                : undefined
                            }
                          >
                            <button
                              type="button"
                              ref={(node) => {
                                const nodes = previewCardNodesRef.current
                                if (node) nodes.set(item.previewIndex, node)
                                else nodes.delete(item.previewIndex)
                                if (rowIndex === 1 && itemIndex === 0) {
                                  firstHiddenWorkCardRef.current = node
                                }
                              }}
                              className={`mosaic-row-card mosaic-row-card-${item.card.id}`}
                              onPointerEnter={prefetchPreviewGallery}
                              onPointerDown={prefetchPreviewGallery}
                              onFocus={prefetchPreviewGallery}
                              onClick={() => {
                                openPreview(item.card, item.previewIndex, setSelectedWorkPreviewIndex)
                              }}
                              aria-label={`Open ${item.card.title} preview ${item.previewIndex + 1} of ${flatWorkCards.length}`}
                            >
                              {renderRowMedia(item.card, item.card.image, item.card.title, eagerRow)}
                              <span className="mosaic-row-card-title" aria-hidden="true">
                                {item.card.title}
                              </span>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              {hiddenWorkCount > 0 ? (
                <button
                  type="button"
                  className="mosaic-work-reveal"
                  aria-controls="selected-work-previews"
                  aria-expanded={showAllWork}
                  onClick={(event) => {
                    shouldFocusRevealedWorkRef.current = event.detail === 0
                    setShowAllWork(true)
                    trackEvent("work_reveal", { hidden_work_count: hiddenWorkCount })
                  }}
                >
                  View {hiddenWorkCount} more projects
                </button>
              ) : null}
          </article>

          <AboutPanel links={links} />

          {/* Stays mounted after the first open so Base UI can run the close
              transition instead of the dialog vanishing on unmount. */}
          {hasOpenedWorkPreview && flatWorkCards.length > 0 ? (
            <Suspense fallback={null}>
              <PreviewGalleryDialog
                cards={flatWorkCards}
                open={activeWorkPreviewIndex != null}
                selectedIndex={selectedWorkPreviewIndex}
                prefersReducedMotion={prefersReducedMotion}
                getOriginRect={getPreviewOriginRect}
                onOpenChange={(nextOpen) => {
                  if (!nextOpen) {
                    setActiveWorkPreviewIndex(null)
                  }
                }}
                onSelectedIndexChange={setSelectedWorkPreviewIndex}
              />
            </Suspense>
          ) : null}
      </>
    </section>
  )
}
