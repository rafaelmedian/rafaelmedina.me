import { useEffect, useRef, useState } from "react"
import type { Map as LeafletMap } from "leaflet"

import "leaflet/dist/leaflet.css"

const puntaCanaCoordinates: [number, number] = [18.5601, -68.3725]
const openStreetMapTileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

type PuntaCanaMapProps = {
  onReady: () => void
}

export function PuntaCanaMap({ onReady }: PuntaCanaMapProps) {
  const mapNodeRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let map: LeafletMap | undefined
    let disposed = false

    void import("leaflet")
      .then((leaflet) => {
        if (disposed || !mapNodeRef.current) return

        map = leaflet
          .map(mapNodeRef.current, {
            attributionControl: false,
            boxZoom: false,
            doubleClickZoom: false,
            keyboard: false,
            scrollWheelZoom: false,
            zoomControl: false,
          })
          .setView(puntaCanaCoordinates, 12)

        const tiles = leaflet.tileLayer(openStreetMapTileUrl, { maxZoom: 19 })
        tiles.once("load", () => {
          if (disposed) return
          setIsReady(true)
          onReady()
        })
        tiles.addTo(map)

        const marker = leaflet
          .circleMarker(puntaCanaCoordinates, {
            className: "mosaic-punta-cana-map-marker",
            color: "#ffffff",
            fillColor: "#ef6d4f",
            fillOpacity: 1,
            interactive: false,
            radius: 6,
            weight: 4,
          })
          .addTo(map)
        marker.getElement()?.setAttribute("role", "img")
        marker.getElement()?.setAttribute("aria-label", "Punta Cana location marker")
      })
      .catch(() => undefined)

    return () => {
      disposed = true
      map?.remove()
    }
  }, [onReady])

  return (
    <div
      className={`mosaic-punta-cana-map${isReady ? " is-ready" : ""}`}
      // role="img", not region: every zoom/pan/keyboard input is disabled, so
      // calling it "interactive" would promise controls that aren't there.
      role="img"
      aria-label="Map of Punta Cana, Dominican Republic"
    >
      {!isReady ? (
        <img
          className="mosaic-local-time-map-screenshot"
          src="/maps/punta-cana-openstreetmap.webp"
          alt="OpenStreetMap screenshot of Punta Cana, Dominican Republic"
          width="696"
          height="320"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div ref={mapNodeRef} className="mosaic-punta-cana-map-canvas" />
    </div>
  )
}
