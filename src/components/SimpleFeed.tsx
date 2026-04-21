import { useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react"

import { homeRows, type PortfolioCard, type SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
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

type RowFit = "cover" | "contain"

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
    { label: "X", href: links.x, external: true },
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
  const [paginatedPreviewIndexes, setPaginatedPreviewIndexes] = useState<Record<string, number>>({})
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() => formatPuntaCanaLocalTime())
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
  }

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
        <video
          src={source}
          muted
          loop={!prefersReducedMotion}
          autoPlay={!prefersReducedMotion}
          playsInline
          preload={prefersReducedMotion ? "none" : "metadata"}
          aria-label={label}
          className="mosaic-row-media"
          data-loaded={dataLoaded}
          onLoadedData={() => markLoaded(source)}
        />
      )
    }
    return (
      <img
        key={source}
        src={source}
        alt={label}
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

  return (
    <section className={shellClassName}>
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <SocialCorner links={links} />
      <header id="about" className={heroClassName}>
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div className="mosaic-profile-info">
            <div className="mosaic-avatar mosaic-avatar-coin" role="img" aria-label={`${profile.name} portrait`}>
              <div className="mosaic-avatar-coin-inner">
                <img src={profile.photo} alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-front" loading="eager" decoding="async" />
                <img src={profile.photo} alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-back" loading="eager" decoding="async" />
              </div>
            </div>
            <div className="mosaic-profile-meta">
              <h2>{profile.name}</h2>
              <p className="mosaic-profile-subtitle">{profile.title}</p>
            </div>
          </div>
          <WorkedWithCompaniesInline variant="profile" />
          <p className="mosaic-profile-location">
            Punta Cana, soon NYC <span aria-hidden="true">·</span> Local time:{" "}
            <LiveTimeLabel label={puntaCanaTimeLabel} reducedMotion={prefersReducedMotion} />
          </p>
        </div>
      </header>

      {showProjects ? (
        <>
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
                            className={`mosaic-row-card mosaic-row-card-${item.card.id}${isPaginatedCard ? " mosaic-row-card-paginated" : ""}`}
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

          <PreviewGalleryDialog
            cards={flatWorkCards}
            open={activeWorkPreviewIndex != null && activeWorkPreviewIndex < flatWorkCards.length}
            selectedIndex={selectedWorkPreviewIndex}
            prefersReducedMotion={prefersReducedMotion}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setActiveWorkPreviewIndex(null)
              }
            }}
            onSelectedIndexChange={setSelectedWorkPreviewIndex}
          />
        </>
      ) : null}
    </section>
  )
}
