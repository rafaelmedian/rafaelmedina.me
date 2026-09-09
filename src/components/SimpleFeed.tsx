import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react"
import { ExternalLink, X } from "lucide-react"

import { AboutPanel } from "./AboutPanel"
import { AvailabilityBooking } from "./AvailabilityBooking"
import { WritingsFolder, type WritingsFolderHandle } from "./WritingsFolder"
import { ContactActionRow } from "./ContactActionRow"
import { MobileTableOfContents } from "./MobileTableOfContents"
import { QuoteCard } from "./QuoteCard"
import { portfolioQuotes } from "../data/quotes"
import { homeRows, linkedinHoverMedia, xProfilePreview, type PortfolioCard, type SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
import { formatAvailability } from "../lib/availability"
import { useHoverCard } from "../lib/hoverCard"
import { visibleOriginRect } from "../lib/originMotion"
import { buildPreviewSrcSet, isVideoSource, previewSizesForShare } from "../lib/media"
import { prefersLightweightMedia, useLightweightMedia } from "../lib/useLightweightMedia"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { useAvatarIntro } from "../lib/useAvatarIntro"
import { closePortfolioUrl, pushPortfolioUrl, useProjectUrl } from "../lib/useProjectUrl"
import { projectPath } from "../lib/projectMetadata"
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

// React caches a lazy component's rejection forever, so a retry needs a fresh
// component identity — each call hands back a new one over the same
// loadPreviewGallery, whose own bookkeeping cache-busts the failed chunk URL.
function createPreviewGalleryComponent() {
  return lazy(() => loadPreviewGallery().then((module) => ({ default: module.PreviewGalleryDialog })))
}

type GalleryLoadBoundaryProps = {
  onLoadError: () => void
  children: ReactNode
}

// Without this, a chunk that 404s at click time (a tab held open across a
// redeploy) throws out of the lazy dialog's render and unmounts the whole app.
// Swallow the failure and let the parent reset, so the feed survives and the
// next click retries the load.
class GalleryLoadBoundary extends Component<GalleryLoadBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onLoadError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function PuntaCanaMapScreenshot() {
  return (
    <img
      className="mosaic-local-time-map-screenshot"
      src="/maps/punta-cana-openstreetmap.webp"
      alt="OpenStreetMap screenshot of Punta Cana, Dominican Republic"
      width="696"
      height="320"
      loading="lazy"
      decoding="async"
    />
  )
}

function FailedPuntaCanaMap() {
  return <PuntaCanaMapScreenshot />
}

const PuntaCanaMap = lazy(async () => {
  try {
    const module = await import("./PuntaCanaMap")
    return { default: module.PuntaCanaMap }
  } catch {
    return { default: FailedPuntaCanaMap }
  }
})

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
  pausePlayback: boolean
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

// Support never changes for the life of the document, so there is nothing to
// subscribe to.
const subscribeToNothing = () => () => {}
const hasIntersectionObserver = () => typeof window !== "undefined" && "IntersectionObserver" in window
// The server assumes support so the prerendered markup ships no video `src` and
// the mosaic stays lazy. A browser without it corrects on hydration, which is
// what useSyncExternalStore is for.
const hasIntersectionObserverOnServer = () => true

// Intersection with the viewport cannot say whether the pinned grid is
// *occluded*, only whether it is on screen — and during the takeover it is
// both. What can be measured is the About sheet against a zero-height line at
// the viewport's top edge: the sheet straddles that line exactly while it
// spans the whole viewport, which is when the grid behind it is fully hidden
// and its videos can rest. One shared observer feeds every video through
// useSyncExternalStore, so a crossing re-renders only the handful of video
// elements rather than the whole feed at the exact moment raster headroom is
// scarcest.
let galleryCoveredValue = false
let galleryCoveredObserver: IntersectionObserver | null = null
const galleryCoveredListeners = new Set<() => void>()

function subscribeToGalleryCovered(listener: () => void) {
  galleryCoveredListeners.add(listener)

  if (!galleryCoveredObserver && "IntersectionObserver" in window) {
    const aboutPanel = document.getElementById("about-panel")
    if (aboutPanel) {
      galleryCoveredObserver = new IntersectionObserver(
        ([entry]) => {
          galleryCoveredValue = entry.isIntersecting
          galleryCoveredListeners.forEach((notify) => notify())
        },
        { rootMargin: "0px 0px -100% 0px" },
      )
      galleryCoveredObserver.observe(aboutPanel)
    }
  }

  return () => {
    galleryCoveredListeners.delete(listener)
    if (galleryCoveredListeners.size === 0) {
      galleryCoveredObserver?.disconnect()
      galleryCoveredObserver = null
    }
  }
}

const getGalleryCovered = () => galleryCoveredValue
const getGalleryCoveredOnServer = () => false

// The gallery is the point of the mosaic, but its chunk is the heaviest thing
// we ship after the media itself. Fetching it on intent -- a hover, or the
// pointerdown that precedes a tap -- keeps it off the initial load without
// making the click wait for it.
function prefetchPreviewGallery() {
  if (prefersLightweightMedia()) return
  void loadPreviewGallery().catch(() => undefined)
}

// The card paints the poster long before `loadeddata`, and on reduced motion or
// a metered connection the loop never loads at all -- so a video tile's skeleton
// has to clear on the poster's own decode rather than the video's. The element's
// poster request and this one resolve to the same resource, so it costs no bytes.
function usePosterReady(poster: string | undefined) {
  const [ready, setReady] = useState(!poster)

  useEffect(() => {
    if (!poster) return

    // Listeners go on before `src`, so a poster already in the cache still
    // arrives through `load` rather than needing a synchronous `complete` check.
    const image = new Image()
    const finish = () => setReady(true)
    image.addEventListener("load", finish)
    // A poster that fails is not going to paint, so stop waiting on it rather
    // than leaving the tile under a skeleton for the rest of the session.
    image.addEventListener("error", finish)
    image.src = poster
    return () => {
      image.removeEventListener("load", finish)
      image.removeEventListener("error", finish)
    }
  }, [poster])

  return ready
}

function RowVideoMedia({
  source,
  poster,
  label,
  width,
  height,
  prefersReducedMotion,
  pausePlayback,
}: RowVideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const supportsIntersectionObserver = useSyncExternalStore(
    subscribeToNothing,
    hasIntersectionObserver,
    hasIntersectionObserverOnServer,
  )
  const galleryCovered = useSyncExternalStore(
    subscribeToGalleryCovered,
    getGalleryCovered,
    getGalleryCoveredOnServer,
  )
  // Without a poster there is nothing to fall back to, so the video loads even
  // on a metered connection.
  const lightweightMedia = useLightweightMedia()
  const holdForLightweightMedia = Boolean(poster) && lightweightMedia
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const posterReady = usePosterReady(poster)

  // With no observer to flip the state, `src` would stay undefined for the whole
  // session and only the poster would ever show -- so fall back to loading up
  // front instead.
  const loadNow = !holdForLightweightMedia && !prefersReducedMotion &&
    (shouldLoad || !supportsIntersectionObserver)
  const visibleNow = isVisible || !supportsIntersectionObserver

  useEffect(() => {
    const video = videoRef.current
    if (!video || !supportsIntersectionObserver || holdForLightweightMedia || pausePlayback) return

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          loadObserver.disconnect()
        }
      },
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
  }, [holdForLightweightMedia, pausePlayback, supportsIntersectionObserver])

  useEffect(() => {
    // Removing src alone can retain the current resource. Reset the element
    // on a connection downgrade to abort the transfer and restore its poster.
    if (!loadNow) videoRef.current?.load()
  }, [loadNow])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // `visibleNow` cannot catch the takeover: the pinned grid still intersects
    // the viewport while the About sheet slides over it, so without
    // `galleryCovered` every loop keeps decoding and uploading frames to the
    // GPU behind an opaque sheet — starving the raster budget the sheet's own
    // text needs during scroll.
    if (!prefersReducedMotion && !pausePlayback && loadNow && visibleNow && !galleryCovered) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [galleryCovered, loadNow, pausePlayback, prefersReducedMotion, visibleNow])

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
      data-pending={(poster ? posterReady : loaded) ? "false" : "true"}
      onLoadedData={() => setLoaded(true)}
    />
  )
}

