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
  /** Gallery "Product" row; falls back to `category`. */
  product?: string
  /** Gallery "Industry" row; falls back to "Product Design". */
  industry?: string
  /** Teammates on this work; Rafael is credited automatically alongside them. */
  team?: Collaborator[]
  previewAspectRatio?: number
  previewMediaPaddingBlock?: string
  /** The grid tile crops this shot; the gallery repeats the same crop. */
  previewCropped?: boolean
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
  github: "https://github.com/rafaelmedian",
  linkedin: "https://www.linkedin.com/in/rafaelmedian",
  email: "hey@rafaelmedina.me",
}

const matchaMeta = {
  product: "Matcha - DEX Aggregator by 0x",
  industry: "DeFi / Web3 / Fintech",
  ctaHref: "https://matcha.xyz",
}

export const portfolioCards: PortfolioCard[] = [
  {
    id: "preview-shot-9",
    category: "Preview",
    title: "Matcha - Multiwallet flow",
    summary: "",
    detail:
      "Connecting and switching between several wallets without losing your place — the flow, states, and small interactions that make juggling accounts on Matcha feel routine.",
    image: "/Projects/shot-small-9.webm",
    previewWidth: 480,
    previewHeight: 360,
    previewPoster: "/Projects/shot-small-9-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon],
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-14",
    category: "Preview",
    title: "Matcha - Mobile Screens",
    summary: "",
    detail:
      "A pass across Matcha's core mobile screens, keeping dense trading data legible and tappable on a phone-sized canvas.",
    image: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-20",
    category: "Preview",
    title: "Matcha - Security Audit",
    summary: "",
    detail:
      "Surfacing token security audits inside Matcha so traders can gauge risk before they swap, without leaving the flow.",
    image: "/Projects/shot-small-20.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-20-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-16",
    category: "Preview",
    title: "Matcha - Homepage",
    summary: "",
    detail:
      "Matcha's homepage, introducing the product and moving visitors into their first trade with as little friction as possible.",
    image: "/Projects/shot-small-16.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-16-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon],
    previewAspectRatio: 0.8,
  },
  {
    id: "preview-protector",
    category: "Preview",
    title: "Protector",
    summary: "",
    detail:
      "A protection-focused mobile product designed around trust: quick comprehension, calm surfaces, and confident action in stressful moments.",
    image: "/Projects/protector.webp",
    previewWidth: 1200,
    previewHeight: 1328,
    ctaHref: "https://protector.so",
    product: "Protector",
    industry: "Consumer Safety",
    team: [collaborators.nick],
    previewAspectRatio: 1354 / 1025,
    previewCropped: true,
  },
  {
    id: "preview-popparazi-v1",
    category: "Preview",
    title: "Popparazi V1",
    summary: "",
    detail:
      "The first version of Popparazi, a mobile social app exploration focused on visual rhythm, content density, and playful interaction.",
    image: "/Projects/popparazi_v1.webp",
    previewWidth: 630,
    previewHeight: 1314,
    ctaHref: "#",
    product: "Popparazi",
    industry: "Consumer Social",
    team: [collaborators.nick],
    previewAspectRatio: 0.46,
    previewMediaPaddingBlock: "clamp(0.7rem, 1.6vw, 1.4rem)",
  },
  {
    id: "preview-shot-21",
    category: "Preview",
    title: "Matcha - Token Page",
    summary: "",
    detail:
      "Matcha's token page, organizing price action, liquidity, and token metadata into a hierarchy a trader can scan in seconds.",
    image: "/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.jakub],
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-shot-1",
    category: "Preview",
    title: "Matcha Trade Page",
    summary: "",
    detail:
      "The trade page that anchors Matcha: a dense quote panel held together by calm hierarchy, so fast decisions don't feel rushed.",
    image: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-15",
    category: "Preview",
    title: "Matcha - Mobile navigation",
    summary: "",
    detail:
      "Rethinking Matcha's mobile navigation so the core actions stayed one thumb-reach away as the product grew.",
    image: "/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon],
  },
  {
    id: "preview-shot-19",
    category: "Preview",
    title: "Matcha Trade module",
    summary: "",
    detail:
      "The trade module itself — inputs, quotes, and confirmation states tuned for clarity at the moment money moves.",
    image: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.jakub],
  },
  {
    id: "preview-shot-22",
    category: "Preview",
    title: "Matcha Dark mode",
    summary: "",
    detail:
      "Matcha's dark mode, rebuilt from tokens up so contrast and depth hold on every surface instead of just inverting colors.",
    image: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon],
  },
  {
    id: "preview-shot-23",
    category: "Preview",
    title: "Matcha Pro",
    summary: "",
    detail:
      "Matcha Pro, a denser trading view with charting and order controls for the people who live in the product all day.",
    image: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
]
