/**
 * Media sources follow the convention documented beside the card data in
 * src/data/portfolio.ts: .webm/.mp4 render as autoplaying muted video,
 * anything else as an image. Case-insensitive so an upper-case extension
 * cannot silently demote a clip to a broken <img>.
 */
export function isVideoSource(source: string): boolean {
  const normalized = source.toLowerCase()
  return normalized.endsWith(".webm") || normalized.endsWith(".mp4")
}
