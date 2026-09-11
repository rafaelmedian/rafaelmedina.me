import { createElement } from "react"

import type { WritingSummary } from "../data/writingIndex"
import { getWritingPage } from "../lib/writingPageSlot"

/** The note page once its chunk is in hand; see `lib/writingPageSlot`. */
export function DeferredWritingPage({ writing }: { writing: WritingSummary }) {
  const page = getWritingPage()
  return page ? createElement(page, { writing }) : null
}
