import { portfolioCards, type PortfolioCard } from "../data/portfolio"
import { writingSummaries, type WritingSummary } from "../data/writingIndex"

export const siteOrigin = "https://rafaelmedina.me"

/**
 * The résumé is a gallery item like a project is, so it needs an id to be
 * selected by and a path to be shared from. It has no card behind it, so this
 * sentinel stands in for one wherever the two travel together.
 */
export const resumeItemId = "resume"
export const resumePath = "/resume/"

/**
 * The notes folder is a gallery item for the same reason: its tile opens a
 * slide -- the list of notes -- and that list owns `/notes/`, with every note
 * under it at `/notes/<id>/`.
 */
export const writingsItemId = "writings"
export const notesPath = "/notes/"

/** A project, a note, the notes list, the résumé, or the portfolio itself. */
export type GalleryTarget = PortfolioCard | WritingSummary | typeof resumeItemId | typeof writingsItemId

/** Only a project carries a slug, which is what tells the two objects apart. */
const isCard = (target: PortfolioCard | WritingSummary): target is PortfolioCard => "slug" in target

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

export function isNotesPath(pathname: string) {
  return `${normalizePath(pathname)}/` === notesPath
}

/**
 * A note owns its path the way a project owns `/work/<slug>/`. The id is
 * already the readable, stable name the likes API knows it by, so it is the
 * slug too rather than a second string to keep in step with the title.
 */
export function writingPath(writing: { id: string }) {
  return `/notes/${writing.id}/`
}

export function writingAtPath(pathname: string) {
  const normalized = normalizePath(pathname)
  return writingSummaries.find(writing => writingPath(writing) === `${normalized}/`)
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

// The list has no artwork at all, so it carries the site's own card.
const notesPage: PageDescription = {
  title: "Notes — Rafael Medina",
  description: "Rafael Medina's notes on design, tools, and working with agents: short essays written over the year, newest first.",
  path: notesPath,
  image: "/og-image.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "The rafaelmedina.me homepage: Rafael Medina's portrait and intro above the first row of work tiles.",
}

// A note is prose, so it has no artwork of its own unless it opens with a
// cover. The two that do preview with it; the rest fall back to the site's own
// card, which is the portrait a link to anything else here carries.
function writingPage(writing: WritingSummary): PageDescription {
  return {
    title: `${writing.title} — Rafael Medina`,
    description: writing.description,
    path: writingPath(writing),
    image: writing.social?.src ?? homePage.image,
    imageWidth: writing.social?.width ?? homePage.imageWidth,
    imageHeight: writing.social?.height ?? homePage.imageHeight,
    imageAlt: writing.social?.alt ?? homePage.imageAlt,
  }
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
  if (target === resumeItemId) return resumePage
  if (target === writingsItemId) return notesPage
  return isCard(target) ? projectPage(target) : writingPage(target)
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
