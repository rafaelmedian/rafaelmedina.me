import { renderToString } from "react-dom/server"

import App from "./App"
import { portfolioCards } from "./data/portfolio"
import { pageMetadata, projectPath } from "./lib/projectMetadata"

export const pages = [
  { pathname: "/", metadata: pageMetadata() },
  ...portfolioCards.map(card => ({ pathname: projectPath(card), metadata: pageMetadata(card) })),
]

export function render(pathname = "/") {
  return renderToString(<App pathname={pathname} />)
}
