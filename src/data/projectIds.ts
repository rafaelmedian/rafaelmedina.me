// Shared by the portfolio data and likes API; keep IDs stable to preserve saved
// likes. The order mirrors `portfolioCards`, which is also the grid's order.
export const projectIds = [
  "preview-shot-9",
  "preview-shot-22",
  "preview-shot-16",
  "preview-protector",
  "preview-popparazi-v1",
  "preview-shot-21",
  "preview-shot-1",
  "preview-shot-19",
  "preview-shot-14",
  "preview-shot-23",
  "preview-shot-20",
  "preview-dealership-lead-hub",
  "preview-family-stories",
  "preview-matcha-rewards",
  "preview-matcha-marketing",
  "preview-matcha-relaunch-film",
  "preview-matcha-cross-chain-film",
  "preview-matcha-gasless-film",
  "preview-matcha-limit-orders-film",
] as const

export type ProjectId = typeof projectIds[number]
