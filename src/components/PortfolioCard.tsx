import type { PortfolioCard as PortfolioCardType } from "../data/portfolio"
import { cn } from "../lib/cn"

export type PortfolioCardProps = {
  card: PortfolioCardType
  className?: string
}

export function PortfolioCard({ card, className }: PortfolioCardProps) {
  return (
    <article
      className={cn(
        "project-card relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 sm:p-7",
        className,
      )}
    >
      <p className="tabular-nums text-sm font-medium text-[var(--muted)]">{card.category}</p>
      <h2 className="mt-3 max-w-[18ch] text-balance text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-[1.9rem]">
        {card.title}
      </h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-[var(--media-inset)]">
        <img src={card.image} alt="" className="h-44 w-full object-cover sm:h-52" />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-5 inline-flex size-9 rounded-full border border-[var(--border)] bg-[var(--control-bg)] text-[var(--muted)] shadow-[0_1px_1px_rgba(0,0,0,0.1),0_6px_14px_-10px_rgba(0,0,0,0.24)]"
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
