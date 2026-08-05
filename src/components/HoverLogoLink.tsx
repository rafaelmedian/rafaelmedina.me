import type { PropsWithChildren } from "react"

import { applyPointerTilt, coalescePointerMove, logoChipTilt, nestedChipTilt, resetPointerTilt } from "../lib/pointerTilt"

type HoverLogoLinkProps = PropsWithChildren<{
  href: string
  logoUrls: string[]
  className: string
  ariaLabel?: string
  title?: string
}>

const handlePointerMove = coalescePointerMove<HTMLAnchorElement>((target, pointer) => {
  const box = target.getBoundingClientRect()

  // The pill leans; the logos inside it lean half as much, so they parallax
  // against their own container instead of moving as one rigid slab.
  applyPointerTilt({ target, box, pointer, scales: logoChipTilt, prefix: "mosaic-hover" })
  applyPointerTilt({ target, box, pointer, scales: nestedChipTilt, prefix: "mosaic-hover-chip" })
})

function resetPointerAnchor(event: React.PointerEvent<HTMLAnchorElement>) {
  handlePointerMove.cancel()
  resetPointerTilt(event.currentTarget, "mosaic-hover")
  resetPointerTilt(event.currentTarget, "mosaic-hover-chip")
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
