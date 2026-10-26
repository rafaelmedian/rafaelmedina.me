import profilePhoto from "../assets/profile-photo.webp"
import type { ProjectId } from "./projectIds"
import { projectCaseStudies } from "./projectCaseStudies"

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
  /** When the work shipped, as "2023" or "2018–2019". The gallery and the
      project page set it ahead of the title, so a reviewer can tell recent work
      from old without a metadata table. Left off, nothing is drawn. Every card carries one. */
  year?: string
  /** Teammates on this work; Rafael is credited automatically alongside them. */
  team?: Collaborator[]
  /** Where a piece that shipped as a public post first went out; the gallery
      links to the original under the summary. */
  post?: { site: "X" | "YouTube"; href: string; date: string }
  previewAspectRatio?: number
  previewMediaPadding?: string
  /** The grid tile crops this shot; the gallery repeats the same crop. */
  previewCropped?: boolean
  /** Alternate artwork used only in the home mosaic. The project preview and
      social metadata continue to use `image` as their single hero source. */
  homeImages?: PortfolioImage[]
  /** The gallery shows `homeImages` laid out as the tile lays them out, so the
      open grows the tile's own picture instead of swapping in `image`. */
  galleryUsesHomeImages?: boolean
  /** Long-form project narrative. Matcha tiles share one body because they are
      chapters of the same end-to-end product redesign, not isolated shots. */
  caseStudy?: ProjectCaseStudy
}

export type PortfolioImage = {
  source: string
  /** A muted loop of the same frame, e.g. a prototype recording. It plays over
      the still once the still is near the reader; `source` stays the poster. */
  video?: string
  label: string
  width: number
  height: number
  /** Where the artwork was published, for work that shipped as a post. Only
      link a post the artwork was actually attached to. */
  post?: { href: string; date: string }
}

export type ProjectCaseStudySection = {
  heading: string
  paragraphs: string[]
  media?: PortfolioImage[]
  /** Two or more images sit side by side unless they are dense screens that
      need the column's full width to read; those stack. A study marked
      `media: "wide"` stacks every section regardless. */
  mediaLayout?: "pair" | "stack"
}