type RowImageMediaProps = {
  source: string
  label: string
  width?: number
  height?: number
  eager: boolean
  /** The tile's fraction of its row's total span; see `previewSizesForShare`. */
  share?: number
}

// Owns its own loaded flag on purpose. Hoisting it into SimpleFeed meant every
// one of the ~11 images re-rendered the entire mosaic when it decoded, which
// re-ran the row/tile tree eleven times during load.
function RowImageMedia({ source, label, width, height, eager, share }: RowImageMediaProps) {
  const [loaded, setLoaded] = useState(false)
  const [approached, setApproached] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const supportsIntersectionObserver = useSyncExternalStore(
    subscribeToNothing,
    hasIntersectionObserver,
    hasIntersectionObserverOnServer,
  )
  const srcSet = buildPreviewSrcSet(source, width)
  // A lazy tile ten screens down has no request in flight, so a skeleton there
  // would promise an arrival that is not underway -- and its breathe would run
  // for the session on a card nobody is looking at. Arm it on approach instead,
  // roughly when `loading="lazy"` starts fetching. Eager tiles are already
  // loading at mount, and without an observer to arm them the rest never would.
  const armed = eager || approached || !supportsIntersectionObserver

  useEffect(() => {
    const image = imageRef.current
    if (armed || !image) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setApproached(true)
        observer.disconnect()
      },
      { rootMargin: "300px" },
    )
    observer.observe(image)
    return () => observer.disconnect()
  }, [armed])

  return (
    <img
      src={source}
      srcSet={srcSet}
      sizes={srcSet ? previewSizesForShare(share) : undefined}
      alt={label}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      className="mosaic-row-media"
      data-loaded={loaded ? "true" : "false"}
      data-pending={armed && !loaded ? "true" : "false"}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth > 0) setLoaded(true)
      }}
      ref={(el) => {
        imageRef.current = el
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

const sectionLinks: { label: string; href: string }[] = [
  { label: "About", href: "#about-panel" },
]

function SectionCorner({
  onSelect,
  onNotes,
  resumeHref,
}: {
  onSelect: (href: string) => void
  onNotes: (opener: HTMLElement) => void
  resumeHref: string
}) {
  const { isOpen, hoverProps } = useHoverCard()
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const previewFrameRef = useRef<HTMLAnchorElement>(null)

  // The frame shows the top ~160px of a ~450px page, so an ordinary wheel
  // gesture would cover the whole travel in one flick and the middle of the
  // résumé would never be on screen. Damping the delta turns the same gesture
  // into a slow pan. React registers its wheel listener passively, so this has
  // to be wired by hand to be allowed to preventDefault.
  useEffect(() => {
    const frame = previewFrameRef.current
    if (!frame) return

    const handleWheel = (event: WheelEvent) => {
      const travel = frame.scrollHeight - frame.clientHeight
      if (travel <= 0) return

      // Firefox reports mouse wheels in lines rather than pixels.
      const pixels =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * frame.clientHeight
            : event.deltaY
      const next = Math.min(Math.max(frame.scrollTop + pixels * 0.25, 0), travel)
      // During the initial blur, Chromium can keep the wheel gesture latched
      // to this scroller even after it reaches an edge. Forward that delta
      // explicitly so the page responds while the entrance is still running.
      if (Math.abs(next - frame.scrollTop) < 0.5) {
        if (pixels !== 0) {
          event.preventDefault()
          window.scrollBy({ top: pixels, behavior: "instant" })
        }
        return
      }

      event.preventDefault()
      frame.scrollTop = next
    }

    frame.addEventListener("wheel", handleWheel, { passive: false })
    return () => frame.removeEventListener("wheel", handleWheel)
  }, [previewLoaded])

  // The card is mounted for the rest of the session once it has loaded, so a
  // reopen would otherwise resume wherever the last hover left off.
  useEffect(() => {
    if (isOpen) return
    const frame = previewFrameRef.current
    if (frame) frame.scrollTop = 0
  }, [isOpen])

  return (
    <nav className="mosaic-section-corner" aria-label="Sections">
      {sectionLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="mosaic-social-link"
          onClick={(event) => {
            // Let modified clicks fall through so the anchor still opens in a
            // new tab; otherwise use the same focused smooth-scroll path as
            // the profile-photo shortcut.
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
            event.preventDefault()
            onSelect(link.href)
          }}
        >
          {link.label}
        </a>
      ))}
      {/* Notes has no section of its own to scroll to: it opens the same
          folder the mosaic tile does, so this is a button, not a link. It hands
          itself over as the opener, so the sheet flies out of this corner
          rather than out of a tile that may be pages down. */}
      <button type="button" className="mosaic-social-link" onClick={(event) => onNotes(event.currentTarget)}>
        Notes
      </button>
      <span className="mosaic-hover-anchor mosaic-resume-anchor" {...hoverProps}>
        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className="mosaic-social-link"
          onClick={() => {
            trackEvent("social_link_click", {
              social_label: "View Resume",
              social_href: resumeHref,
              social_placement: "top_corner",
            })
          }}
        >
          Resume
          <ExternalLink
            className="mosaic-social-link-external-icon"
            size={12}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </a>
        <span
          className={`mosaic-resume-card${isOpen ? " is-open" : ""}`}
          data-state={isOpen ? "open" : "closed"}
          aria-hidden="true"
          inert={!isOpen}
        >
          {isOpen || previewLoaded ? (
            <a
              ref={previewFrameRef}
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              // Out of the tab order, and mousedown's default is cancelled so a
              // click cannot move focus into this aria-hidden card either. The
              // keyboard path is the Resume link the card hangs off; this is the
              // same destination for a pointer already sitting on the preview.
              tabIndex={-1}
              className="mosaic-resume-card-frame"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                trackEvent("social_link_click", {
                  social_label: "View Resume",
                  social_href: resumeHref,
                  social_placement: "resume_preview",
                })
              }}
            >
              <img
                src="/rafael-medina-resume-preview.png"
                alt=""
                width={816}
                height={1056}
                decoding="async"
                onLoad={() => setPreviewLoaded(true)}
                className="mosaic-resume-card-image"
              />
            </a>
          ) : null}
        </span>
      </span>
    </nav>
  )
}

