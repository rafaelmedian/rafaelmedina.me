import { renderToString } from "react-dom/server"

import App from "./App"
import { portfolioCards } from "./data/portfolio"
import { pageMetadata, projectPath, resumeItemId, resumePath } from "./lib/projectMetadata"

export const pages = [
  { pathname: "/", metadata: pageMetadata() },
  { pathname: resumePath, metadata: pageMetadata(resumeItemId) },
  ...portfolioCards.map(card => ({ pathname: projectPath(card), metadata: pageMetadata(card) })),
]

export function render(pathname = "/") {
  return renderToString(<App pathname={pathname} />)
}
