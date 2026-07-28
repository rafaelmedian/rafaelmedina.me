import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react"

import { AboutPanel } from "./AboutPanel"
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
  intro: string
  previouslyLabel?: string
  previouslyText?: string
  nowLabel?: string
  nowText?: string
  availability: string
  contactLabel: string
  contactHref: string
  photo: string
}

type SimpleFeedProps = {
  cards: PortfolioCard[]
  profile: SiteProfile
  links: SiteLinks
  showProjects?: boolean
}

type RowFit = "cover" | "contain"

type RowVideoMediaProps = {
  source: string
  poster?: string
  label: string
  width?: number
  height?: number
  prefersReducedMotion: boolean
  loaded: boolean
  onLoaded: () => void
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
  loaded,
  onLoaded,
}: RowVideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const supportsIntersectionObserver = typeof window !== "undefined" && "IntersectionObserver" in window
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  // Without a poster there is nothing to fall back to, so the video loads even
  // on a metered connection.
  const holdForLightweightMedia = Boolean(poster) && prefersLightweightMedia()

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

    if (!prefersReducedMotion && shouldLoad && isVisible) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [isVisible, prefersReducedMotion, shouldLoad])

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? source : undefined}
      poster={poster}
      width={width}
      height={height}
      muted
      loop={!prefersReducedMotion}
      playsInline
      preload={shouldLoad && !prefersReducedMotion ? "metadata" : "none"}
      aria-label={label}
      className="mosaic-row-media"
      data-loaded={poster || loaded ? "true" : "false"}
      onLoadedData={onLoaded}
    />
  )
}

function defaultFitForCard(card: PortfolioCard): RowFit {
  if (card.id === "preview-shot-20") return "contain"
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

function getPaginationTotal(card: PortfolioCard) {
  return card.pagination && card.pagination.total > 1 ? card.pagination.total : 0
}

function getPaginationImage(card: PortfolioCard, screenIndex: number) {
  const images = card.pagination?.images ?? []
  if (images.length === 0) return card.image
  return images[screenIndex] ?? images[screenIndex % images.length] ?? card.image
}

function paginatePreviewCard(
  card: PortfolioCard,
  currentScreenIndex: number,
  paginationTotal: number,
  setPaginatedPreviewIndexes: Dispatch<SetStateAction<Record<string, number>>>,
) {
  const nextScreenIndex = (currentScreenIndex + 1) % paginationTotal

  trackEvent("work_preview_paginate", {
    preview_id: card.id,
    preview_title: card.title,
    preview_screen_index: nextScreenIndex + 1,
    preview_screen_total: paginationTotal,
    preview_placement: "grid",
  })

  setPaginatedPreviewIndexes((current) => ({
    ...current,
    [card.id]: ((current[card.id] ?? currentScreenIndex) + 1) % paginationTotal,
  }))
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
    <span className={`mosaic-live-time ${resolvedAnimatingState ? "is-animating" : ""}`} aria-live="polite" aria-atomic="true">
      <span className="mosaic-live-time-track">
        <span className="mosaic-live-time-value mosaic-live-time-value-current">{resolvedLabel}</span>
        {resolvedIncomingLabel ? <span className="mosaic-live-time-value mosaic-live-time-value-next">{resolvedIncomingLabel}</span> : null}
      </span>
    </span>
  )
}

function SocialCorner({ links }: { links: SiteLinks }) {
  const socialLinks = [
    { label: "X.com", href: links.x, external: true },
    { label: "Telegram", href: links.telegram, external: true },
    { label: "Email", href: `mailto:${links.email}`, external: false },
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
        </a>
      ))}
    </nav>
  )
}

