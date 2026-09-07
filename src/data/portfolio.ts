import profilePhoto from "../assets/profile-photo.webp"

export type PortfolioCard = {
  id: string
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
  /** Place the quote slider before the project tiles in this row. */
  quote?: boolean
  /** Flex span for that quote slider, in the same units as `HomeRowItem.span`. */
  quoteSpan?: number
  /** Close this row with the writings folder tile, at a 1-unit span. */
  writings?: boolean
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
  // The three newest projects are spread through the grid rather than parked in
  // a block at the end, so the Matcha run is broken up on the way down.
  //
  // Where they can go is tighter than it looks. All three want a span-1 slot in
  // a three-unit row (~509px against a 420px row): the dealership shot and the
  // phone mockup are matted, so a wider slot only grows the mat, and the
  // Rewards composite is cut to the tile's own ratio, so a slot with a
  // different shape only mats it. The Matcha 4:3 shots have the same
  // requirement from the other side -- at span 1 in a four-unit row `cover`
  // eats a third of their width. That leaves three-unit rows as the home for
  // most of the cards, so the three newest take one row each on the way down:
  // Rewards and the phone mockup in row 2, the dealership hub in row 4. Row 1
  // keeps its pair of clips: index.html preloads their posters, and the first
  // is the LCP element.
  //
  // Pulling the phone mockup up into row 2 leaves row 5 all Matcha, which the
  // spread above was meant to avoid. It is unavoidable once the mockup moves:
  // rows 4 and 5 hold six slots and five Matcha shots between them, and the
  // dealership hub can only break up one of the two.
  {
    id: "row-2",
    height: homeTileRowHeight,
    // The writings tile is this row's third unit, so the two projects keep the
    // ~509px slot the note above asks for.
    writings: true,
    // Both tiles are `contain` and both drop the mat that normally comes with
    // it; see `.mosaic-row-card-preview-family-stories` and
    // `.mosaic-row-card-preview-matcha-rewards` in work-grid.css.
    //
    // Rewards is `contain` against 1.16, which is what this slot measures at
    // 1440px and wider, so on the wide layout the artwork fills the tile edge
    // to edge and the crop the composition wants is the one it was built with.
    // `cover` would have re-cut it at every breakpoint instead: the same slot
    // swings from 0.65 at 900px to 1.16 at 1440, and at the portrait end that
    // is a quarter of the frame off each side — enough to take "left" off the
    // countdown headline.
    items: [
      { cardId: "preview-family-stories", span: 1, fit: "contain" },
      { cardId: "preview-matcha-rewards", span: 1, fit: "contain" },
    ],
  },
  {
    id: "row-3",
    height: homeTileRowHeight,
    quote: true,
    // Widens the quote at Protector's expense. The span was tuned when the
    // writings tile shared this row and it totalled 4; the tile now closes row
    // 2, so this is a 3-unit row and both tiles sit wider than that tuning
    // assumed -- the quote's blockquote is capped at 21rem, so its extra width
    // lands in side padding.
    quoteSpan: 1.25,
    items: [
      { cardId: "preview-protector", span: 1.75 },
    ],
  },
  {
    id: "row-4",
    height: homeTileRowHeight,
    // `contain` is explicit here rather than inferred: the dealership shot's
    // 1.6 ratio sits just past the threshold either way, and it is a browser
    // frame, so `cover` would trim its chrome off the edge.
    items: [
      { cardId: "preview-shot-21", span: 1 },
      { cardId: "preview-shot-1", span: 1 },
      { cardId: "preview-dealership-lead-hub", span: 1, fit: "contain" },
    ],
  },
  {
    id: "row-5",
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
  email: "hellorafaelmedina@gmail.com",
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
    slug: "matcha-multiwallet-flow",
    category: "Preview",
    title: "Matcha multiwallet flow",
    summary: "",
    detail:
      "The multiwallet menu brings connected wallets and network details into one place. I covered wallet selection, adding another wallet, loading, empty, and error states.",
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
    category: "Preview",
    title: "Matcha dark mode",
    summary: "",
    detail:
      "I designed Matcha's dark mode as part of the product system. The work covered semantic color tokens, elevation, component states, charts, and high-density trading screens.",
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
    category: "Preview",
    title: "Matcha homepage",
    summary: "",
    detail:
      "I redesigned the homepage around the ways people start using Matcha. They can search for a token, browse the market, or connect a wallet from the first screen.",
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
      "Protector lets people book short-term personal security. I designed the steps for choosing a protector, selecting how they should be dressed, and adding escorted transportation.",
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
      "This was an early version of Popparazi's discovery feed. I explored friend suggestions, featured photos, content density, and the visual style for the first release.",
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
    previewMediaPaddingBlock: "clamp(0.7rem, 1.6vw, 1.4rem)",
  },
  {
    id: "preview-shot-21",
    slug: "matcha-token-page",
    category: "Preview",
    title: "Matcha token page",
    summary: "",
    detail:
      "I designed a token page that combines market data, charting, trade controls, and order history. The layout prioritizes the information people check before placing a trade.",
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
    category: "Preview",
    title: "Matcha trade page",
    summary: "",
    detail:
      "This is Matcha's main trading workspace. It brings the live quote, chart, balances, open orders, and trade history into a single layout.",
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
    category: "Preview",
    title: "Matcha trade module",
    summary: "",
    detail:
      "I designed the trade module's amount entry, token selection, route, network cost, review, and confirmation states. Each step shows the details required to approve a swap.",
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
    category: "Preview",
    title: "Matcha on mobile",
    summary: "",
    detail:
      "I adapted Matcha's token details, trade form, review, and confirmation screens for mobile browsers. The work included layout, touch targets, and the order of information at narrow widths.",
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
    category: "Preview",
    title: "Matcha Pro",
    summary: "",
    detail:
      "Matcha Pro is a workspace for active traders. It combines live charts, token signals, transactions, and order management in a denser layout.",
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
    category: "Preview",
    title: "Matcha security audit",
    summary: "",
    detail:
      "I added GoPlus token checks to Matcha, including source code, tax, minting, and honeypot signals. I also designed loading, pending, warning, and result states.",
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
      "A workspace for dealership staff to find sales and service opportunities inside their existing customer base. The hub pairs outcome counters for recent outreach and retention rates for signed and non-signed customers with a filtered customer list that can be sent to the dealer app in bulk.",
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
      "A private space where a family keeps its memories together. Stories are grouped by the period they belong to, each one holding a strip of photos and clips, and opening a moment shows when it happened alongside the comments and likes it collected.",
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
    category: "Preview",
    title: "Matcha Rewards",
    summary: "",
    detail:
      "Campaign artwork for Matcha's weekly rewards program. The key visual sets the live leaderboard — wallets, cash prizes, trades, referrals, and points — on an angle behind the headline, and the same construction carries the weekly countdown posts as well as the link previews.",
    role: "I designed the campaign key visual and the variants it ships in.",
    outcome:
      "The rewards program launched with one visual system shared by its social posts and link previews.",
    // Both deliverables in one frame — the green link preview behind and to the
    // left, the purple countdown post in front and to the right — composed as a
    // single asset rather than two tiles so one campaign reads as one project.
    //
    // They overlap and each runs off its own edge instead of sitting side by
    // side. Laid out whole as a diptych, two 1.9:1 banners force a ~3.2 frame,
    // and a strip that wide gets matted down to a sliver in a tile close to
    // square — the banners ended up too small to read as artwork. Overlapping
    // them lets each render about as wide as the whole tile, and the crop is
    // part of the composition rather than something the tile does: the frame is
    // 1.16, the slot's own ratio on the wide layout, so `contain` fills it edge
    // to edge there. The green banner's subtitle is cut by design — it is the
    // layer behind, and the cut lands in the space before "cash" — while both
    // headlines and the whole countdown post stay inside the frame. The wedges
    // the two banners leave in the opposite corners are transparent, so the
    // tile's own surface shows through them.
    image: "/Projects/matcha-rewards.webp",
    previewWidth: 1540,
    previewHeight: 1325,
    ...matchaMeta,
    previewAspectRatio: 1540 / 1325,
  },
]
