import { useEffect, useMemo, useRef, useState } from "react"
import type { DragEventHandler, MouseEventHandler, PointerEventHandler, WheelEventHandler } from "react"

import type { PortfolioCard as PortfolioCardType } from "../data/portfolio"
import { cn } from "../lib/cn"
import { ProjectDialog } from "./ProjectDialog"
import type { PortfolioCardVariant } from "./PortfolioCard"

type SiteProfile = {
  name: string
  title: string
  intro: string
  previouslyLabel: string
  previouslyText: string
  nowLabel: string
  nowText: string
  availability: string
  contactLabel: string
  contactHref: string
  photo: string
}

type SiteLinks = {
  dribbble: string
  x: string
  email: string
}

type CanvasItem = {
  id: string
  card: PortfolioCardType
  variant: PortfolioCardVariant
  mode: CanvasCardMode
  x: number
  y: number
  width: number
  height: number
}

type TileLayoutItem = {
  col: number
  row: number
  colSpan: number
  rowSpan: number
}

type RepeatedCanvasItem = CanvasItem & {
  tileX: number
  tileY: number
  renderKey: string
}

type InfiniteCanvasBoardProps = {
  cards: PortfolioCardType[]
  profile: SiteProfile
  links: SiteLinks
}

type CanvasCardMode = "image" | "link" | "video" | "preview"
type CanvasLinkStyle = "memo" | "journal"

const cardVariants: PortfolioCardVariant[] = ["editorial", "media", "split", "spotlight"]
const GRID_UNIT = 132
const GRID_GAP = 15
const GRID_STEP = GRID_UNIT + GRID_GAP
const DRAG_THRESHOLD_PX = 6
const KEYBOARD_PAN_SPEED = 880
const TILE_COL_START = -11
const TILE_COL_END = 11
const TILE_ROW_START = -8
const TILE_ROW_END = 8
const TILE_OVERSCAN = 1
const VIEWPORT_CULL_OVERSCAN_PX = 180
const MASONRY_COLUMN_SPANS = [3, 4, 3, 4, 4, 4]
const MASONRY_ROW_PATTERN = [3, 2, 4, 3, 2, 4, 3]
const NAVIGATION_KEY_CODES = new Set(["KeyW", "KeyA", "KeyS", "KeyD"])

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function findNearestToOrigin(items: CanvasItem[]) {
  if (items.length === 0) return null

  let nearest = items[0]
  let minDistance = Math.hypot(nearest.x, nearest.y)

  for (let index = 1; index < items.length; index += 1) {
    const candidate = items[index]
    const distance = Math.hypot(candidate.x, candidate.y)
    if (distance < minDistance) {
      nearest = candidate
      minDistance = distance
    }
  }

  return nearest
}

function shouldIgnoreKeyboardNavigation(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    target.closest("[contenteditable='true']") !== null
  )
}

function getCanvasLinkStyle(variant: PortfolioCardVariant): CanvasLinkStyle {
  return variant === "split" || variant === "spotlight" ? "journal" : "memo"
}

function buildMasonryTileLayout() {
  const layout: TileLayoutItem[] = []
  const colStart = TILE_COL_START
  const rowStart = TILE_ROW_START
  const rowEnd = TILE_ROW_END

  MASONRY_COLUMN_SPANS.forEach((colSpan, columnIndex) => {
    const colOffset = MASONRY_COLUMN_SPANS.slice(0, columnIndex).reduce((sum, value) => sum + value, 0)
    const col = colStart + colOffset
    let row = rowStart
    let itemIndex = 0

    while (row < rowEnd) {
      const remaining = rowEnd - row

      if (remaining === 1) {
        const previous = layout[layout.length - 1]
        if (previous && previous.col === col) {
          previous.rowSpan += 1
        }
        break
      }

      const preferred = MASONRY_ROW_PATTERN[(columnIndex + itemIndex) % MASONRY_ROW_PATTERN.length]
      let rowSpan = Math.min(preferred, remaining)

      if (remaining - rowSpan === 1) {
        if (rowSpan > 2) {
          rowSpan -= 1
        } else if (remaining >= 3) {
          rowSpan += 1
        }
      }

      layout.push({
        col,
        row,
        colSpan,
        rowSpan,
      })

      row += rowSpan
      itemIndex += 1
    }
  })

  return layout
}

