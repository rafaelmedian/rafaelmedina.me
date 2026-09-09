import { useHoverCard } from "../lib/hoverCard"
import { PuntaCanaLocationCard } from "./PuntaCanaLocationCard"

/**
 * The hero line's "Punta Cana & NYC", carrying the same map card the About
 * panel's clock opens.
 *
 * Two places on one line and one map under it: the card names Punta Cana
 * rather than the pair, because that is the half of the sentence a map can
 * answer -- New York needs no introduction, and a card that tried to show
 * both would be two maps of nothing in particular.
 *
 * It opens upward. The contact pills are the next row down, and a card this
 * tall dropping over them would cover the only thing in the hero worth
 * pressing -- the same reason the activity card beside it opens up.
 */
export function ProfileLocation({ timeLabel }: { timeLabel: string }) {
  const { isOpen, hoverProps } = useHoverCard()

  return (
    <span className="mosaic-hover-anchor mosaic-profile-location-anchor" {...hoverProps}>
      <span
        className="mosaic-profile-location-place"
        tabIndex={0}
        aria-describedby="profile-location-note"
      >
        Punta Cana &amp; NYC
      </span>
      {/* Plain text on purpose: the card below contains a link, which an
          accessible description must not. */}
      <span id="profile-location-note" className="sr-only">
        Based in Punta Cana, Dominican Republic
      </span>
      <PuntaCanaLocationCard
        isOpen={isOpen}
        timeLabel={timeLabel}
        className="mosaic-profile-location-card"
      />
    </span>
  )
}
