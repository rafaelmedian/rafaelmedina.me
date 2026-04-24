import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react"

import { homeRows, type PortfolioCard, type SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
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
  showProjects?: boolean
}

type RowFit = "cover" | "contain"
type FeedTab = "home" | "resume"

type WorkListItem = {
  card: PortfolioCard
  previewIndex: number
  year: string
  client: string
  discipline: string
  summary: string
}

type ResumeWorkItem = {
  id: string
  title: string
  card: PortfolioCard
  previewIndex: number
  previewIndexes: number[]
  year: string
  client: string
  discipline: string
  summary: string
  projectCount: number
}

const puntaCanaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Santo_Domingo",
  timeZoneName: "short",
})

function getInitialFeedTab(showProjects: boolean): FeedTab {
  if (!showProjects || typeof window === "undefined") return "home"
  return window.location.hash === "#resume" ? "resume" : "home"
}

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

function openPreview(
  card: PortfolioCard,
  previewIndex: number,
  setSelectedWorkPreviewIndex: (value: number) => void,
  placement: "home_grid" | "resume_preview" | "resume_item" = "resume_preview",
) {
  trackEvent("work_preview_open", {
    preview_id: card.id,
    preview_title: card.title,
    preview_index: previewIndex + 1,
    preview_placement: placement,
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

function getProjectCountLabel(total: number) {
  return `${total} project ${total === 1 ? "image" : "images"}`
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

function SocialCorner({ activeTab, onTabChange, showTabs }: { activeTab: FeedTab; onTabChange: (tab: FeedTab) => void; showTabs: boolean }) {
  return (
    <nav className="mosaic-social-corner" aria-label="Portfolio sections">
      {showTabs ? (
        <div className="mosaic-social-tabs" role="tablist" aria-label="Portfolio sections">
          {(["home", "resume"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              id={`portfolio-${tab}-tab`}
              role="tab"
              aria-selected={activeTab === tab}
              className={`mosaic-social-link mosaic-social-tab${activeTab === tab ? " is-active" : ""}`}
              onClick={() => onTabChange(tab)}
            >
              {tab === "home" ? "Home" : "Resume"}
            </button>
          ))}
        </div>
      ) : null}
    </nav>
  )
}

const workItemMeta: Record<string, Omit<WorkListItem, "card" | "previewIndex">> = {
  "preview-shot-9": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, prototyping",
    summary: "A multiwallet switching flow for traders managing several connected accounts.",
  },
  "preview-shot-16": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, web",
    summary: "Homepage explorations for making DEX routing feel clearer and more approachable.",
  },
  "preview-popparazi-v1": {
    year: "2021",
    client: "Popparazi",
    discipline: "Product design, mobile",
    summary: "Early social camera concepts for publishing through friends instead of feeds.",
  },
  "preview-protector": {
    year: "2024",
    client: "Protector",
    discipline: "Product design, mobile",
    summary: "Protection-focused product surfaces with a calmer path through sensitive moments.",
  },
  "preview-shot-14": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, mobile",
    summary: "Mobile trading screens tuned for dense information, quick scanning, and confidence.",
  },
  "preview-shot-20": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, trust",
    summary: "Security audit surfaces that explain risk without turning the product into paperwork.",
  },
  "preview-shot-21": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, markets",
    summary: "Token detail pages for comparing market context before making a trade.",
  },
  "preview-shot-1": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, trading",
    summary: "A trade page composition for quote review, route confidence, and execution clarity.",
  },
  "preview-shot-15": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, navigation",
    summary: "Navigation patterns for moving through trading flows on smaller screens.",
  },
  "preview-shot-19": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, interface systems",
    summary: "A modular trade component intended to stay legible across contexts.",
  },
  "preview-shot-22": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, visual systems",
    summary: "Dark mode explorations for a trading interface that still feels precise and quiet.",
  },
  "preview-shot-23": {
    year: "2025",
    client: "0x / Matcha",
    discipline: "Product design, advanced trading",
    summary: "Pro trading concepts for power users who need more density without more noise.",
  },
}

