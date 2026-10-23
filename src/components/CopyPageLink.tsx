import { Check, Link2 } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { cssTimeToMilliseconds } from "../lib/cssTime"
import { InlineSwap } from "./InlineSwap"

const COPY_CONFIRMATION_MS = 1600

/**
 * A page's own address, offered rather than left in the URL bar. Every note,
 * project and the résumé has a page of its own -- prerendered, so the link
 * opens straight into the same sheet -- but a visitor reading inside a sheet
 * has no reason to look up there, and the one thing they might want to do with
 * something they liked is send it to someone. Pass the absolute public URL
 * rather than one read off `location`, so a copy made from a preview server or
 * a local build still pastes as the public link.
 */
export function CopyPageLink({ href, subject, className, variant = "pill" }: {
  href: string
  /** What the link is to, for the spoken name: "note", "project", "résumé". */
  subject: string
  className?: string
  /** "pill" is the notes' icon-only glass control; "text" is a plain link with no icon,
   *  for places where a control would compete with what is beside it. */
  variant?: "pill" | "text"
}) {
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<number | undefined>(undefined)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const fromWidthRef = useRef(0)
  const resizeRef = useRef<Animation | null>(null)
  useEffect(() => () => window.clearTimeout(resetRef.current), [])

  // Read the width the pill is showing -- mid-resize, if a press lands during
  // one -- before the label changes, so the next resize starts from there.
  function showCopied(next: boolean) {
    fromWidthRef.current = linkRef.current?.offsetWidth ?? 0
    setCopied(next)
  }

  // The pill hugs whichever label it wears, the way the like pill hugs its
  // count, and eases between the two widths rather than jumping.
  useLayoutEffect(() => {
    const link = linkRef.current
    const from = fromWidthRef.current
    if (!link || !from) return
    resizeRef.current?.cancel()
    const to = link.offsetWidth
    if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const style = getComputedStyle(link)
    resizeRef.current = link.animate([{ width: `${from}px` }, { width: `${to}px` }], {
      duration: cssTimeToMilliseconds(style.getPropertyValue("--duration-quick")),
      easing: style.getPropertyValue("--ease-standard").trim() || "ease",
    })
  }, [copied])

  return (
    <>
      {/* An ordinary link underneath -- for the context menu, for a browser with
          no clipboard, for a middle-click -- and a plain press copies instead,
          the way the address in the About sheet does. */}
      <a ref={linkRef} className={[variant === "pill" ? "writing-copy-link" : "copy-page-link-text", className].filter(Boolean).join(" ")}
        href={href} data-copied={copied ? "true" : undefined}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
          event.preventDefault()
          void navigator.clipboard?.writeText(href).then(() => {
            showCopied(true)
            // Restart the window on every copy so a second press gets its own
            // full confirmation instead of the tail of the first.
            window.clearTimeout(resetRef.current)
            resetRef.current = window.setTimeout(() => showCopied(false), COPY_CONFIRMATION_MS)
          }, () => undefined)
        }}>
        {/* The pill is the heart's twin, so it is an icon alone: the link
            turning into a check is the confirmation. */}
        {variant === "text" ? (
          <span aria-hidden="true">
            <InlineSwap value={copied ? "Link copied" : "Copy link"} direction={copied ? "up" : "down"} />
          </span>
        ) : copied
          ? <Check className="writing-copy-link-icon" size={14} aria-hidden="true" />
          : <Link2 className="writing-copy-link-icon" size={14} aria-hidden="true" />}
        {/* The name says what the control does and stays saying it: the icon or
            label is the confirmation, and a name that changed with it
            would leave a screen reader hunting for the button it just used. */}
        <span className="sr-only">Copy a link to this {subject}</span>
      </a>
      {/* Outside the link, so the confirmation is announced without joining the
          control's accessible name. */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copied ? `Link to this ${subject} copied to clipboard` : ""}
      </span>
    </>
  )
}