function buildBaseTileItems(cards: PortfolioCardType[]) {
  if (cards.length === 0) {
    return { baseItems: [], tileWidth: GRID_STEP, tileHeight: GRID_STEP }
  }

  const layout = buildMasonryTileLayout()
  const previewCards = cards.filter((card) => card.kind === "preview")
  const infoCards = cards.filter((card) => card.kind === "info")
  const tallPreviewCards = previewCards.filter((card) => (card.previewAspectRatio ?? 1) < 0.95)
  const widePreviewCards = previewCards.filter((card) => (card.previewAspectRatio ?? 1) > 1.45)
  const mediumPreviewCards = previewCards.filter((card) => {
    const ratio = card.previewAspectRatio ?? 1
    return ratio >= 0.95 && ratio <= 1.45
  })
  const infoSlots = new Set([6, 17, 28, 31])
  let infoIndex = 0
  let tallPreviewIndex = 0
  let widePreviewIndex = 0
  let mediumPreviewIndex = 0

  const nextFrom = (list: PortfolioCardType[], cursor: number) => {
    if (list.length === 0) return null
    return list[cursor % list.length]
  }

  const pickPreviewForSlot = (slotAspectRatio: number, index: number) => {
    if (previewCards.length === 0) return null

    if (slotAspectRatio < 0.95) {
      const match = nextFrom(tallPreviewCards, tallPreviewIndex)
      if (match) {
        tallPreviewIndex += 1
        return match
      }
    }

    if (slotAspectRatio > 1.55) {
      const match = nextFrom(widePreviewCards, widePreviewIndex)
      if (match) {
        widePreviewIndex += 1
        return match
      }
    }

    const mediumMatch = nextFrom(mediumPreviewCards, mediumPreviewIndex)
    if (mediumMatch) {
      mediumPreviewIndex += 1
      return mediumMatch
    }

    const tallFallback = nextFrom(tallPreviewCards, tallPreviewIndex)
    if (tallFallback) {
      tallPreviewIndex += 1
      return tallFallback
    }

    const wideFallback = nextFrom(widePreviewCards, widePreviewIndex)
    if (wideFallback) {
      widePreviewIndex += 1
      return wideFallback
    }

    return nextFrom(previewCards, index)
  }

  const rawItems = layout.map((position, index) => {
    const width = position.colSpan * GRID_UNIT + (position.colSpan - 1) * GRID_GAP
    const height = position.rowSpan * GRID_UNIT + (position.rowSpan - 1) * GRID_GAP
    const slotAspectRatio = width / height
    const infoCard =
      infoCards.length > 0 && infoSlots.has(index)
        ? infoCards[infoIndex++ % infoCards.length]
        : null
    const previewCard = infoCard ? null : pickPreviewForSlot(slotAspectRatio, index)
    const fallbackPreview = nextFrom(previewCards, index)
    const fallbackInfo = nextFrom(infoCards, index)
    const card = infoCard ?? previewCard ?? fallbackPreview ?? fallbackInfo ?? cards[index % cards.length]
    const mode: CanvasCardMode = card.kind === "preview" ? "preview" : "link"
    const left = position.col * GRID_STEP
    const top = position.row * GRID_STEP
    return {
      id: `${card.id}-clone-${index}`,
      card,
      variant: cardVariants[index % cardVariants.length],
      mode,
      x: left + width / 2,
      y: top + height / 2,
      width,
      height,
    }
  })

  return {
    baseItems: rawItems,
    tileWidth: (TILE_COL_END - TILE_COL_START) * GRID_STEP,
    tileHeight: (TILE_ROW_END - TILE_ROW_START) * GRID_STEP,
  }
}

