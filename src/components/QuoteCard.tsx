import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Popover } from "@base-ui/react/popover"
import { XProfileHoverCard } from "./XProfileHoverCard"
import type { PortfolioQuote } from "../data/quotes"

function QuoteCredit({ quote, active }: { quote: PortfolioQuote; active: boolean }) {
  const [open, setOpen] = useState(false)
  const skipNextFocusOpen = useRef(false)
  const pointerFocus = useRef(false)
  const triggerId = useId()
  const href = quote.xHandle ? `https://x.com/${quote.xHandle}` : undefined

  return (
    <figcaption className="mosaic-quote-credit">
      <span className="mosaic-quote-person">
        {quote.photo && <img className="mosaic-quote-avatar" src={quote.photo} width="40" height="40" alt="" loading="lazy" decoding="async" />}
        <span className="mosaic-quote-attribution">
          {href ? (
            <Popover.Root
              open={active && open}
              onOpenChange={(nextOpen, details) => {
                if (!nextOpen && details.reason === "escape-key") skipNextFocusOpen.current = true
                setOpen(nextOpen)
              }}
              triggerId={triggerId}
            >
              <Popover.Trigger
                id={triggerId}
                onPointerDown={() => {
                  pointerFocus.current = true
                }}
                onClick={() => {
                  pointerFocus.current = false
                }}
                onFocus={() => {
                  if (pointerFocus.current) {
                    pointerFocus.current = false
                    return
                  }
                  if (skipNextFocusOpen.current) {
                    skipNextFocusOpen.current = false
                    return
                  }
                  setOpen(true)
                }}
                className="mosaic-quote-profile-link mosaic-quote-name"
                aria-label={`${quote.attribution} on X`}
                tabIndex={active ? 0 : -1}
                openOnHover
                delay={260}
                closeDelay={140}
              >
                {quote.attribution}
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner className="mosaic-quote-profile-positioner" side="top" align="center" sideOffset={10} collisionPadding={20}>
                  <Popover.Popup
                    className="mosaic-quote-profile-popup"
                    initialFocus={false}
                    aria-label={`${quote.attribution} X profile`}
                  >
                    <XProfileHoverCard
                      isOpen={active && open}
                      profile={{ name: quote.attribution, handle: `@${quote.xHandle}`, href, photo: quote.photo ?? "", bio: "", ...quote.xProfile }}
                    />
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          ) : <span className="mosaic-quote-name">{quote.attribution}</span>}
          <span className="mosaic-quote-role">{quote.caption}</span>
        </span>
      </span>
      <p className="mosaic-quote-note">{quote.attributionNote}</p>
    </figcaption>
  )
}

