import { Tooltip } from "@base-ui/react/tooltip"
import { useId } from "react"

import { useEmailCopy } from "../lib/useEmailCopy"
import { EMAIL_COPY_CONFIRMATION, EMAIL_COPY_INVITATION } from "./emailCopyReactions"
import { ReactionCard } from "./ReactionCard"

type ProfileEmailCopyProps = {
  email: string
  /** Which way the reaction card hangs off the address. */
  side?: "top" | "bottom"
}

export function ProfileEmailCopy({ email, side = "top" }: ProfileEmailCopyProps) {
  const hintId = useId()
  const { isCopied, copy } = useEmailCopy(email)

  return (
    <>
      <Tooltip.Root>
        {/* The tooltip has to survive the press: it is the surface that reports
            the copy back, so closing on click would take the confirmation with
            it. */}
        <Tooltip.Trigger
          delay={160}
          closeDelay={120}
          closeOnClick={false}
          className="mosaic-profile-email"
          data-copied={isCopied ? "true" : undefined}
          aria-label={`Copy email address ${email}`}
          aria-describedby={hintId}
          onClick={() => void copy()}
        >
          <span className="mosaic-profile-email-icon" aria-hidden="true">
            {/* One drawing with two states rather than two icons trading
                places: the back sheet slides down onto the front one, the
                merged sheet shrinks away, and a check draws itself in where it
                stood. The back sheet is only its visible corner, so nothing has
                to paint over it to hide the overlap. */}
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.25}
              strokeLinecap="round" strokeLinejoin="round">
              <g className="mosaic-profile-email-sheets">
                <path className="mosaic-profile-email-sheet-back" d="M3.5 3.5V2.75a2 2 0 0 1 2-2h3.75a2 2 0 0 1 2 2V6.5a2 2 0 0 1-2 2H8.5" />
                <rect x="0.75" y="3.5" width="7.75" height="7.75" rx="2" />
              </g>
              <path className="mosaic-profile-email-check" pathLength={1} d="M2.25 6.25 4.75 8.75 9.75 3.25" />
            </svg>
          </span>
          <span className="mosaic-profile-email-label">{email}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {/* In the corner the card hangs down, because there is nothing above
              it but the edge of the page. */}
          <Tooltip.Positioner side={side} align="center" sideOffset={10} collisionPadding={16} className="reaction-card-positioner">
            {/* The reaction is the whole hint. It says "click to copy" and then
                "copied" in a register a line of grey type cannot, which is why
                the address is worth hovering at all; the words are still there
                for screen readers, in the description below and the live region
                that announces the copy. */}
            <Tooltip.Popup className="reaction-card" data-copied={isCopied ? "true" : undefined} aria-hidden="true">
              <ReactionCard
                key={isCopied ? "success" : "invitation"}
                reaction={isCopied ? EMAIL_COPY_CONFIRMATION : EMAIL_COPY_INVITATION}
              />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <span id={hintId} className="sr-only">
        Click to copy
      </span>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopied ? `${email} copied to clipboard` : ""}
      </span>
    </>
  )
}
