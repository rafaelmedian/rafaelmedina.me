import type { PropsWithChildren } from "react"

type HoverLogoLinkProps = PropsWithChildren<{
  href: string
  logoUrls: string[]
  className: string
  ariaLabel?: string
  title?: string
}>

function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const relativeX = rect.width === 0 ? 0 : (event.clientX - rect.left) / rect.width - 0.5
  const relativeY = rect.height === 0 ? 0 : (event.clientY - rect.top) / rect.height - 0.5

  event.currentTarget.style.setProperty("--mosaic-hover-anchor-x", `${(relativeX * 12).toFixed(2)}px`)
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-y", `${(relativeY * 4).toFixed(2)}px`)
  event.currentTarget.style.setProperty("--mosaic-hover-tilt-x", `${(-relativeY * 4).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--mosaic-hover-tilt-y", `${(relativeX * 8).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--mosaic-hover-lift", `${(1 + Math.abs(relativeX) * 0.01).toFixed(3)}`)
  event.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x", `${(-relativeY * 2).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y", `${(relativeX * 4).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--mosaic-hover-chip-lift", `${(1 + Math.abs(relativeX) * 0.006).toFixed(3)}`)
}

function resetPointerAnchor(event: React.PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-x", "0px")
  event.currentTarget.style.setProperty("--mosaic-hover-anchor-y", "0px")
  event.currentTarget.style.setProperty("--mosaic-hover-tilt-x", "0deg")
  event.currentTarget.style.setProperty("--mosaic-hover-tilt-y", "0deg")
  event.currentTarget.style.setProperty("--mosaic-hover-lift", "1")
  event.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x", "0deg")
  event.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y", "0deg")
  event.currentTarget.style.setProperty("--mosaic-hover-chip-lift", "1")
}

export function HoverLogoLink({ href, logoUrls, className, ariaLabel, title, children }: HoverLogoLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={ariaLabel}
      title={title}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerAnchor}
      onPointerCancel={resetPointerAnchor}
    >
      <span className="mosaic-company-inline-name">{children}</span>
      <span className="mosaic-company-inline-hover-logos" aria-hidden="true">
        {logoUrls.map((logoUrl) => (
          <span key={`${href}-${logoUrl}`} className="mosaic-company-inline-hover-logo-wrap">
            <img src={logoUrl} alt="" loading="eager" decoding="async" className="mosaic-company-inline-hover-logo" />
          </span>
        ))}
      </span>
    </a>
  )
}