export function SimpleFeed({ cards, profile, links, showProjects = true }: SimpleFeedProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)
  const [lastWorkPreviewIndex, setLastWorkPreviewIndex] = useState(0)
  const [hasOpenedWorkPreview, setHasOpenedWorkPreview] = useState(false)
  const previewCardNodesRef = useRef(new Map<number, HTMLButtonElement>())
  const [paginatedPreviewIndexes, setPaginatedPreviewIndexes] = useState<Record<string, number>>({})
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() =>
    formatPuntaCanaLocalTime(new Date(globalThis.__PRERENDERED_AT__ ?? Date.now())),
  )
  const [view, setView] = useState<"work" | "about">("work")
  const [isSwapping, setIsSwapping] = useState(false)
  // The swap animation is for swaps only. On first paint the work rows are
  // already there, and animating them would fight the hero intro and leave the
  // mosaic mid-scale for anything measuring it.
  const [hasSwapped, setHasSwapped] = useState(false)
  const swapTimeoutRef = useRef<number | null>(null)
  const avatarRef = useRef<HTMLButtonElement | null>(null)
  const [loadedSources, setLoadedSources] = useState<Set<string>>(() => new Set())
  const markLoaded = (src: string) =>
    setLoadedSources((prev) => (prev.has(src) ? prev : new Set(prev).add(src)))
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

  const shellClassName = `mosaic-shell${showProjects ? "" : " mosaic-shell-hero-only"}`
  const heroClassName = `mosaic-hero${showProjects ? "" : " mosaic-hero-hero-only"}`

  const renderRowMedia = (
    card: PortfolioCard,
    source = card.image,
    label = card.title,
    eager = false,
  ) => {
    const dataLoaded = loadedSources.has(source) ? "true" : "false"
    if (isVideoPreviewSource(source)) {
      return (
        <RowVideoMedia
          source={source}
          poster={card.previewPoster}
          label={label}
          width={card.previewWidth}
          height={card.previewHeight}
          prefersReducedMotion={prefersReducedMotion}
          loaded={dataLoaded === "true"}
          onLoaded={() => markLoaded(source)}
        />
      )
    }
    return (
      <img
        key={source}
        src={source}
        alt={label}
        width={card.previewWidth}
        height={card.previewHeight}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        className="mosaic-row-media"
        data-loaded={dataLoaded}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth > 0) markLoaded(source)
        }}
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0) markLoaded(source)
        }}
      />
    )
  }

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)
    syncPreference()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPreference)
      return () => mediaQuery.removeEventListener("change", syncPreference)
    }

    mediaQuery.addListener(syncPreference)
    return () => mediaQuery.removeListener(syncPreference)
  }, [])

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

  useEffect(() => {
    return () => {
      if (swapTimeoutRef.current !== null) window.clearTimeout(swapTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (view !== "about") return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") swapView("work")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- swapView is redeclared each render
  }, [view, prefersReducedMotion])

  function swapView(nextView: "work" | "about") {
    if (nextView === view) return

    trackEvent("hero_view_change", { hero_view: nextView, hero_view_trigger: "avatar" })

    // Closing from inside the panel (its back button, or Escape) unmounts
    // whatever had focus, so hand it back to the photo that opened it.
    const focusLeavesWithPanel =
      nextView === "work" &&
      document.activeElement instanceof Node &&
      (document.getElementById("about-panel")?.contains(document.activeElement) ?? false)
    const restoreFocus = () => {
      if (focusLeavesWithPanel) avatarRef.current?.focus()
    }

    if (prefersReducedMotion) {
      setView(nextView)
      restoreFocus()
      return
    }

    setHasSwapped(true)
    if (swapTimeoutRef.current !== null) window.clearTimeout(swapTimeoutRef.current)
    setIsSwapping(true)
    swapTimeoutRef.current = window.setTimeout(() => {
      setView(nextView)
      setIsSwapping(false)
      swapTimeoutRef.current = null
      restoreFocus()
    }, 170)
  }

  const isAboutView = view === "about"

  return (
    <section className={shellClassName}>
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <SocialCorner links={links} />
      <header id="about" className={heroClassName}>
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div className="mosaic-profile-info">
            <button
              ref={avatarRef}
              type="button"
              className={`mosaic-avatar mosaic-avatar-coin mosaic-avatar-button${isAboutView ? " is-flipped" : ""}`}
              aria-expanded={isAboutView}
              aria-controls={isAboutView ? "about-panel" : undefined}
              aria-label={isAboutView ? "Back to selected work" : `Read about ${profile.name}`}
              onClick={() => swapView(isAboutView ? "work" : "about")}
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
                <span className="mosaic-avatar-hint-label">
                  {isAboutView ? "go back" : "read about me"}
                </span>
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
        </div>
      </header>

      {showProjects ? (
        <>
          <div
            key={view}
            className={`mosaic-view${isSwapping ? " is-leaving" : ""}${
              hasSwapped && !prefersReducedMotion ? " mosaic-view-animated" : ""
            }`}
          >
          {isAboutView ? (
            <AboutPanel links={links} onClose={() => swapView("work")} />
          ) : (
            <article id="work" className="mosaic-work">
              <h2 className="sr-only">Selected work</h2>
              <div className="mosaic-rows" aria-label="Selected work previews">
                {rowsRender.map((row, rowIndex) => {
                  const rowStyle = {
                    ...(row.height ? { "--row-height": row.height } : {}),
                    ...(row.gap ? { "--row-gap": row.gap } : {}),
                  } as CSSProperties
                  const eagerRow = rowIndex === 0
                  return (
                    <div key={row.id} className="mosaic-row" style={rowStyle}>
                      {row.items.map((item) => {
                        const itemKey = `${item.card.id}-${item.previewIndex}`
                        const paginationTotal = getPaginationTotal(item.card)
                        const isPaginatedCard = paginationTotal > 1
                        const paginationScreenIndex = isPaginatedCard
                          ? (paginatedPreviewIndexes[item.card.id] ?? 0) % paginationTotal
                          : 0
                        const mediaSource = isPaginatedCard ? getPaginationImage(item.card, paginationScreenIndex) : item.card.image
                        const mediaLabel = isPaginatedCard
                          ? `${item.card.title} screen ${paginationScreenIndex + 1} of ${paginationTotal}`
                          : item.card.title
                        const itemStyle = {
                          "--row-span": item.span,
                          ...(item.width ? { flex: `0 0 ${item.width}` } : {}),
                          ...(item.mediaMaxHeight ? { "--row-media-max-height": item.mediaMaxHeight } : {}),
                        } as CSSProperties
                        return (
                          <div
                            key={itemKey}
                            className={`mosaic-row-item mosaic-row-item-fit-${item.fit}`}
                            style={itemStyle}
                          >
                            <button
                              type="button"
                              ref={(node) => {
                                const nodes = previewCardNodesRef.current
                                if (node) nodes.set(item.previewIndex, node)
                                else nodes.delete(item.previewIndex)
                              }}
                              className={`mosaic-row-card mosaic-row-card-${item.card.id}${isPaginatedCard ? " mosaic-row-card-paginated" : ""}`}
                              onPointerEnter={isPaginatedCard ? undefined : prefetchPreviewGallery}
                              onPointerDown={isPaginatedCard ? undefined : prefetchPreviewGallery}
                              onFocus={isPaginatedCard ? undefined : prefetchPreviewGallery}
                              onClick={() => {
                                if (isPaginatedCard) {
                                  paginatePreviewCard(
                                    item.card,
                                    paginationScreenIndex,
                                    paginationTotal,
                                    setPaginatedPreviewIndexes,
                                  )
                                  return
                                }

                                openPreview(item.card, item.previewIndex, setSelectedWorkPreviewIndex)
                              }}
                              aria-label={
                                isPaginatedCard
                                  ? `Show next ${item.card.title} screen, currently screen ${paginationScreenIndex + 1} of ${paginationTotal}`
                                  : `Open ${item.card.title} preview ${item.previewIndex + 1} of ${flatWorkCards.length}`
                              }
                            >
                              {renderRowMedia(item.card, mediaSource, mediaLabel, eagerRow)}
                              <span className="mosaic-row-card-title" aria-hidden="true">
                                {item.card.title}
                              </span>
                              {isPaginatedCard ? (
                                <span className="mosaic-row-card-pagination" aria-hidden="true">
                                  {Array.from({ length: paginationTotal }).map((_, dotIndex) => (
                                    <span
                                      key={`${item.card.id}-pagination-${dotIndex}`}
                                      className={`mosaic-row-card-pagination-dot${dotIndex === paginationScreenIndex ? " is-active" : ""}`}
                                    />
                                  ))}
                                </span>
                              ) : null}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </article>
          )}
          </div>

          {/* Outside the swap wrapper: while that wrapper is mid-animation it has
              a transform, which would become the containing block for the
              dialog's fixed positioning. Stays mounted after the first open so
              Base UI can run the close transition instead of the dialog
              vanishing on unmount. */}
          {!isAboutView && hasOpenedWorkPreview && flatWorkCards.length > 0 ? (
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
      ) : null}
    </section>
  )
}