export type ProjectCaseStudy = {
  showSignatures?: boolean
  /** Dense product screenshots stack one per row and run the card's full
      width, past the text measure, so their UI stays legible. Artwork that
      reads at half width (posts, campaign stills) keeps the default pairs. */
  media?: "wide"
  label: string
  title: string
  introduction: string[]
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
  layout: "opening" | "aside" | "featured" | "portraits" | "agency"
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
  // The second quote card is a band of its own rather than a fourth tile in a
  // project row: no row has a column to spare without re-cutting the artwork
  // that was composed for it, and the card needs its full 340px to hold a
  // quote, a face, and the dots. The grid already speaks this way -- the
  // personal-photo fan is a band inside the portraits group.
  //
  // Straight under the opening row, so the Pokédex experiment in the middle of
  // the band is the grid's fifth tile and Dealership Hub, the most recent
  // product work, follows it.
  // Never at the end: the takeover pins the last screenful while About slides
  // up over it, so a band parked there would never be read.
  {
    layout: "aside",
    columns: 3,
    items: [
      { kind: "quote", area: "quote2", source: "team", share: 2 / 7, compactWide: true },
      // The Duo recording is the device on white, so its card is painted white.
      { kind: "project", area: "duo", cardId: "preview-pokemon-duo", share: 2 / 7, fit: "contain", compactWide: true },
      // The dashboard is wider than this short slot wants, so it crops from
      // the top and runs its lower rows into the card edge, as it always has.
      // Partnered, the quote is no longer the lone card floating in an empty
      // row that kept it full width.
      { kind: "project", area: "dealership", cardId: "preview-dealership-lead-hub", share: 3 / 7, fit: "contain", compactWide: true },
    ],
  },
  // Research Views is the deepest case study on the site, so it gets the
  // widest slot high on the page rather than a middle column in the closing
  // band. Twilio, the other agency product, keeps it company; the rest of the
  // agency years still close the grid.
  {
    layout: "featured",
    columns: 2,
    items: [
      { kind: "project", area: "moodys", cardId: "preview-moodys-sprints", share: 7 / 12, fit: "contain", compactWide: true },
      { kind: "project", area: "twilio", cardId: "preview-twilio-admiral", share: 5 / 12, fit: "cover", compactWide: true },
    ],
  },
  {
    layout: "portraits",
    columns: 3,
    items: [
      // Both sister apps show a phone recording -- Protector picking a dress
      // code, Patrol booking a car -- framed as a phone on the grey mat.
      { kind: "project", area: "protector", cardId: "preview-protector", share: 4 / 11, fit: "contain", compactWide: true },
      { kind: "project", area: "patrol", cardId: "preview-patrol", share: 3 / 11, fit: "contain" },
      { kind: "quote", area: "quote", source: "internet", share: 4 / 11, compactWide: true },
      // Matcha's launch films lead the band under the projects, beside the
      // photos, so personal life sits next to work rather than next to the
      // résumé. The tile plays the relaunch film.
      { kind: "project", area: "relaunch", cardId: "preview-matcha-relaunch-film", share: 4 / 11, fit: "cover", compactWide: true },
      // The marketing posts hang as a tilted wall sized from the tile's width,
      // so the band's short slot under Patrol holds it at any ratio.
      { kind: "project", area: "marketing", cardId: "preview-matcha-marketing", share: 3 / 11, fit: "contain", compactWide: true },
      // The photos used to sit inside About, below the hobbies. They read
      // better as a tile in the grid, and this group is where there was room
      // for one: a band under Protector, Patrol, and the quote, beside the
      // launch films and the marketing wall, so the slots above keep the
      // shapes their artwork was cut for.
      // The fan is a fixed 27rem centred in whatever tile it gets, so extra
      // width becomes margin rather than a banner of prints.
      //
      // Not a group of its own at the end of the grid, which is where they
      // landed first: the takeover pins the last screenful while About slides
      // up over it, so a trailing band is behind the About sheet from roughly
      // halfway down the page and never reads on its own.
      { kind: "photos", area: "photos", share: 4 / 11, compactWide: true },
    ],
  },
  // The rest of the agency years, 2018-2021: Turtle and Onit, with the résumé
  // closing the row, the career tile beside the companies it lists. They close
  // the grid: the About takeover slides over the last screenful, but the films
  // that used to sit under them read better high on the page.
  {
    layout: "agency",
    columns: 3,
    items: [
      { kind: "project", area: "turtle", cardId: "preview-turtle", share: 4 / 12, fit: "cover" },
      { kind: "project", area: "onit", cardId: "preview-onit-process-builder", share: 5 / 12, fit: "cover", compactWide: true },
      // Its paper is sized from the slot's height, so the narrow column still
      // holds it whole.
      { kind: "resume", area: "resume", share: 3 / 12 },
    ],
  },
]

