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
  /** Gallery "Role" row: what I owned on this work. Required — a preview
      without it leaves a hiring reviewer unable to judge scope. */
  role: string
  /** Gallery "Outcome" row: what changed because of the work. Qualitative by
      design; no confidential metrics. */
  outcome: string
  /** Teammates on this work; Rafael is credited automatically alongside them. */
  team?: Collaborator[]
  previewAspectRatio?: number
  previewMediaPaddingBlock?: string
  /** The grid tile crops this shot; the gallery repeats the same crop. */
  previewCropped?: boolean
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
  resumePdf: string
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
      { cardId: "preview-shot-22", span: 1 },
      { cardId: "preview-protector", span: 2 },
    ],
  },
  {
    id: "row-3",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-21", span: 1 },
      { cardId: "preview-shot-1", span: 1 },
      { cardId: "preview-shot-19", span: 1 },
    ],
  },
  {
    id: "row-4",
    height: homeTileRowHeight,
    items: [
      { cardId: "preview-shot-14", span: 1 },
      { cardId: "preview-shot-23", span: 1 },
      { cardId: "preview-shot-20", span: 1 },
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
  // Self-hosted so the link survives Drive permission changes and skips the
  // Drive viewer interstitial.
  resumePdf: "/rafael-medina-resume.pdf",
}

/** Static mirror of the X profile, used by the hover preview on the Follow pill. */
export type XProfilePreview = {
  name: string
  handle: string
  photo: string
  bio: string
  href: string
  verified?: boolean
  /** Counts are typed out by hand; leave them off rather than showing a stale number. */
  following?: string
  followers?: string
}

export const xProfilePreview: XProfilePreview = {
  name: siteProfile.name,
  handle: "@rafaelmedian",
  photo: profilePhoto,
  // Verbatim from the X profile; @mentions are linked out the way X renders them.
  bio: "Designer - Prev at @0xproject / @matchaxyz",
  href: siteLinks.x,
  verified: true,
  following: "2,566",
  followers: "713",
}

/** A clip or still hung under a contact pill on hover. */
export type HoverMedia = {
  src: string
  /** Only used for video sources. */
  poster?: string
  width: number
  height: number
}

// Patrick Star at his very serious business desk, sourced from Tenor (5752959),
// trimmed before the caption and transcoded to VP9. Swap `src` for any
// .gif/.webp/.webm/.mp4 in `public/` -- video sources autoplay muted and loop,
// stills just sit there.
export const linkedinHoverMedia: HoverMedia = {
  src: "/reactions/linkedin-reaction.webm",
  poster: "/reactions/linkedin-reaction-poster.webp",
  width: 500,
  height: 280,
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
      "Connecting and switching between wallets without losing your place. The flow, the empty and error states, and the small interactions in between.",
    role: "Lead product designer for the multiwallet experience.",
    outcome:
      "Connecting or switching wallets stopped interrupting a trade in progress, and every empty and error state got a defined recovery path.",
    image: "/Projects/shot-small-9.webm",
    previewWidth: 480,
    previewHeight: 360,
    previewPoster: "/Projects/shot-small-9-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon],
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-22",
    category: "Preview",
    title: "Matcha Dark mode",
    summary: "",
    detail:
      "Matcha's dark mode, rebuilt from tokens up so contrast and depth hold on every surface instead of just inverting colors.",
    role: "Lead product designer; owned the color and elevation tokens behind the theme.",
    outcome:
      "Dark mode shipped as a first-class theme rather than an inversion, so contrast and depth hold on every surface in the product.",
    image: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon],
  },
  {
    id: "preview-shot-16",
    category: "Preview",
    title: "Matcha - Homepage",
    summary: "",
    detail:
      "Matcha's homepage. It explains what the product does and gets people to their first trade in as few steps as possible.",
    role: "Lead product designer for the homepage and the first-trade path.",
    outcome:
      "New visitors learn what Matcha does before they scroll and reach their first trade in a few steps instead of landing in a bare trading UI.",
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
      "A private security app for booking short-term personal protection from veteran and former law enforcement professionals. I designed the booking flow—from choosing an operator and uniform to arranging escorted transportation—to make high-stakes decisions feel clear and discreet.",
    role: "Sole product designer for the booking experience.",
    outcome:
      "Choosing an operator, a uniform, and escorted transportation became one guided flow that keeps high-stakes decisions clear and discreet.",
    image: "/Projects/protector.webp",
    previewWidth: 1200,
    previewHeight: 1328,
    ctaHref: "https://protector.so",
    product: "Protector",
    industry: "Private Security",
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
      "First version of Popparazi, a mobile social app. An exploration of feed layout, how much content fits per screen, and how playful the interactions could get.",
    role: "Product designer on V1: feed layout, content density, and interaction language.",
    outcome:
      "V1 settled how much content fits per screen and how playful the interactions could get, which set the baseline the app was iterated from.",
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
      "Matcha's token page. Price, liquidity, and token details ordered so a trader can scan the page in a few seconds.",
    role: "Lead product designer for the token page.",
    outcome:
      "Price, liquidity, and token details are ordered so a trader can size up a token in a few seconds without leaving the page.",
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
      "The page most of Matcha runs through. A dense quote panel with enough hierarchy that you can read it quickly.",
    role: "Lead product designer for Matcha's primary trade surface.",
    outcome:
      "The densest screen in the product reads quickly: quote, route, and cost sit in a hierarchy you can scan before committing.",
    image: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-19",
    category: "Preview",
    title: "Matcha Trade module",
    summary: "",
    detail:
      "The trade module itself: inputs, quotes, and confirmation states. Most of the effort went into making the numbers unambiguous before you sign.",
    role: "Lead product designer for the trade module.",
    outcome:
      "Inputs, quotes, and confirmation states spell out what a trader is agreeing to, so the numbers are unambiguous before they sign.",
    image: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.jakub],
  },
  {
    id: "preview-shot-14",
    category: "Preview",
    title: "Matcha - Mobile Screens",
    summary: "",
    detail:
      "A pass across Matcha's core mobile screens, keeping dense trading data legible and tappable on a phone-sized canvas.",
    role: "Lead product designer for the mobile pass across Matcha's core screens.",
    outcome:
      "Dense trading data stayed legible and tappable at phone width without cutting information out of the mobile product.",
    image: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",
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
    role: "Lead product designer for mobile navigation.",
    outcome:
      "Core actions stayed one thumb-reach away as the product added surfaces, so navigation did not have to be relearned each release.",
    image: "/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",
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
    role: "Lead product designer for Matcha Pro.",
    outcome:
      "Full-time traders got charting and order controls in a denser view without that complexity landing on everyone else.",
    image: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",
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
    role: "Lead product designer for token security surfacing.",
    outcome:
      "Audit results appear inside the trade flow, so traders can weigh token risk before swapping instead of researching it elsewhere.",
    image: "/Projects/shot-small-20.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-20-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
]
