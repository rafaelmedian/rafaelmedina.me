import { useState } from "react"
import type { PropsWithChildren } from "react"

type HoverVideoLinkProps = PropsWithChildren<{
  href: string
  className: string
  embedUrl: string
  previewTitle: string
}>

function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const relativeX = rect.width === 0 ? 0 : (event.clientX - rect.left) / rect.width - 0.5
  const relativeY = rect.height === 0 ? 0 : (event.clientY - rect.top) / rect.height - 0.5

  event.currentTarget.style.setProperty("--mosaic-hover-anchor-x", `${(relativeX * 12).toFixed(2)}px`)
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-y", `${(relativeY * 6).toFixed(2)}px`)
}

function resetPointerAnchor(event: React.PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-x", "0px")
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-y", "0px")
}

export function HoverVideoLink({ href, className, embedUrl, previewTitle, children }: HoverVideoLinkProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className} mosaic-profile-link-with-video${isActive ? " is-active" : ""}`}
      onPointerEnter={() => setIsActive(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        setIsActive(false)
        resetPointerAnchor(event)
      }}
      onPointerCancel={(event) => {
        setIsActive(false)
        resetPointerAnchor(event)
      }}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      {children}
      <span className="mosaic-company-inline-hover-video" aria-hidden="true">
        {isActive ? (
          <iframe
            src={embedUrl}
            title={previewTitle}
            loading="eager"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="mosaic-company-inline-hover-video-frame"
          />
        ) : null}
      </span>
    </a>
  )
}
