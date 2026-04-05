import { useEffect, useMemo, useRef, useState } from "react"

import type { PortfolioCard, SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
import { HoverLogoLink } from "./HoverLogoLink"
import { HoverVideoLink } from "./HoverVideoLink"
import { PreviewGalleryDialog } from "./PreviewGalleryDialog"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"

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

type WorkTile =
  | {
      kind: "preview"
      card: PortfolioCard
      span: "sm" | "wide" | "tall"
      previewIndex: number
    }
  | {
      kind: "bridge"
      bridge: "signature"
      span: "sm" | "wide" | "tall"
      id: string
    }

type WorkPreviewTile = Extract<WorkTile, { kind: "preview" }>

const lowerWorkPattern: Array<"sm" | "wide" | "tall"> = ["tall", "sm", "sm", "wide", "sm", "tall", "wide", "sm", "sm", "wide", "sm", "sm"]

const puntaCanaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Santo_Domingo",
  timeZoneName: "short",
})

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function openLinkSafely(url: string) {
  if (url === "#") return undefined
  return url
}

function shouldInsetWorkMedia(card: PortfolioCard) {
  if (card.id === "preview-shot-20") return true
  const ratio = card.previewAspectRatio
  if (ratio == null) return false
  return ratio > 1.45 || ratio < 0.82
}

function formatPuntaCanaLocalTime(date = new Date()) {
  return puntaCanaTimeFormatter.format(date)
}

function openPreview(card: PortfolioCard, previewIndex: number, placement: "featured" | "grid", setActiveWorkPreviewIndex: (value: number) => void) {
  trackEvent("work_preview_open", {
    preview_id: card.id,
    preview_title: card.title,
    preview_index: previewIndex + 1,
    preview_placement: placement,
  })
  setActiveWorkPreviewIndex(previewIndex)
}

