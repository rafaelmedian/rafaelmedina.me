import { createElement } from "react"
import type { PortfolioCard } from "../data/portfolio"
import { getProjectPage } from "../lib/projectPageSlot"

export function DeferredProjectPage({ card }: { card: PortfolioCard }) {
  const page = getProjectPage()
  return page ? createElement(page, { card }) : null
}