function SocialCorner({
  reducedMotion,
  timeLabel,
}: {
  reducedMotion: boolean
  timeLabel: string
}) {
  const { isOpen, hoverProps } = useHoverCard()
  const [mapLoaded, setMapLoaded] = useState(false)
  const handleMapReady = useCallback(() => setMapLoaded(true), [])

  return (
    <div className="mosaic-social-corner">
      <span className="mosaic-hover-anchor mosaic-local-time-anchor" {...hoverProps}>
        <span
          className="mosaic-social-time"
          tabIndex={0}
          aria-describedby="local-time-location"
        >
          Local time: <LiveTimeLabel label={timeLabel} reducedMotion={reducedMotion} />
        </span>
        {/* The description target is plain text on purpose: the visual card
            below contains a link, which a tooltip/description must not. */}
        <span id="local-time-location" className="sr-only">
          Punta Cana, Dominican Republic
        </span>
        <span
          className={`mosaic-local-time-card${isOpen ? " is-open" : ""}`}
          data-state={isOpen ? "open" : "closed"}
          inert={!isOpen}
        >
          <span className="mosaic-local-time-map">
            {/* Nothing renders while closed so the screenshot is never fetched
                for visitors who never hover; the Suspense fallback covers the
                gap while Leaflet's chunk loads. */}
            {isOpen || mapLoaded ? (
              <Suspense fallback={<PuntaCanaMapScreenshot />}>
                <PuntaCanaMap onReady={handleMapReady} />
              </Suspense>
            ) : null}
            <a
              className="mosaic-local-time-map-attribution"
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              aria-label="OpenStreetMap contributors"
            >
              © OpenStreetMap contributors
            </a>
          </span>
          <span className="mosaic-local-time-card-copy">
            <span>
              <strong>Punta Cana</strong>
              <span>Dominican Republic</span>
            </span>
            <span className="mosaic-local-time-card-clock">{timeLabel}</span>
          </span>
        </span>
      </span>
    </div>
  )
}