function LiveTimeLabel({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  const [displayedLabel, setDisplayedLabel] = useState(label)
  const [incomingLabel, setIncomingLabel] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (label === displayedLabel) return

    if (reducedMotion) {
      setDisplayedLabel(label)
      setIncomingLabel(null)
      setIsAnimating(false)
      return
    }

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    setIncomingLabel(label)

    const frameId = window.requestAnimationFrame(() => {
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

  return (
    <span className={`mosaic-live-time ${isAnimating ? "is-animating" : ""}`} aria-live="polite" aria-atomic="true">
      <span className="mosaic-live-time-track">
        <span className="mosaic-live-time-value mosaic-live-time-value-current">{displayedLabel}</span>
        {incomingLabel ? <span className="mosaic-live-time-value mosaic-live-time-value-next">{incomingLabel}</span> : null}
      </span>
    </span>
  )
}

export function SimpleFeed({ cards, profile, links, showProjects = true }: SimpleFeedProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() => formatPuntaCanaLocalTime())

  const previews = useMemo(() => cards.filter((card) => card.kind === "preview"), [cards])
  const featuredPhone = useMemo(
    () => cards.find((card) => card.id === "preview-shot-9") ?? previews.find((card) => (card.previewAspectRatio ?? 1) < 1) ?? previews[0],
    [cards, previews],
  )
  const featuredWide = useMemo(
    () => cards.find((card) => card.id === "preview-shot-21") ?? previews.find((card) => card.id !== featuredPhone?.id) ?? previews[1],
    [cards, previews, featuredPhone],
  )

  const workPreviewCards = useMemo(() => {
    const featuredIds = new Set<string>()
    if (featuredPhone?.id) featuredIds.add(featuredPhone.id)
    if (featuredWide?.id) featuredIds.add(featuredWide.id)
    const sourceCards = previews.filter((card) => !featuredIds.has(card.id))
    if (sourceCards.length === 0) return []
    return Array.from({ length: 12 }, (_, index) => sourceCards[index % sourceCards.length])
  }, [previews, featuredPhone, featuredWide])

  const workTiles = useMemo(() => {
    const nextTiles: WorkTile[] = []

    workPreviewCards.forEach((card, previewIndex) => {
      nextTiles.push({
        kind: "preview",
        card,
        span: card.masonrySpan === "lg" ? "wide" : lowerWorkPattern[previewIndex % lowerWorkPattern.length],
        previewIndex,
      })

      if (previewIndex === 6) {
        nextTiles.push({ kind: "bridge", bridge: "signature", span: "sm", id: "bridge-signature" })
      }
    })

    return nextTiles
  }, [workPreviewCards])

  const featuredWorkTile = useMemo<WorkPreviewTile | null>(() => {
    for (const tile of workTiles) {
      if (tile.kind === "preview") return tile
    }
    return null
  }, [workTiles])

  const gridWorkTiles = useMemo(() => {
    if (!featuredWorkTile) return workTiles

    return workTiles.filter(
      (tile) => !(tile.kind === "preview" && tile.previewIndex === featuredWorkTile.previewIndex),
    )
  }, [workTiles, featuredWorkTile])

  const featureReadMoreHref = useMemo(() => openLinkSafely(links.linkedin), [links.linkedin])
  const studioLinkHref = useMemo(() => openLinkSafely(links.x), [links.x])
  const phonePreviewLabel = featuredPhone?.title ?? "Vertical project preview"
  const widePreviewLabel = featuredWide?.title ?? "Wide project preview"
  const featuredWorkInsetMedia = featuredWorkTile ? shouldInsetWorkMedia(featuredWorkTile.card) : false
  const shellClassName = `mosaic-shell${showProjects ? "" : " mosaic-shell-hero-only"}`
  const heroClassName = `mosaic-hero${showProjects ? "" : " mosaic-hero-hero-only"}`

  const renderWorkMedia = (card: PortfolioCard, insetMedia: boolean, mediaLabel: string) => {
    if (isVideoPreviewSource(card.image)) {
      return (
        <video
          src={card.image}
          muted
          loop={!prefersReducedMotion}
          autoPlay={!prefersReducedMotion}
          playsInline
          preload={prefersReducedMotion ? "none" : "metadata"}
          aria-label={mediaLabel}
          className={`mosaic-work-media ${insetMedia ? "mosaic-work-media-inset" : ""}`}
        />
      )
    }

    return (
      <img
        src={card.image}
        alt={mediaLabel}
        loading="lazy"
        decoding="async"
        className={`mosaic-work-media ${insetMedia ? "mosaic-work-media-inset" : ""}`}
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

  return (
    <section className={shellClassName}>
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <header id="about" className={heroClassName}>
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div className="mosaic-profile-head">
            <img src={profile.photo} alt={`${profile.name} portrait`} className="mosaic-avatar" loading="eager" decoding="async" />
            <div className="mosaic-profile-meta">
              <h2>{profile.name}</h2>
              <p className="mosaic-profile-subtitle">
                {profile.title}
                <span className="mosaic-profile-status-separator" aria-hidden="true">
                  ·
                </span>
                <span className="mosaic-profile-status-tag" aria-label="Currently available">
                  Available
                </span>
              </p>
              <p className="mosaic-profile-location">
                Punta Cana · <LiveTimeLabel label={puntaCanaTimeLabel} reducedMotion={prefersReducedMotion} />
              </p>
            </div>
          </div>
          <p className="mosaic-profile-summary mosaic-profile-summary-followup">
            Born in Santo Domingo, educated in Washington, DC, and now moving to NYC.
          </p>
          <p className="mosaic-profile-summary mosaic-profile-summary-followup">
            My work started in college, where I co-founded{" "}
            <HoverVideoLink
              href="https://www.youtube.com/watch?v=IAHmu0lhcIs&t=1s"
              className="mosaic-profile-link"
              embedUrl="https://www.youtube-nocookie.com/embed/IAHmu0lhcIs?autoplay=1&mute=1&controls=0&loop=1&playlist=IAHmu0lhcIs&modestbranding=1&rel=0&playsinline=1"
              previewTitle="Turtle project preview"
            >
              Turtle
            </HoverVideoLink>
            , a tool for college students to meet each other. Since then, I&apos;ve designed products like{" "}
            <span className="mosaic-inline-nowrap">
              <HoverLogoLink
                href="https://patrol.so"
                logoUrls={["/logos/patrol.svg"]}
                className="mosaic-profile-link mosaic-profile-link-with-logo"
              >
                Patrol
              </HoverLogoLink>
              /
              <HoverLogoLink
                href="https://protector.so"
                logoUrls={["/logos/protector.svg"]}
                className="mosaic-profile-link mosaic-profile-link-with-logo"
              >
                Protector
              </HoverLogoLink>
            </span>
            , rethought developer tools at{" "}
            <HoverLogoLink
              href="https://www.twilio.com"
              logoUrls={["/logos/twilio.svg"]}
              className="mosaic-profile-link mosaic-profile-link-with-logo"
            >
              Twilio
            </HoverLogoLink>
            , built financial products at{" "}
            <HoverLogoLink
              href="https://www.moodys.com"
              logoUrls={["/logos/moodys.png"]}
              className="mosaic-profile-link mosaic-profile-link-with-logo"
            >
              Moody&apos;s
            </HoverLogoLink>
            , and helped shape{" "}
            <HoverLogoLink
              href="https://matcha.xyz"
              logoUrls={["/logos/matcha.svg"]}
              className="mosaic-profile-link mosaic-profile-link-with-logo"
            >
              Matcha.xyz
            </HoverLogoLink>
            {" "}for four and a half years.
          </p>
          <p className="mosaic-profile-summary mosaic-profile-summary-followup mosaic-profile-summary-companies">
            Over the past decade, I&apos;ve designed products with teams at <WorkedWithCompaniesInline />.
          </p>
          <p className="mosaic-profile-summary mosaic-profile-summary-followup">
            Today I freelance on focused, high-impact projects.
          </p>
          <p className="mosaic-profile-summary mosaic-profile-summary-followup">
            You can reach me at{" "}
            <a
              href={studioLinkHref ?? links.x}
              target="_blank"
              rel="noreferrer"
              className="mosaic-profile-link"
            >
              @rafaelmedian
            </a>{" "}
            or{" "}
            <a href={`mailto:${links.email}`} className="mosaic-profile-link">
              {links.email}
            </a>
          </p>
        </div>
      </header>

      {showProjects ? (
        <>
          <div className="mosaic-board">
            <article id="featured" className="mosaic-tile mosaic-feature-card">
              <div className="mosaic-note-card">
                <p className="mosaic-note-date">Nov 23</p>
                <h2>LLMs for house plants?</h2>
                <p>
                  It&apos;s been five incredibly turbulent days at the leading AI tech company, with the exit and then return of CEO...
                </p>
                {featureReadMoreHref ? (
                  <a href={featureReadMoreHref} target="_blank" rel="noreferrer" className="mosaic-note-link">
                    Read more
                  </a>
                ) : null}
              </div>
            </article>

            <article className="mosaic-tile mosaic-empty-card" aria-label="Open space panel">
              <span className="mosaic-doodle mosaic-doodle-top">o_o</span>
              <span className="mosaic-doodle mosaic-doodle-bottom">\\^_^/</span>
            </article>

            <article className="mosaic-tile mosaic-phone-card" aria-label={phonePreviewLabel}>
              <div className="mosaic-phone-shell">
                {featuredPhone ? (
                  isVideoPreviewSource(featuredPhone.image) ? (
                    <video
                      src={featuredPhone.image}
                      muted
                      loop={!prefersReducedMotion}
                      autoPlay={!prefersReducedMotion}
                      playsInline
                      preload={prefersReducedMotion ? "none" : "metadata"}
                      controls={prefersReducedMotion}
                      aria-label={phonePreviewLabel}
                      className="mosaic-phone-media"
                    />
                  ) : (
                    <img src={featuredPhone.image} alt={phonePreviewLabel} loading="lazy" decoding="async" className="mosaic-phone-media" />
                  )
                ) : (
                  <div className="mosaic-media-fallback">Preview coming soon</div>
                )}
              </div>
            </article>

            <article className="mosaic-tile mosaic-note-panel">
              <div className="mosaic-micro-card">
                <h2>Blogging about plants</h2>
                <p>I find joy and inspiration in my ever-growing collection of plants. They make my space feel like home.</p>
              </div>
            </article>

            <article className="mosaic-tile mosaic-dashboard-card" aria-label={widePreviewLabel}>
              <div className="mosaic-wide-shell">
                {featuredWide ? (
                  isVideoPreviewSource(featuredWide.image) ? (
                    <video
                      src={featuredWide.image}
                      muted
                      loop={!prefersReducedMotion}
                      autoPlay={!prefersReducedMotion}
                      playsInline
                      preload={prefersReducedMotion ? "none" : "metadata"}
                      controls={prefersReducedMotion}
                      aria-label={widePreviewLabel}
                      className="mosaic-wide-media"
                    />
                  ) : (
                    <img src={featuredWide.image} alt={widePreviewLabel} loading="lazy" decoding="async" className="mosaic-wide-media" />
                  )
                ) : (
                  <div className="mosaic-media-fallback">Project preview</div>
                )}
              </div>
            </article>

            <article id="work" className="mosaic-work">
              <h2 className="sr-only">Selected work</h2>
              {featuredWorkTile ? (
                <section className="mosaic-work-featured" aria-label="Featured work preview">
                  <button
                    type="button"
                    className="mosaic-work-card mosaic-work-card-featured"
                    onClick={() =>
                      openPreview(featuredWorkTile.card, featuredWorkTile.previewIndex, "featured", setActiveWorkPreviewIndex)
                    }
                    aria-label={`Open ${featuredWorkTile.card.title} preview ${featuredWorkTile.previewIndex + 1} of ${workPreviewCards.length}`}
                  >
                    <span
                      className={`mosaic-work-media-shell ${featuredWorkInsetMedia ? "mosaic-work-media-shell-inset" : ""}`}
                    >
                      {renderWorkMedia(featuredWorkTile.card, featuredWorkInsetMedia, featuredWorkTile.card.title)}
                    </span>
                    <span className="mosaic-work-overlay mosaic-work-overlay-featured">
                      <strong>{featuredWorkTile.card.title}</strong>
                    </span>
                  </button>
                </section>
              ) : null}
              <ul className="mosaic-work-grid" aria-label="Selected work previews">
                {gridWorkTiles.map((tile) => {
                  const sizeClass = `mosaic-work-item mosaic-work-item-${tile.span}`

                  if (tile.kind === "bridge") {
                    return (
                      <li key={tile.id} className={sizeClass}>
                        <div
                          className="mosaic-work-bridge mosaic-work-bridge-signature"
                          aria-hidden="false"
                        >
                          <div className="mosaic-work-signature-stack" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </div>
                          <p>{profile.name} - Software Designer and Engineer</p>
                        </div>
                      </li>
                    )
                  }

                  const insetMedia = shouldInsetWorkMedia(tile.card)

                  return (
                    <li key={`${tile.card.id}-${tile.previewIndex}`} className={sizeClass}>
                      <button
                        type="button"
                        className="mosaic-work-card"
                        onClick={() => openPreview(tile.card, tile.previewIndex, "grid", setActiveWorkPreviewIndex)}
                        aria-label={`Open ${tile.card.title} preview ${tile.previewIndex + 1} of ${workPreviewCards.length}`}
                      >
                        <span className={`mosaic-work-media-shell ${insetMedia ? "mosaic-work-media-shell-inset" : ""}`}>
                          {renderWorkMedia(tile.card, insetMedia, tile.card.title)}
                        </span>
                        <span className="mosaic-work-overlay">
                          <strong>{tile.card.title}</strong>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </article>
          </div>

          <PreviewGalleryDialog
            cards={workPreviewCards}
            open={activeWorkPreviewIndex != null && activeWorkPreviewIndex < workPreviewCards.length}
            selectedIndex={activeWorkPreviewIndex ?? 0}
            prefersReducedMotion={prefersReducedMotion}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setActiveWorkPreviewIndex(null)
              }
            }}
            onSelectedIndexChange={setActiveWorkPreviewIndex}
          />
        </>
      ) : null}
    </section>
  )
}
