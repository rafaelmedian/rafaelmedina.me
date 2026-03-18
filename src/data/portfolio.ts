import card02 from "../assets/cards/card-02.svg"
import card04 from "../assets/cards/card-04.svg"
import card05 from "../assets/cards/card-05.svg"
import card06 from "../assets/cards/card-06.svg"
import profilePhoto from "../assets/profile-photo.png"

export type CardKind = "project" | "about" | "contact" | "preview" | "info"

export type PortfolioCard = {
  id: string
  kind: CardKind
  category: string
  title: string
  summary: string
  detail: string
  image: string
  ctaLabel: string
  ctaHref: string
  ctaExternal: boolean
  previewAspectRatio?: number
  masonrySpan?: "sm" | "lg"
}

export type SiteLinks = {
  dribbble: string
  x: string
  github: string
  linkedin: string
  email: string
}

export const siteProfile = {
  name: "Rafael Medina",
  title: "Freelance Product Designer",
  intro:
    "Hey I'm Rafael, a product designer and maker based in Miami. For over 10 years, I've helped teams design products that balance clarity, visual craft, and practical outcomes.",
  previouslyLabel: "Previously",
  previouslyText: "Product designer for SaaS teams and startup builders.",
  nowLabel: "Now",
  nowText: "Freelancing, experimenting with AI workflows, and building design systems.",
  availability: "Available for work",
  contactLabel: "Get in touch",
  contactHref: "mailto:hey@rafaelmedina.me",
  photo: profilePhoto,
}

export const siteLinks: SiteLinks = {
  dribbble: "https://dribbble.com/rafaelmedina",
  x: "https://x.com/rafaelmedian",
  github: "https://github.com/rafaelmedina",
  linkedin: "https://www.linkedin.com/in/rafaelmedina",
  email: "hey@rafaelmedina.me",
}

export const portfolioCards: PortfolioCard[] = [
  {
    id: "preview-shot-21",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 21",
    summary: "",
    detail: "",
    image: "/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-shot-9",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 9",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-9.webm",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-16",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 16",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-16.webm",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
    previewAspectRatio: 1.85,
  },
  {
    id: "preview-shot-1",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 1",
    summary: "",
    detail: "",
    image: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-14",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 14",
    summary: "",
    detail: "",
    image: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-15",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 15",
    summary: "",
    detail: "",
    image: "/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-19",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 19",
    summary: "",
    detail: "",
    image: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-20",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 20",
    summary: "",
    detail: "",
    image: "/Projects/shot-small-20.webm",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-22",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 22",
    summary: "",
    detail: "",
    image: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "preview-shot-23",
    kind: "preview",
    category: "Preview",
    title: "Shot Preview 23",
    summary: "",
    detail: "",
    image: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",
    ctaLabel: "",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    id: "widget-music",
    kind: "info",
    category: "Widget",
    title: "Music Player",
    summary: "A focused listening mix for design sessions.",
    detail: "Ambient and electronic tracks for deep work and prototyping.",
    image: "",
    ctaLabel: "Spotify Embed",
    ctaHref: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator",
    ctaExternal: true,
  },
  {
    id: "widget-map",
    kind: "info",
    category: "Widget",
    title: "Map",
    summary: "Current location and nearby context.",
    detail: "Map snapshot centered on Miami, FL.",
    image: "",
    ctaLabel: "Open in Maps",
    ctaHref: "https://maps.google.com/?q=Miami,FL",
    ctaExternal: true,
  },
  {
    id: "info-cv",
    kind: "info",
    category: "CV",
    title: "Curriculum Vitae",
    summary: "Experience, projects, and selected work history.",
    detail: "A concise overview of product design roles, outcomes, and capabilities.",
    image: card02,
    ctaLabel: "Open LinkedIn",
    ctaHref: siteLinks.linkedin,
    ctaExternal: true,
  },
  {
    id: "info-about",
    kind: "info",
    category: "About",
    title: "About",
    summary: "Product designer focused on clarity, systems, and practical craft.",
    detail: "I design dependable experiences with clean hierarchy and thoughtful interaction.",
    image: card05,
    ctaLabel: "About Profile",
    ctaHref: siteLinks.linkedin,
    ctaExternal: true,
  },
  {
    id: "info-notes",
    kind: "info",
    category: "Notes",
    title: "Design Notes",
    summary: "Short notes on process, interaction ideas, and UI experiments.",
    detail: "A running collection of observations, rationale, and implementation details.",
    image: card04,
    ctaLabel: "View GitHub",
    ctaHref: siteLinks.github,
    ctaExternal: true,
  },
  {
    id: "info-social",
    kind: "info",
    category: "Social",
    title: "Basic Social Links",
    summary: "Email, GitHub, and LinkedIn for quick contact.",
    detail: "Reach out by email or connect via GitHub and LinkedIn.",
    image: card06,
    ctaLabel: "Open LinkedIn",
    ctaHref: siteLinks.linkedin,
    ctaExternal: true,
  },
]
