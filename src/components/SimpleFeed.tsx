import { useMemo, useState } from "react"

import { cn } from "../lib/cn"
import type { PortfolioCard, SiteLinks } from "../data/portfolio"

type SiteProfile = {
  name: string
  title: string
  intro: string
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

const floatingNav = [
  { label: "Feed", href: "#feed", isActive: true },
  { label: "About", href: "#about" },
  { label: "Work", href: "#feed" },
  { label: "Contact", href: "#contact" },
]
const archiveMonthLabels = [
  "January 2026",
  "December 2025",
  "November 2025",
  "October 2025",
  "September 2025",
  "August 2025",
]

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function getArchiveLabel(index: number) {
  return archiveMonthLabels[index % archiveMonthLabels.length]
}

export function SimpleFeed({ cards, profile, links }: SimpleFeedProps) {
  const [mapLoadFailed, setMapLoadFailed] = useState(false)
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapboxMapSrc = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-80.1918,25.7617,10.8,0/1200x900@2x?logo=false&attribution=false&access_token=${mapboxToken}`
    : null
  const osmEmbedSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-80.315%2C25.694%2C-80.067%2C25.867&layer=mapnik&marker=25.7617%2C-80.1918"
  const shouldRenderMapboxImage = Boolean(mapboxMapSrc) && !mapLoadFailed
  const nycTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }).format(new Date()),
    [],
  )
  const santoDomingoTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Santo_Domingo",
      }).format(new Date()),
    [],
  )

  return (
    <section className="w-full px-1 pb-28 pt-3 text-[var(--ink)] sm:px-2 sm:pb-32 lg:px-3">
      <header id="about" className="pt-12 pb-12">
        <div className="mx-auto flex max-w-[70ch] flex-col items-center gap-5 px-2 text-center sm:px-3">
          <div className="space-y-1">
            <p className="text-balance text-[1.72rem] font-medium leading-none text-[var(--ink)]">{profile.name}</p>
            <p className="text-balance text-[1.72rem] font-medium leading-none text-[var(--muted)]">{profile.title}</p>
            <p className="pt-1 text-pretty text-[0.98rem] text-[var(--muted)]">
              NYC {nycTime} - Santo Domingo {santoDomingoTime}
            </p>
          </div>

          <p className="max-w-[26ch] text-pretty text-[1.35rem] font-medium leading-[1.12] text-[var(--ink)]">
            Designer and maker focused on digital products, practical systems, and building teams obsessed with craft.
          </p>
        </div>
      </header>

      <ul id="feed" className="columns-1 gap-5 px-1 md:columns-2 2xl:columns-3">
        {cards.map((card, index) => {
          const isPreview = card.kind === "preview"
          const isMusicCard = card.id === "widget-music"
          const isMapCard = card.id === "widget-map"
          const isResumeCard = card.id === "info-cv"
          const isStickerStackCard = card.id === "info-notes"
          const isCustomCard = isMusicCard || isMapCard || isResumeCard || isStickerStackCard

          return (
            <li key={card.id} className="mb-6 break-inside-avoid">
              <article
                className={cn(
                  "group isolate overflow-hidden rounded-[16px] border-0",
                  isPreview ? "bg-[#08080c] text-white" : "bg-[#e7e7e8]",
                )}
              >
                <div className={cn("relative", isPreview || isCustomCard ? "" : "p-6")}>
                  {isPreview ? (
                    <>
                      <div className="relative">
                        {isVideoPreviewSource(card.image) ? (
                          <video
                            src={card.image}
                            aria-label={card.title}
                            muted
                            loop
                            playsInline
                            autoPlay
                            preload="metadata"
                            className="block h-auto w-full"
                          />
                        ) : (
                          <img src={card.image} alt={card.title} className="block h-auto w-full" />
                        )}
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-4 pb-4 pt-6 text-[0.78rem] font-medium opacity-0 transition-opacity duration-180 ease-out group-hover:opacity-100">
                        <p className="truncate text-white mix-blend-difference">{card.title}</p>
                        <p className="shrink-0 text-white/85 mix-blend-difference">{getArchiveLabel(index)}</p>
                      </div>
                    </>
                  ) : isMusicCard ? (
                    <iframe
                      title="Spotify player"
                      src={card.ctaHref}
                      className="block h-[352px] w-full border-0"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isMapCard ? (
                    <div className="aspect-[4/3] bg-[#dbe1ea]">
                      {shouldRenderMapboxImage ? (
                        <img
                          src={mapboxMapSrc ?? undefined}
                          alt="Map centered on Miami, Florida"
                          className="block h-full w-full object-cover"
                          onError={() => setMapLoadFailed(true)}
                        />
                      ) : (
                        <iframe
                          title="Map centered on Miami, Florida"
                          src={osmEmbedSrc}
                          className="block h-full w-full border-0"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ) : isResumeCard ? (
                    <div className="relative overflow-hidden rounded-[16px] border border-black/10 bg-[#f8f8f8] p-6">
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-black/10 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
                      <div className="relative z-base">
                        <p className="text-[0.7rem] font-semibold uppercase text-[color-mix(in_oklab,var(--muted)_84%,#6b7280)]">
                          Mini Resume
                        </p>
                        <h2 className="mt-2 text-balance text-[1.3rem] font-semibold leading-[1.04] text-[var(--ink)]">
                          Rafael Medina
                        </h2>
                        <p className="mt-1 text-pretty text-[0.84rem] font-medium text-[color-mix(in_oklab,var(--ink)_58%,#6b7280)]">
                          Product Designer - Miami, FL
                        </p>

                        <div className="mt-4 space-y-2 text-pretty text-[0.86rem] leading-[1.5] text-[color-mix(in_oklab,var(--ink)_72%,#52525b)]">
                          <p>10+ years designing digital products for SaaS and startup teams.</p>
                          <p>Specialty: UI systems, product strategy, and design execution.</p>
                          <p>Now: freelance product design and AI workflow experiments.</p>
                        </div>

                        <a
                          href={card.ctaHref}
                          target={card.ctaExternal ? "_blank" : undefined}
                          rel={card.ctaExternal ? "noreferrer" : undefined}
                          className="mt-5 inline-flex items-center rounded-full bg-[var(--ink)] px-3 py-1.5 text-[0.77rem] font-medium text-[var(--canvas)] no-underline transition-opacity duration-150 hover:opacity-90"
                        >
                          {card.ctaLabel}
                        </a>
                      </div>
                    </div>
                  ) : isStickerStackCard ? (
                    <div className="relative h-[270px] overflow-hidden rounded-[16px] border border-black/10 bg-[#eceef0] p-5">
                      <div className="absolute left-7 top-7 w-[70%] rounded-[14px] border border-black/10 bg-[#fdfdfd] px-4 py-3 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out group-hover:rotate-[-5deg]">
                        <p className="text-[0.72rem] font-medium text-[color-mix(in_oklab,var(--ink)_70%,#6b7280)]">UI Systems</p>
                        <p className="mt-1 text-pretty text-[0.9rem] font-semibold text-[var(--ink)]">Component architecture</p>
                      </div>
                      <div className="absolute left-[18%] top-[35%] w-[68%] rounded-[14px] border border-black/10 bg-[#f6f7f8] px-4 py-3 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out group-hover:translate-y-[-4px] group-hover:rotate-[2deg]">
                        <p className="text-[0.72rem] font-medium text-[color-mix(in_oklab,var(--ink)_70%,#6b7280)]">Research</p>
                        <p className="mt-1 text-pretty text-[0.9rem] font-semibold text-[var(--ink)]">Signals, user feedback, iteration</p>
                      </div>
                      <div className="absolute left-[9%] top-[63%] w-[72%] rounded-[14px] border border-black/10 bg-[#efefef] px-4 py-3 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out group-hover:translate-y-[-2px] group-hover:rotate-[-2deg]">
                        <p className="text-[0.72rem] font-medium text-[color-mix(in_oklab,var(--ink)_70%,#6b7280)]">Execution</p>
                        <p className="mt-1 text-pretty text-[0.9rem] font-semibold text-[var(--ink)]">Design-to-build handoff clarity</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-[14px] border border-black/10 bg-[#f8f8f8] p-5">
                        <p className="w-fit rounded-full border border-black/10 bg-white px-2.5 py-1 text-[0.67rem] font-semibold uppercase text-[color-mix(in_oklab,var(--muted)_80%,#64748b)]">
                          {card.category}
                        </p>
                        <h2 className="mt-3 text-balance text-[1.25rem] font-semibold leading-[1.08] text-[var(--ink)]">
                          {card.title}
                        </h2>
                        <p className="mt-3 text-pretty text-[0.9rem] leading-[1.55] text-[color-mix(in_oklab,var(--ink)_66%,#6b7280)]">
                          {card.summary || card.detail}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.78rem] font-semibold">
                          {card.ctaHref !== "#" ? (
                            <a
                              href={card.ctaHref}
                              target={card.ctaExternal ? "_blank" : undefined}
                              rel={card.ctaExternal ? "noreferrer" : undefined}
                              className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[var(--ink)] no-underline transition-colors duration-150 hover:bg-black hover:text-white"
                            >
                              {card.ctaLabel}
                            </a>
                          ) : null}
                          <span className="text-[color-mix(in_oklab,var(--muted)_88%,#6b7280)]">{links.email}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <footer id="contact" className="mt-8 border-t border-[var(--border)] px-2 pt-4 text-[0.82rem] text-[var(--muted)] sm:px-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>{profile.availability}</span>
          <a href={profile.contactHref} className="text-[var(--ink)] no-underline hover:underline">
            {profile.contactLabel}
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" className="text-[var(--ink)] no-underline hover:underline">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-[var(--ink)] no-underline hover:underline">
            LinkedIn
          </a>
        </div>
      </footer>

      <nav
        aria-label="Primary"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-dock flex justify-center px-3 sm:bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <ul className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-black p-1.5 text-white shadow-[0_10px_26px_-16px_rgba(0,0,0,0.55)]">
          {floatingNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-[0.78rem] font-medium no-underline transition-colors duration-150",
                  item.isActive ? "bg-white/16 text-white" : "text-white/78 hover:bg-white/12 hover:text-white",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
