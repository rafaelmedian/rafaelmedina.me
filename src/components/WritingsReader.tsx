import { type RefObject } from "react"
import { writings } from "../data/writings"
import { WritingArticle } from "./WritingArticle"

export type WritingsReaderProps = {
  writingId: string
  titleRef: RefObject<HTMLHeadingElement | null>
  onSelectWriting: (id: string) => void
}

/** Deferred article content. The preview gallery owns the dialog and navigation. */
export function WritingsReader({ writingId, titleRef, onSelectWriting }: WritingsReaderProps) {
  const writing = writings.find((entry) => entry.id === writingId)
  return writing ? <WritingArticle key={writing.id} writing={writing}
    titleRef={titleRef} showLikes onSelectWriting={onSelectWriting} /> : null
}
