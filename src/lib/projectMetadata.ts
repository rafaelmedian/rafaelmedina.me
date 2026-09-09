import { portfolioCards, type PortfolioCard } from "../data/portfolio"

export const siteOrigin = "https://rafaelmedina.me"

/**
 * The résumé is a gallery item like a project is, so it needs an id to be
 * selected by and a path to be shared from. It has no card behind it, so this
 * sentinel stands in for one wherever the two travel together.
 */
export const resumeItemId = "resume"
export const resumePath = "/resume/"

/** A project, the résumé, or the portfolio itself. */
export type GalleryTarget = PortfolioCard | typeof resumeItemId

function normalizePath(pathname: string) {
  return pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "")
}

export function projectPath(card: PortfolioCard) {
  return `/work/${card.slug}/`
}

export function projectAtPath(pathname: string) {
  const normalized = normalizePath(pathname)
  return portfolioCards.find(card => projectPath(card) === `${normalized}/`)
}

export function isResumePath(pathname: string) {
  return `${normalizePath(pathname)}/` === resumePath
}

type PageDescription = {
  title: string
  description: string
  path: string
  image: string
  imageWidth: number
  imageHeight: number
  imageAlt: string
}

const homePage: PageDescription = {
  title: "Rafael Medina — Senior Product Designer",
  description: "Senior product designer across web3, fintech, and consumer products. Ten years prototyping in code and shipping real interfaces. Available for work.",
  path: "/",
  image: "/og-image.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "The rafaelmedina.me homepage: Rafael Medina's portrait and intro above the first row of work tiles.",
}

// The social image is the same sheet the hero's Resume link previews, at its
// real pixel size: the résumé's own first page is a better card for a link to
// the résumé than the site's portrait.
const resumePage: PageDescription = {
  title: "Résumé — Rafael Medina",
  description: "Rafael Medina's work history and education: ten years of product design across web3, fintech, and consumer products, with the projects each role shipped.",
  path: resumePath,
  image: "/rafael-medina-resume-preview.png",
  imageWidth: 816,
  imageHeight: 1056,
  imageAlt: "The first page of Rafael Medina's résumé.",
}

function projectPage(card: PortfolioCard): PageDescription {
  const image = card.previewPoster ?? card.image
  return {
    title: `${card.title} — Rafael Medina`,
    description: card.detail,
    path: projectPath(card),
    image,
    imageWidth: card.previewPosterWidth ?? card.previewWidth ?? 1200,
    imageHeight: card.previewPosterHeight ?? card.previewHeight ?? 630,
    imageAlt: card.title,
  }
}

function describePage(target?: GalleryTarget) {
  if (!target) return homePage
  return target === resumeItemId ? resumePage : projectPage(target)
}

export function pageMetadata(target?: GalleryTarget) {
  const page = describePage(target)
  const canonical = `${siteOrigin}${page.path}`
  const image = `${siteOrigin}${page.image}`
  const imageType = page.image.endsWith(".jpg") ? "image/jpeg" : page.image.endsWith(".webp") ? "image/webp" : "image/png"

  return {
    title: page.title,
    canonical,
    meta: {
      description: page.description,
      "og:title": page.title,
      "og:description": page.description,
      "og:url": canonical,
      "og:image": image,
      "og:image:secure_url": image,
      "og:image:type": imageType,
      "og:image:width": String(page.imageWidth),
      "og:image:height": String(page.imageHeight),
      "og:image:alt": page.imageAlt,
      "twitter:title": page.title,
      "twitter:description": page.description,
      "twitter:image": image,
      "twitter:image:alt": page.imageAlt,
    },
  }
}

/** Keep an enhanced gallery visit's head in step with its static destination. */
export function updatePageMetadata(target?: GalleryTarget) {
  const metadata = pageMetadata(target)
  document.title = metadata.title
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical)
  for (const [key, value] of Object.entries(metadata.meta)) {
    document.querySelector(`meta[${key.startsWith("og:") ? "property" : "name"}="${key}"]`)
      ?.setAttribute("content", value)
  }
}
