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
  photo: string
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

type Rect = {
  left: number
  top: number
  right: number
  bottom: number
}

type RepeatedCanvasItem = CanvasItem & {
  tileX: number
  tileY: number
  renderKey: string
}

type InfiniteCanvasBoardProps = {
  cards: PortfolioCardType[]
  profile: SiteProfile
}

type CanvasCardMode = "image" | "link" | "video"

const cardVariants: PortfolioCardVariant[] = ["editorial", "media", "split", "spotlight"]
const GRID_UNIT = 92
const GRID_GAP = 15
const GRID_STEP = GRID_UNIT + GRID_GAP
const DRAG_THRESHOLD_PX = 6
const TILE_COL_START = -11
const TILE_COL_END = 11
const TILE_ROW_START = -8
const TILE_ROW_END = 8
const PROFILE_CLEARANCE_WIDTH = 430
const PROFILE_CLEARANCE_HEIGHT = 300
const TARGET_TILE_ITEMS = 32
const TILE_OVERSCAN = 1
const VIEWPORT_CULL_OVERSCAN_PX = 180
const SPAN_PATTERN: Array<Pick<TileLayoutItem, "colSpan" | "rowSpan">> = [
  { colSpan: 3, rowSpan: 3 },
  { colSpan: 4, rowSpan: 2 },
  { colSpan: 2, rowSpan: 3 },
  { colSpan: 3, rowSpan: 2 },
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 4, rowSpan: 3 },
  { colSpan: 3, rowSpan: 2 },
  { colSpan: 2, rowSpan: 2 },
]

function modeForIndex(index: number): CanvasCardMode {
  const bucket = index % 10
  if (bucket < 7) return "image"
  if (bucket < 9) return "video"
  return "link"
}