const resumeWorkMeta = [
  {
    id: "matcha-0x",
    title: "Matcha / 0x product work",
    cardIds: [
      "preview-shot-9",
      "preview-shot-16",
      "preview-shot-14",
      "preview-shot-20",
      "preview-shot-21",
      "preview-shot-1",
      "preview-shot-15",
      "preview-shot-19",
      "preview-shot-22",
      "preview-shot-23",
    ],
    year: "2025",
    client: "0x / Matcha",
    discipline: "Trading, markets, trust, mobile",
    summary: "A run of product surfaces across DEX trading, wallet flows, token pages, and interface systems.",
  },
  {
    id: "popparazi",
    title: "Popparazi V1",
    cardIds: ["preview-popparazi-v1"],
    year: "2021",
    client: "Popparazi",
    discipline: "Mobile social product",
    summary: "Early social camera concepts for publishing through friends instead of feeds.",
  },
  {
    id: "protector",
    title: "Protector",
    cardIds: ["preview-protector"],
    year: "2024",
    client: "Protector",
    discipline: "Protection-focused mobile UX",
    summary: "Protection-focused product surfaces with a calmer path through sensitive moments.",
  },
]

function getWorkItem(card: PortfolioCard, previewIndex: number): WorkListItem {
  const fallbackMeta = {
    year: "2025",
    client: card.category,
    discipline: "Product design",
    summary: card.summary || card.detail || "Selected product design work.",
  }

  return {
    card,
    previewIndex,
    ...(workItemMeta[card.id] ?? fallbackMeta),
  }
}

function getResumeWorkItems(workItems: WorkListItem[]): ResumeWorkItem[] {
  return resumeWorkMeta.flatMap((caseMeta) => {
    const caseWorkItems = caseMeta.cardIds.flatMap((cardId) => {
      const workItem = workItems.find((candidate) => candidate.card.id === cardId)
      return workItem ? [workItem] : []
    })
    const representativeWorkItem = caseWorkItems[0]
    if (!representativeWorkItem) return []

    return [
      {
        id: caseMeta.id,
        title: caseMeta.title,
        card: representativeWorkItem.card,
        previewIndex: representativeWorkItem.previewIndex,
        previewIndexes: caseWorkItems.map((item) => item.previewIndex),
        year: caseMeta.year,
        client: caseMeta.client,
        discipline: caseMeta.discipline,
        summary: caseMeta.summary,
        projectCount: caseWorkItems.length,
      },
    ]
  })
}

