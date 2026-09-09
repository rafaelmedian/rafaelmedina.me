import { usePreviewCount } from "../lib/photoLayout"
import { useEffect, useRef, type CSSProperties } from "react"
import { personalPhotoItems as photos } from "../data/personalPhotos"

export type OpenPhoto = (opener: HTMLElement) => void
export type PreviewPhoto = { photo: typeof photos[number]; src: string }
const initialPreview = photos.slice(0, 5).map((photo) => ({ photo, src: `/images/personal/${photo.name}-thumb.webp` }))

/** A hand-dealt wobble. The fan is a formula, and a formula lands every print
 *  at exactly the angle its neighbour predicts, which reads as a printed
 *  pattern rather than a hand of photos. These nudges break that up. They are
 *  a fixed table rather than a random draw so a print gets the same nudge on
 *  every render and the hand opens the same way twice, and they stay well
 *  inside the arc's own step between neighbours — a nudge as large as the step
 *  closes the gap between two prints and the hand reads as mis-dealt rather
 *  than dealt by hand. The signs do not simply alternate, or the row zigzags.
 */
const printWobble = [
  { tilt: -1.6, drop: 1.1 },
  { tilt: 0.9, drop: -0.7 },
  { tilt: 1.4, drop: 1.3 },
  { tilt: -1.1, drop: -0.5 },
  { tilt: 1.2, drop: 0.8 },
]

/** Where a print sits on the fan, at rest and opened.
 *
 *  The prints are dealt along an arc rather than jumbled: the lean runs
 *  straight from one end of the row to the other, and each print drops by the
 *  square of its distance from the middle, which is the arc a hand of cards
 *  makes when it is spread. The drop is a share of the print's own height, so
 *  it holds at every tile size.
 *
 *  The middle print sits on top and each one behind it steps back, so the fan
 *  reads as one pile opening outwards instead of a row shingled left to right.
 *
 *  Pointing at the tile opens the whole hand at once: every print leans a
 *  little further out, off the arc by its own wobble, and the whole hand
 *  settles a few percent down the same curve — it eases rather than snapping
 *  open. The fan answers as one thing, so there is no single print to pick out
 *  and no reason for the pile to change hands under the pointer.
 */
function arcPlacement(index: number, middle: number, count: number): CSSProperties {
  // -1 at the left end of the fan, 0 in the middle, 1 at the right end.
  const spread = middle === 0 ? 0 : (index - middle) / middle
  const wobble = printWobble[index % printWobble.length]
  return {
    "--print-tilt": `${(spread * 10).toFixed(2)}deg`,
    "--print-fan-tilt": `${(spread * 16 + wobble.tilt).toFixed(2)}deg`,
    "--print-offset-y": `${(spread * spread * 10).toFixed(2)}%`,
    // The hand comes down as a whole — the flat middle included — and still
    // sits on a curve, because the drop keeps the arc's squared term.
    "--print-fan-offset-y": `${(5 + spread * spread * 9 + wobble.drop).toFixed(2)}%`,
    "--print-depth": count - Math.round(Math.abs(index - middle) * 2),
  } as CSSProperties
}

export function PersonalPhotosPreview({ onOpen, onIntent, status, className = "", items }: { onOpen: OpenPhoto; onIntent?: () => void; status?: "loading" | "error" | "reload"; className?: string; items?: PreviewPhoto[] }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const count = usePreviewCount()
  const preview = items ?? initialPreview.slice(0, count)
  useEffect(() => {
    const element = previewRef.current
    if (!element) return
    // Warm the small bitmaps before opening so every flight can show its own
    // photo from the first frame.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      photos.forEach((photo) => {
        const image = new Image()
        image.src = `/images/personal/${photo.name}-thumb.webp`
        void image.decode().catch(() => undefined)
      })
      observer.disconnect()
    }, { rootMargin: "200px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  // The middle print of the fan, which the arc is measured from. With an even
  // count it falls between two prints and both lean the same amount.
  const middle = (preview.length - 1) / 2
  return (
    <div ref={previewRef} className={`personal-photos ${className}`}>
      {/* Whichever print is tapped, the sheet opens at its first row: the
          prints are always the first photos, and the close always brings
          those same photos back, so no visit reshuffles the stack. */}
      <button type="button" className="personal-photos-trigger" aria-haspopup="dialog" aria-busy={status === "loading" || undefined} onPointerEnter={onIntent} onFocus={onIntent} onClick={(event) => onOpen(event.currentTarget)}>
        <span className="personal-photos-stack" aria-hidden="true" style={{ "--photo-preview-count": preview.length } as CSSProperties}>
          {preview.map(({ photo, src }, index) => (
            <span className="personal-photos-print" data-photo-id={photo.id} key={photo.id} style={arcPlacement(index, middle, preview.length)}>
              <img src={src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
            </span>
          ))}
        </span>
        <span className="personal-photos-label">{status === "loading" ? "Opening photos…" : status === "error" ? "Try opening photos again" : status === "reload" ? "Reload to try photos again" : "Personal life"}</span>
      </button>
    </div>
  )
}