function rectsIntersect(a: Rect, b: Rect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function buildDenseTileLayout() {
  const items: TileLayoutItem[] = []
  const occupied = new Set<string>()

  const getCellKey = (col: number, row: number) => `${col}:${row}`

  const canPlace = (candidate: TileLayoutItem) => {
    if (candidate.col < TILE_COL_START || candidate.row < TILE_ROW_START) return false
    if (candidate.col + candidate.colSpan > TILE_COL_END) return false
    if (candidate.row + candidate.rowSpan > TILE_ROW_END) return false

    for (let row = candidate.row; row < candidate.row + candidate.rowSpan; row += 1) {
      for (let col = candidate.col; col < candidate.col + candidate.colSpan; col += 1) {
        if (occupied.has(getCellKey(col, row))) return false
      }
    }

    return true
  }

  const place = (candidate: TileLayoutItem) => {
    items.push(candidate)
    for (let row = candidate.row; row < candidate.row + candidate.rowSpan; row += 1) {
      for (let col = candidate.col; col < candidate.col + candidate.colSpan; col += 1) {
        occupied.add(getCellKey(col, row))
      }
    }
  }

  const centerCol = (TILE_COL_START + TILE_COL_END) / 2
  const centerRow = (TILE_ROW_START + TILE_ROW_END) / 2
  const anchors: Array<{ col: number; row: number }> = []

  for (let row = TILE_ROW_START; row < TILE_ROW_END; row += 1) {
    for (let col = TILE_COL_START; col < TILE_COL_END; col += 1) {
      anchors.push({ col, row })
    }
  }

  anchors.sort((a, b) => {
    const aDx = Math.abs(a.col - centerCol)
    const aDy = Math.abs(a.row - centerRow)
    const bDx = Math.abs(b.col - centerCol)
    const bDy = Math.abs(b.row - centerRow)
    const aDistance = aDx + aDy
    const bDistance = bDx + bDy
    if (aDistance !== bDistance) return aDistance - bDistance
    if (aDy !== bDy) return aDy - bDy
    return aDx - bDx
  })

  for (const { col, row } of anchors) {
    if (items.length >= TARGET_TILE_ITEMS) break
    if (occupied.has(getCellKey(col, row))) continue

    const patternOffset = Math.abs((row + col) % SPAN_PATTERN.length)
    let placed = false

    for (let index = 0; index < SPAN_PATTERN.length; index += 1) {
      const next = SPAN_PATTERN[(index + patternOffset) % SPAN_PATTERN.length]
      const candidate: TileLayoutItem = {
        col,
        row,
        colSpan: next.colSpan,
        rowSpan: next.rowSpan,
      }

      if (!canPlace(candidate)) continue
      place(candidate)
      placed = true
      break
    }

    if (placed) continue

    const fallback: TileLayoutItem = { col, row, colSpan: 2, rowSpan: 2 }
    if (canPlace(fallback)) {
      place(fallback)
    }
  }

  return items
}

function buildBaseTileItems(cards: PortfolioCardType[]) {
  if (cards.length === 0) {
    return { baseItems: [], tileWidth: GRID_STEP, tileHeight: GRID_STEP }
  }

  const layout = buildDenseTileLayout()
  const rawItems = layout.map((position, index) => {
    const card = cards[index % cards.length]
    const width = position.colSpan * GRID_UNIT + (position.colSpan - 1) * GRID_GAP
    const height = position.rowSpan * GRID_UNIT + (position.rowSpan - 1) * GRID_GAP
    const left = position.col * GRID_STEP
    const top = position.row * GRID_STEP
    return {
      id: `${card.id}-clone-${index}`,
      card,
      variant: cardVariants[index % cardVariants.length],
      mode: modeForIndex(index),
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
  const profileClearance: Rect = {
    left: -PROFILE_CLEARANCE_WIDTH / 2,
    right: PROFILE_CLEARANCE_WIDTH / 2,
    top: -PROFILE_CLEARANCE_HEIGHT / 2,
    bottom: PROFILE_CLEARANCE_HEIGHT / 2,
  }
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
        const itemRect: Rect = {
          left: itemLeft,
          right: itemRight,
          top: itemTop,
          bottom: itemBottom,
        }

        if (x === 0 && y === 0 && rectsIntersect(itemRect, profileClearance)) {
          continue
        }

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

export function InfiniteCanvasBoard({ cards, profile }: InfiniteCanvasBoardProps) {
  const [offset, setOffset] = useState(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
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

  const { baseItems, tileWidth, tileHeight } = useMemo(() => buildBaseTileItems(cards), [cards])

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
          <article
            data-canvas-profile="true"
            className="center-main-card absolute left-0 top-0 z-20 w-[min(78vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border px-7 py-7 shadow-[var(--card-shadow)] sm:w-[380px] sm:px-8 sm:py-8"
          >
            <div className="flex items-center gap-5">
              <img
                src={profile.photo}
                alt={profile.name}
                className="size-20 rounded-full border border-[var(--border)] object-cover"
              />
              <div>
                <h1 className="text-3xl font-semibold leading-tight text-[var(--ink)]">{profile.name}</h1>
                <p className="mt-1 text-base text-[var(--muted)]">{profile.title}</p>
              </div>
            </div>
            <p className="mt-5 text-pretty text-[0.98rem] leading-relaxed text-[var(--muted-strong)]">{profile.intro}</p>
          </article>

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
              {item.mode === "image" ? (
                <ProjectDialog card={item.card} cardVariant={item.variant} className="h-full" />
              ) : null}

              {item.mode === "link" ? (
                <a
                  href={item.card.ctaHref}
                  target={item.card.ctaExternal ? "_blank" : undefined}
                  rel={item.card.ctaExternal ? "noreferrer" : undefined}
                  draggable={false}
                  className="canvas-link-card group flex h-full flex-col rounded-[2rem] border p-6 no-underline sm:p-7"
                  aria-label={`${item.card.title} - ${item.card.ctaLabel}`}
                >
                  <p className="tabular-nums text-sm font-medium text-[var(--muted)]">{item.card.category}</p>
                  <h2 className="mt-3 max-w-[16ch] text-balance text-[1.85rem] font-semibold leading-[1.1] text-[var(--ink)]">
                    {item.card.title}
                  </h2>
                  <p className="mt-4 max-w-[26ch] text-pretty text-base leading-relaxed text-[var(--muted)]">
                    {item.card.summary}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--accent-strong)]">
                    {item.card.ctaLabel}
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                      <path d="M5 15L15 5M7 5h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                </a>
              ) : null}

              {item.mode === "video" ? (
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
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.35)_100%)]" />
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
        Drag to pan or use trackpad scroll
      </div>
    </section>
  )
}
