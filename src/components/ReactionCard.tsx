import { useLightweightMedia } from "../lib/useLightweightMedia"

export type Reaction = {
  /** The animated clip: any .gif/.webp/.webm-free image in `public/`. */
  src: string
  /** The frame shown instead when the visitor has asked for less motion. */
  still: string
  width: number
  height: number
}

/**
 * A clip inside a hover card — the site's answer to a tooltip that would
 * otherwise be one grey line of type.
 *
 * The two wearers are the address's copy button and the booking pill. They keep
 * one shape between them on purpose: both are "hover this and something happens
 * next", and giving them separate card recipes would make one idea look like
 * two. Callers key the element on the state so a swap remounts the image —
 * an animated webp only plays from the top on a fresh element, and a card that
 * resumed mid-loop would report a fresh press as an old one.
 */
export function ReactionCard({ reaction }: { reaction: Reaction }) {
  const lightweight = useLightweightMedia()
  return (
    <picture className="reaction-card-media">
      <source media="(prefers-reduced-motion: reduce)" srcSet={reaction.still} />
      <img
        src={lightweight ? reaction.still : reaction.src}
        alt=""
        width={reaction.width}
        height={reaction.height}
        decoding="async"
      />
    </picture>
  )
}
