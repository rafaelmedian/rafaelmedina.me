import { useEffect, useRef, useState } from "react"
import type { PortfolioCard } from "../data/portfolio"
import { buildPreviewSrcSet, isVideoSource, previewSizes } from "../lib/media"
import { useLightweightMedia } from "../lib/useLightweightMedia"

/** Mounted per source, so late events from an old preview cannot reveal the next one. */
export function PreviewMedia({ card, reducedMotion }: { card: PortfolioCard; reducedMotion: boolean }) {
  const lightweightMedia = useLightweightMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const video = isVideoSource(card.image)
  const manualPlayback = lightweightMedia || reducedMotion
  const thumbnailSrcSet = video ? undefined : buildPreviewSrcSet(card.image, card.previewWidth)
  const pending = !loaded && !failed && (!video || !manualPlayback)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (manualPlayback) video.pause()
    else void video.play().catch(() => undefined)
  }, [manualPlayback])

  async function revealImage(image: HTMLImageElement) {
    if (!image.complete || image.naturalWidth === 0) return
    try {
      await image.decode()
      if (image.isConnected) setLoaded(true)
    } catch {
      if (image.isConnected) setFailed(true)
    }
  }

  return (
    <>
      {thumbnailSrcSet && (
        <img
          src={card.image}
          srcSet={thumbnailSrcSet}
          sizes={previewSizes}
          alt=""
          aria-hidden="true"
          className="preview-gallery-media preview-gallery-media-placeholder"
          data-hidden={loaded ? "true" : "false"}
        />
      )}
      {video ? (
        <video
          key={attempt}
          ref={videoRef}
          src={card.image}
          poster={card.previewPoster}
          width={card.previewWidth}
          height={card.previewHeight}
          muted
          loop={!reducedMotion}
          autoPlay={!manualPlayback}
          controls={lightweightMedia}
          playsInline
          preload={manualPlayback ? "none" : "metadata"}
          aria-label={card.title}
          className="preview-gallery-media"
          data-loaded={card.previewPoster || loaded ? "true" : "false"}
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          key={attempt}
          src={card.image}
          alt=""
          width={card.previewWidth}
          height={card.previewHeight}
          className="preview-gallery-media"
          data-loaded={loaded ? "true" : "false"}
          loading="eager"
          decoding="async"
          onLoad={event => { void revealImage(event.currentTarget) }}
          onError={() => setFailed(true)}
          ref={image => { if (image) void revealImage(image) }}
        />
      )}
      {(pending || failed) && (
        <div className="preview-gallery-media-status" role="status">
          <span>{failed ? "Preview couldn’t load." : "Loading preview…"}</span>
          {failed && (
            <button type="button" onClick={() => {
              setFailed(false)
              setLoaded(false)
              setAttempt(value => value + 1)
            }}>
              Retry preview
            </button>
          )}
        </div>
      )}
    </>
  )
}
