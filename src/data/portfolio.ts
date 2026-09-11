import profilePhoto from "../assets/profile-photo.webp"
import type { ProjectId } from "./projectIds"

export type PortfolioCard = {
  /** Registered in `projectIds`, so the likes API knows every project by name. */
  id: ProjectId
  /** Stable public URL; changing a title must not break shared links. */
  slug: string
  category: string
  title: string
  summary: string
  detail: string
  image: string
  previewWidth?: number
  previewHeight?: number
  previewPoster?: string
  /** Poster dimensions can differ from the media's display dimensions. */
  previewPosterWidth?: number
  previewPosterHeight?: number
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
  previewMediaPadding?: string
  /** The grid tile crops this shot; the gallery repeats the same crop. */
  previewCropped?: boolean
  /** Alternate artwork used only in the home mosaic. The project preview and
      social metadata continue to use `image` as their single hero source. */
  homeImages?: PortfolioImage[]
  /** Long-form project narrative. Matcha tiles share one body because they are
      chapters of the same end-to-end product redesign, not isolated shots. */
  caseStudy?: ProjectCaseStudy
}

export type PortfolioImage = {
  source: string
  label: string
  width: number
  height: number
}

export type ProjectCaseStudySection = {
  heading: string
  paragraphs: string[]
  media?: PortfolioImage[]
}

export type ProjectCaseStudyHighlightGroup = {
  heading: string
  items: string[]
}

export type ProjectCaseStudy = {
  label: string
  period: string
  title: string
  introduction: string
  highlights: ProjectCaseStudyHighlightGroup[]
  sections: ProjectCaseStudySection[]
}

export type Collaborator = {
  name: string
  href: string
  /** Drop a square image in `public/people/` to replace the initials fallback. */
  photo?: string
}

export const collaborators = {
  // The gallery always includes this credit, after any project teammates.
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
  /** Cal.com event type, opened as a calendar in the availability dialog. */
  booking: string
}

type HomeTilePlacement = {
  /** Named CSS area, shared by the wide and compact compositions. */
  area: string
  /** Fraction of the desktop group's usable width, excluding gutters. */
  share: number
  compactWide?: boolean
}

/** Which set of quotes a quote tile cycles through. */
export type QuoteSource = "internet" | "team"

export type HomeTile = HomeTilePlacement & (
  | { kind: "project"; cardId: string; fit: "cover" | "contain"; mediaMaxHeight?: string }
  | { kind: "quote"; source: QuoteSource }
  | { kind: "writings" }
  | { kind: "resume" }
  | { kind: "photos" }
)

export type HomeGroup = {
  layout: "opening" | "portraits" | "aside" | "offset" | "closing"
  columns: 2 | 3
  items: HomeTile[]
}

