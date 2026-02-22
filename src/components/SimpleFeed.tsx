import { useEffect, useMemo, useState } from "react"

import type { PortfolioCard, SiteLinks } from "../data/portfolio"
import { PreviewGalleryDialog } from "./PreviewGalleryDialog"

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

const floatingNav = [
  { label: "About", href: "#about", isActive: true },
  { label: "Featured", href: "#featured" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

const lowerWorkPattern: Array<"sm" | "wide" | "tall"> = ["tall", "sm", "sm", "wide", "sm", "tall", "wide", "sm", "sm", "wide", "sm", "sm"]

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

export function SimpleFeed({ cards, profile, links }: SimpleFeedProps) {
  const [isCopySuccess, setIsCopySuccess] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)

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

  const featureReadMoreHref = useMemo(() => openLinkSafely(links.linkedin), [links.linkedin])
  const studioLinkHref = useMemo(() => openLinkSafely(links.x), [links.x])
  const phonePreviewLabel = featuredPhone?.title ?? "Vertical project preview"
  const widePreviewLabel = featuredWide?.title ?? "Wide project preview"

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setIsCopySuccess(true)
      window.setTimeout(() => setIsCopySuccess(false), 1800)
    } catch {
      window.location.href = profile.contactHref
    }
  }

  return (
    <section className="mosaic-shell">
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <div className="mosaic-board">
        <article id="about" className="mosaic-tile mosaic-profile">
          <header className="mosaic-profile-head">
            <img src={profile.photo} alt={`${profile.name} portrait`} className="mosaic-avatar" loading="eager" decoding="async" />
            <div className="mosaic-profile-title">
              <h2>{profile.name} - Software Designer and Engineer</h2>
              <p>Santo Domingo</p>
            </div>
          </header>

          <ul className="mosaic-profile-links" aria-label="Social links">
            <li>
              {studioLinkHref ? (
                <a href={studioLinkHref} target="_blank" rel="noreferrer">
                  @rafaelmedina on X
                </a>
              ) : (
                <span>@rafaelmedina on X</span>
              )}
            </li>
            <li>
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.contactHref}>{links.email}</a>
            </li>
          </ul>

          <p className="mosaic-role">Independent Software designer</p>
          <p className="mosaic-bio">{profile.intro}</p>
          <p className="mosaic-bio">
            {profile.previouslyLabel}: {profile.previouslyText}
          </p>
          <p className="mosaic-bio">
            {profile.nowLabel}: {profile.nowText}
          </p>

          <button type="button" className="mosaic-copy-button" onClick={handleCopyEmail}>
            {isCopySuccess ? "Email copied" : "Copy Email"}
          </button>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isCopySuccess ? "Email copied to clipboard" : ""}
          </span>

          <p className="mosaic-fee" id="contact">
            Contact fee:
            <span>$1,000,000</span>
            <strong>free</strong>
          </p>
        </article>

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
          <ul className="mosaic-work-grid" aria-label="Selected work previews">
            {workTiles.map((tile) => {
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
                    onClick={() => setActiveWorkPreviewIndex(tile.previewIndex)}
                    aria-label={`Open ${tile.card.title} preview ${tile.previewIndex + 1} of ${workPreviewCards.length}`}
                  >
                    <span className={`mosaic-work-media-shell ${insetMedia ? "mosaic-work-media-shell-inset" : ""}`}>
                      {isVideoPreviewSource(tile.card.image) ? (
                        <video
                          src={tile.card.image}
                          muted
                          loop={!prefersReducedMotion}
                          autoPlay={!prefersReducedMotion}
                          playsInline
                          preload={prefersReducedMotion ? "none" : "metadata"}
                          aria-label={tile.card.title}
                          className={`mosaic-work-media ${insetMedia ? "mosaic-work-media-inset" : ""}`}
                        />
                      ) : (
                        <img
                          src={tile.card.image}
                          alt={tile.card.title}
                          loading="lazy"
                          decoding="async"
                          className={`mosaic-work-media ${insetMedia ? "mosaic-work-media-inset" : ""}`}
                        />
                      )}
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

      <nav aria-label="Primary" className="mosaic-floating-nav">
        <ul>
          {floatingNav.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <a href={item.href} aria-current={item.isActive ? "page" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

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
    </section>
  )
}
