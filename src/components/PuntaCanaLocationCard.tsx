import { lazy, Suspense, useCallback, useState } from "react"

function PuntaCanaMapScreenshot() {
  return (
    <img
      className="mosaic-local-time-map-screenshot"
      src="/maps/punta-cana-openstreetmap.webp"
      alt="OpenStreetMap screenshot of Punta Cana, Dominican Republic"
      width="696"
      height="320"
      loading="lazy"
      decoding="async"
    />
  )
}

function FailedPuntaCanaMap() {
  return <PuntaCanaMapScreenshot />
}

const PuntaCanaMap = lazy(async () => {
  try {
    const module = await import("./PuntaCanaMap")
    return { default: module.PuntaCanaMap }
  } catch {
    return { default: FailedPuntaCanaMap }
  }
})

/**
 * Where I am, as a floating card: the map, the place, and the time there.
 *
 * Two triggers open it -- the hero's location line and the About panel's
 * clock -- so it lives here rather than inside either of them. Only the
 * anchoring differs, and that is the caller's `className`.
 */
export function PuntaCanaLocationCard({
  isOpen,
  timeLabel,
  className,
}: {
  isOpen: boolean
  timeLabel: string
  className?: string
}) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const handleMapReady = useCallback(() => setMapLoaded(true), [])

  return (
    <span
      className={`mosaic-local-time-card${className ? ` ${className}` : ""}${isOpen ? " is-open" : ""}`}
      data-state={isOpen ? "open" : "closed"}
      inert={!isOpen}
    >
      <span className="mosaic-local-time-map">
        {/* Nothing renders while closed so the screenshot is never fetched
            for visitors who never hover; the Suspense fallback covers the
            gap while Leaflet's chunk loads. */}
        {isOpen || mapLoaded ? (
          <Suspense fallback={<PuntaCanaMapScreenshot />}>
            <PuntaCanaMap onReady={handleMapReady} />
          </Suspense>
        ) : null}
        {/* The attribution has to be visible, not tabbable. The card opens on
            focus, and a link inside it made every pass over the clock or the
            location line stop on a credit nobody tabbed there to read. */}
        <a
          className="mosaic-local-time-map-attribution"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          aria-label="OpenStreetMap contributors"
          tabIndex={-1}
        >
          © OpenStreetMap contributors
        </a>
      </span>
      <span className="mosaic-local-time-card-copy">
        <span>
          <strong>Punta Cana</strong>
          <span>Dominican Republic</span>
        </span>
        <span className="mosaic-local-time-card-clock">{timeLabel}</span>
      </span>
    </span>
  )
}
