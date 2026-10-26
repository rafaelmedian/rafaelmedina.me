import type { ProjectCaseStudy } from "./portfolio"

// Different projects need different amounts of explanation. Media can be
// added to these sections later without changing the reading layout.
const study = (
  title: string, introduction: string[], sections: ProjectCaseStudy["sections"],
  options: Partial<Pick<ProjectCaseStudy, "media" | "label">> = {},
): ProjectCaseStudy => ({
  label: "Case study", title, introduction, sections, ...options,
})

export const projectCaseStudies = {
  "matcha-multiwallet-flow": study("Connecting wallets without losing the trade", [
    "Switching wallets shouldn't mean filling out the trade again.",
    "Matcha added Solana beside its Ethereum networks, so one person could need a wallet for each.",
    "I brought both accounts into one menu in the header.",
  ], [
    { heading: "Which wallet am I using?", paragraphs: [
      "With one wallet, the header shows its address. A second turns it into Wallets, with both avatars stacked.",
      "Each row carries the address, balance, and a chain badge, so people can tell the Solana account from the Ethereum one before switching.",
    ], media: [
      { source: "/Projects/matcha-wallet-menu-one.webp", label: "One Solana wallet, with room to connect another", width: 2000, height: 1500 },
      { source: "/Projects/matcha-wallet-menu-two.webp", label: "Solana and Ethereum wallets in the same menu", width: 2000, height: 1500 },
    ] },
    { heading: "Every state of the menu", paragraphs: [
      "The header pill covers one wallet and two, with a fallback avatar for wallets it doesn’t recognize.",
      "Wallets are listed in the order they were connected. Hovering an address offers to copy it, and the exit icon disconnects that wallet alone.",
      "I specified hover, pressed, and focus states for the menu’s actions in both themes.",
    ], media: [
      { source: "/Projects/matcha-wallet-menu-board.webp", label: "The wallet menu board: pills, menus, hover, and button states", width: 2880, height: 1326 },
    ] },
    { heading: "Connected doesn’t mean ready", paragraphs: [
      "A Solana wallet can’t trade an Ethereum token, and the reverse is true too. The trade module names the wallet the token needs.",
      "Limit orders and cross-chain swaps weren’t available on Solana, so the module says so and asks for a token from a supported network.",
    ], media: [
      { source: "/Projects/matcha-wallet-trade-module.webp", label: "The trade module board: asking for the right wallet, and what Solana can’t do yet", width: 2880, height: 1477 },
    ] },
    { heading: "Keep what’s already entered", paragraphs: [
      "Preserved the token pair, amount, and quote when changing wallets mid-trade.",
      "Once the second wallet is in, the header switches to Wallets and the token is still selected underneath.",
    ], media: [
      { source: "/Projects/matcha-wallet-two-connected.webp", label: "Both wallets connected, back on the same Solana trade", width: 2880, height: 1546 },
    ] },
    { heading: "Placing the order", paragraphs: [
      "Review shows the quote counting down, with the network cost, the amount received, the route, slippage, and rate above Place order.",
      "While the swap runs, a timer shows the time left. The result links to the transaction on Solscan, first while it confirms and then once it’s final.",
    ], media: [
      { source: "/Projects/matcha-wallet-order-flow.webp", label: "The order flow board, from quote to completed", width: 2880, height: 722 },
    ] },
  ]),
  "matcha-homepage": study("Helping people find their next token", [
    "Some people arrive knowing exactly what to trade. Others just want to look around.",
    "I redesigned the homepage to give both a place to start.",
  ], [
    { heading: "Two ways in", paragraphs: [
      "Kept search direct for people with a token in mind.",
      "Gave market browsing room for people who hadn't decided yet.",
    ] },
    { heading: "Discovery before a decision", paragraphs: [
      "Connected market browsing to token pages, where people can take a closer look.",
      "Research comes before the commitment to connect a wallet and trade.",
    ] },
    { heading: "Finding the next step", paragraphs: [
      "Kept search, research, and trading easy to find from anywhere on the page.",
    ] },
    { heading: "One page, both themes", paragraphs: [
      "The homepage is built from Matcha’s design system, so light and dark are the same components on different tokens.",
    ], media: [
      { source: "/Projects/matcha-homepage-light.webp", label: "The homepage in the light theme", width: 1440, height: 2485 },
      { source: "/Projects/matcha-homepage-dark.webp", label: "The homepage in the dark theme", width: 1440, height: 2485 },
    ] },
    { heading: "Tokens before components", paragraphs: [
      "Gray, purple, and green primitives map to semantic tokens, each with a light and a dark value.",
    ], media: [
      { source: "/Projects/matcha-design-system-colors.webp", label: "Color primitives and their light and dark tokens", width: 2400, height: 1425 },
    ] },
    { heading: "Type and spacing", paragraphs: [
      "Gilroy sets the headlines and Inter everything else.",
      "Spacing steps up from a 4px unit, from 4px gaps to 32px container padding.",
    ], media: [
      { source: "/Projects/matcha-design-system-type.webp", label: "The type scale", width: 1428, height: 1700 },
      { source: "/Projects/matcha-design-system-scale.webp", label: "The size and spacing scale", width: 1782, height: 1300 },
    ] },
    { heading: "Every state, specified", paragraphs: [
      "Primary, secondary, tertiary, and link buttons each cover default, hover, pressed, focused, and disabled.",
      "State changes fade in over 150 to 200ms, so the timing is part of the spec too.",
    ], media: [
      { source: "/Projects/matcha-design-system-buttons.webp", label: "Button variants and their states", width: 2400, height: 1170 },
    ] },
  ]),
  "matcha-dark-mode": study("The same Matcha, after dark", [
    "I led the dark theme across Matcha’s trading screens and components.",
  ], [
    { heading: "Keep the hierarchy", paragraphs: [
      "Defined color and elevation tokens so panels, charts, and controls stayed distinct.",
      "Worked through component states too. A theme has to hold up when you use it.",
    ] },
  ]),
  "matcha-token-page": study("A closer look at a token", [
    "I brought token research and trading onto the same page.",
  ], [
    { heading: "Look first", paragraphs: [
      "Organized market data and charts around the token someone came to investigate.",
      "Kept trade controls nearby, without letting them take over the research view.",
    ] },
    { heading: "Your activity belongs here too", paragraphs: [
      "Added order history so people can review their activity alongside the market.",
    ] },
  ]),
  "matcha-trade-page": study("Keeping the trade in view", [
    "I organized the main workspace around the live quote, with charts and balances close by.",
  ], [
    { heading: "Before and after the trade", paragraphs: [
      "Separated the current trade from open orders and history so they don't compete for attention.",
      "Kept activity on the page, giving people somewhere to follow the trade after placing it.",
    ] },
  ]),
  "matcha-trade-module": study("Know what you’re signing", [
    "I designed the swap from token selection and amount entry through confirmation.",
  ], [
    { heading: "Make the quote readable", paragraphs: [
      "Put the received amount, fees, and route where people can review them before signing.",
      "Kept those details close to the inputs that produced the quote.",
    ] },
    { heading: "Don’t stop at the button", paragraphs: [
      "Covered transaction states as well as the form, so review and confirmation feel connected.",
    ] },
  ]),
  "matcha-on-mobile": study("A trade that fits in your hand", [
    "I adapted the research and trading journey for a mobile browser.",
  ], [
    { heading: "One thing at a time", paragraphs: [
      "Reordered token details, the trade form, and review for a narrow screen.",
      "Gave touch targets and inputs room, rather than squeezing in the desktop layout.",
    ] },
    { heading: "Room to check", paragraphs: [
      "Kept review and confirmation readable before asking someone to commit to the trade.",
    ] },
  ]),
  "matcha-pro": study("More room for active traders", [
    "I led the structure and interaction design for Matcha Pro.",
  ], [
    { heading: "Everything within reach", paragraphs: [
      "Brought live charts, token signals, transactions, and orders into one denser workspace.",
      "Gave advanced tools their own home, while keeping the standard swap simple.",
    ] },
  ]),
  "matcha-security-audit": study("Showing token warnings before a swap", [
    "I designed how GoPlus token checks appear inside Matcha’s trade flow.",
  ], [
    { heading: "Show what was checked", paragraphs: [
      "Separated source-code, tax, minting, and honeypot signals so each finding is readable.",
      "Kept the warnings beside the trade people are preparing.",
    ] },
    { heading: "Pending isn’t a pass", paragraphs: [
      "Made loading and pending states distinct from completed results.",
      "The checks offer context, not a promise that a token is safe.",
    ] },
  ]),
  "matcha-rewards": study("A look for the weekly rewards", [
    "I designed Matcha Rewards: the campaign artwork and the rewards page itself, from the countdown to the final winners.",
  ], [
    { heading: "Built for more than launch day", paragraphs: [
      "Used the leaderboard, prizes, and points to give the headline a product story.",
      "Adapted that visual into weekly countdowns and link previews so the campaign stayed recognizable.",
    ] },
    { heading: "Before it starts", paragraphs: [
      "Ahead of launch, the page counts down to the first week and tilts a sample leaderboard behind the headline, so people see what they’re playing for.",
      "A banner above the nav points every Matcha page here.",
    ], media: [
      { source: "/Projects/matcha-rewards-prelaunch.webp", label: "The countdown before the first week", width: 2880, height: 2606 },
    ] },
    { heading: "Rules people actually read", paragraphs: [
      "The competition rules open as short questions: what it is, the prizes, how points work, referrals, and restrictions.",
      "The first visit shows the rules first; after that the page goes straight to the leaderboard.",
    ], media: [
      { source: "/Projects/matcha-rewards-rules-faq.webp", label: "Competition rules, opened on what Matcha Rewards is", width: 2880, height: 1678 },
      { source: "/Projects/matcha-rewards-rules-prizes.webp", label: "Competition rules, opened on the prizes", width: 2880, height: 1448 },
    ] },
    { heading: "During the week", paragraphs: [
      "With a wallet connected, the page opens on your weekly total and rank, then where the points came from: swaps, referrals, chain boosts, and a daily streak.",
      "Below it, you against the friends you referred, then the full leaderboard with the top three in gold, silver, and bronze.",
    ], media: [
      { source: "/Projects/matcha-rewards-live.webp", label: "The full rewards page during week two, wallet connected", width: 2880, height: 7142 },
    ] },
    { heading: "On a phone", paragraphs: [
      "The same page stacks into one column: the score first, the referral link next, and the leaderboard trimmed to rank, wallet, and prize.",
    ], media: [
      { source: "/Projects/matcha-rewards-mobile.webp", label: "The rewards page on mobile", width: 780, height: 5410 },
    ] },
    { heading: "When a week ends", paragraphs: [
      "Each finished week leaves a card with your place and a share button for X and Farcaster.",
    ], media: [
      { source: "/Projects/matcha-rewards-week-results.webp", label: "Results cards for each finished week", width: 2880, height: 2286 },
    ] },
    { heading: "Something worth sharing", paragraphs: [
      "Shared links unfold into the leaderboard image, in light and dark.",
    ], media: [
      { source: "/Projects/matcha-rewards-share-image.webp", label: "The shared leaderboard image, light and dark", width: 2880, height: 691 },
    ] },
    { heading: "After the last week", paragraphs: [
      "Once the competition closes, the page thanks people for taking part and keeps a winners leaderboard for each week.",
    ], media: [
      { source: "/Projects/matcha-rewards-ended.webp", label: "The competition over, no wallet connected", width: 2880, height: 1406 },
    ] },
    { heading: "Where you finished", paragraphs: [
      "Connected wallets see their own row pinned at the top of every week.",
    ], media: [
      { source: "/Projects/matcha-rewards-ended-connected.webp", label: "The competition over, with your row pinned on the winners leaderboard", width: 2880, height: 4276 },
    ] },
  ]),
  "matcha-marketing": study("Marketing Matcha in one voice", [
    "I designed Matcha’s marketing materials: launch posts, milestones, promos, and campaigns.",
    "Most of it went out on @matchaxyz through 2022, one milestone after another.",
  ], [
    { heading: "Something new to announce", paragraphs: [
      "Gave each launch a headline people could read at feed size: the network or feature, and nothing else.",
      "Used the partner’s own mark and colors so the post reads as theirs as much as Matcha’s.",
    ], media: [
      { source: "/Projects/matcha-marketing-optimism.webp", label: "Launching on Optimism", width: 1200, height: 600 },
      { source: "/Projects/matcha-marketing-arbitrum.webp", label: "Now live on Arbitrum", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1598421719940681728", date: "2022-12-01" } },
    ] },
    { heading: "Checked where it lands", paragraphs: [
      "Reviewed posts inside a mock X timeline, at the size people actually scroll past them.",
      "Then the real thing: the $50B milestone as it went out on Twitter in March 2022.",
    ], media: [
      { source: "/Projects/matcha-marketing-arbitrum-feed.webp", label: "The Arbitrum launch in an X timeline", width: 1200, height: 686 },
      { source: "/Projects/matcha-marketing-50-billion-tweet.webp", label: "The $50B milestone tweet", width: 1200, height: 1202, post: { href: "https://x.com/matchaxyz/status/1505926434958753792", date: "2022-03-21" } },
    ] },
    { heading: "A number worth sharing", paragraphs: [
      "Milestones lead with the figure itself, set large enough to carry the post on its own.",
      "The chart and the cup stay in the background, so the number is what gets reposted.",
      "Between February and May 2022 they landed every few weeks, each one recognizably part of the same run.",
    ], media: [
      { source: "/Projects/matcha-marketing-40-billion.webp", label: "$40B in trade volume", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1489264665955815424", date: "2022-02-03" } },
      { source: "/Projects/matcha-marketing-2-million.webp", label: "Two million transactions", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1491054562358468611", date: "2022-02-08" } },
      { source: "/Projects/matcha-marketing-50-billion-bars.webp", label: "$50B traded on Matcha", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1505926434958753792", date: "2022-03-21" } },
      { source: "/Projects/matcha-marketing-50-billion.webp", label: "$50B traded on Ethereum", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1522213692460335104", date: "2022-05-05" } },
    ] },
    { heading: "One layout, a color per chain", paragraphs: [
      "Kept the structure fixed and let each network’s color change, so a new chain needed a palette, not a new design.",
      "The series stays recognizable across chains while each post still belongs to its network.",
    ], media: [
      { source: "/Projects/matcha-marketing-polygon.webp", label: "$1B traded on Polygon", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1508483724190621705", date: "2022-03-28" } },
      { source: "/Projects/matcha-marketing-bnb-chain.webp", label: "$1B traded on BNB Chain", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1520037557437964290", date: "2022-04-29" } },
      { source: "/Projects/matcha-marketing-bnb-250k.webp", label: "250,000 trades on BNB Chain", width: 1200, height: 600, post: { href: "https://x.com/matchaxyz/status/1539617064033427457", date: "2022-06-22" } },
      { source: "/Projects/matcha-marketing-avalanche-750m.webp", label: "$750M traded on Avalanche", width: 1200, height: 600 },
    ] },
    { heading: "Showing the product’s edge", paragraphs: [
      "Promos put the swap itself in the post, with the saving against other exchanges called out beneath it.",
    ], media: [
      { source: "/Projects/matcha-marketing-savings.webp", label: "Swap savings compared with Uniswap", width: 1200, height: 600 },
    ] },
    { heading: "It’s a Match(a)", paragraphs: [
      "A lighter campaign built on the name: fill-in-the-blank token pairs and short verses about trading.",
      "Swapped the dark trading palette for coral and glass, while the cup kept it recognizably Matcha.",
    ], media: [
      { source: "/Projects/matcha-marketing-match-markets.webp", label: "“The markets are red, Matcha green”", width: 1200, height: 1043 },
      { source: "/Projects/matcha-marketing-match-roses.webp", label: "“Roses are red, Matcha is the best”", width: 1200, height: 1043 },
    ] },
  ]),
  "dealership-lead-hub": study("From a lead table to a dealership hub", [
    "The old CRM did one thing: list customers and send them a campaign.",
    "Everything around that list — the workshop, the customer’s history, who on the team was falling behind — lived in other tools.",
    "I designed and built Dealership Hub to replace it: one app for sales, service, customers, and staff, with the lead flow still at its center.",
  ], [
    { heading: "Where it started", paragraphs: [
      "The lead hub was a dense table under a row of numbers nobody could act on: “Not the Owner”, “Another Workshop”.",
      "Every row looked the same, the send button was the loudest thing on the page, and nothing said who to call first.",
      "Its strongest idea, filtering customers and sending a batch to the dealer app, was worth keeping. The rest needed rethinking.",
    ] },
    { heading: "Ask instead of hunting", paragraphs: [
      "Every page has the same bar at the bottom for plain questions, like what’s running late.",
      "Answers come back as rows that open the job or the customer, not paragraphs to read, with the likely next questions underneath.",
    ], media: [
      { source: "/Projects/dealership-hub-ask.webp", video: "/Projects/dealership-hub-ask.webm", label: "Asking who to call first, the agent’s eyes following the typing", width: 1600, height: 1000 },
      { source: "/Projects/dealership-hub-hub-answer.webp", label: "An answer listing the three late jobs", width: 2880, height: 2064 },
    ] },
    { heading: "Leads, kept and sharpened", paragraphs: [
      "Rewrote the metrics as things to act on — ready for follow-up, due this week — each measured against a goal.",
      "Folded six dropdowns into one Filters menu that composes dealer, model, campaign, ownership, and last sent.",
      "Rows lead with the person and their car, mask the registration, and flag anyone who has never been contacted.",
      "Batch sends confirm the count and can be undone; an offline send keeps the selection so it can be retried.",
    ], media: [
      { source: "/Projects/dealership-hub-leads-filters.webp", label: "One Filters menu in place of six dropdowns", width: 2880, height: 2064 },
      { source: "/Projects/dealership-hub-leads-confirm.webp", label: "Confirming a send to four customers", width: 2880, height: 2064 },
    ] },
    { heading: "The workshop floor at a glance", paragraphs: [
      "Service was invisible in the old CRM. Now every car on the floor sits on one board, grouped by stage.",
      "Each stage says how many cars are running late, and each row pairs car, customer, job, and technician with the time promised.",
    ], media: [
      { source: "/Projects/dealership-hub-workshop-light.webp", label: "The workshop board, grouped by stage", width: 2880, height: 2064 },
    ] },
    { heading: "Start with what needs doing", paragraphs: [
      "The hub opens on the three things worth doing first, each with its reason: a customer waiting in the lounge, six leads never contacted.",
      "Sales, workshop, issues, and team follow as one line each, and a shared to-do list stays alongside.",
      "Picking one drafts the question for you — who should I call first? — ready to send or edit.",
    ], media: [
      { source: "/Projects/dealership-hub-hub-light.webp", label: "The hub, opening on the day’s first three things", width: 2880, height: 2064 },
    ] },
    { heading: "One page per customer", paragraphs: [
      "The directory opens on who needs attention — follow-ups, an advisor on leave, an unbooked recall — before the list itself.",
      "A customer’s page holds their cars, bookings, staff notes, and the conversation side by side, so nobody asks them the same thing twice.",
    ], media: [
      { source: "/Projects/dealership-hub-customers-light.webp", label: "The customer directory", width: 2880, height: 2064 },
      { source: "/Projects/dealership-hub-customer-profile.webp", label: "A customer profile with the next booking open", width: 2880, height: 2064 },
    ] },
    { heading: "Who needs a hand", paragraphs: [
      "The team view tracks each advisor’s sales against target, open leads, and what’s overdue.",
      "Leave, unassigned leads, and pending invites surface as tasks with one action each: reassign, assign, resend.",
    ], media: [
      { source: "/Projects/dealership-hub-team-light.webp", label: "The team view, with sales against target", width: 2880, height: 2064 },
    ] },
    { heading: "One system under it", paragraphs: [
      "Neutral surfaces carry the work; one brand blue moves it forward, and orange is saved for what’s urgent.",
      "Every screen is built from the same tokens and components, documented on a live design-system page, so the dark theme is the same components on different tokens.",
    ], media: [
      { source: "/Projects/dealership-hub-design-system-light.webp", label: "The live design-system page", width: 2880, height: 2064 },
      { source: "/Projects/dealership-hub-workshop-dark.webp", label: "The workshop board in the dark theme", width: 2880, height: 2064 },
    ] },
    { heading: "Built to be used, not just shown", paragraphs: [
      "It’s a working Next.js app on sample data, not a click-through: filters, sends, undo, comments, and to-dos all hold state.",
      "Single-letter shortcuts move between pages without stealing the browser’s own, and menus and dialogs work from the keyboard.",
      "More than 90 Playwright tests cover those flows, from offline retries to mobile tables that scroll inside themselves.",
    ] },
  ], { media: "wide" }),
  "protector-booking": study("Making a personal-security booking clear", [
    "The iPhone flow brings the people, the protectors’ attire, and the convoy into one request.",
  ], [
    { heading: "Start with the people", paragraphs: [
      "Booking starts with how many people need protection, whether someone is solo or in a group.",
      "The app recommends how many protectors to assign from that count, and people can still change it.",
    ], media: [
      { source: "/Projects/protector-booking-start.webp", label: "The home screen, then the protectee and protector count", width: 2400, height: 2246 },
    ] },
    { heading: "The details matter", paragraphs: [
      "Made attire a choice within the flow: Business Formal, Business Casual, or Tactical Casual.",
      "Each option shows a protector wearing it, so people choose by sight instead of by description.",
    ], media: [
      { source: "/Projects/protector-dress-code.webp", label: "Three dress codes, each shown on a protector", width: 2400, height: 1510 },
    ] },
    { heading: "The car is part of the booking", paragraphs: [
      "Escorted transportation sits in the same flow. Each car comes with a dedicated driver, and the app says how many the detail needs.",
      "Pickup address, date, time, and duration are set on one screen instead of across separate bookings.",
    ], media: [
      { source: "/Projects/protector-convoy.webp", label: "Choosing the convoy and where it meets you", width: 2400, height: 1510 },
    ] },
    { heading: "Check the whole request", paragraphs: [
      "Brought every selection together for review, each with its own Edit link.",
      "Booking is for members only, so the membership fee sits beside the booking total before anyone pays.",
      "Confirmation repeats the pickup details, and the detail leader texts to verify them.",
    ], media: [
      { source: "/Projects/protector-review.webp", label: "Review, the membership step, and confirmation", width: 2400, height: 1510 },
    ] },
  ]),
  "patrol-booking": study("A patrol car outside the house", [
    "Booking takes an address and a time window, and the account comes last.",
  ], [
    { heading: "Where, then when", paragraphs: [
      "The flow starts by asking whether someone lives in the Los Angeles area, then which neighborhood. Areas Patrol doesn’t cover yet get a waitlist.",
      "The address is confirmed on a map, and the car appears parked outside it while people pick when it arrives and leaves.",
      "The hourly rate and total sit above the button. Creating an account is the last step, not the first.",
    ], media: [
      { source: "/Projects/patrol-booking.webp", video: "/Projects/patrol-booking.webm", label: "Booking a patrol car in Brentwood, from the home screen to the phone number", width: 880, height: 1912 },
    ] },
    { heading: "Who’s parked outside", paragraphs: [
      "Each officer’s profile shows their department, license number, and years of service before anyone books.",
    ], media: [
      { source: "/Projects/patrol-screens.webp", label: "Patrol’s App Store screens: the home screen, the booked car, and an officer’s profile", width: 2400, height: 934 },
    ] },
    { heading: "A patrol for the whole street", paragraphs: [
      "Neighbors can also fund a patrol together. Each street shows what it has raised toward a monthly goal, and who has chipped in.",
      "Contributions can be one-off or monthly. Every tier unlocks more coverage, from one patrol car up to drones and robotics.",
      "Once a patrol is on, the map shows the car on its route and a notification says which officer is on shift and until when.",
    ], media: [
      { source: "/Projects/patrol-neighborhood.webp", label: "Crowdfunding a street’s patrol: the goal, neighbors’ contributions, unlock tiers, the live map, and the officer", width: 2400, height: 1142 },
    ] },
    { heading: "The service behind the app", paragraphs: [
      "The cars are marked and parked where people can see them, and every one carries a medical kit.",
      "The app is how a homeowner sees where the car is and messages the officer on duty.",
    ], media: [
      { source: "/Projects/patrol-service.webp", label: "Highly visible patrol cars, medical kits, and the app in hand", width: 2400, height: 1208 },
    ] },
  ]),
  "twilio-admiral": study("Showing each team only what’s theirs", [
    "I joined to iterate on Admiral’s pipelines feature. The research turned it into a redesign of how the whole platform is organized.",
  ], [
    { heading: "Seven people, seven maps of Admiral", paragraphs: [
      "We interviewed seven Admiral users and had each one rank their top five workflows. Two groups emerged: daily work and administration.",
      "Then we asked them to rename and regroup its sections. Everyone came back with a different picture of how Admiral was structured.",
    ], media: [
      { source: "/Projects/twilio-admiral-card-sort.webp", label: "Grouping and labeling exercises from the interviews", width: 1600, height: 653 },
    ] },
    { heading: "A sliver of a huge list", paragraphs: [
      "Admiral held 2,351 roles across 246 teams, about ten per team. Each team only owned 0.4–4% of them.",
      "So the structure became contextual instead of flat, the way Slack only shows the channels you’ve joined.",
    ], media: [
      { source: "/Projects/twilio-admiral-ownership.webp", label: "The few roles one team owns among thousands", width: 1600, height: 724 },
      { source: "/Projects/twilio-admiral-hierarchy.webp", label: "Flat hierarchy versus contextual hierarchy", width: 1600, height: 709 },
    ] },
    { heading: "Start from your team", paragraphs: [
      "A Team › Roles switcher replaced the long list from top to bottom. By default you see your own team’s deployments, pipelines, and dashboards.",
      "Editing a team’s access policy went from six steps to three.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/twilio-admiral-team-switcher.webp", label: "Switching team and role from the header", width: 1600, height: 571 },
      { source: "/Projects/twilio-admiral-access-flow.webp", label: "Editing an access policy, before and after", width: 1600, height: 552 },
    ] },
    { heading: "One level down", paragraphs: [
      "The same structure carried the detailed tools: a deployment’s events and configuration sit under the team that owns it.",
    ], media: [
      { source: "/Projects/twilio-admiral-deployment.webp", label: "A failed deployment, with its log and a rollback, inside the team’s view", width: 1600, height: 911 },
    ] },
    { heading: "A system to build it on", paragraphs: [
      "Worked with the team to bring a design system into Admiral, and drew an icon set for the platform’s own concepts.",
    ], media: [
      { source: "/Projects/twilio-admiral-design-system.webp", label: "Typography and color in the design system", width: 1600, height: 986 },
      { source: "/Projects/twilio-admiral-icons.webp", label: "The Admiral icon set, with the options drawn for each concept, in light and dark", width: 1600, height: 995 },
    ] },
  ]),
  "moodys-design-sprints": study("A credit opinion that reads like a product", [
    "Analysts read credit opinions the way they always had: top to bottom, then into a spreadsheet.",
    "We took one report and turned it into a page you can scan, compare, and keep.",
  ], [
    { heading: "The rating before the reading", paragraphs: [
      "The header answers what changed before anything else: the upgrade from Ba2 to Ba1, the outlook, the short-term rating, and the ESG score, with the rating’s history beside it.",
      "The analyst’s brief sits next to it as a video, or as audio for the commute.",
    ], media: [
      { source: "/Projects/moodys-research-audio-brief.webp", label: "The rating action, outlook, and ESG score, with the analyst’s brief as audio", width: 2880, height: 1254 },
    ] },
    { heading: "Notes that stay with the text", paragraphs: [
      "Selecting a passage offers to save it or comment on it. Analysts’ own comments sit in the margin beside the line they’re about.",
      "Everything saved collects in My snippets, ready to download or share as a link.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/moodys-research-snippets-flow.webp", video: "/Projects/moodys-research-snippets-flow.webm", label: "Highlighting a passage and finding it in My snippets", width: 1600, height: 1000 },
      { source: "/Projects/moodys-research-comment.webp", label: "An analyst’s comment beside the passage it explains", width: 2880, height: 1800 },
    ] },
    { heading: "Indicators you can compare", paragraphs: [
      "Built for people who work in spreadsheets all day: each key indicator opens from a row in the table into a chart, with the forecast years shaded.",
      "Peers from the same sector join the chart from a search, and the view saves to your snippets with an annotation.",
    ], media: [
      { source: "/Projects/moodys-research-indicators-flow.webp", video: "/Projects/moodys-research-indicators-flow.webm", label: "EBIT margin opened from the table into a chart, then compared against Teck", width: 1600, height: 1000 },
    ] },
    { heading: "What would change the rating", paragraphs: [
      "The scorecard shows how each factor feeds the rating. Entering your own measures runs a scenario, and the indicated outcome moves with them.",
    ], media: [
      { source: "/Projects/moodys-research-scorecard-flow.webp", video: "/Projects/moodys-research-scorecard-flow.webm", label: "Dragging two leverage measures moves the indicated outcome from Baa3 to Baa2", width: 1600, height: 1000 },
    ] },
    { heading: "The same thinking, one level up", paragraphs: [
      "The testing went well enough that our team was asked to design the new Moodys.com.",
      "The issuer pages took the report’s parts and laid them out as a grid: the rating and outlook up top, then news sentiment, risk signals, and key indicators an analyst can scan before opening any research.",
      "We tried it two ways, as tabs and as a single page.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/moodys-content-grid-overview.webp", label: "An issuer’s overview: news sentiment, key indicators, and risk signals", width: 2880, height: 1800 },
      { source: "/Projects/moodys-content-grid-geographic.webp", label: "Revenue by US segment on the Geographic Exposure tab", width: 2880, height: 1800 },
      { source: "/Projects/moodys-content-grid-summary.webp", label: "The single-page version: rating history, takeaways, and key indicators", width: 2880, height: 1800 },
    ] },
    { heading: "Starting from the inbox", paragraphs: [
      "Most readers arrive from an alert, so the email carries the rating action, the key exhibit, and the reasons for the upgrade, with one way into the full research.",
    ], media: [
      { source: "/Projects/moodys-research-email.webp", label: "The rating alert that leads into the report", width: 2880, height: 2806 },
    ] },
  ]),
  "onit-process-builder": study("Document logic lawyers can build themselves", [
    "I joined as development started, to close the gap between design and engineering.",
  ], [
    { heading: "Blocks, not code", paragraphs: [
      "Each rule is a stack of events, conditions, and actions. An if/else branch reads top to bottom, the way the people writing it would say it.",
      "Optimized the editor for the paths people used most, and mapped every state the blocks could be in.",
    ], media: [
      { source: "/Projects/onit-process-builder-workflow.webp", label: "Annotated workflow through the editor", width: 1600, height: 823 },
    ] },
    { heading: "One system, in Figma and in code", paragraphs: [
      "Built, scaled, and documented the design system both in Figma and in React and TypeScript.",
      "Took on front-end work so my teammates could focus on the back end and the logic.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/onit-process-builder-design-system.webp", label: "Buttons, inputs, and type in the Figma library", width: 1600, height: 867 },
      { source: "/Projects/onit-process-builder-frontend.webp", label: "The same components in code", width: 1600, height: 864 },
    ] },
    { heading: "Tested before it shipped", paragraphs: [
      "Prototyped each new feature against different use cases before it went to development, like editing a block in place and reviewing changes before publishing them.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/onit-process-builder-action-block.webp", video: "/Projects/onit-process-builder-action-block.webm", label: "Editing an action block", width: 1600, height: 1094 },
      { source: "/Projects/onit-process-builder-history.webp", video: "/Projects/onit-process-builder-history.webm", label: "Reviewing changes before publishing", width: 1600, height: 992 },
    ] },
  ]),
  "turtle": study("Friends first, names later", [
    "Turtle let students start a conversation with a classmate without being judged for it.",
    "A friend and I started it as sophomores, and I co-led the product.",
  ], [
    { heading: "Temporary anonymity", paragraphs: [
      "Conversations started anonymous. After a set number of days, both people were revealed.",
      "The countdown kept it playful while lowering the stakes that make anonymous apps go wrong.",
    ], media: [
      { source: "/Projects/turtle-conversations.webp", label: "The countdown to a reveal", width: 1600, height: 842 },
      { source: "/Projects/turtle-reveal.webp", label: "An inbox of revealed chats", width: 1600, height: 842 },
    ] },
    { heading: "Guess who", paragraphs: [
      "Hints and guess games gave people something to talk about while they were still anonymous.",
    ], media: [
      { source: "/Projects/turtle-guess-games.webp", label: "Hints and guesses", width: 1600, height: 842 },
    ] },
    { heading: "In within a minute", paragraphs: [
      "Onboarding took a phone number, a code, a username, and a photo, one question per screen.",
    ], media: [
      { source: "/Projects/turtle-onboarding.webp", label: "The onboarding flow", width: 1200, height: 1677 },
    ] },
    { heading: "Built to spread", paragraphs: [
      "Profiles came with one-tap sharing to Snapchat and a link of their own.",
      "Schools were the network: you found people through your high school or college.",
    ], media: [
      { source: "/Projects/turtle-profiles.webp", label: "Profiles and sharing", width: 1600, height: 842 },
      { source: "/Projects/turtle-schools.webp", label: "Finding people by school", width: 1600, height: 840 },
    ] },
    { heading: "Launch week", paragraphs: [
      "Over 500 students around Virginia signed up for the beta. At launch we asked those groups to share it with their friends.",
      "10,000 people signed up in the first week. Turtle was #4 Product of the Day on Product Hunt, Business Insider covered it, and investors and product leads reached out.",
    ], media: [
      { source: "/Projects/turtle-product-hunt.webp", label: "Ryan Hoover on Product Hunt", width: 1600, height: 1177 },
      { source: "/Projects/turtle-business-insider.webp", label: "Business Insider’s coverage", width: 1534, height: 870 },
    ] },
  ]),
  "pokemon-duo": study("A Pokédex with a fold down the middle", [
    "The iPhone Duo folds in half, so I built a Pokédex that uses both screens.",
    "The right screen shows the Pokémon. The left one holds the guesses, the hints, and Professor Oak.",
  ], [
    { heading: "Who’s that Pokémon?", paragraphs: [
      "A silhouette sits on the right screen and four names wait on the left. Each wrong guess unlocks another hint.",
      "Guess right and the Pokémon is registered in a 151-slot collection, with Professor Oak reacting to every guess.",
    ], media: [
      { source: "/Projects/pokemon-duo-playing.webp", video: "/Projects/pokemon-duo-playing.webm", label: "Guessing Poliwhirl, then Zapdos", width: 1440, height: 1146 },
    ] },
  ], { label: "Experiment" }),
  "matcha-relaunch-film": study("Three launches, three films", [
    "Each one shows the feature in the product’s own screens.",
  ], [
    { heading: "Cross-chain swaps", paragraphs: [
      "A pure-motion teaser went out first, then the launch film a week later.",
      "It says goodbye to broken bridges and wrapping, then swaps from one chain to another in the new cross-chain tab.",
    ], media: [
      { source: "/Projects/matcha-video-cross-chain-2023-poster.webp", video: "/Projects/matcha-video-cross-chain-2023.webm", label: "Matcha cross-chain swaps", width: 960, height: 540, post: { href: "https://x.com/matchaxyz/status/1732070138281918806", date: "2023-12-05" } },
    ] },
    { heading: "The new Matcha", paragraphs: [
      "Introduced the redesign in May 2023, running the new product’s screens in its new green identity.",
      "One search across every chain, the best price, MEV protection, then the trade, ending on “Search. Trade. Done.”",
    ], media: [
      { source: "/Projects/matcha-video-relaunch-2023-poster.webp", video: "/Projects/matcha-video-relaunch-2023.webm", label: "The new Matcha", width: 960, height: 540, post: { href: "https://x.com/matchaxyz/status/1661401872811565056", date: "2023-05-24" } },
    ] },
    { heading: "Gasless trading", paragraphs: [
      "The October 2021 film keeps gas off the coins with an umbrella, then shows the toggle in the trade form and a rate with no gas to pay.",
    ], media: [
      { source: "/Projects/matcha-video-gasless-2021-poster.webp", video: "/Projects/matcha-video-gasless-2021.webm", label: "Matcha gasless trading", width: 960, height: 540, post: { href: "https://x.com/matchaxyz/status/1447592326424055816", date: "2021-10-11" } },
    ] },
  ], { label: "Video" }),
} satisfies Record<string, ProjectCaseStudy>
