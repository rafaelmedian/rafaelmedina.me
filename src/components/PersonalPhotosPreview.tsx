import { usePreviewCount } from "../lib/photoLayout"
import { useRef, type CSSProperties } from "react"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { usePhotoFanDeal } from "../lib/usePhotoFanDeal"
import { usePhotoStackTilt } from "../lib/usePhotoStackTilt"

/** Opens the globe from the tile. With a photo id, the globe opens holding
    that photo at its centre; without one it opens as it lies. */
export type OpenPhoto = (opener: HTMLElement, photoId?: string) => void
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
  { shift: -2.2, tilt: -1.6, drop: 1.1, lift: 1.0 },
  { shift: 1.4, tilt: 0.9, drop: -0.7, lift: -0.8 },
  { shift: -0.8, tilt: 1.4, drop: 1.3, lift: 0.4 },
  { shift: 1.9, tilt: -1.1, drop: -0.5, lift: 1.2 },
  { shift: -1.3, tilt: 1.2, drop: 0.8, lift: -0.4 },
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
 *  At rest the arc is only hinted at, so the hand lies almost flat on the
 *  tile. Pointing at it opens the whole hand at once: every print leans
 *  out along the arc, off it by its own wobble, and the whole hand
 *  settles a few percent down the same curve — it eases rather than snapping
 *  open. The entire hand also tilts toward the pointer, and the one print
 *  under the pointer slides up out of the hand by --print-lift. Every print
 *  keeps its original depth, so crossing between photos never reshuffles the
 *  pile.
 */
function arcPlacement(index: number, middle: number, count: number): CSSProperties {
  // -1 at the left end of the fan, 0 in the middle, 1 at the right end.
  const spread = middle === 0 ? 0 : (index - middle) / middle
  const wobble = printWobble[index % printWobble.length]
  return {
    // At rest the hand lies almost flat — a few degrees at the ends, and a
    // little of the wobble so it is still not quite on its arc. Each print is
    // also shifted sideways by a different sliver of its own width: the flex
    // row remains regular for hit testing, while the visible hand loses the
    // mechanically even spacing of a plotted curve.
    "--print-offset-x": `${wobble.shift.toFixed(2)}%`,
    "--print-tilt": `${(spread * 2 + wobble.tilt * 0.5).toFixed(2)}deg`,
    "--print-fan-tilt": `${(spread * 16 + wobble.tilt * 1.5).toFixed(2)}deg`,
    "--print-offset-y": `${(spread * spread * 3 + wobble.drop * 0.3).toFixed(2)}%`,
    // The hand comes down as a whole — the flat middle included — and still
    // sits on a curve, because the drop keeps the arc's squared term.
    "--print-fan-offset-y": `${(5 + spread * spread * 9 + wobble.drop).toFixed(2)}%`,
    // How far this print slides up when the pointer rests on it: about a
    // tenth of its height, a little more or less per print.
    "--print-lift": `${(-11 + wobble.lift).toFixed(2)}%`,
    "--print-depth": count - Math.round(Math.abs(index - middle) * 2),
    // The pile the deal springs out of: each print pulled onto the middle of
    // the row — half a print's width for every step it sits from there — and
    // every print but the one on top of the pile at half opacity. With an
    // even count the two middle prints share a depth, and the later one in
    // the row is drawn over the other.
    "--print-deal-x": `${((middle - index) * 50).toFixed(2)}%`,
    "--print-deal-opacity": index === Math.ceil(middle) ? 1 : 0.5,
  } as CSSProperties
}

export function PersonalPhotosPreview({ onOpen, onIntent, status, className = "", items }: { onOpen: OpenPhoto; onIntent?: () => void; status?: "loading" | "error" | "reload"; className?: string; items?: PreviewPhoto[] }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const resetStackTilt = usePhotoStackTilt(previewRef)
  const finishDeal = usePhotoFanDeal(previewRef)
  const count = usePreviewCount()
  const preview = items ?? initialPreview.slice(0, count)
  const thumbnailsWarmed = useRef(false)
  const warmPhotos = () => {
    // The fan's images load natively. The remaining flight placeholders are
    // only needed once a pointer, focus, or tap expresses opening intent.
    if (!thumbnailsWarmed.current) {
      thumbnailsWarmed.current = true
      photos.forEach((photo) => {
        const image = new Image()
        image.src = `/images/personal/${photo.name}-thumb.webp`
        void image.decode().catch(() => undefined)
      })
    }
    onIntent?.()
  }
  // The middle print of the fan, which the arc is measured from. With an even
  // count it falls between two prints and both lean the same amount.
  const middle = (preview.length - 1) / 2
  return (
    <div ref={previewRef} className={`personal-photos ${className}`}>
      {/* One button, one stop for Tab: a click or a tap on a print opens the
          globe holding that photo, read from whatever print was on top under
          the pointer, with the pile keeping its original stacking order. A
          click beside the prints, or Enter, opens the globe as it lies — the
          globe itself lets the keyboard bring any photo to the front. The
          prints are always the first photos, and the close always brings
          those same photos back, so no visit reshuffles the stack. */}
      <button type="button" className="personal-photos-trigger" aria-haspopup="dialog" aria-busy={status === "loading" || undefined} onPointerEnter={warmPhotos} onFocus={warmPhotos} onClick={(event) => {
        // A keyboard activation is a click with no pointer behind it.
        const print = event.detail ? (event.target as Element).closest<HTMLElement>(".personal-photos-print") : null
        warmPhotos()
        resetStackTilt()
        finishDeal()
        onOpen(event.currentTarget, print?.dataset.photoId)
      }}>
        <span className="personal-photos-stack" aria-hidden="true" style={{ "--photo-preview-count": preview.length } as CSSProperties}>
          <span className="personal-photos-stack-tilt">
            {preview.map(({ photo, src }, index) => (
              <span className="personal-photos-print" data-photo-id={photo.id} key={photo.id} style={arcPlacement(index, middle, preview.length)}>
                <img src={src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              </span>
            ))}
          </span>
        </span>
        <span className="personal-photos-label">{status === "loading" ? "Opening photos…" : status === "error" ? "Try opening photos again" : status === "reload" ? "Reload to try photos again" : "Personal life"}</span>
      </button>
    </div>
  )
}
