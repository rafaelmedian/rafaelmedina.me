import card01 from "../assets/cards/card-01.svg"
import card02 from "../assets/cards/card-02.svg"
import card03 from "../assets/cards/card-03.svg"
import card04 from "../assets/cards/card-04.svg"
import card05 from "../assets/cards/card-05.svg"
import card06 from "../assets/cards/card-06.svg"

export type CardKind = "project" | "about" | "contact"

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
}

export type SiteLinks = {
  github: string
  linkedin: string
  email: string
}

export const siteProfile = {
  name: "Rafa",
  intro: "I design clear digital products with strong visual systems.",
}

export const siteLinks: SiteLinks = {
  github: "https://github.com/rafaelmedina",
  linkedin: "https://www.linkedin.com/in/rafaelmedina",
  email: "hello@rafaelmedina.me",
}

export const portfolioCards: PortfolioCard[] = [
  {
    id: "project-visual-system",
    kind: "project",
    category: "Design System · 2026",
    title: "Visual Language for a Finance Platform",
    summary: "Built a modular UI language with reusable card and data patterns.",
    detail:
      "Created a complete interface system with reusable sections, consistent states, and a clear type rhythm. The system reduced design drift and improved handoff speed across product teams.",
    image: card01,
    ctaLabel: "Open case study",
    ctaHref: "https://github.com/rafaelmedina",
    ctaExternal: true,
  },
  {
    id: "project-dashboard-rebuild",
    kind: "project",
    category: "Product Design · 2025",
    title: "Ops Dashboard Rebuild",
    summary: "Redesigned a dense workflow into a calm, action-first workspace.",
    detail:
      "Mapped high-frequency tasks, simplified hierarchy, and introduced expandable detail views. The redesign improved scan speed and reduced misclicks in daily operations.",
    image: card02,
    ctaLabel: "View process",
    ctaHref: "https://github.com/rafaelmedina",
    ctaExternal: true,
  },
  {
    id: "project-mobile-flow",
    kind: "project",
    category: "Mobile UX · 2025",
    title: "Guided Mobile Onboarding",
    summary: "Designed a lightweight onboarding flow with higher completion quality.",
    detail:
      "Built a progressive sequence with clear checkpoints, concise copy, and transparent progress. The flow was optimized for short sessions and reduced abandonment during setup.",
    image: card03,
    ctaLabel: "Read notes",
    ctaHref: "https://github.com/rafaelmedina",
    ctaExternal: true,
  },
  {
    id: "project-prototype-lab",
    kind: "project",
    category: "Interaction Design · 2024",
    title: "Prototype Lab",
    summary: "Rapid prototyping system for validating concepts before engineering.",
    detail:
      "Established a fast prototyping cadence with reusable blocks and realistic motion guidance. This helped teams align on behavior early and cut late-stage rework.",
    image: card04,
    ctaLabel: "Explore prototype",
    ctaHref: "https://github.com/rafaelmedina",
    ctaExternal: true,
  },
  {
    id: "about-me",
    kind: "about",
    category: "About",
    title: "How I Work",
    summary: "I focus on practical craft, clear systems, and measurable outcomes.",
    detail:
      "My approach combines product strategy, visual design, and interaction detail. I prefer simple interfaces with strong hierarchy, clear copy, and behavior that feels reliable under real use.",
    image: card05,
    ctaLabel: "Connect on LinkedIn",
    ctaHref: siteLinks.linkedin,
    ctaExternal: true,
  },
  {
    id: "contact-now",
    kind: "contact",
    category: "Now",
    title: "Available for Select Collaborations",
    summary: "Open to product design, interface systems, and portfolio projects.",
    detail:
      "If you are building a product and need design direction with execution rigor, reach out. I am currently taking a small number of focused engagements.",
    image: card06,
    ctaLabel: "Send email",
    ctaHref: `mailto:${siteLinks.email}`,
    ctaExternal: false,
  },
]
