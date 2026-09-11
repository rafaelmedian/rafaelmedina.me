import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

// Keep one player instance while its DOM host joins the active dialog's focus
// scope. A manual popover escapes transformed dialog surfaces into the top layer.
export function AboutIntroLayer({ open, children }: { open: boolean; children: ReactNode }) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [host] = useState(() => {
    const element = document.createElement("div")
    element.className = "about-intro-layer"
    return element
  })

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const sync = () => {
      const dialogs = [...document.querySelectorAll<HTMLElement>("[role='dialog'], dialog[open]")]
        .filter(dialog => !dialog.hasAttribute("data-closed") && dialog.getAttribute("aria-hidden") !== "true" && dialog.getClientRects().length > 0)
      const dialog = open ? dialogs.at(-1) : undefined
      const parent = dialog ?? anchor
      const relocating = host.parentElement !== parent
      if (relocating) {
        host.setAttribute("data-relocating", "true")
        const video = host.querySelector<HTMLVideoElement>("video[data-recording]")
        const wasPlaying = video && !video.paused && !video.ended && !document.hidden
        if (host.matches(":popover-open")) host.hidePopover()
        // moveBefore preserves media state where available. Older Safari keeps
        // currentTime on a move, but may pause; resume only an already playing clip.
        if (parent.moveBefore && host.isConnected) parent.moveBefore(host, null)
        else parent.appendChild(host)
        if (wasPlaying && video.paused) void video.play().catch(() => {})
      }
      anchor.dataset.detached = String(Boolean(dialog))
      if (dialog) {
        host.setAttribute("popover", "manual")
        if (!host.matches(":popover-open")) host.showPopover()
      } else {
        if (host.matches(":popover-open")) host.hidePopover()
        host.removeAttribute("popover")
      }
      if (relocating) {
        // The new containing block needs its corresponding offsets immediately;
        // tweening the old offsets would briefly push the mobile frame sideways.
        const surface = host.querySelector(".about-intro-surface")
        if (surface) void getComputedStyle(surface).right
        host.removeAttribute("data-relocating")
      }
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ["open", "data-closed", "aria-hidden"],
    })
    return () => observer.disconnect()
  }, [host, open])

  useLayoutEffect(() => () => { host.remove() }, [host])

  return <div ref={anchorRef} className="about-intro-anchor">{createPortal(children, host)}</div>
}