// One reading order for the DOM, keyboard, compact grid, and preview gallery.
// Desktop groups share outer edges; their interior seams can end at different
// heights. Compact CSS lets the items cross group boundaries without reordering.
export const homeGroups: HomeGroup[] = [
  {
    layout: "opening",
    columns: 3,
    items: [
      { kind: "project", area: "wallet", cardId: "preview-shot-9", share: 3 / 12, fit: "contain" },
      { kind: "project", area: "homepage", cardId: "preview-shot-16", share: 6 / 12, fit: "contain" },
      { kind: "writings", area: "writings", share: 3 / 12 },
    ],
  },
  {
    layout: "portraits",
    columns: 3,
    items: [
      { kind: "project", area: "popparazi", cardId: "preview-popparazi-v1", share: 3 / 12, fit: "contain", mediaMaxHeight: "84%" },
      { kind: "resume", area: "resume", share: 3 / 12, compactWide: true },
      { kind: "project", area: "protector", cardId: "preview-protector", share: 5 / 12, fit: "cover", compactWide: true },
      { kind: "quote", area: "quote", source: "internet", share: 4 / 12, compactWide: true },
      { kind: "project", area: "security", cardId: "preview-shot-20", share: 4 / 12, fit: "contain" },
      // The photos used to sit inside About, below the hobbies. They read
      // better as a tile in the grid, and this group is where there was room
      // for one: a third band under the quote and Security, so the personal
      // half of the page -- the résumé, the quote, the photos -- stays together
      // and the four project slots above keep the shapes their artwork was cut
      // for. The band is the group's full width because the fan is a fixed
      // 27rem centred in whatever tile it gets, so extra width becomes margin
      // rather than a banner of prints.
      //
      // Not a group of its own at the end of the grid, which is where they
      // landed first: the takeover pins the last screenful while About slides
      // up over it, so a trailing band is behind the About sheet from roughly
      // halfway down the page and never reads on its own.
      { kind: "photos", area: "photos", share: 1, compactWide: true },
    ],
  },
  {
    layout: "offset",
    columns: 2,
    items: [
      { kind: "project", area: "family", cardId: "preview-family-stories", share: 5 / 12, fit: "contain" },
      { kind: "project", area: "dealership", cardId: "preview-dealership-lead-hub", share: 7 / 12, fit: "contain" },
      { kind: "project", area: "token", cardId: "preview-shot-21", share: 5 / 12, fit: "contain" },
      { kind: "project", area: "rewards", cardId: "preview-matcha-rewards", share: 7 / 12, fit: "contain" },
    ],
  },
  // The second quote card is a band of its own rather than a fourth tile in a
  // project row: no row has a column to spare without re-cutting the artwork
  // that was composed for it, and the card needs its full 340px to hold a
  // quote, a face, and the dots. The grid already speaks this way -- the
  // personal-photo fan is a band inside the portraits group.
  //
  // Between the offset and closing groups, not after them. The takeover pins
  // the last screenful while About slides up over it, so the closing row of
  // projects is already half-covered by the sheet -- a quote parked there would
  // never be read.
  {
    layout: "aside",
    columns: 3,
    items: [
      { kind: "quote", area: "quote2", source: "team", share: 1, compactWide: true },
    ],
  },
  {
    layout: "closing",
    columns: 3,
    items: [
      { kind: "project", area: "mobile", cardId: "preview-shot-14", share: 1 / 3, fit: "contain" },
      { kind: "project", area: "trade", cardId: "preview-shot-1", share: 1 / 3, fit: "contain" },
      { kind: "project", area: "pro", cardId: "preview-shot-23", share: 1 / 3, fit: "contain" },
    ],
  },
]

export const siteProfile = {
  name: "Rafael Medina",
  title: "Senior Product Designer, Freelance",
  photo: profilePhoto,
}

