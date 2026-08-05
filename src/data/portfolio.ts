import profilePhoto from "../assets/profile-photo.webp"

export type PortfolioCard = {
  id: string
  category: string
  title: string
  summary: string
  detail: string
  image: string
  previewWidth?: number
  previewHeight?: number
  previewPoster?: string
  ctaHref: string
  previewAspectRatio?: number
  previewMediaPaddingBlock?: string
  pagination?: {
    total: number
    images: string[]
  }
}

export type Collaborator = {
  name: string
  href: string
  /** Drop a square image in `public/people/` to replace the initials fallback. */
  photo?: string
}

export const collaborators = {
  // Listed first on every project so my own involvement reads at a glance.
  rafael: { name: "Rafael Medina", href: "https://www.linkedin.com/in/rafaelmedian", photo: profilePhoto },
  nick: { name: "Nick Sarath", href: "https://www.linkedin.com/in/nicksarath", photo: "/people/nick.jpg" },
  simon: { name: "Simon Rico", href: "https://www.linkedin.com/in/simonrico/", photo: "/people/simon.jpg" },
  jakub: { name: "Jakub Antalik", href: "https://www.linkedin.com/in/jakubantalik/", photo: "/people/jakub.jpg" },
} satisfies Record<string, Collaborator>

export type SiteLinks = {
  dribbble: string
  x: string
  telegram: string
  github: string
  linkedin: string
  email: string
}

export type HomeRowItem = {
  cardId: string
  span?: number
  width?: string
  fit?: "cover" | "contain"
  mediaMaxHeight?: string
}

export type HomeRow = {
  id: string
  height?: string
  gap?: string
  items: HomeRowItem[]
}

const homeTileRowHeight = "clamp(180px, 16vw, 260px)"

export const homeRows: HomeRow[] = [
  {
    id: "row-featured",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-9", span: 2 },
      { cardId: "preview-shot-16", span: 2 },
      { cardId: "preview-popparazi-v1", span: 1, fit: "contain", mediaMaxHeight: "84%" },
    ],
  },
  {
    id: "row-2",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-14", span: 1 },
      { cardId: "preview-protector", span: 2 },
      { cardId: "preview-shot-20", span: 1 },
    ],
  },
  {
    id: "row-3",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-21", span: 1 },
      { cardId: "preview-shot-1", span: 1 },
      { cardId: "preview-shot-15", span: 1 },
    ],
  },
  {
    id: "row-4",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-19", span: 1 },
      { cardId: "preview-shot-22", span: 1 },
      { cardId: "preview-shot-23", span: 1 },
    ],
  },
]

export const siteProfile = {
  name: "Rafael Medina",
  title: "Product Designer, Freelance",
  photo: profilePhoto,
}

export const siteLinks: SiteLinks = {
  dribbble: "https://dribbble.com/rafaelmedian",
  x: "https://x.com/rafaelmedian",
  telegram: "https://t.me/rafaelmedian",
  github: "https://github.com/rafaelmedian",
  linkedin: "https://www.linkedin.com/in/rafaelmedian",
  email: "hey@rafaelmedina.me",
}

export const portfolioCards: PortfolioCard[] = [
  {
    id: "preview-shot-9",
    category: "Preview",
    title: "Matcha - Multiwallet flow",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-9.webm",
    previewWidth: 480,
    previewHeight: 360,
    previewPoster: "/Projects/shot-small-9-poster.webp",
    ctaHref: "#",
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-14",
    category: "Preview",
    title: "Matcha - Mobile Screens",
    summary: "",
    detail: "",
    image: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
  {
    id: "preview-shot-20",
    category: "Preview",
    title: "Matcha - Security Audit",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-20.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-20-poster.webp",
    ctaHref: "#",
  },
  {
    id: "preview-shot-16",
    category: "Preview",
    title: "Matcha - Homepage",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-16.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-16-poster.webp",
    ctaHref: "#",
    previewAspectRatio: 0.8,
  },
  {
    id: "preview-protector",
    category: "Preview",
    title: "Protector",
    summary: "",
    detail: "",
    image: "/Projects/protector.webp",
    previewWidth: 1200,
    previewHeight: 1328,
    ctaHref: "#",
    previewAspectRatio: 1354 / 1025,
  },
  {
    id: "preview-popparazi-v1",
    category: "Preview",
    title: "Popparazi V1",
    summary: "",
    detail: "",
    image: "/Projects/popparazi_v1.webp",
    previewWidth: 630,
    previewHeight: 1314,
    ctaHref: "#",
    previewAspectRatio: 0.46,
    previewMediaPaddingBlock: "clamp(0.7rem, 1.6vw, 1.4rem)",
  },
  {
    id: "preview-shot-21",
    category: "Preview",
    title: "Matcha - Token Page",
    summary: "",
    detail: "",
    image: "/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-shot-1",
    category: "Preview",
    title: "Matcha Trade Page",
    summary: "",
    detail: "",
    image: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
  {
    id: "preview-shot-15",
    category: "Preview",
    title: "Matcha - Mobile navigation",
    summary: "",
    detail: "",
    image: "/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
  {
    id: "preview-shot-19",
    category: "Preview",
    title: "Matcha Trade module",
    summary: "",
    detail: "",
    image: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
  {
    id: "preview-shot-22",
    category: "Preview",
    title: "Matcha Dark mode",
    summary: "",
    detail: "",
    image: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
  {
    id: "preview-shot-23",
    category: "Preview",
    title: "Matcha Pro",
    summary: "",
    detail: "",
    image: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
  },
]