export function SimpleFeed({ cards, profile, links }: SimpleFeedProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { avatarRef, active: introActive } = useAvatarIntro()
  const [isTakeoverCloseVisible, setIsTakeoverCloseVisible] = useState(false)
  const [isReturningToTop, setIsReturningToTop] = useState(false)
  const { projectId, selectProject, clearProject } = useProjectUrl()
  const [lastWorkPreviewIndex, setLastWorkPreviewIndex] = useState(0)
  const [hasOpenedWorkPreview, setHasOpenedWorkPreview] = useState(false)
  const previewCardNodesRef = useRef(new Map<number, HTMLAnchorElement>())
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() =>
    formatPuntaCanaLocalTime(new Date(globalThis.__PRERENDERED_AT__ ?? Date.now())),
  )
  const [availabilityLabel, setAvailabilityLabel] = useState(() =>
    formatAvailability(new Date(globalThis.__PRERENDERED_AT__ ?? Date.now())),
  )
  const [writingsOpen, setWritingsOpen] = useState(false)
  const writingsFolderRef = useRef<WritingsFolderHandle>(null)
  const [GalleryDialog, setGalleryDialog] = useState(() => createPreviewGalleryComponent())

  const handleGalleryLoadError = useCallback(() => {
    trackEvent("work_preview_load_error", {})
    // Closing resets the boundary (it unmounts with the Suspense tree); the
    // fresh lazy component means the next click re-attempts the fetch instead
    // of replaying the cached rejection.
    setGalleryDialog(() => createPreviewGalleryComponent())
    clearProject()
    setHasOpenedWorkPreview(false)
  }, [clearProject])
  const rowsRender = useMemo(() => {
    let previewIndex = 0
    return homeRows.map((row) => {
      // Every tile in the row -- projects, the quote slider, the writings
      // folder -- flexes against this total, so it is also what decides how much
      // width a project's artwork has to cover. Feeds `previewSizesForShare`.
      const rowSpan =
        row.items.reduce((total, item) => total + (item.span ?? 1), 0) +
        (row.quote ? row.quoteSpan ?? 1 : 0) +
        (row.writings ? 1 : 0)
      const items = row.items.flatMap((item) => {
        const card = cards.find((candidate) => candidate.id === item.cardId)
        if (!card) return []
        const currentIndex = previewIndex++
        const span = item.span ?? 1
        return [
          {
            card,
            span,
            share: span / rowSpan,
            width: item.width,
            fit: item.fit ?? defaultFitForCard(card),
            mediaMaxHeight: item.mediaMaxHeight,
            previewIndex: currentIndex,
          },
        ]
      })
      return { id: row.id, height: row.height, gap: row.gap, quote: row.quote, quoteSpan: row.quoteSpan, writings: row.writings, items }
    })
  }, [cards])

  const flatWorkCards = useMemo(
    () => rowsRender.flatMap((row) => row.items.map((item) => item.card)),
    [rowsRender],
  )
  const projectIndex = flatWorkCards.findIndex((card) => card.id === projectId)
  const activeWorkPreviewIndex = projectIndex < 0 ? null : projectIndex
  // Keep the last preview mounted for its exit, including direct URL visits
  // and browser Forward, which do not pass through a card's click handler.
  if (activeWorkPreviewIndex !== null && (!hasOpenedWorkPreview || lastWorkPreviewIndex !== activeWorkPreviewIndex)) {
    setHasOpenedWorkPreview(true)
    setLastWorkPreviewIndex(activeWorkPreviewIndex)
  }
  const selectedWorkPreviewIndex = activeWorkPreviewIndex ?? Math.min(lastWorkPreviewIndex, Math.max(flatWorkCards.length - 1, 0))
  const setSelectedWorkPreviewIndex = (index: number) => {
    const card = flatWorkCards[index]
    if (card) selectProject(card.id, projectId !== null)
  }

  // The gallery grows out of (and shrinks back into) the card it represents, so
  // it needs that card's live geometry at open and close time.
  const getPreviewOriginRect = useCallback(
    (index: number) => visibleOriginRect(previewCardNodesRef.current.get(index)),
    [],
  )

  const renderRowMedia = (
    card: PortfolioCard,
    source = card.image,
    label = card.title,
    eager = false,
    share?: number,
  ) => {
    if (isVideoSource(source)) {
      return (
        <RowVideoMedia
          source={source}
          poster={card.previewPoster}
          label={label}
          width={card.previewWidth}
          height={card.previewHeight}
          prefersReducedMotion={prefersReducedMotion}
          // A modal covers the feed even though its videos still intersect
          // the viewport. Rest their decoders and defer new video loads until
          // the preview closes, just as we do during the return from About.
          pausePlayback={introActive || isReturningToTop || activeWorkPreviewIndex !== null || writingsOpen}
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
        share={share}
      />
    )
  }

  useEffect(() => {
    let intervalId: number | undefined
    let timeoutId: number | undefined

    const updatePuntaCanaTime = () => {
      setPuntaCanaTimeLabel(formatPuntaCanaLocalTime())
      setAvailabilityLabel(formatAvailability())
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
    const aboutPanel = document.getElementById("about-panel")
    if (!aboutPanel) return

    const takeoverMedia = window.matchMedia("(min-width: 700px)")
    let frameId: number | null = null
    let visible = false

    const syncVisibility = () => {
      frameId = null
      const bounds = aboutPanel.getBoundingClientRect()
      const nextVisible =
        takeoverMedia.matches && bounds.top < window.innerHeight * 0.3 && bounds.bottom > 0

      if (nextVisible === visible) return
      visible = nextVisible
      setIsTakeoverCloseVisible(nextVisible)
    }

    const scheduleSync = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(syncVisibility)
    }

    scheduleSync()
    window.addEventListener("scroll", scheduleSync, { passive: true })
    window.addEventListener("resize", scheduleSync)
    takeoverMedia.addEventListener("change", scheduleSync)

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", scheduleSync)
      window.removeEventListener("resize", scheduleSync)
      takeoverMedia.removeEventListener("change", scheduleSync)
    }
  }, [])

  useEffect(() => {
    if (!isReturningToTop) return

    let idleTimeoutId: number | null = null
    let fallbackTimeoutId: number | null = null
    const finishReturn = () => setIsReturningToTop(false)
    const scheduleFallback = () => {
      if (fallbackTimeoutId !== null) {
        window.clearTimeout(fallbackTimeoutId)
        fallbackTimeoutId = null
      }
      if (idleTimeoutId !== null) window.clearTimeout(idleTimeoutId)
      idleTimeoutId = window.setTimeout(finishReturn, 120)
    }

    if (Reflect.has(window, "onscrollend")) {
      window.addEventListener("scrollend", finishReturn)
    } else {
      fallbackTimeoutId = window.setTimeout(finishReturn, 1500)
      window.addEventListener("scroll", scheduleFallback, { passive: true })
    }

    return () => {
      if (idleTimeoutId !== null) window.clearTimeout(idleTimeoutId)
      if (fallbackTimeoutId !== null) window.clearTimeout(fallbackTimeoutId)
      window.removeEventListener("scroll", scheduleFallback)
      window.removeEventListener("scrollend", finishReturn)
    }
  }, [isReturningToTop])

  const scrollToSection = (trigger: string, sectionId = "about-panel") => {
    if (sectionId === "work") {
      trackEvent("section_scroll", { section_id: sectionId, section_scroll_trigger: trigger })
    } else {
      trackEvent("about_scroll", { about_scroll_trigger: trigger })
    }
    const aboutPanel = document.getElementById(sectionId)
    if (!aboutPanel) return
    const hash = `#${sectionId}`
    if (window.location.hash !== hash) {
      // Section links share one visit instead of adding a history entry for
      // every jump within the same page.
      if (["#work", "#about-panel", "#about-panel-resume"].includes(window.location.hash)) {
        window.history.replaceState(window.history.state, "", hash)
      } else {
        pushPortfolioUrl(hash, "about")
      }
    }

    aboutPanel.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    aboutPanel.focus({ preventScroll: true })
  }

  const closeAbout = () => {
    const url = new URL(window.location.href)
    url.hash = ""
    document.getElementById("portfolio-title")?.focus({ preventScroll: true })
    setIsReturningToTop(window.scrollY > 0)
    closePortfolioUrl(url, "about", () => {
      // History restores the previous scroll position after popstate. Wait
      // until that finishes so the Work tab always returns to the top.
      window.requestAnimationFrame(() => window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      }))
    })
  }

  const openAbout = () => {
    scrollToSection("nav_about")
  }

  return (
    <section className="mosaic-shell">
      <h1 id="portfolio-title" className="sr-only" tabIndex={-1}>{profile.name} portfolio</h1>
      <SectionCorner
        onSelect={openAbout}
        onNotes={(opener) => writingsFolderRef.current?.openFolder(opener)}
        resumeHref={links.resumePdf}
      />
      <SocialCorner timeLabel={puntaCanaTimeLabel} reducedMotion={prefersReducedMotion} />
      <MobileTableOfContents
        onWork={() => scrollToSection("toc_work", "work")}
        onAbout={() => scrollToSection("toc_about")}
        onWorkHistory={() => scrollToSection("toc_work_history", "about-panel-resume")}
      />
      <button
        type="button"
        className="mosaic-takeover-close"
        data-visible={isTakeoverCloseVisible}
        aria-label="Close about"
        aria-hidden={!isTakeoverCloseVisible}
        tabIndex={isTakeoverCloseVisible ? 0 : -1}
        inert={!isTakeoverCloseVisible}
        onClick={closeAbout}
      >
        <X aria-hidden="true" />
      </button>
      <header id="about" className="mosaic-hero">
        <div className="mosaic-hero-profile">
          <div className="mosaic-profile-info">
            <button
              ref={avatarRef}
              type="button"
              className="mosaic-avatar mosaic-avatar-coin mosaic-avatar-button"
              aria-label={`Read about ${profile.name}`}
              onClick={() => scrollToSection("avatar")}
            >
              <div className="mosaic-avatar-coin-inner">
                <img src={profile.photo} width="208" height="208" alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-front" loading="eager" fetchPriority="high" decoding="async" />
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
            <span className="mosaic-profile-location-place">Punta Cana & NYC</span>
            <span className="mosaic-profile-location-separator" aria-hidden="true">·</span>
            <AvailabilityBooking label={availabilityLabel} bookingUrl={links.booking} />
          </p>
          <div className="mosaic-profile-contact">
            <ContactActionRow
              email={links.email}
              contactHref={`mailto:${links.email}`}
              linkedinHref={links.linkedin}
              xHref={links.x}
              xProfile={xProfilePreview}
              linkedinMedia={linkedinHoverMedia}
            />
          </div>
        </div>
      </header>

      <>
          <article id="work" className="mosaic-work" tabIndex={-1}>
              <h2 className="sr-only">Selected work</h2>
              <div className="mosaic-takeover-runway">
                <div className="mosaic-takeover-stage">
                  <div
                    className="mosaic-rows"
                    role="group"
                    aria-label="Selected work previews"
                    id="selected-work-previews"
                  >
                    {rowsRender.map((row, rowIndex) => {
                      const rowStyle = {
                        ...(row.height ? { "--row-height-input": row.height } : {}),
                        ...(row.gap ? { "--row-gap": row.gap } : {}),
                      } as CSSProperties
                      const eagerRow = rowIndex === 0
                      return (
                        <div
                          key={row.id}
                          className={`mosaic-row${row.quote ? " mosaic-row-with-quote" : ""}`}
                          style={rowStyle}
                        >
                          {row.quote ? (
                            <div
                              className="mosaic-row-item mosaic-row-quote"
                              style={
                                {
                                  "--row-span": row.quoteSpan ?? 1,
                                } as CSSProperties
                              }
                            >
                              <QuoteCard quotes={portfolioQuotes} />
                            </div>
                          ) : null}
                          {row.items.map((item) => {
                            const itemKey = `${item.card.id}-${item.previewIndex}`
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
                                <a
                                  href={projectPath(item.card)}
                                  ref={(node) => {
                                    const nodes = previewCardNodesRef.current
                                    if (node) nodes.set(item.previewIndex, node)
                                    else nodes.delete(item.previewIndex)
                                  }}
                                  className={`mosaic-row-card mosaic-row-card-${item.card.id}`}
                                  onPointerEnter={prefetchPreviewGallery}
                                  onPointerDown={prefetchPreviewGallery}
                                  onFocus={prefetchPreviewGallery}
                                  onClick={(event) => {
                                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                                    event.preventDefault()
                                    openPreview(item.card, item.previewIndex, setSelectedWorkPreviewIndex)
                                  }}
                                  aria-label={`Open ${item.card.title} preview ${item.previewIndex + 1} of ${flatWorkCards.length}`}
                                  aria-describedby={`${itemKey}-description`}
                                >
                                  {renderRowMedia(item.card, item.card.image, item.card.title, eagerRow, item.share)}
                                  {/* The caption backdrop. Four nodes because
                                      each one carries a different blur radius
                                      and its own mask, and a pseudo-element
                                      pair only gets you two of them. */}
                                  <span className="mosaic-row-card-scrim" aria-hidden="true">
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                  </span>
                                  <span className="mosaic-row-card-title" aria-hidden="true">
                                    {item.card.title}
                                  </span>
                                  {/* Prerenders each project's description as real
                                      text: crawlers get more than an aria-label,
                                      and screen readers hear it after the label. */}
                                  <span id={`${itemKey}-description`} className="sr-only">
                                    {item.card.detail}
                                  </span>
                                </a>
                              </div>
                            )
                          })}
                          {row.writings ? (
                            <div className="mosaic-row-item">
                              <WritingsFolder ref={writingsFolderRef} onOpenChange={setWritingsOpen} />
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* The scroll cue rides the runway, not the sheet, for the same
                    reason the hairline below does: nothing may paint outside
                    the sheet's own opaque layer. Two bars hinged at their
                    shared inner end, so the squeeze is a pair of rotations —
                    the caps keep their weight all the way to flat, which a
                    scaled chevron would not. */}
                {/* The chevron is nested rather than blended on the button
                    itself because the blend needs a backdrop: `opacity` on an
                    ancestor would isolate the group and leave it inverting
                    transparency. The button therefore carries no opacity of its
                    own, and no `z-index` — a stacking context here would do the
                    same damage. */}
                <button
                  type="button"
                  className="mosaic-takeover-cue"
                  aria-label="Continue to About"
                  onClick={() => scrollToSection("takeover_cue")}
                >
                  <span className="mosaic-takeover-cue-chevron" aria-hidden="true">
                    <span className="mosaic-takeover-cue-arm mosaic-takeover-cue-arm-left" />
                    <span className="mosaic-takeover-cue-arm mosaic-takeover-cue-arm-right" />
                  </span>
                </button>
              </div>
          </article>

          <AboutPanel links={links} />

          {/* Stays mounted after the first open so Base UI can run the close
              transition instead of the dialog vanishing on unmount. */}
          {hasOpenedWorkPreview && flatWorkCards.length > 0 ? (
            <GalleryLoadBoundary onLoadError={handleGalleryLoadError}>
              <Suspense
                // A dim that fades in on a short delay: a slow chunk fetch gets
                // visible feedback for the tap, a warm cache never shows it.
                fallback={
                  activeWorkPreviewIndex != null ? (
                    <div className="preview-gallery-pending" role="status">
                      <span className="sr-only">Loading project preview</span>
                    </div>
                  ) : null
                }
              >
                <GalleryDialog
                  cards={flatWorkCards}
                  open={activeWorkPreviewIndex != null}
                  selectedIndex={selectedWorkPreviewIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  getOriginRect={getPreviewOriginRect}
                  onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                      clearProject()
                    }
                  }}
                  onSelectedIndexChange={setSelectedWorkPreviewIndex}
                />
              </Suspense>
            </GalleryLoadBoundary>
          ) : null}
      </>
    </section>
  )
}
