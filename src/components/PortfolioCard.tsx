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
      <p className="tabular-nums text-sm font-medium text-stone-500">{card.category}</p>
      <h2 className="mt-3 max-w-[18ch] text-balance text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-[1.9rem]">
        {card.title}
      </h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(148,163,184,0.25)]">
        <img src={card.image} alt="" className="h-44 w-full object-cover sm:h-52" />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-5 inline-flex size-9 rounded-full border border-stone-300 bg-white text-stone-500 shadow-[0_1px_1px_rgba(0,0,0,0.1),0_6px_14px_-10px_rgba(0,0,0,0.24)]"
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