export const siteProfile = {
  name: "Rafael Medina",
  title: "Senior Product Designer",
  photo: profilePhoto,
  /** First month open for new work, as YYYY-MM. Edit by hand when it changes;
   * once the month arrives the hero says "Available now" on its own. */
  availableFrom: "2026-11",
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

const matchaMeta = {
  product: "Matcha - DEX Aggregator by 0x",
  industry: "DeFi / Web3 / Fintech",
  ctaHref: "https://matcha.xyz",
}

const portfolioCardEntries: PortfolioCard[] = [
  {
    id: "preview-shot-9",
    slug: "matcha-multiwallet-flow",
    year: "2025",
    category: "Case study",
    title: "Matcha multiwallet flow",
    summary: "",
    detail:
      "I mapped and designed Matcha’s multiwallet flow, bringing connected wallets and network details into one menu. I covered wallet selection, adding a wallet, and loading, empty, and error states, so people can switch wallets during a trade without losing their quote or inputs.",
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
    previewAspectRatio: 0.74,
  },
  {
    id: "preview-shot-22",
    slug: "matcha-dark-mode",
    year: "2023",
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
    year: "2023",
    category: "Case study",
    title: "Matcha",
    summary: "",
    detail:
      "I redesigned Matcha’s homepage around the ways people begin a visit. I led the page structure and content hierarchy, giving new and returning users direct paths to search for a token, browse the market, connect a wallet, and start trading.",
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
    year: "2023",
    category: "Case study",
    title: "Protector booking",
    summary: "",
    detail:
      "Protector lets people book short-term personal security. As the sole product designer for its booking experience on iPhone, I designed the steps for choosing a protector, selecting how they should be dressed, and adding escorted transportation. Each part of the service can be selected and confirmed in one guided flow.",
    role: "I was the sole product designer for the booking experience.",
    outcome:
      "Each part of the service is selected and confirmed in one guided booking flow.",
    image: "/Projects/protector-dress-code.webm",
    previewWidth: 480,
    previewHeight: 1042,
    previewPoster: "/Projects/protector-dress-code-poster.webp",
    previewPosterWidth: 480,
    previewPosterHeight: 1042,
    ctaHref: "https://protector.so",
    product: "Protector",
    industry: "Private Security",
    team: [collaborators.nick],
    previewAspectRatio: 480 / 1042,
  },
  {
    id: "preview-patrol",
    slug: "patrol-booking",
    year: "2025",
    category: "Case study",
    title: "Patrol booking",
    summary: "",
    detail:
      "Patrol is Protector’s sister app: it books an off-duty or recently retired police officer to park a marked patrol car outside someone’s home. The booking asks where, confirms the address on a map, and sets when the car arrives and leaves, with the price on the same screen. I designed the booking flow and the App Store screens.",
    role: "I designed the booking flow and the App Store screens.",
    outcome:
      "A home patrol is booked from an address and a time window, with the account created last.",
    image: "/Projects/patrol.webm",
    previewWidth: 480,
    previewHeight: 1042,
    previewPoster: "/Projects/patrol-poster.webp",
    previewPosterWidth: 480,
    previewPosterHeight: 1042,
    ctaHref: "https://protector.so",
    product: "Patrol",
    industry: "Private Security",
    previewAspectRatio: 480 / 1042,
  },
  {
    id: "preview-shot-21",
    slug: "matcha-token-page",
    year: "2025",
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
    year: "2023",
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
    year: "2023",
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
    year: "2023",
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
    year: "2024",
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
    year: "2025",
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
    year: "2024",
    category: "Preview",
    title: "Dealership Hub",
    summary: "",
    detail:
      "I designed and built Dealership Hub, the app that replaces a car dealership’s older CRM. The old tool was a single lead table; the Hub brings sales, the workshop floor, customer records, and the team into one place, opens on the few things worth doing first, and answers plain questions with rows that link straight to the job or the customer.",
    role: "I designed the app end to end and built it as a working Next.js prototype: the hub, the leads flow, the workshop board, customer profiles, team views, and the design system under them.",
    outcome:
      "One app in place of the old single-table CRM: staff can start from what needs doing and follow a customer from a sales lead to a car on the lift.",
    image: "/Projects/dealership-lead-hub.webp",
    previewWidth: 3200,
    previewHeight: 2400,
    ctaHref: "#",
    product: "Dealership CRM",
    industry: "Automotive Retail",
    previewAspectRatio: 4 / 3,
  },
  {
    id: "preview-matcha-rewards",
    slug: "matcha-rewards",
    year: "2025",
    category: "Case study",
    title: "Matcha Rewards",
    summary: "",
    detail:
      "I designed the campaign artwork and variants for Matcha’s weekly rewards program on its decentralized trading platform. The key visual puts the leaderboard, cash prizes, trades, referrals, and points behind the headline, giving the launch, weekly countdown posts, and link previews one shared visual system.",
    role: "I designed the campaign key visual and the variants it ships in.",
    outcome:
      "The rewards program launched with one visual system shared by its social posts and link previews.",
    // Social metadata keeps the compact campaign composite, while the home
    // tile and the gallery lay out the two complete deliverables
    // independently. Keeping their rounded ends inside the card prevents an
    // intentional bleed from reading as an accidental crop when the organic
    // grid changes shape.
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
    galleryUsesHomeImages: true,
    ...matchaMeta,
    previewAspectRatio: 1540 / 1325,
  },
  {
    id: "preview-matcha-marketing",
    slug: "matcha-marketing",
    year: "2022",
    category: "Case study",
    title: "Matcha marketing materials",
    summary: "",
    detail:
      "I designed Matcha’s marketing materials: network and feature launches, trading milestones, product promos, and the It’s a Match(a) campaign. The posts and blog covers share one visual language, a headline figure beside the network’s mark and Matcha’s cup, with a color for each chain, so every announcement reads as Matcha.",
    role: "I designed the social posts, blog covers, and campaign artwork, and the system their variants follow.",
    outcome:
      "Launches, milestones, and campaigns went out as one recognizable series across X and the blog.",
    // The gallery keeps the flat 2x2 sheet; the home tile hangs the posts as
    // a tilted wall, four across and five down, reading left to right. The
    // middle three rows are the twelve worth reading; the first and last run
    // off the tile's top and bottom so the wall reads as continuing past it:
    // blog covers and the variants that never went out.
    image: "/Projects/matcha-marketing.webp",
    previewWidth: 1600,
    previewHeight: 816,
    homeImages: [
      ["limit-orders", "Limit orders on BSC and Polygon"],
      ["match-headline", "It’s a Match(a) campaign"],
      ["optimism-blog", "Optimism launch blog cover"],
      ["bsc-1-billion", "$1 billion traded on BSC"],
      ["optimism", "Launching on Optimism"],
      ["polygon", "$1B traded on Polygon"],
      ["50-billion-bars", "$50B traded on Matcha"],
      ["bnb-chain", "$1B traded on BNB Chain"],
      ["fantom", "$500M traded on Fantom"],
      ["40-billion", "$40B trade volume"],
      ["arbitrum", "Now live on Arbitrum"],
      ["avalanche-750m", "$750M traded on Avalanche"],
      ["savings", "Savings shown on a Matcha order"],
      ["2-million", "Two million transactions"],
      ["bnb-250k", "250,000 trades on BNB Chain"],
      ["50-billion", "$50B traded on Ethereum"],
      ["polygon-alt", "$1B traded on Polygon, alternate"],
      ["bnb-chain-icon", "$1B traded on BNB Chain, alternate"],
      ["arbitrum-cover", "Arbitrum launch blog cover"],
      ["bnb-chain-alt", "$1B traded on BNB Chain, second alternate"],
    ].map(([name, label]) => ({
      source: `/Projects/matcha-marketing-${name}.webp`,
      label,
      width: 1200,
      height: 600,
    })),
    ...matchaMeta,
    previewAspectRatio: 1600 / 816,
  },
  {
    id: "preview-matcha-relaunch-film",
    slug: "matcha-relaunch-film",
    year: "2021–2023",
    category: "Video",
    title: "Matcha launch films",
    summary: "",
    detail:
      "I worked on three of Matcha’s launch films: a teaser and launch film for cross-chain swaps in December 2023, the film that introduced the redesigned Matcha in May 2023, and gasless trading in October 2021. Each one shows the feature in the product’s own screens.",
    role: "I worked on the relaunch and cross-chain swaps, and on the films that announced them and gasless trading.",
    outcome:
      "The relaunch post reached 141K views and nearly 3,900 likes on X; the cross-chain teaser and launch post drew about 1,600 likes each.",
    // The tile plays the cross-chain film; the project view carries all three,
    // each with the post it went out in. The cross-chain and gasless cards
    // keep their own pages for old links but are no longer on the grid.
    image: "/Projects/matcha-video-cross-chain-2023.webm",
    previewWidth: 960,
    previewHeight: 540,
    previewPoster: "/Projects/matcha-video-cross-chain-2023-poster.webp",
    previewPosterWidth: 640,
    previewPosterHeight: 360,
    ...matchaMeta,
    ctaHref: "https://x.com/matchaxyz/status/1732070138281918806",
    previewAspectRatio: 16 / 9,
  },
  {
    id: "preview-matcha-cross-chain-film",
    slug: "matcha-cross-chain-film",
    year: "2023",
    category: "Video",
    title: "Matcha cross-chain swaps",
    summary: "",
    detail:
      "I worked on the teaser and launch film for cross-chain swaps on Matcha, posted a week apart in late 2023. The teaser is pure motion; the launch film says goodbye to broken bridges and wrapping, then shows a swap from one chain to another in the new cross-chain tab.",
    role: "I worked on cross-chain swaps and on the teaser and launch film.",
    outcome:
      "The teaser and the launch post drew about 1,600 likes each on X.",
    image: "/Projects/matcha-video-cross-chain-2023.webm",
    previewWidth: 960,
    previewHeight: 540,
    previewPoster: "/Projects/matcha-video-cross-chain-2023-poster.webp",
    previewPosterWidth: 640,
    previewPosterHeight: 360,
    ...matchaMeta,
    ctaHref: "https://x.com/matchaxyz/status/1732070138281918806",
    post: { site: "X", href: "https://x.com/matchaxyz/status/1732070138281918806", date: "2023-12-05" },
    previewAspectRatio: 16 / 9,
  },
  {
    id: "preview-matcha-gasless-film",
    slug: "matcha-gasless-film",
    year: "2021",
    category: "Video",
    title: "Matcha gasless trading",
    summary: "",
    detail:
      "I worked on the launch film for gasless trading on Matcha in October 2021: an umbrella keeps gas off the coins, then the trade form shows the gasless toggle and the rate with no gas to pay.",
    role: "I worked on the gasless trading launch film.",
    outcome:
      "Gasless trading launched with a film that explains the feature before showing it.",
    image: "/Projects/matcha-video-gasless-2021.webm",
    previewWidth: 960,
    previewHeight: 540,
    previewPoster: "/Projects/matcha-video-gasless-2021-poster.webp",
    previewPosterWidth: 640,
    previewPosterHeight: 360,
    ...matchaMeta,
    ctaHref: "https://x.com/matchaxyz/status/1447592326424055816",
    post: { site: "X", href: "https://x.com/matchaxyz/status/1447592326424055816", date: "2021-10-11" },
    previewAspectRatio: 16 / 9,
  },
  {
    id: "preview-twilio-admiral",
    slug: "twilio-admiral",
    year: "2019–2020",
    category: "Case study",
    title: "Twilio Admiral",
    summary: "",
    detail:
      "I redesigned the navigation of Admiral, the internal platform Twilio’s engineers use to deploy and run their services. Interviews showed each team only cares about a small slice of 2,351 roles, so I rebuilt the structure around your own team: contextual dashboards, a Team › Roles switcher, and shorter paths to everyday tasks.",
    role: "As a contract product designer I led the navigation research, the information architecture, and the team dashboards.",
    outcome:
      "Engineers land on their own team’s deployments and pipelines by default, and editing an access policy takes three steps instead of six.",
    // The tile and the project view both show one panel, the team's
    // performance against the company, on the grey of the other cards and
    // running off the right edge. It sits at 1.71x, zoomed out from 1.9x so
    // the panel doesn't crowd the tile.
    image: "/Projects/twilio-admiral-overview.webp",
    previewWidth: 1920,
    previewHeight: 1093,
    ctaHref: "#",
    product: "Twilio Admiral, internal developer platform",
    industry: "Developer Tools",
    previewAspectRatio: 1920 / 1093,
  },
  {
    id: "preview-moodys-sprints",
    slug: "moodys-design-sprints",
    year: "2021",
    category: "Case study",
    title: "Moody’s Research Views",
    summary: "",
    detail:
      "Research Views turned Moody’s credit opinions from long PDFs into pages analysts can work in: the rating action and its drivers up top, key indicators that chart against peers, a scorecard to test scenarios, and highlights that save to your snippets. We shaped it over a five-day design sprint and four month-long ones, testing a prototype with users at the end of each.",
    role: "I designed and prototyped each sprint’s concept, building the prototype that users tested at the end of the week.",
    outcome: "The testing earned our team the brief to design the new Moodys.com.",
    image: "/Projects/moodys-research-views.webp",
    previewWidth: 3200,
    previewHeight: 2120,
    ctaHref: "#",
    product: "Moody’s Research Views, credit research",
    industry: "Financial Services",
    previewAspectRatio: 3200 / 2120,
  },
  {
    id: "preview-turtle",
    slug: "turtle",
    year: "2018–2019",
    category: "Case study",
    title: "Turtle",
    summary: "",
    detail:
      "Turtle was a chat app for high school and college students to meet their classmates. Conversations started anonymous and revealed both people after a few days, with hints and guess games in between. As its founding designer I designed everything from onboarding and profiles to the school networks that drove signups.",
    role: "As founding designer and design co-lead I owned the product’s design and direction, and the growth experiments around its launch.",
    outcome:
      "10,000 people signed up in the first week. Turtle was #4 Product of the Day on Product Hunt and was covered by Business Insider.",
    image: "/Projects/turtle.webp",
    previewWidth: 1920,
    previewHeight: 1011,
    ctaHref: "#",
    product: "Turtle, social app for students",
    industry: "Consumer Social",
    previewAspectRatio: 1920 / 1011,
  },
  {
    id: "preview-onit-process-builder",
    slug: "onit-process-builder",
    year: "2019–2020",
    category: "Case study",
    title: "Onit Process Builder",
    summary: "",
    detail:
      "Process Builder lets legal teams automate what happens when a transaction or matter changes, using if/else blocks instead of code. I designed its visual language and front end from the start of development, and built the design system in Figma and React that the product shipped on.",
    role: "I owned the visual design, the design system in Figma and in code, and front-end work in React and TypeScript.",
    outcome:
      "Design and development worked from one documented system, which made building the product faster and simpler.",
    image: "/Projects/onit-process-builder.webp",
    previewWidth: 1920,
    previewHeight: 1200,
    ctaHref: "#",
    product: "Onit, legal workflow automation",
    industry: "Legal Tech",
    previewAspectRatio: 1920 / 1200,
  },
  {
    id: "preview-pokemon-duo",
    slug: "pokemon-duo",
    year: "2026",
    category: "Experiment",
    title: "Pokédex experiment for iPhone Duo",
    summary: "",
    detail:
      "I built a Pokédex that uses both halves of the iPhone Duo. Closed, it is the red cover with the lens; opened, the left screen holds the guesses and the right asks “Who’s that Pokémon?” over a silhouette. Point the lens at a plushie to scan one in.",
    role: "I designed and built the experiment.",
    outcome:
      "A working prototype where the fold does the work: clues on one screen, the Pokémon on the other.",
    image: "/Projects/pokemon-duo.webm",
    previewWidth: 960,
    previewHeight: 764,
    previewPoster: "/Projects/pokemon-duo-poster.webp",
    previewPosterWidth: 640,
    previewPosterHeight: 508,
    ctaHref: "#",
    product: "Pokédex for iPhone Duo",
    industry: "Personal experiment",
    previewAspectRatio: 960 / 764,
  },
]

export const portfolioCards: PortfolioCard[] = portfolioCardEntries.map((card) => ({
  ...card,
  caseStudy: projectCaseStudies[card.slug as keyof typeof projectCaseStudies],
}))
