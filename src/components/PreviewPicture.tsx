import type { ReactElement } from "react"

/** Offers a source's AVIF ahead of the WebP `<img>` it wraps. `display:
 * contents` keeps the image the layout child its CSS was written for. With no
 * AVIF, the image renders on its own. Pass `avifSrcSet` undefined to hold the
 * request back while the image's own `src` is held back, but keep `enabled`
 * steady so the wrapper does not remount the image when loading starts. */
export function PreviewPicture({ enabled, avifSrcSet, sizes, children }: {
  enabled: boolean
  avifSrcSet: string | undefined
  sizes?: string
  children: ReactElement
}) {
  if (!enabled) return children
  return (
    <picture className="preview-picture">
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      {children}
    </picture>
  )
}
