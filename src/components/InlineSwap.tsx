import { useEffect, useRef, useState, type ReactNode } from "react"
import { cssTimeToMilliseconds } from "../lib/cssTime"

type InlineSwapProps = {
  value: string | number
  children?: ReactNode
  direction?: "up" | "down"
  /** Reserve the widest label without adding duplicate accessible text. */
  reserve?: string
}

/** A small, noninteractive label or icon trading places like the TOC label. */
export function InlineSwap({ value, children, direction, reserve }: InlineSwapProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const content = children ?? value
  const [swap, setSwap] = useState<{
    value: string | number
    content: ReactNode
    leaving: ReactNode
    direction: "up" | "down"
  }>({ value, content, leaving: null, direction: "up" })

  // Capture the outgoing content before committing the new value. A fresh
  // keyed arrival also restarts the animation when taps arrive mid-swap.
  if (swap.value !== value) {
    setSwap({
      value,
      content,
      leaving: swap.content,
      direction: direction ?? (typeof value === "number" && typeof swap.value === "number" && value < swap.value ? "down" : "up"),
    })
  }

  useEffect(() => {
    const root = rootRef.current
    if (swap.leaving === null || !root) return
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : cssTimeToMilliseconds(getComputedStyle(root).getPropertyValue("--duration-quick"))
    const timer = window.setTimeout(() => setSwap((current) => ({ ...current, leaving: null })), duration)
    return () => window.clearTimeout(timer)
  }, [swap])

  return (
    <span ref={rootRef} className="inline-swap" data-direction={swap.direction}
      data-swapping={swap.leaving !== null || undefined} data-reserve={reserve}>
      <span key={value} className="inline-swap-current">{content}</span>
      {swap.leaving !== null && (
        <span key={`leaving-${value}`} className="inline-swap-leaving" aria-hidden="true">{swap.leaving}</span>
      )}
    </span>
  )
}