function buildRepeatedItems(
  baseItems: CanvasItem[],
  offset: { x: number; y: number },
  viewportSize: { width: number; height: number },
  tileWidth: number,
  tileHeight: number,
) {
  if (tileWidth <= 0 || tileHeight <= 0) return []

  const worldCenterX = -offset.x + viewportSize.width / 2
  const worldCenterY = -offset.y + viewportSize.height / 2
  const tileX = Math.floor(worldCenterX / tileWidth)
  const tileY = Math.floor(worldCenterY / tileHeight)

  const radiusX = Math.ceil(viewportSize.width / tileWidth) + TILE_OVERSCAN
  const radiusY = Math.ceil(viewportSize.height / tileHeight) + TILE_OVERSCAN
  const visibleLeft = -offset.x - VIEWPORT_CULL_OVERSCAN_PX
  const visibleTop = -offset.y - VIEWPORT_CULL_OVERSCAN_PX
  const visibleRight = visibleLeft + viewportSize.width + VIEWPORT_CULL_OVERSCAN_PX * 2
  const visibleBottom = visibleTop + viewportSize.height + VIEWPORT_CULL_OVERSCAN_PX * 2
  const items: RepeatedCanvasItem[] = []

  for (let y = tileY - radiusY; y <= tileY + radiusY; y += 1) {
    for (let x = tileX - radiusX; x <= tileX + radiusX; x += 1) {
      for (const item of baseItems) {
        const nextX = item.x + x * tileWidth
        const nextY = item.y + y * tileHeight
        const itemLeft = nextX - item.width / 2
        const itemTop = nextY - item.height / 2
        const itemRight = itemLeft + item.width
        const itemBottom = itemTop + item.height

        if (
          itemRight < visibleLeft ||
          itemLeft > visibleRight ||
          itemBottom < visibleTop ||
          itemTop > visibleBottom
        ) {
          continue
        }

        items.push({
          ...item,
          tileX: x,
          tileY: y,
          renderKey: `${item.id}-${x}-${y}`,
          x: nextX,
          y: nextY,
        })
      }
    }
  }

  return items
}

