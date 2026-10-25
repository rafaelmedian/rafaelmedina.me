import { useEffect, useRef, useState } from "react"
import type { PortfolioCard } from "../data/portfolio"
import { buildPreviewSrcSet, isVideoSource, previewSizes } from "../lib/media"
import { useLightweightMedia } from "../lib/useLightweightMedia"

/** Mounted per source, so late events from an old preview cannot reveal the next one. */
export function PreviewMedia({ card, reducedMotion }: { card: PortfolioCard; reducedMotion: boolean }) {
  if (card.galleryUsesHomeImages && card.homeImages?.length) return <PreviewMediaPair card={card} />
  return <PreviewMediaSingle card={card} reducedMotion={reducedMotion} />
}

// Each banner spans 71% of a frame up to the gallery's 864px width.
const pairSizes = "(max-width: 699.98px) 66vw, 620px"

// The tile's own arrangement of its images, at the tile's shape: the flight
// grows the tile into it rather than cross-fading two different pictures.
// The tile already loaded these files, so there is no thumbnail stage.
function PreviewMediaPair({ card }: { card: PortfolioCard }) {
  const images = card.homeImages ?? []
  const [loaded, setLoaded] = useState(0)
  const [failed, setFailed] = useState(false)

  async function revealImage(image: HTMLImageElement) {
    if (!image.complete || image.naturalWidth === 0 || image.dataset.revealed) return
    image.dataset.revealed = "true"
    try {
      await image.decode()
    } catch {
      // Painted as soon as it can be; a decode failure is not a load failure.
    }
    if (image.isConnected) setLoaded(count => count + 1)
  }

  const pending = loaded < images.length && !failed
  return (
    <>
      <span
        className="preview-gallery-media preview-gallery-media-pair"
        role="img"
        aria-label={card.title}
        data-loaded={pending ? "false" : "true"}
      >
        {images.map(image => (
          <img
            key={image.source}
            src={image.source}
            srcSet={buildPreviewSrcSet(image.source, image.width)}
            sizes={pairSizes}
            alt=""
            width={image.width}
            height={image.height}
            loading="eager"
            decoding="async"
            onLoad={event => { void revealImage(event.currentTarget) }}
            onError={() => setFailed(true)}
            ref={element => { if (element) void revealImage(element) }}
          />
        ))}
      </span>
      {failed && (
        <div className="preview-gallery-media-status" role="status">
          <span>Preview couldn’t load.</span>
        </div>
      )}
    </>
  )
}

function PreviewMediaSingle({ card, reducedMotion }: { card: PortfolioCard; reducedMotion: boolean }) {
  const lightweightMedia = useLightweightMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const video = isVideoSource(card.image)
  const manualPlayback = lightweightMedia || reducedMotion
  // A tile with its own single artwork (Twilio's tilted sheet) opens from that
  // picture, so the flight leaves the grid showing what was clicked and the
  // gallery's image fades in over it, instead of swapping on the first frame.
  // A wall of several home images has no one picture to stand in for it.
  const thumbnail = card.homeImages?.length === 1
    ? { source: card.homeImages[0].source, width: card.homeImages[0].width }
    : { source: card.image, width: card.previewWidth }
  const thumbnailSrcSet = video ? undefined : buildPreviewSrcSet(thumbnail.source, thumbnail.width)
  // A video with a poster is already showing its artwork, so a "Loading
  // preview…" chip over it was a badge under a picture that had loaded.
  const pending = !loaded && !failed && (!video || (!manualPlayback && !card.previewPoster))

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
          src={thumbnail.source}
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
