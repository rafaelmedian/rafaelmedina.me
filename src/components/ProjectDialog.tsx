import { Dialog } from "@base-ui/react/dialog"

import type { PortfolioCard as PortfolioCardType } from "../data/portfolio"
import { cn } from "../lib/cn"
import { PortfolioCard } from "./PortfolioCard"

export type ProjectDialogProps = {
  card: PortfolioCardType
  className?: string
}

export function ProjectDialog({ card, className }: ProjectDialogProps) {
  const linkAttributes = card.ctaExternal
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {}

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          "group w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent)_72%,transparent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
          className,
        )}
      >
        <PortfolioCard
          card={card}
          className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-active:scale-[0.99] motion-reduce:transition-none"
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-overlay bg-[color-mix(in_oklab,var(--ink)_35%,transparent)] transition-opacity duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />

        <div className="fixed inset-0 z-modal p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-[calc(0.5rem+env(safe-area-inset-top))] sm:p-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pt-[calc(1rem+env(safe-area-inset-top))] lg:p-5 lg:pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:pt-[calc(1.25rem+env(safe-area-inset-top))]">
          <div className="mx-auto flex h-full w-full items-center justify-center">
            <Dialog.Popup className="relative h-[80vh] max-h-[80vh] w-[80vw] max-w-[80vw] overflow-y-auto rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl outline-none transition duration-200 ease-out data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-1 data-[starting-style]:opacity-0 motion-reduce:transition-none sm:rounded-[1.5rem] sm:p-9">
              <Dialog.Close
                aria-label={`Close details for ${card.title}`}
                className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--control-bg)] text-[var(--muted)] transition-colors duration-150 ease-out hover:bg-[var(--control-hover)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--accent)_72%,transparent)] motion-reduce:transition-none sm:right-6 sm:top-6"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                </svg>
              </Dialog.Close>

              <div className="grid gap-7 sm:grid-cols-[1.05fr_0.95fr] sm:items-start">
                <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-[var(--control-bg)]">
                  <img src={card.image} alt={`${card.title} preview`} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-5 pr-7 sm:pr-10">
                  <p className="tabular-nums text-sm font-semibold text-[var(--accent-strong)]">{card.category}</p>
                  <Dialog.Title className="max-w-[18ch] text-balance text-3xl font-semibold leading-[1.06] text-[var(--ink)]">
                    {card.title}
                  </Dialog.Title>
                  <Dialog.Description className="max-w-[34ch] text-pretty text-base leading-relaxed text-[var(--muted-strong)]">
                    {card.summary}
                  </Dialog.Description>
                  <p className="max-w-[36ch] text-pretty text-base leading-relaxed text-[var(--muted)]">
                    {card.detail}
                  </p>

                  <a
                    href={card.ctaHref}
                    {...linkAttributes}
                    className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors duration-150 ease-out hover:bg-[var(--accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] motion-reduce:transition-none"
                  >
                    {card.ctaLabel}
                  </a>
                </div>
              </div>
            </Dialog.Popup>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