export function InfiniteCanvasBoard({ cards, profile, links }: InfiniteCanvasBoardProps) {
  const [offset, setOffset] = useState(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 }

    const { baseItems } = buildBaseTileItems(cards)
    const centerItem = findNearestToOrigin(baseItems)

    if (!centerItem) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }

    return {
      x: window.innerWidth / 2 - centerItem.x,
      y: window.innerHeight / 2 - centerItem.y,
    }
  })
  const [viewportSize, setViewportSize] = useState(() => {
    if (typeof window === "undefined") return { width: 0, height: 0 }
    return { width: window.innerWidth, height: window.innerHeight }
  })
  const [isDragging, setIsDragging] = useState(false)

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{
    pointerId: number
    startPointerX: number
    startPointerY: number
    startOffsetX: number
    startOffsetY: number
    hasDragged: boolean
  } | null>(null)
  const suppressClickRef = useRef(false)
  const pendingOffsetRef = useRef(offset)
  const rafRef = useRef<number | null>(null)
  const pressedKeysRef = useRef<Set<string>>(new Set())
  const keyboardRafRef = useRef<number | null>(null)
  const lastKeyboardFrameRef = useRef<number | null>(null)

  const { baseItems, tileWidth, tileHeight } = useMemo(() => buildBaseTileItems(cards), [cards])
  const centerProfileItemId = useMemo(() => {
    const nearest = findNearestToOrigin(baseItems)
    return nearest?.id ?? null
  }, [baseItems])

  const repeatedItems = useMemo(() => {
    return buildRepeatedItems(baseItems, offset, viewportSize, tileWidth, tileHeight)
  }, [baseItems, offset, tileHeight, tileWidth, viewportSize])

  const scheduleOffset = (nextOffset: { x: number; y: number }) => {
    pendingOffsetRef.current = nextOffset
    if (rafRef.current !== null) return

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      setOffset(pendingOffsetRef.current)
    })
  }

  useEffect(() => {
    pendingOffsetRef.current = offset
  }, [offset])

  useEffect(() => {
    const stopKeyboardPan = () => {
      pressedKeysRef.current.clear()
      lastKeyboardFrameRef.current = null
      if (keyboardRafRef.current !== null) {
        window.cancelAnimationFrame(keyboardRafRef.current)
        keyboardRafRef.current = null
      }
    }

    const runKeyboardPan = (timestamp: number) => {
      const keys = pressedKeysRef.current
      if (keys.size === 0) {
        keyboardRafRef.current = null
        lastKeyboardFrameRef.current = null
        return
      }

      const previousTimestamp = lastKeyboardFrameRef.current ?? timestamp
      const elapsedSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.05)
      lastKeyboardFrameRef.current = timestamp

      let xAxis = 0
      let yAxis = 0

      if (keys.has("KeyA")) xAxis += 1
      if (keys.has("KeyD")) xAxis -= 1
      if (keys.has("KeyW")) yAxis += 1
      if (keys.has("KeyS")) yAxis -= 1

      if (xAxis !== 0 || yAxis !== 0) {
        const magnitude = Math.hypot(xAxis, yAxis)
        const normalizedX = xAxis / magnitude
        const normalizedY = yAxis / magnitude
        const distance = KEYBOARD_PAN_SPEED * elapsedSeconds

        scheduleOffset({
          x: pendingOffsetRef.current.x + normalizedX * distance,
          y: pendingOffsetRef.current.y + normalizedY * distance,
        })
      }

      keyboardRafRef.current = window.requestAnimationFrame(runKeyboardPan)
    }

    const ensureKeyboardPan = () => {
      if (keyboardRafRef.current !== null) return
      lastKeyboardFrameRef.current = null
      keyboardRafRef.current = window.requestAnimationFrame(runKeyboardPan)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!NAVIGATION_KEY_CODES.has(event.code)) return
      if (shouldIgnoreKeyboardNavigation(event.target)) return

      event.preventDefault()
      pressedKeysRef.current.add(event.code)
      ensureKeyboardPan()
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (!NAVIGATION_KEY_CODES.has(event.code)) return
      pressedKeysRef.current.delete(event.code)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", stopKeyboardPan)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", stopKeyboardPan)
      stopKeyboardPan()
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!viewportRef.current) return
    if (event.button !== 0) return

    const eventTarget = event.target as HTMLElement
    if (!viewportRef.current.contains(eventTarget)) {
      return
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      hasDragged: false,
    }

    viewportRef.current.setPointerCapture(event.pointerId)
  }

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startPointerX
    const deltaY = event.clientY - dragState.startPointerY
    const distance = Math.hypot(deltaX, deltaY)

    if (!dragState.hasDragged && distance < DRAG_THRESHOLD_PX) {
      return
    }

    if (!dragState.hasDragged) {
      dragState.hasDragged = true
      setIsDragging(true)
    }

    scheduleOffset({
      x: dragState.startOffsetX + deltaX,
      y: dragState.startOffsetY + deltaY,
    })
  }

  const onPointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    const dragState = dragRef.current
    if (!viewportRef.current || !dragState || dragState.pointerId !== event.pointerId) return

    if (dragState.hasDragged) {
      suppressClickRef.current = true
    }

    dragRef.current = null
    setIsDragging(false)

    if (viewportRef.current.hasPointerCapture(event.pointerId)) {
      viewportRef.current.releasePointerCapture(event.pointerId)
    }
  }

  const onClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!suppressClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  const onDragStartCapture: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  const onWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    scheduleOffset({
      x: pendingOffsetRef.current.x - event.deltaX,
      y: pendingOffsetRef.current.y - event.deltaY,
    })
  }

  return (
    <section className="canvas-root relative h-[100dvh] w-full overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          "canvas-viewport absolute inset-0 touch-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDownCapture={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onDragStartCapture={onDragStartCapture}
        onWheel={onWheel}
      >
        <div
          className="canvas-world absolute left-0 top-0 will-change-transform"
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          {repeatedItems.map((item) => (
            <div
              key={item.renderKey}
              data-canvas-card="true"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {item.id === centerProfileItemId ? (
                <article
                  data-canvas-profile="true"
                  className="flex h-full items-center justify-center rounded-[2rem] border border-transparent bg-transparent px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="grid w-full max-w-[52rem] content-center items-center gap-5 lg:grid-cols-[1.2fr_0.9fr] lg:gap-7">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className="size-[60px] rounded-[16px] object-cover"
                        />
                        <div>
                          <h1 className="text-[14px] font-semibold leading-[1.3] text-[var(--ink)]">
                            {profile.name}
                          </h1>
                          <p className="mt-0.5 text-[14px] font-normal leading-[1.3] text-[color-mix(in_oklab,var(--muted)_75%,#8a8a8a)]">
                            {profile.title}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 max-w-[46ch] text-pretty text-[14px] leading-[1.45] text-[color-mix(in_oklab,var(--muted)_75%,#6f737a)]">
                        {profile.intro}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--muted)_28%,#d5d7db)] px-3 py-1.5 text-[14px] font-medium uppercase tracking-[0.02em] text-[color-mix(in_oklab,var(--muted)_72%,#6f737a)]">
                        <span className="size-2 rounded-full bg-[#29d463]" aria-hidden="true" />
                        {profile.availability}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        <a
                          href={profile.contactHref}
                          className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--ink)_28%,#1f2937)] bg-[color-mix(in_oklab,var(--ink)_84%,#111)] px-4 py-2 text-[14px] font-semibold text-white no-underline transition-opacity duration-150 ease-out hover:opacity-85"
                        >
                          {profile.contactLabel}
                          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                            <path d="M6 5l7 5-7 5" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </a>
                        <a
                          href={`mailto:${links.email}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--muted)_25%,#d5d7db)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--ink)] no-underline transition-opacity duration-150 ease-out hover:opacity-85"
                        >
                          {links.email}
                          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-[var(--muted)]">
                            <path d="M5.5 2.5h7a2 2 0 0 1 2 2v7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <rect x="2.5" y="5.5" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-center gap-4">
                      <div>
                        <p className="text-[14px] font-medium uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--muted)_68%,#8b8f96)]">
                          {profile.previouslyLabel}
                        </p>
                        <p className="mt-1 text-pretty text-[14px] leading-[1.45] text-[color-mix(in_oklab,var(--muted)_76%,#6f737a)]">
                          {profile.previouslyText}
                        </p>
                      </div>

                      <div>
                        <p className="text-[14px] font-medium uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--muted)_68%,#8b8f96)]">
                          {profile.nowLabel}
                        </p>
                        <p className="mt-1 text-pretty text-[14px] leading-[1.45] text-[color-mix(in_oklab,var(--muted)_76%,#6f737a)]">
                          {profile.nowText}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ) : item.mode === "image" ? (
                <ProjectDialog card={item.card} cardVariant={item.variant} className="h-full" />
              ) : item.mode === "preview" ? (
                <div className="canvas-preview-card h-full w-full overflow-hidden rounded-[24px] p-2 sm:p-3">
                  <div className="canvas-preview-media flex h-full w-full items-center justify-center overflow-hidden rounded-[1.45rem]">
                    {isVideoPreviewSource(item.card.image) ? (
                      <video
                        src={item.card.image}
                        aria-label={item.card.title}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="canvas-preview-asset"
                      />
                    ) : (
                      <img
                        src={item.card.image}
                        alt={item.card.title}
                        draggable={false}
                        className="canvas-preview-asset"
                      />
                    )}
                  </div>
                </div>
              ) : item.mode === "link" ? (
                <div className="canvas-link-shell flex h-full w-full items-center justify-center overflow-hidden rounded-[24px] p-2 sm:p-3">
                  <a
                    href={item.card.ctaHref}
                    target={item.card.ctaExternal ? "_blank" : undefined}
                    rel={item.card.ctaExternal ? "noreferrer" : undefined}
                    draggable={false}
                    data-link-style={getCanvasLinkStyle(item.variant)}
                    className={cn(
                      "canvas-link-card group flex w-full flex-col rounded-[1.35rem] border p-5 no-underline sm:p-6",
                      getCanvasLinkStyle(item.variant) === "memo"
                        ? "canvas-link-card-memo"
                        : "canvas-link-card-journal",
                    )}
                    aria-label={`${item.card.title} - ${item.card.ctaLabel}`}
                  >
                    <p className="canvas-link-card-kicker tabular-nums text-sm font-medium text-[var(--muted)]">
                      {item.card.category}
                    </p>
                    <h2 className="mt-3 max-w-[20ch] text-balance text-[1.62rem] font-semibold leading-[1.12] text-[var(--ink)]">
                      {item.card.title}
                    </h2>
                    <p className="canvas-link-card-summary mt-4 max-w-[27ch] text-pretty text-[1.02rem] leading-relaxed text-[var(--muted)]">
                      {item.card.summary}
                    </p>
                    <span className="canvas-link-card-cta mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--accent-strong)]">
                      {item.card.ctaLabel}
                      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                        <path d="M5 15L15 5M7 5h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </a>
                </div>
              ) : item.mode === "video" ? (
                <a
                  href={item.card.ctaHref}
                  target={item.card.ctaExternal ? "_blank" : undefined}
                  rel={item.card.ctaExternal ? "noreferrer" : undefined}
                  draggable={false}
                  className="canvas-video-card group relative block h-full overflow-hidden rounded-[2rem] border"
                  aria-label={`Open ${item.card.title} video`}
                >
                  <img
                    src={item.card.image}
                    alt={item.card.title}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/30" />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition-transform duration-200 ease-out group-hover:scale-105">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 size-8 fill-current">
                      <path d="M8 6v12l10-6z" />
                    </svg>
                  </div>
                  <p className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-sm font-medium text-white">
                    {item.card.title}
                  </p>
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-5 top-[calc(1rem+env(safe-area-inset-top))] z-30 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_86%,transparent)] px-4 py-2 text-xs font-medium tracking-[0.03em] text-[var(--muted)] backdrop-blur-sm sm:right-8 sm:top-[calc(1.25rem+env(safe-area-inset-top))]">
        Drag, scroll, or use WASD keys
      </div>
    </section>
  )
}
