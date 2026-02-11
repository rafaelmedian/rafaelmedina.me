import type { PortfolioCard as PortfolioCardType } from "../data/portfolio"
import { cn } from "../lib/cn"
import { ProjectDialog } from "./ProjectDialog"

type PortfolioGridProps = {
  cards: PortfolioCardType[]
}

const bentoPattern = [
  "xl:col-span-5 xl:row-span-4",
  "xl:col-span-4 xl:row-span-4",
  "xl:col-span-3 xl:row-span-2",
  "xl:col-span-3 xl:row-span-2",
  "xl:col-span-4 xl:row-span-2",
  "xl:col-span-5 xl:row-span-2",
]

export function PortfolioGrid({ cards }: PortfolioGridProps) {
  return (
    <section className="space-y-6">
      <ul className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:gap-8 xl:auto-rows-[10rem] xl:grid-cols-12">
        {cards.map((card, index) => (
          <li key={card.id} className={cn("min-h-[22rem] xl:min-h-0", bentoPattern[index % bentoPattern.length])}>
            <ProjectDialog card={card} className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}