export const siteLinks: SiteLinks = {
  dribbble: "https://dribbble.com/rafaelmedian",
  x: "https://x.com/rafaelmedian",
  github: "https://github.com/rafaelmedian",
  linkedin: "https://www.linkedin.com/in/rafaelmedian",
  email: "hey@rafaelmedina.me",
  // The event type rather than the profile: /rafaelmedian alone opens a list of
  // meeting lengths, and the dialog is meant to land on the calendar itself.
  booking: "https://cal.com/rafaelmedian/30min",
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

const matchaCaseStudy: ProjectCaseStudy = {
  label: "Case study",
  period: "2021 - 2026",
  title: "Designing Matcha end to end",
  introduction:
    "A swap fits inside a small rectangle; the product around it does not. I redesigned Matcha across discovery, research, wallets, trading, mobile, and the visual system that holds those journeys together.",
  highlights: [
    {
      heading: "Product",
      items: [
        "Redesigned Matcha.xyz end to end across discovery, research, wallets, and trading.",
        "Led the structure and interaction design for the homepage, token pages, trade flows, mobile experience, and Matcha Pro.",
        "Introduced monetization flows that generated sustainable revenue.",
      ],
    },
    {
      heading: "Design",
      items: [
        "Defined the visual system and dark theme across components, charts, and dense trading surfaces.",
        "Designed loading, empty, error, warning, review, and confirmation states alongside the primary journeys.",
        "Worked with product, engineering, and research from early direction through shipped implementation.",
      ],
    },
  ],
  sections: [
    {
      heading: "Different reasons to arrive",
      paragraphs: [
        "The homepage gives search, market browsing, wallet connection, and trading distinct ways in. A person with a token in mind should not have to browse a showcase first, while someone who is still looking around needs more than an empty trade form.",
        "The token page carries that discovery into research. Market data, charts, trade controls, and order history live together so someone can review a token and begin a trade without changing context.",
      ],
      media: [
        { source: "/Projects/shot-small-16-poster.webp", label: "Matcha homepage for token discovery and market browsing", width: 640, height: 480 },
        { source: "/Projects/6842e949e1acb44abd669218_shot-small-21.jpg", label: "Matcha token research and trading page", width: 1600, height: 1200 },
      ],
    },
    {
      heading: "Keep the trade intact",
      paragraphs: [
        "The main trading workspace brings the quote, chart, balances, open orders, and history into one hierarchy. In the trade module, costs, routes, and received amounts stay available before a transaction is signed.",
        "The multiwallet flow applies the same idea to account changes. People can switch wallets while keeping the quote and inputs they already entered, so changing the account does not mean starting the trade again.",
      ],
      media: [
        { source: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg", label: "Matcha trading workspace", width: 1600, height: 1200 },
        { source: "/Projects/shot-small-9-poster.webp", label: "Matcha multiwallet menu and switching flow", width: 640, height: 480 },
      ],
    },
    {
      heading: "One system, many contexts",
      paragraphs: [
        "The interface had to remain recognizable as its surroundings changed. I defined the dark theme across components, charts, and dense trading surfaces rather than recoloring screens one at a time.",
        "On mobile, the same journey needed a different order because research, the trade form, review, and confirmation could no longer sit side by side. Layout and emphasis changed while the meaning of each action stayed intact.",
      ],
      media: [
        { source: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg", label: "Matcha dark theme across trading surfaces", width: 1600, height: 1200 },
        { source: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg", label: "Matcha mobile research and trade journey", width: 1600, height: 1200 },
      ],
    },
    {
      heading: "Density and confidence",
      paragraphs: [
        "Matcha Pro gives active traders a stable, denser workspace for live charts, token signals, transactions, and order management. The goal was not to make every panel loud, but to give changing information a familiar place.",
        "Confidence also depends on the awkward states. The GoPlus integration distinguishes loading, pending, warning, and result states so a check that has not returned cannot read like a reassuring result.",
      ],
      media: [
        { source: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg", label: "Matcha Pro workspace for active traders", width: 1600, height: 1200 },
        { source: "/Projects/shot-small-20-poster.webp", label: "Token security checks inside the Matcha trade flow", width: 640, height: 480 },
      ],
    },
    {
      heading: "A product beyond the interface",
      paragraphs: [
        "The same system extended into the rewards program. I created a key visual that could carry the leaderboard, prizes, trades, referrals, and points across launch posts, weekly countdowns, and link previews.",
      ],
      media: [
        { source: "/Projects/matcha-rewards-link-preview.webp", label: "Matcha Rewards link preview", width: 805, height: 480 },
        { source: "/Projects/matcha-rewards-countdown.webp", label: "Matcha Rewards countdown post", width: 805, height: 480 },
      ],
    },
  ],
}

const matchaMeta = {
  product: "Matcha - DEX Aggregator by 0x",
  industry: "DeFi / Web3 / Fintech",
  ctaHref: "https://matcha.xyz",
  caseStudy: matchaCaseStudy,
}

export const portfolioCards: PortfolioCard[] = [
  {
    id: "preview-shot-9",
    slug: "matcha-multiwallet-flow",
    category: "Case study",
    title: "Matcha multiwallet flow",
    summary: "",
    detail:
      "I mapped and designed Matcha’s multiwallet flow, bringing connected wallets and network details into one menu for the decentralized trading platform. I covered wallet selection, adding a wallet, and loading, empty, and error states, so people can switch wallets during a trade without losing their quote or inputs.",
    role: "I mapped the full flow and designed the wallet menu and its edge cases.",
    outcome:
      "People can change wallets during a trade and keep their current quote and inputs.",
    image: "/Projects/shot-small-9.webm",
    previewWidth: 480,
    previewHeight: 360,
    previewPoster: "/Projects/shot-small-9-poster.webp",
    previewPosterWidth: 640,
    previewPosterHeight: 480,
    ...matchaMeta,
    team: [collaborators.simon],
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-22",
    slug: "matcha-dark-mode",
    category: "Case study",
    title: "Matcha dark mode",
    summary: "",
    detail:
      "I led the dark theme for Matcha, the decentralized trading platform by 0x. I defined semantic color and elevation tokens across component states, charts, and dense trading screens, giving the product one consistent dark theme across its main surfaces.",
    role: "I led the theme work and defined the color and elevation tokens.",
    outcome:
      "The product now uses one consistent dark theme across its main surfaces.",
    image: "/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon],
  },
  {
    id: "preview-shot-16",
    slug: "matcha-homepage",
    category: "Case study",
    title: "Matcha homepage",
    summary: "",
    detail:
      "I redesigned the homepage for Matcha, the decentralized trading platform by 0x, around the ways people begin a visit. I led the page structure and content hierarchy, giving new and returning users direct paths to search for a token, browse the market, connect a wallet, and start trading.",
    role: "I led the page structure, content hierarchy, and paths into discovery and trading.",
    outcome:
      "New and returning users have direct routes into the part of Matcha they need.",
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
    slug: "protector-booking",
    category: "Preview",
    title: "Protector booking",
    summary: "",
    detail:
      "Protector lets people book short-term personal security. As the sole product designer for the booking experience, I designed the steps for choosing a protector, selecting how they should be dressed, and adding escorted transportation. Each part of the service can be selected and confirmed in one guided flow.",
    role: "I was the sole product designer for the booking experience.",
    outcome:
      "Each part of the service is selected and confirmed in one guided booking flow.",
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
    slug: "popparazi-v1",
    category: "Preview",
    title: "Popparazi V1",
    summary: "",
    detail:
      "I designed an early discovery feed for Popparazi, a social photo app. The work brought together friend suggestions, featured photos, and recommendation patterns, while exploring content density and the visual style for V1. It established the structure and interactions for the team’s early product iterations.",
    role: "I designed the V1 feed and recommendation patterns.",
    outcome:
      "The work established the structure and interaction style used for the team's early product iterations.",
    image: "/Projects/popparazi_v1.webp",
    previewWidth: 630,
    previewHeight: 1314,
    ctaHref: "#",
    product: "Popparazi",
    industry: "Consumer Social",
    team: [collaborators.nick],
    previewAspectRatio: 0.46,
    previewMediaPadding: "clamp(0.7rem, 1.6vw, 1.4rem)",
  },
  {
    id: "preview-shot-21",
    slug: "matcha-token-page",
    category: "Case study",
    title: "Matcha token page",
    summary: "",
    detail:
      "I led the page structure and interactions for token research and trading on Matcha, the decentralized trading platform by 0x. The page brings market data, charts, trade controls, and order history together, so people can review a token and start a trade without changing views.",
    role: "I led the page structure and interactions for token research and trading.",
    outcome:
      "People can review a token and start a trade from the same page.",
    image: "/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.jakub],
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-shot-1",
    slug: "matcha-trade-page",
    category: "Case study",
    title: "Matcha trade page",
    summary: "",
    detail:
      "I defined the information hierarchy and interactions for Matcha’s main trading workspace. It brings the live quote, chart, balances, open orders, and trade history into one layout, so people can place a decentralized trade and follow its activity from the same page.",
    role: "I defined the information hierarchy and interactions for the page.",
    outcome:
      "People can place a trade and follow its activity from one workspace.",
    image: "/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-19",
    slug: "matcha-trade-module",
    category: "Case study",
    title: "Matcha trade module",
    summary: "",
    detail:
      "I designed the trade module for Matcha, the decentralized trading platform by 0x, from amount entry and token selection through review and confirmation. I owned the quote, fee, route, and transaction states, making the cost, route, and received amount visible before someone signs a swap.",
    role: "I owned the module's quote, fee, route, and transaction states.",
    outcome:
      "The cost, route, and received amount are visible before a transaction is signed.",
    image: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.jakub],
  },
  {
    id: "preview-shot-14",
    slug: "matcha-on-mobile",
    category: "Case study",
    title: "Matcha on mobile",
    summary: "",
    detail:
      "I led the mobile trade journey for Matcha, the decentralized trading platform by 0x. I adapted token details, the trade form, review, and confirmation for phone screens, including the layout, touch targets, and order of information, so people can research and trade from a mobile browser.",
    role: "I led the mobile design for the full trade journey.",
    outcome:
      "The main research and trading flow is available on phone-sized screens.",
    image: "/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-23",
    slug: "matcha-pro",
    category: "Case study",
    title: "Matcha Pro",
    summary: "",
    detail:
      "I led the product structure and interaction design for Matcha Pro, a decentralized trading workspace for active traders. Live charts, token signals, transactions, and order management come together in a denser layout, giving advanced tools a dedicated home alongside Matcha’s standard swap experience.",
    role: "I led the product structure and interaction design.",
    outcome:
      "Advanced trading tools live in a dedicated workspace, separate from the standard swap experience.",
    image: "/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",
    previewWidth: 1600,
    previewHeight: 1200,
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-shot-20",
    slug: "matcha-security-audit",
    category: "Case study",
    title: "Matcha security audit",
    summary: "",
    detail:
      "I designed the GoPlus token-check integration for Matcha, the decentralized trading platform by 0x. The work covers source code, tax, minting, and honeypot signals, along with loading, pending, warning, and result states, so people can review common token warnings while preparing a swap.",
    role: "I designed the integration and how the audit results are presented.",
    outcome:
      "People can review common token warnings while preparing a swap.",
    image: "/Projects/shot-small-20.webm",
    previewWidth: 640,
    previewHeight: 480,
    previewPoster: "/Projects/shot-small-20-poster.webp",
    ...matchaMeta,
    team: [collaborators.simon, collaborators.jakub],
  },
  {
    id: "preview-dealership-lead-hub",
    slug: "dealership-lead-hub",
    category: "Preview",
    title: "Dealership lead hub",
    summary: "",
    detail:
      "I designed a lead hub for a dealership retention platform, helping staff find sales and service opportunities in their existing customer base. I owned the layout, outreach metrics, retention comparisons, filters, and bulk-send flow, so staff can see how outreach performed and send a filtered batch of customers to the dealer app without leaving the page.",
    role: "I designed the hub layout, its overview metrics, and the filtering and bulk-send flow for leads.",
    outcome:
      "Staff can read how recent outreach landed and send a filtered batch of customers without leaving the page.",
    image: "/Projects/dealership-lead-hub.webp",
    previewWidth: 1600,
    previewHeight: 1200,
    ctaHref: "#",
    product: "Dealer retention platform",
    industry: "Automotive Retail",
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-family-stories",
    slug: "shared-family-stories",
    category: "Preview",
    title: "Shared family stories",
    summary: "",
    detail:
      "I designed the story feed, moment detail view, and commenting patterns for a private family memory app. Stories group photos and clips by period, with dates, comments, and likes attached to each moment, so families can browse their memories and keep the conversation with the story it belongs to.",
    role: "I designed the story feed, the moment detail view, and the commenting patterns.",
    outcome:
      "Families can browse their memories by period and keep each conversation attached to the moment it belongs to.",
    image: "/Projects/shared-family-stories.webp",
    previewWidth: 1600,
    previewHeight: 1214,
    ctaHref: "#",
    product: "Family memory app",
    industry: "Consumer Social",
    previewAspectRatio: 1600 / 1214,
  },
  {
    id: "preview-matcha-rewards",
    slug: "matcha-rewards",
    category: "Case study",
    title: "Matcha Rewards",
    summary: "",
    detail:
      "I designed the campaign artwork and variants for Matcha’s weekly rewards program on its decentralized trading platform. The key visual puts the leaderboard, cash prizes, trades, referrals, and points behind the headline, giving the launch, weekly countdown posts, and link previews one shared visual system.",
    role: "I designed the campaign key visual and the variants it ships in.",
    outcome:
      "The rewards program launched with one visual system shared by its social posts and link previews.",
    // The project preview keeps the compact campaign composite, while the home
    // tile lays out the two complete deliverables independently. Keeping their
    // rounded ends inside the card prevents an intentional bleed from reading
    // as an accidental crop when the organic grid changes shape.
    image: "/Projects/matcha-rewards.webp",
    previewWidth: 1540,
    previewHeight: 1325,
    homeImages: [
      {
        source: "/Projects/matcha-rewards-link-preview.webp",
        label: "Matcha Rewards link preview",
        width: 805,
        height: 480,
      },
      {
        source: "/Projects/matcha-rewards-countdown.webp",
        label: "Matcha Rewards countdown post",
        width: 805,
        height: 480,
      },
    ],
    ...matchaMeta,
    previewAspectRatio: 1540 / 1325,
  },
]
