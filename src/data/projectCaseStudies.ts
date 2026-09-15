import type { ProjectCaseStudy } from "./portfolio"

// Different projects need different amounts of explanation. Media can be
// added to these sections later without changing the reading layout.
const study = (title: string, introduction: string[], sections: ProjectCaseStudy["sections"]): ProjectCaseStudy => ({
  label: "Case study", period: "", title, introduction, sections,
})

export const projectCaseStudies = {
  "matcha-multiwallet-flow": study("Connecting wallets without losing the trade", [
    "Switching wallets shouldn't mean filling out the trade again.",
    "I brought connected accounts and network details into one menu.",
  ], [
    { heading: "Which wallet am I using?", paragraphs: [
      "Made the active account distinct from the other connected wallets.",
      "Kept wallet and network details together so people could check before switching.",
    ] },
    { heading: "Keep what’s already entered", paragraphs: [
      "Preserved the token pair, amount, and quote when changing wallets mid-trade.",
    ] },
    { heading: "Connected doesn’t mean ready", paragraphs: [
      "The selected account still needs the right network and balance for the trade.",
      "I covered loading, empty, and error states alongside adding and selecting a wallet.",
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
      "I led the page structure and hierarchy, keeping search, research, and trading easy to find.",
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
    "I designed the campaign artwork for Matcha Rewards.",
  ], [
    { heading: "Built for more than launch day", paragraphs: [
      "Used the leaderboard, prizes, and points to give the headline a product story.",
      "Adapted that visual into weekly countdowns and link previews so the campaign stayed recognizable.",
    ] },
  ]),
  "protector-booking": study("Making a personal-security booking clear", [
    "I was the sole product designer for Protector’s booking experience.",
    "The flow brings the person, their attire, and transportation into one request.",
  ], [
    { heading: "Start with the person", paragraphs: [
      "Put protector selection first, then carried that choice into the rest of the booking.",
    ] },
    { heading: "The details matter", paragraphs: [
      "Made attire a choice within the flow, alongside optional escorted transportation.",
      "Kept these service details together instead of sending people into separate bookings.",
    ] },
    { heading: "Check the whole request", paragraphs: [
      "Brought the selections together for confirmation before finishing the booking.",
    ] },
  ]),
} satisfies Record<string, ProjectCaseStudy>
