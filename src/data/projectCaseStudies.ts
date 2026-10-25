import type { ProjectCaseStudy } from "./portfolio"

// Different projects need different amounts of explanation. Media can be
// added to these sections later without changing the reading layout.
const study = (
  title: string, introduction: string[], sections: ProjectCaseStudy["sections"],
  options: Pick<ProjectCaseStudy, "media"> = {},
): ProjectCaseStudy => ({
  label: "Case study", title, introduction, sections, ...options,
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
    "I designed and built Dealership Hub to replace it: one app for sales, service, customers, and staff, with the lead flow still at its centre.",
  ], [
    { heading: "Where it started", paragraphs: [
      "The lead hub was a dense table under a row of numbers nobody could act on: “Not the Owner”, “Another Workshop”.",
      "Every row looked the same, the send button was the loudest thing on the page, and nothing said who to call first.",
      "Its strongest idea, filtering customers and sending a batch to the dealer app, was worth keeping. The rest needed rethinking.",
    ], media: [
      { source: "/Projects/dealership-hub-old-lead-hub.webp", label: "The old lead hub this replaces", width: 1400, height: 1004 },
    ] },
    { heading: "Start with what needs doing", paragraphs: [
      "The hub opens on the three things worth doing first, each with its reason: a customer waiting in the lounge, six leads never contacted.",
      "Sales, workshop, issues, and team follow as one line each, and a shared to-do list stays alongside.",
      "Picking one drafts the question for you — who should I call first? — ready to send or edit.",
    ], media: [
      { source: "/Projects/dealership-hub-hub-light.webp", label: "The hub, opening on the day’s first three things", width: 2880, height: 2064 },
    ] },
    { heading: "Ask instead of hunting", paragraphs: [
      "Every page has the same bar at the bottom for plain questions, like what’s running late.",
      "Answers come back as rows that open the job or the customer, not paragraphs to read, with the likely next questions underneath.",
    ], media: [
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
    { heading: "One page per customer", paragraphs: [
      "The directory opens on who needs attention — follow-ups, an advisor on leave, an unbooked recall — before the list itself.",
      "A customer’s page holds their cars, bookings, staff notes, and the conversation side by side, so nobody asks them the same thing twice.",
    ], media: [
      { source: "/Projects/dealership-hub-customers-light.webp", label: "The customer directory", width: 2880, height: 2064 },
      { source: "/Projects/dealership-hub-customer-profile.webp", label: "A customer profile with bookings and messages", width: 2880, height: 2064 },
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
    "I was the sole product designer for Protector’s booking experience on iPhone.",
    "The flow brings the people, the protectors’ attire, and the convoy into one request.",
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
  "twilio-admiral": study("Showing each team only what’s theirs", [
    "Admiral is the internal platform Twilio’s engineers use to deploy and run their services.",
    "I joined to iterate on its pipelines feature. The research turned it into a redesign of how the whole platform is organized.",
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
      { source: "/Projects/twilio-admiral-hierarchy.webp", label: "Flat hierarchy versus contextual hierarchy", width: 1600, height: 729 },
    ] },
    { heading: "Start from your team", paragraphs: [
      "A Team › Roles switcher replaced the long list from top to bottom. By default you see your own team’s deployments, pipelines, and dashboards.",
      "Editing a team’s access policy went from six steps to three.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/twilio-admiral-team-switcher.webp", label: "Switching team and role from the header", width: 1600, height: 693 },
      { source: "/Projects/twilio-admiral-access-flow.webp", label: "Editing an access policy, before and after", width: 1600, height: 612 },
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
      { source: "/Projects/twilio-admiral-icons.webp", label: "The Admiral icon set", width: 1600, height: 896 },
    ] },
  ]),
  "moodys-design-sprints": study("Five sprints toward a new Moodys.com", [
    "Moody’s internal teams took a long time to agree on change, and the research platform had grown without direction.",
    "We used design sprints to get there faster: one five-day sprint, then four that ran a month each.",
  ], [
    { heading: "Five days, one tested idea", paragraphs: [
      "Each sprint started with agreed goals, questions, and assumptions. Workshops gathered everyone’s input before anything was decided.",
      "Sketches came on Tuesday and decisions on Wednesday. I designed the prototype on Thursday, and four users tested it on Friday.",
    ], media: [
      { source: "/Projects/moodys-sprint-week.webp", label: "The sprint week", width: 1024, height: 576 },
      { source: "/Projects/moodys-journey-map.webp", label: "Mapping how analysts find research", width: 1600, height: 927 },
    ] },
    { heading: "Research that reads at a glance", paragraphs: [
      "Designed issuer pages for financial analysts and asset managers. They put credit ratings, outlooks, and ESG scores in one header, with commentary beside each score.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/moodys-esg.webp", label: "ESG performance for asset managers", width: 1600, height: 1000 },
      { source: "/Projects/moodys-company-overview.webp", label: "A company overview with news, ownership, and key ratios", width: 1600, height: 1230 },
    ] },
    { heading: "Dense data, still readable", paragraphs: [
      "Built key-indicator tables that turn into charts, with peer comparison and annotations, for people who work in spreadsheets all day.",
    ], media: [
      { source: "/Projects/moodys-key-indicators.webp", label: "Key indicators, from table to chart", width: 1600, height: 783 },
    ] },
    { heading: "Month by month", paragraphs: [
      "Over the next four sprints we explored alternatives and iterated on what testing had shown, from a modular header to peer comparison.",
      "The testing went well enough that our team was asked to design the new Moodys.com.",
    ], mediaLayout: "stack", media: [
      { source: "/Projects/moodys-iterations.webp", label: "A modular header and an alternative", width: 1600, height: 981 },
      { source: "/Projects/moodys-peer-comparison.webp", label: "Comparing an issuer’s ESG scores with its peers", width: 1600, height: 1032 },
    ] },
  ]),
  "onit-process-builder": study("Document logic lawyers can build themselves", [
    "Process Builder lets legal teams decide what happens when a transaction or matter changes, without writing code.",
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
    "Turtle was a chat app that helped high school and college students start conversations with classmates without being judged.",
    "A friend and I started it as sophomores. I was the founding designer and co-led the product.",
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
} satisfies Record<string, ProjectCaseStudy>
