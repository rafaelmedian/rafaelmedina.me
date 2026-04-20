import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

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

function openPreview(card: PortfolioCard, previewIndex: number, setActiveWorkPreviewIndex: (value: number) => void) {
  trackEvent("work_preview_open", {
    preview_id: card.id,
    preview_title: card.title,
    preview_index: previewIndex + 1,
    preview_placement: "grid",
  })
  setActiveWorkPreviewIndex(previewIndex)
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

export function SimpleFeed({ cards, profile, showProjects = true }: SimpleFeedProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)
  const [puntaCanaTimeLabel, setPuntaCanaTimeLabel] = useState(() => formatPuntaCanaLocalTime())
  const workRowsRef = useRef<HTMLDivElement | null>(null)
  const workItemRefs = useRef(new Map<string, HTMLDivElement>())

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

  const shellClassName = `mosaic-shell${showProjects ? "" : " mosaic-shell-hero-only"}`
  const heroClassName = `mosaic-hero${showProjects ? "" : " mosaic-hero-hero-only"}`

  const renderRowMedia = (card: PortfolioCard) => {
    if (isVideoPreviewSource(card.image)) {
      return (
        <video
          src={card.image}
          muted
          loop={!prefersReducedMotion}
          autoPlay={!prefersReducedMotion}
          playsInline
          preload={prefersReducedMotion ? "none" : "metadata"}
          aria-label={card.title}
          className="mosaic-row-media"
        />
      )
    }
    return (
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        decoding="async"
        className="mosaic-row-media"
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
    if (!showProjects || prefersReducedMotion) return
    if (typeof window === "undefined") return

    const items = Array.from(workItemRefs.current.values())
    if (items.length === 0) return

    const revealVisibleItems = () => {
      const viewportHeight = window.innerHeight
      let hasPendingItems = false

      items.forEach((item) => {
        if (item.classList.contains("is-visible")) return

        const rect = item.getBoundingClientRect()
        const revealThreshold = viewportHeight * 0.9

        if (rect.top <= revealThreshold && rect.bottom >= viewportHeight * 0.08) {
          item.classList.add("is-visible")
          return
        }

        hasPendingItems = true
      })

      return hasPendingItems
    }

    let frameId: number | null = null

    const tick = () => {
      const hasPendingItems = revealVisibleItems()

      if (hasPendingItems) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        frameId = null
      }
    }

    tick()

    return () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [prefersReducedMotion, showProjects, rowsRender])

  return (
    <section className={shellClassName}>
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <header id="about" className={heroClassName}>
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div className="mosaic-profile-info">
            <img src={profile.photo} alt={`${profile.name} portrait`} className="mosaic-avatar" loading="eager" decoding="async" />
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
            <div ref={workRowsRef} className="mosaic-rows" aria-label="Selected work previews">
              {rowsRender.map((row) => {
                const rowStyle = {
                  ...(row.height ? { "--row-height": row.height } : {}),
                  ...(row.gap ? { "--row-gap": row.gap } : {}),
                } as CSSProperties
                return (
                  <div key={row.id} className="mosaic-row" style={rowStyle}>
                    {row.items.map((item) => {
                      const itemKey = `${item.card.id}-${item.previewIndex}`
                      const itemStyle = {
                        "--row-span": item.span,
                        "--reveal-index": item.previewIndex,
                        ...(item.width ? { flex: `0 0 ${item.width}` } : {}),
                        ...(item.mediaMaxHeight ? { "--row-media-max-height": item.mediaMaxHeight } : {}),
                      } as CSSProperties
                      return (
                        <div
                          key={itemKey}
                          className={`mosaic-row-item mosaic-row-item-fit-${item.fit}${prefersReducedMotion ? " is-visible" : ""}`}
                          style={itemStyle}
                          ref={(node) => {
                            if (node) {
                              workItemRefs.current.set(itemKey, node)
                            } else {
                              workItemRefs.current.delete(itemKey)
                            }
                          }}
                        >
                          <button
                            type="button"
                            className="mosaic-row-card"
                            onClick={() => openPreview(item.card, item.previewIndex, setActiveWorkPreviewIndex)}
                            aria-label={`Open ${item.card.title} preview ${item.previewIndex + 1} of ${flatWorkCards.length}`}
                          >
                            {renderRowMedia(item.card)}
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
