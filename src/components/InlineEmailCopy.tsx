import { Tooltip } from "@base-ui/react/tooltip"
import { useId, useState } from "react"

import { trackEvent } from "../lib/analytics"
import { useEmailCopy } from "../lib/useEmailCopy"
import { EMAIL_COPY_CONFIRMATION, EMAIL_COPY_INVITATION } from "./emailCopyReactions"
import { ReactionCard } from "./ReactionCard"

type InlineEmailCopyProps = {
  email: string
  /** Where this address sits, for the analytics event. */
  placement: string
  className?: string
}

/**
 * The address inside a run of prose. The corner spells it out as a chip with a
 * copy icon; a sentence has no room for that chrome, so this stays an ordinary
 * `mailto:` link -- for the crawler, for the context menu, for a browser with
 * no clipboard -- and a plain press copies the address instead of handing it to
 * a mail client the visitor may never have set up. The hint is the pair of
 * clips the corner already offers, because it is the same offer.
 */
export function InlineEmailCopy({ email, placement, className }: InlineEmailCopyProps) {
  const hintId = useId()
  const [isHinting, setIsHinting] = useState(false)
  const { isCopied, copy } = useEmailCopy(email)

  return (
    // The card is the confirmation and a phone never hovers, so it is held open
    // for the confirmation window: a tap gets the same answer a pointer does.
    // The corner chip can put a check in its own icon slot; a word set in a
    // sentence has nowhere to draw one.
    <Tooltip.Root open={isHinting || isCopied} onOpenChange={setIsHinting}>
      {/* Same deal as the corner: the card is what reports the copy back, so
          the press must not close it. */}
      <Tooltip.Trigger
        delay={160}
        closeDelay={120}
        closeOnClick={false}
        className={className}
        data-copied={isCopied ? "true" : undefined}
        aria-describedby={hintId}
        render={<a href={`mailto:${email}`} />}
        onClick={(event) => {
          trackEvent("social_link_click", {
            social_label: "Email",
            social_href: `mailto:${email}`,
            social_placement: placement,
          })
          // A modified or secondary press belongs to the browser -- open the
          // draft in a tab, copy the link, save it. Only the plain one is ours.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          if (event.button !== 0) return
          event.preventDefault()
          void copy()
        }}
      >
        {email}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        {/* Above the address: below it is the foot of the section, and on a
            short viewport the sheet's own scroll edge. */}
        <Tooltip.Positioner
          side="top"
          align="center"
          sideOffset={10}
          collisionPadding={16}
          className="reaction-card-positioner"
        >
          <Tooltip.Popup className="reaction-card" data-copied={isCopied ? "true" : undefined} aria-hidden="true">
            <ReactionCard
              key={isCopied ? "success" : "invitation"}
              reaction={isCopied ? EMAIL_COPY_CONFIRMATION : EMAIL_COPY_INVITATION}
            />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
      {/* The link's accessible name is the address -- that is the thing being
          read out of the sentence -- so what the press does is said in the
          description, and the copy itself in the live region. */}
      <span id={hintId} className="sr-only">
        Click to copy
      </span>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopied ? `${email} copied to clipboard` : ""}
      </span>
    </Tooltip.Root>
  )
}
