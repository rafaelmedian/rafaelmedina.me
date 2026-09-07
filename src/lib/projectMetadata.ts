import { portfolioCards, type PortfolioCard } from "../data/portfolio"

export const siteOrigin = "https://rafaelmedina.me"

export function projectPath(card: PortfolioCard) {
  return `/work/${card.slug}/`
}

export function projectAtPath(pathname: string) {
  const normalized = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "")
  return portfolioCards.find(card => projectPath(card) === `${normalized}/`)
}

export function pageMetadata(card?: PortfolioCard) {
  const title = card ? `${card.title} — Rafael Medina` : "Rafael Medina — Product Designer"
  const description = card?.detail ?? "Senior product designer across web3, fintech, and consumer products. Ten years prototyping in code and shipping real interfaces. Available for work."
  const canonical = `${siteOrigin}${card ? projectPath(card) : "/"}`
  const imagePath = card ? card.previewPoster ?? card.image : "/og-image.png"
  const image = `${siteOrigin}${imagePath}`
  const imageAlt = card?.title ?? "Portrait of Rafael Medina centered on a plain off-white background."
  const imageType = imagePath.endsWith(".jpg") ? "image/jpeg" : imagePath.endsWith(".webp") ? "image/webp" : "image/png"

  return {
    title,
    canonical,
    meta: {
      description,
      "og:title": title,
      "og:description": description,
      "og:url": canonical,
      "og:image": image,
      "og:image:secure_url": image,
      "og:image:type": imageType,
      "og:image:width": String(card?.previewPosterWidth ?? card?.previewWidth ?? 1200),
      "og:image:height": String(card?.previewPosterHeight ?? card?.previewHeight ?? 630),
      "og:image:alt": imageAlt,
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image,
      "twitter:image:alt": imageAlt,
    },
  }
}

/** Keep an enhanced gallery visit's head in step with its static destination. */
export function updatePageMetadata(card?: PortfolioCard) {
  const metadata = pageMetadata(card)
  document.title = metadata.title
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical)
  for (const [key, value] of Object.entries(metadata.meta)) {
    document.querySelector(`meta[${key.startsWith("og:") ? "property" : "name"}="${key}"]`)
      ?.setAttribute("content", value)
  }
}