export function SimpleFeed({ cards, profile, links, showProjects = true }: SimpleFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>(() => getInitialFeedTab(showProjects))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [activeWorkPreviewIndex, setActiveWorkPreviewIndex] = useState<number | null>(null)
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0)
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

  const workListItems = useMemo(
    () => rowsRender.flatMap((row) => row.items.map((item) => getWorkItem(item.card, item.previewIndex))),
    [rowsRender],
  )
  const resumeWorkItems = useMemo(() => getResumeWorkItems(workListItems), [workListItems])
  const flatWorkCards = useMemo(() => workListItems.map((item) => item.card), [workListItems])
  const selectedWorkItem = resumeWorkItems[Math.min(selectedWorkIndex, Math.max(resumeWorkItems.length - 1, 0))]
  const selectedWorkPreviewIndex = activeWorkPreviewIndex ?? selectedWorkItem?.previewIndex ?? 0
  const setSelectedWorkPreviewIndex = (index: number) => {
    setActiveWorkPreviewIndex(index)
  }
  const setFeedTab = (nextTab: FeedTab) => {
    setActiveTab(nextTab)
    trackEvent("feed_tab_change", { tab: nextTab })
  }
  const isHomeTab = activeTab === "home"

  const shellClassName = `mosaic-shell${showProjects ? ` mosaic-shell-split mosaic-shell-tab-${activeTab}` : " mosaic-shell-hero-only"}`
  const heroClassName = `mosaic-hero${showProjects ? "" : " mosaic-hero-hero-only"}`

  const renderWorkMedia = (
    card: PortfolioCard,
    source = card.image,
    label = card.title,
    eager = false,
    className = "mosaic-row-media",
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
          className={className}
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
        className={className}
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
    if (!showProjects) {
      setActiveTab("home")
    }
  }, [showProjects])

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
    if (typeof window === "undefined" || !showProjects) return

    const syncFromHash = () => {
      setActiveTab(window.location.hash === "#resume" ? "resume" : "home")
    }

    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [showProjects])

  useEffect(() => {
    if (typeof window === "undefined" || !showProjects) return

    const nextUrl = `${window.location.pathname}${window.location.search}${activeTab === "resume" ? "#resume" : "#home"}`
    window.history.replaceState(null, "", nextUrl)
  }, [activeTab, showProjects])

  const selectWorkItem = (index: number, source: "hover" | "focus" | "click") => {
    setSelectedWorkIndex(index)

    if (source === "click") {
      const workItem = resumeWorkItems[index]
      if (!workItem) return
      trackEvent("work_preview_select", {
        preview_id: workItem.id,
        preview_title: workItem.title,
        preview_index: workItem.previewIndex + 1,
      })
    }
  }

  const renderWorkIndexList = () => (
    <div className="mosaic-work-index-list">
      <div className="mosaic-work-index-heading">
        <p>Resume</p>
        <h2>Selected product work</h2>
      </div>
      <ol className="mosaic-work-list" aria-label="Selected work">
        {resumeWorkItems.map((item, index) => {
          const isSelected = item.id === selectedWorkItem?.id

          return (
            <li key={item.id} className="mosaic-work-list-item">
              <button
                type="button"
                className={`mosaic-work-list-button${isSelected ? " is-selected" : ""}`}
                aria-current={isSelected ? "true" : undefined}
                onMouseEnter={() => selectWorkItem(index, "hover")}
                onFocus={() => selectWorkItem(index, "focus")}
                onClick={() => selectWorkItem(index, "click")}
              >
                <span className="mosaic-work-list-year">{item.year}</span>
                <span className="mosaic-work-list-body">
                  <span className="mosaic-work-list-title-row">
                    <span className="mosaic-work-list-title">{item.title}</span>
                    <span className="mosaic-work-list-client">{item.client}</span>
                  </span>
                  <span className="mosaic-work-list-discipline">{item.discipline}</span>
                  <span className="mosaic-work-list-count">{getProjectCountLabel(item.projectCount)}</span>
                  <span className="mosaic-work-list-summary">{item.summary}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )

  const renderSelectedWorkPreview = () =>
    selectedWorkItem ? (
      <aside className="mosaic-work-preview" aria-live="polite" aria-label="Selected work preview">
        <button
          type="button"
          className={`mosaic-work-preview-card mosaic-work-preview-card-${selectedWorkItem.card.id}`}
          onClick={() => openPreview(selectedWorkItem.card, selectedWorkItem.previewIndex, setSelectedWorkPreviewIndex, "resume_preview")}
          aria-label={`Open ${selectedWorkItem.title} preview ${selectedWorkItem.previewIndex + 1} of ${flatWorkCards.length}`}
        >
          {renderWorkMedia(
            selectedWorkItem.card,
            selectedWorkItem.card.image,
            selectedWorkItem.title,
            selectedWorkItem.previewIndex === 0,
            "mosaic-work-preview-media",
          )}
        </button>
        <div className="mosaic-work-preview-caption">
          <span>{selectedWorkItem.year}</span>
          <strong>{selectedWorkItem.title}</strong>
        </div>
      </aside>
    ) : null

  const renderHomeRows = () => (
    <div className="mosaic-rows" aria-label="Selected work previews">
      {rowsRender.map((row, rowIndex) => {
        const rowStyle = {
          ...(row.height ? { "--row-height": row.height } : {}),
          ...(row.gap ? { "--row-gap": row.gap } : {}),
        } as CSSProperties
        const eagerRow = rowIndex === 0
        return (
          <Fragment key={row.id}>
            <div className={`mosaic-row mosaic-${row.id}`} style={rowStyle}>
              {row.items.map((item) => {
                const itemKey = `${item.card.id}-${item.previewIndex}`
                const paginationTotal = getPaginationTotal(item.card)
                const isPaginatedCard = paginationTotal > 1
                const paginationScreenIndex = isPaginatedCard ? (paginatedPreviewIndexes[item.card.id] ?? 0) % paginationTotal : 0
                const mediaSource = isPaginatedCard ? getPaginationImage(item.card, paginationScreenIndex) : item.card.image
                const mediaLabel = isPaginatedCard ? `${item.card.title} screen ${paginationScreenIndex + 1} of ${paginationTotal}` : item.card.title
                const itemStyle = {
                  "--row-span": item.span,
                  ...(item.width ? { flex: `0 0 ${item.width}` } : {}),
                  ...(item.mediaMaxHeight ? { "--row-media-max-height": item.mediaMaxHeight } : {}),
                } as CSSProperties
                return (
                  <div key={itemKey} className={`mosaic-row-item mosaic-row-item-fit-${item.fit}`} style={itemStyle}>
                    <button
                      type="button"
                      className={`mosaic-row-card mosaic-row-card-${item.card.id}${isPaginatedCard ? " mosaic-row-card-paginated" : ""}`}
                      onClick={() => {
                        if (isPaginatedCard) {
                          paginatePreviewCard(item.card, paginationScreenIndex, paginationTotal, setPaginatedPreviewIndexes)
                          return
                        }

                        openPreview(item.card, item.previewIndex, setSelectedWorkPreviewIndex, "home_grid")
                      }}
                      aria-label={
                        isPaginatedCard
                          ? `Show next ${item.card.title} screen, currently screen ${paginationScreenIndex + 1} of ${paginationTotal}`
                          : `Open ${item.card.title} preview ${item.previewIndex + 1} of ${flatWorkCards.length}`
                      }
                    >
                      {renderWorkMedia(item.card, mediaSource, mediaLabel, eagerRow)}
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
          </Fragment>
        )
      })}
    </div>
  )

  return (
    <section className={shellClassName}>
      <h1 className="sr-only">{profile.name} portfolio</h1>
      <SocialCorner activeTab={activeTab} onTabChange={setFeedTab} showTabs={showProjects} />
      <header id="about" className={heroClassName}>
        <div className="mosaic-hero-profile mosaic-hero-profile-animated">
          <div id="home" className="mosaic-profile-info">
            <button
              type="button"
              className={`mosaic-avatar mosaic-avatar-coin${isHomeTab ? "" : " is-active"}`}
              aria-label="Show home"
              aria-controls="home-tab-panel"
              aria-pressed={isHomeTab}
              onClick={() => setFeedTab("home")}
            >
              <div className="mosaic-avatar-coin-inner">
                <img src={profile.photo} alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-front" loading="eager" decoding="async" />
                <img src={profile.photo} alt="" aria-hidden="true" className="mosaic-avatar-face mosaic-avatar-face-back" loading="eager" decoding="async" />
              </div>
            </button>
            <div className="mosaic-profile-meta">
              <h2>{profile.name}</h2>
              <p className="mosaic-profile-subtitle">{profile.title}</p>
            </div>
          </div>
          <div className="mosaic-profile-screen" aria-live="polite" data-screen={activeTab}>
            {isHomeTab ? (
              <div id="home-tab-panel" className="mosaic-profile-about-screen" role="tabpanel" aria-labelledby="portfolio-home-tab">
                <p className="mosaic-profile-about-copy">
                  Born in Santo Domingo, shaped in DC, and now in the middle of a move to NYC.
                </p>
                <p className="mosaic-profile-about-copy mosaic-profile-about-copy-muted">
                  I co-founded Turtle, a way for college students to meet each other; redesigned developer tools at Twilio; built financial workflows
                  with Moody&apos;s; and helped push Web3 product craft forward at Matcha.xyz.
                </p>
                <p className="mosaic-profile-about-copy mosaic-profile-about-copy-muted">
                  I&apos;ve also been fortunate to work with teams at 0x / Matcha, Moody&apos;s, Twilio, Onit, and Chainlink. Since 2015, I&apos;ve focused on
                  product design for complex tools and high-trust workflows.
                </p>
                <p className="mosaic-profile-about-copy mosaic-profile-about-copy-muted">
                  These days I freelance on focused, high-impact projects. Reach me at{" "}
                  <a href="https://x.com/rafaelmedian" target="_blank" rel="noreferrer" className="mosaic-profile-link">
                    @rafaelmedian
                  </a>{" "}
                  ,{" "}
                  <a href={links.telegram} target="_blank" rel="noreferrer" className="mosaic-profile-link">
                    Telegram
                  </a>{" "}
                  or{" "}
                  <a href="mailto:hey@rafaelmedina.me" className="mosaic-profile-link">
                    hey@rafaelmedina.me
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div id="resume" className="mosaic-profile-resume-screen" role="tabpanel" aria-labelledby="portfolio-resume-tab">
                {renderWorkIndexList()}
              </div>
            )}
          </div>
          {isHomeTab ? (
            <p className="mosaic-profile-location">
              Punta Cana, soon NYC <span aria-hidden="true">·</span> Local time:{" "}
              <LiveTimeLabel label={puntaCanaTimeLabel} reducedMotion={prefersReducedMotion} />
            </p>
          ) : null}
        </div>
      </header>

      {showProjects ? (
        <>
          <article id="work" className="mosaic-work" aria-label={isHomeTab ? "Home project list" : "Resume project preview"}>
            <h2 className="sr-only">{isHomeTab ? "Selected work" : "Selected resume project preview"}</h2>
            {isHomeTab ? renderHomeRows() : renderSelectedWorkPreview()}
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
            onSelectedIndexChange={(nextIndex) => {
              setSelectedWorkPreviewIndex(nextIndex)
              const nextResumeIndex = resumeWorkItems.findIndex((item) => item.previewIndexes.includes(nextIndex))
              setSelectedWorkIndex(nextResumeIndex >= 0 ? nextResumeIndex : 0)
            }}
          />
        </>
      ) : null}
    </section>
  )
}
