import { Tooltip } from "@base-ui/react/tooltip"
import { Check, Copy } from "lucide-react"
import { useId } from "react"

import { useEmailCopy } from "../lib/useEmailCopy"
import { EMAIL_COPY_CONFIRMATION, EMAIL_COPY_INVITATION } from "./emailCopyReactions"
import { ReactionCard } from "./ReactionCard"
import { InlineSwap } from "./InlineSwap"

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
            <InlineSwap value={isCopied ? "copied" : "copy"} direction={isCopied ? "up" : "down"}>
              {isCopied ? <Check strokeWidth={2.25} /> : <Copy strokeWidth={2} />}
            </InlineSwap>
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