export function QuoteCard({ quotes }: { quotes: PortfolioQuote[] }) {
  // `settle` is how the change was asked for, not how far it travels: a pointer
  // gesture lands on the next quote quickly, a dot chosen across the card keeps
  // the longer, more deliberate move.
  const [{ activeIndex, previousIndex, direction, settle }, setSelection] = useState({
    activeIndex: 0,
    previousIndex: 0,
    direction: 1,
    settle: "slow" as "quick" | "slow",
  })
  const slidesRef = useRef<HTMLDivElement>(null)
  const preparedSlide = useRef<HTMLElement | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const gesture = useRef<{
    pointerId: number
    x: number
    y: number
    offset: number
    axis: "x" | "y" | null
  } | null>(null)
  const suppressClick = useRef(false)
  const sliderId = useId()
  const activeQuote = quotes[activeIndex]

  // A direct selection primes its hidden destination beside the current quote.
  // Release that measured start after React commits the new destination, so CSS
  // animates exactly one width instead of crossing the intervening quotes.
  useLayoutEffect(() => {
    const slide = preparedSlide.current
    if (!slide) return
    slide.style.removeProperty("transition")
    slide.style.removeProperty("transform")
    preparedSlide.current = null
  }, [activeIndex])

  if (!activeQuote) return null

  // Keep the preceding and following slides one card-width from the current
  // quote. Only the offscreen slide jumps sides when the carousel wraps.
  const positionOf = (index: number, selected: number) => {
    const position = (index - selected + quotes.length) % quotes.length
    return position > quotes.length / 2 ? position - quotes.length : position
  }

  const slidePosition = (index: number) => {
    if (previousIndex !== activeIndex) {
      if (index === previousIndex) return -direction
      // During a distant jump the outgoing quote occupies this neighbor slot.
      // Keep its replacement offscreen until the pair finishes settling.
      if (positionOf(index, activeIndex) === -direction) return -direction * 2
    }
    return positionOf(index, activeIndex)
  }

  const selectQuote = (index: number, travel = Math.sign(positionOf(index, activeIndex)), settleAs: "quick" | "slow" = "slow") => {
    if (index === activeIndex) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelection({ previousIndex: index, activeIndex: index, direction: travel, settle: settleAs })
      return
    }
    const incoming = slidesRef.current?.querySelector<HTMLElement>(`[data-quote-index="${index}"]`)
    if (incoming && slidePosition(index) !== travel) {
      incoming.style.transition = "none"
      incoming.style.transform = `translateX(calc(${travel} * 100% + ${dragOffset}px))`
      incoming.getBoundingClientRect()
      preparedSlide.current = incoming
    }
    setSelection({ previousIndex: activeIndex, activeIndex: index, direction: travel, settle: settleAs })
  }

  const moveQuote = (travel: number, settleAs: "quick" | "slow" = "slow") =>
    selectQuote((activeIndex + travel + quotes.length) % quotes.length, travel, settleAs)

  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    suppressClick.current = false
    const currentSlide = event.currentTarget.parentElement?.querySelector('[data-active="true"]')
    const offset = currentSlide ? new DOMMatrixReadOnly(getComputedStyle(currentSlide).transform).m41 : 0
    gesture.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offset,
      axis: null,
    }
    // Catch an in-flight slide at its rendered position so reversing a drag
    // doesn't jump to the previous animation's destination.
    setIsDragging(true)
    setDragOffset(offset)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (!start.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      suppressClick.current = true
    }
    if (start.axis !== "x") return
    const limit = event.currentTarget.clientWidth * 0.65
    setIsDragging(true)
    setDragOffset(start.offset + Math.max(-limit, Math.min(limit, dx)))
  }

  const finishDrag = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    gesture.current = null
    if (cancelled) suppressClick.current = true
    if (!cancelled && start.axis === "x") {
      const dx = start.offset + event.clientX - start.x
      // A quote is a card, not a page. Asking for a quarter of the card before
      // it changes is what makes a swipe feel like it was ignored, so the
      // gesture commits as soon as it is more than a slip of the hand -- while
      // staying above the few pixels a click can wander through the surface.
      const threshold = Math.min(16, event.currentTarget.clientWidth * 0.04)
      if (Math.abs(dx) >= threshold) {
        const travel = dx < 0 ? 1 : -1
        // Reversing a caught transition returns to the quote still beside it,
        // including when that transition began with a distant dot selection.
        if (Math.abs(start.offset) > 1 && previousIndex !== activeIndex && travel === -direction) {
          selectQuote(previousIndex, travel, "quick")
        } else {
          moveQuote(travel, "quick")
        }
      }
    }
    setIsDragging(false)
    setDragOffset(0)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      className="mosaic-quote"
      role="group"
      aria-roledescription="carousel"
      aria-label="Quotes"
      data-dragging={isDragging}
      data-settle={settle}
      style={{ "--quote-drag-x": `${dragOffset}px` } as CSSProperties}
    >
      <button
        type="button"
        className="mosaic-quote-next"
        aria-label="Advance quote"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => finishDrag(event, true)}
        onClick={(event) => {
          // Pointer release also fires click. Only a tap (or keyboard activation)
          // advances here; completed and cancelled drags have already been handled.
          if (event.detail !== 0 && suppressClick.current) return
          moveQuote(1, "quick")
        }}
      />
      <div ref={slidesRef} className="mosaic-quote-slides">
        {quotes.map((quote, index) => (
          <figure
            key={quote.id}
            id={`${sliderId}-${quote.id}`}
            className="mosaic-quote-slide"
            data-quote-index={index}
            data-short={quote.text.length + 1 + quote.emphasis.length <= 80}
            data-active={index === activeIndex}
            data-repositioning={index !== activeIndex && index !== previousIndex && Math.abs(slidePosition(index) - positionOf(index, previousIndex)) > 1}
            style={{ "--quote-position": slidePosition(index) } as CSSProperties}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget || event.propertyName !== "transform" || index !== activeIndex || gesture.current) return
              setSelection((selection) => selection.previousIndex === selection.activeIndex
                ? selection
                : { ...selection, previousIndex: selection.activeIndex })
            }}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex}
          >
            <blockquote>
              <p>“{quote.text} <strong>{quote.emphasis}</strong>”</p>
            </blockquote>
            <QuoteCredit quote={quote} active={index === activeIndex} />
          </figure>
        ))}
        {(["left", "right"] as const).map((side) => (
          <span key={side} className={`mosaic-quote-edge mosaic-quote-edge-${side}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        ))}
      </div>
      <div className="mosaic-quote-dots" role="group" aria-label="Choose a quote">
          {quotes.map((quote, index) => (
            <button
              key={quote.id}
              type="button"
              className="mosaic-quote-dot"
              aria-label={`Show quote from ${quote.attribution}`}
              aria-pressed={index === activeIndex}
              aria-controls={`${sliderId}-${quote.id}`}
              onClick={() => selectQuote(index)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {activeIndex + 1} of {quotes.length}. {activeQuote.attribution}. {activeQuote.caption}: {activeQuote.text} {activeQuote.emphasis}. {activeQuote.attributionNote}
      </p>
    </div>
  )
}
