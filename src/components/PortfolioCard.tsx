import type { PortfolioCard as PortfolioCardType } from "../data/portfolio"
import { cn } from "../lib/cn"

export type PortfolioCardVariant = "editorial" | "media" | "split" | "spotlight"

export type PortfolioCardProps = {
  card: PortfolioCardType
  variant?: PortfolioCardVariant
  className?: string
}

export function PortfolioCard({ card, variant = "editorial", className }: PortfolioCardProps) {
  return (
    <article
      data-card-variant={variant}
      className={cn(
        "project-card relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 sm:p-7",
        className,
      )}
    >
      {variant === "media" ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-[var(--media-inset)]">
            <img src={card.image} alt="" className="h-48 w-full object-cover sm:h-56" />
          </div>
          <p className="mt-5 tabular-nums text-sm font-semibold text-[var(--accent-strong)]">{card.category}</p>
          <h2 className="mt-2 max-w-[17ch] text-balance text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-[1.85rem]">
            {card.title}
          </h2>
          <p className="mt-3 max-w-[32ch] text-pretty text-[1.02rem] leading-relaxed text-[var(--muted)]">
            {card.summary}
          </p>
        </>
      ) : null}

      {variant === "split" ? (
        <>
          <p className="tabular-nums text-sm font-medium text-[var(--muted)]">{card.category}</p>
          <div className="mt-5 grid grow gap-5 sm:grid-cols-[1fr_1.2fr] sm:items-stretch">
            <div className="overflow-hidden rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-[var(--media-inset)]">
              <img src={card.image} alt="" className="h-36 w-full object-cover sm:h-full" />
            </div>
            <div className="flex flex-col justify-between">
              <h2 className="max-w-[16ch] text-balance text-[1.7rem] font-semibold leading-tight text-[var(--ink)]">
                {card.title}
              </h2>
              <p className="mt-4 max-w-[24ch] text-pretty text-base leading-relaxed text-[var(--muted)]">
                {card.summary}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {variant === "spotlight" ? (
        <>
          <div className="pointer-events-none absolute inset-0">
            <img src={card.image} alt="" className="h-full w-full object-cover opacity-[0.17]" />
            <div className="absolute inset-0 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--surface)_74%,transparent),var(--surface)_58%)]" />
          </div>
          <div className="relative z-[1]">
            <p className="tabular-nums text-sm font-semibold text-[var(--accent-strong)]">{card.category}</p>
            <h2 className="mt-4 max-w-[15ch] text-balance text-[1.95rem] font-semibold leading-[1.06] text-[var(--ink)]">
              {card.title}
            </h2>
            <p className="mt-4 max-w-[28ch] text-pretty text-base leading-relaxed text-[var(--muted-strong)]">
              {card.summary}
            </p>
          </div>
        </>
      ) : null}

      {variant === "editorial" ? (
        <>
          <p className="tabular-nums text-sm font-medium text-[var(--muted)]">{card.category}</p>
          <h2 className="mt-3 max-w-[18ch] text-balance text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-[1.9rem]">
            {card.title}
          </h2>
          <p className="mt-3 max-w-[31ch] text-pretty text-base leading-relaxed text-[var(--muted)]">
            {card.summary}
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-[var(--media-inset)]">
            <img src={card.image} alt="" className="h-40 w-full object-cover sm:h-48" />
          </div>
        </>
      ) : null}

      <span
        aria-hidden="true"
        className="project-card-plus absolute bottom-5 right-5 inline-flex size-9 rounded-full border border-[var(--border)] bg-[var(--control-bg)] text-[var(--muted)] shadow-[0_1px_1px_rgba(0,0,0,0.1),0_6px_14px_-10px_rgba(0,0,0,0.24)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
        >
          <path d="M12 6v12M6 12h12" strokeLinecap="round" />
        </svg>
      </span>
    </article>
  )
}
