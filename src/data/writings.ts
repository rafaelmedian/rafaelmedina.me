import type { WritingId } from "./writingIds"
import { portfolioCards } from "./portfolio"

export type WritingImage = {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

// A fenced sample. `language` is the only one the reader can highlight --
// there is one code sample on the site and it is the Markdown the article is
// about, so the highlighter is thirty lines here rather than a parser for
// every language nobody is going to paste.
export type WritingCode = {
  language: "markdown"
  /** One entry per line, so the sample reads as written in the source file. */
  lines: string[]
  caption?: string
}

export type WritingSection = {
  heading: string
  paragraphs: string[]
  annotations?: WritingAnnotation[]
  image?: WritingImage
  code?: WritingCode
}

// Marginalia. A note is a phrase Rafael would have pencilled beside his own
// draft, pinned to the paragraph it belongs to and hanging in the gutter that
// side of the reading column. Keep them short -- a gutter is about twenty
// characters wide -- and keep them rare: two an article, one early and one
// late, one in each gutter. They used to run to five, plus interjections
// dropped between the paragraphs, and at that rate a reader stops reading the
// article and starts reading the margin.
export type WritingAnnotation = {
  text: string
  /** Zero-based paragraph within the block the note is pinned beside. */
  at: number
  place?: "left" | "right"
}

export type Writing = {
  id: WritingId
  title: string
  cover?: WritingImage
  paragraphs: string[]
  annotations?: WritingAnnotation[]
  image?: WritingImage
  code?: WritingCode
  sections?: WritingSection[]
  /** Publication or editorial edition date, YYYY-MM-DD. Project samples use illustrative dates. */
  publishedAt?: string
  /** Year grouping for sample notes without an exact publication date. */
  archiveYear?: number
  /** Sources and credits, printed small and grey at the end of the article. */
  acknowledgements?: string
  href?: string
}

// Personal essays expand Rafael's supplied X drafts and public posts. Each
// carries the date it was written rather than the date this edition shipped:
// they were drafted over the year, and dating them all to one afternoon made
// the archive read as a batch published in an evening instead of a year of
// notes. The project notes below use portfolio scope and illustrative dates.
function projectImage(id: string): WritingImage | undefined {
  const card = portfolioCards.find((entry) => entry.id === id)
  return card ? {
    src: card.previewPoster ?? card.image,
    alt: card.title,
    width: card.previewWidth,
    height: card.previewHeight,
  } : undefined
}

// Curated public selection. Full omitted entries live in docs/archive/writings.md.
export const writings: Writing[] = [
  {
    id: "project-context-in-markdown",
    title: "My project context is moving into Markdown",
    publishedAt: "2026-09-07",
    acknowledgements: "Expanded from my own draft. The file names are this site's: `PROJECT_STATUS.md` and `DESIGN_QA.md` are the two I actually keep.",
    // Source: supplied draft screenshot, 01.19.00; PROJECT_STATUS.md and DESIGN_QA.md.
    paragraphs: [
      "I've found myself creating more Markdown files lately. Things I would have put in Linear, or kept beside a design system in Figma, are ending up in files called `PROJECT_STATUS.md` and `DESIGN_QA.md`. It wasn't a big decision to change my workflow. I just kept needing somewhere to put information that both I and an agent could use.",
      "A task needs a little history. A design decision needs a reason. A bug needs an explanation of what should have happened. When those details are scattered across tools, I become the person carrying them between places. The files started as a way to do less of that.",
      "What interests me is how ordinary the solution is. A heading, a few sentences, a list of things that still need attention. Enough context to pick up the work without reconstructing the whole conversation first.",
    ],
    annotations: [
      { at: 0, place: "right", text: "This one began as a to-do list" },
    ],
    code: {
      language: "markdown",
      caption: "PROJECT_STATUS.md, halfway through a week.",
      lines: [
        "# Portfolio — status",
        "",
        "Updated **7 Sep**. Read this before touching the notes reader.",
        "",
        "## Settled",
        "",
        "- Prose runs at `--text-sm` over a 34rem measure. Don't reopen it.",
        "- Marginalia is two notes an article, one in each gutter.",
        "",
        "## Still open",
        "",
        "- Whether the sheet keeps growing past `56rem` on very wide screens.",
        "- The archive has no empty state. See [design QA](./DESIGN_QA.md).",
        "",
        "> If a new element won't fit the four type steps, change the element.",
      ],
    },
    sections: [
      {
        heading: "The explanation belongs near the work",
        paragraphs: [
          "An agent can inspect a component and see how it's built. That doesn't mean it knows why the component works that way. Maybe the unusual spacing is deliberate. Maybe a screen is an experiment. Maybe something that looks unfinished is waiting on a decision, and polishing it would be wasted effort.",
          "Those are the details I want to write down. A status file can explain what's settled and what is still open. A design QA file can describe what feels wrong in the actual interface. A note about the design system can give the next change some boundaries before another slightly different version of the same button appears.",
          "The useful part is that I can read the same context. I don't want a separate set of instructions that only makes sense to an agent. If I come back to a project and the file helps me remember what I was thinking, it's already doing something valuable.",
        ],
      },
      {
        heading: "A file can become another place to forget things",
        paragraphs: [
          "Of course, adding a document doesn't make it true forever. A status file that describes last week's work can be more confusing than no status file at all. It sounds authoritative. It has a sensible name. Someone will probably believe it.",
          "This is the part I want to be careful about as I keep adding files. Every document creates a small maintenance job. If two files describe the same decision, they can disagree. If every passing thought becomes a rule, the project gets harder to understand instead of easier.",
          "I'd rather have a short explanation of the current decision than a long record that makes every abandoned direction look equally relevant. There can be room for history, but the next person reading should be able to tell which parts still apply.",
        ],
      },
      {
        heading: "Use the format that helps the next step",
        paragraphs: [
          "I still see a reason for a visual canvas and a shared task tracker. A picture can explain a relationship that takes several paragraphs to describe. A team may need a place to assign work and see who is waiting on whom. A folder full of text doesn't automatically do either job well.",
          "For the context I keep repeating, though, a small file is becoming a very comfortable place to start. I can change it while working, keep it close to the implementation, and give the next session something more useful than a blank slate.",
          "The question I'm trying to ask before creating another one is simple: what will this help me or the agent understand next time? If I can answer that clearly, the file probably deserves to exist.",
        ],
        annotations: [
          { at: 0, place: "left", text: "Kept Linear for the team parts anyway" },
        ],
      },
    ],
  },
  {
    id: "ai-design-needs-control",
    title: "AI design needs more control",
    publishedAt: "2026-07-29",
    acknowledgements: "Expanded from two posts of mine on X and a draft written alongside them. The Figma-to-code workflow described here is my own; nothing in it is a claim about how anyone else works.",
    // Sources: supplied draft screenshot, 01.18.48, and Rafael's public posts:
    // https://x.com/rafaelmedian/status/2020873645401276488
    // https://x.com/rafaelmedian/status/2020875883116937589
    paragraphs: [
      "Claude-only web design is wild when you already have a Figma design in front of you. There is very little mystery about what you want. You can see the layout, the spacing, the way the pieces belong together. Getting the code to arrive at that same place can still take a surprising amount of back and forth.",
      "I described it on X as three stretches: the first 60% flies, the next 30% takes ages of saying 'no, not like that,' and the final 10% feels like god mode. Those numbers describe the feeling, not a benchmark. The strange part is how quickly the experience swings from impressive to frustrating and back again.",
      "Once the structure is right, changes can feel almost instant. Before that, even a small request can turn into another round of explaining the layout. That middle stretch is where I keep getting stuck.",
    ],
    annotations: [
      { at: 0, place: "right", text: "And I still typed three paragraphs describing it" },
    ],
    sections: [
      {
        heading: "Close is a difficult place to work from",
        paragraphs: [
          "A rough first version is easy to appreciate. There was nothing, and now there is a page. A version that is almost right asks for a different kind of attention. You start seeing all the relationships that are slightly off: a panel that's too wide, a heading wrapping too early, a mobile layout that technically fits but reads in the wrong order.",
          "These are normal design decisions. In a visual tool, I can often point at the thing and change it. In a conversation, I have to describe the thing, explain the desired result, and then check whether the change affected something else. The request may be short while the verification takes much longer.",
          "That's what I meant when I compared vibe coding to bowling. Some throws land beautifully. Others miss in a way I didn't expect. When I know exactly what I want to adjust, I'd like a little less suspense.",
        ],
      },
      {
        heading: "Getting connected is only the beginning",
        paragraphs: [
          "In one of my drafts I called this 'MCP hell.' I'd been working through a v0-to-Claude Code workflow, and it felt like most of my time went into matching the layout and structure from Figma. Once that barrier was crossed, iteration opened up. Getting across it was the expensive part.",
          "That experience makes me cautious about judging a workflow by whether two tools can talk to each other. Access to the design is useful. Understanding which relationships need to survive in the browser is another problem. A connection can carry information while leaving me with plenty of explaining to do.",
          "What I want is the ability to make a precise correction and keep the surrounding decisions intact. Move this. Preserve that. Show me what changed at the smaller size. The more directly I can express those intentions, the more useful the speed becomes.",
        ],
      },
      {
        heading: "I want both speeds",
        paragraphs: [
          "My preference in that post was to use Framer for structure and AI for things like shaders, animation, and exploring ideas. That was a response to the friction I was feeling. I wouldn't turn it into a permanent rule about which tool belongs in every designer's workflow.",
          "The balance can change. A visual tool might make generation easier to steer. An agent might give me a better way to select and adjust a specific part of the page. Either would help with the same frustration.",
          "I want the speed of asking for a whole possibility and the precision of adjusting one small detail. The exciting moment is when those two things happen in the same workflow, and I can spend more time deciding what feels right than explaining why the last attempt still doesn't.",
        ],
        annotations: [
          { at: 1, place: "left", text: "Less sure about this than I was in July" },
        ],
      },
    ],
  },
  {
    id: "building-it-yourself-isnt-free",
    title: "Building it yourself still costs something",
    publishedAt: "2026-06-16",
    acknowledgements: "Expanded from a reply I drafted about tokens, time, and running costs. The accounting is mine, and it changes every time the tools do.",
    // Source: supplied draft screenshot, 01.19.00; reply about tokens, time, and running costs.
    paragraphs: [
      "Whenever someone says you can just build a tool yourself now, I have two reactions. The first is excitement, because more of those ideas are becoming possible. The second is a small accounting question: what are we including in the cost?",
      "In a draft reply, I listed tokens, time, and running costs. It was a fairly ordinary objection to a very exciting possibility. Being able to make the thing doesn't settle whether I want to be responsible for it.",
      "I think the decision will keep moving. Something that is too expensive or frustrating to build today might become a reasonable afternoon project later. Something that looks cheap in a demo might become a surprisingly demanding part of your week.",
    ],
    annotations: [
      { at: 1, place: "right", text: "I always forget upkeep" },
    ],
    sections: [
      {
        heading: "The first working version has a very good sales pitch",
        paragraphs: [
          "A small tool that does exactly what you asked is persuasive. It doesn't have the extra screens you never use. You can change the wording, remove a step, or arrange the information around your own habits. There is a real appeal in having software that fits without asking someone else to prioritize your request.",
          "But the first version is also the point where you know the least about living with it. Consider a simple tool that pulls information from another service. Getting the information onto a page might be straightforward. What happens when the connection stops working, the data arrives late, or you need to understand a result you didn't expect?",
          "Those questions don't make the project a bad idea. They belong in the decision. If I only compare the subscription price with the cost of generating the first version, I'm leaving out a lot of the work I may be agreeing to do.",
        ],
      },
      {
        heading: "Your attention belongs in the calculation",
        paragraphs: [
          "Time is the cost that's easiest to wave away when building is fun. An evening spent exploring a tool can be worth it on its own. I don't need every experiment to justify itself as a saving. Learning something and enjoying the process are perfectly good reasons to make software.",
          "I do want to distinguish that from replacing something I depend on. If a tool supports my everyday work, maintenance competes with that work. Even a quick fix requires me to notice the problem, remember how the project works, and check that the correction holds up.",
          "Paying for a product can mean paying someone else to carry those concerns. Whether they do that well is another question, but it's part of what the price is supposed to cover. The comparison gets more useful when I include the responsibility on both sides.",
        ],
      },
      {
        heading: "Make the decision small enough to revisit",
        paragraphs: [
          "For a narrow personal need, I'd be more willing to build something small and see whether I actually use it. The scope gives me a way to learn without committing to recreate an entire product. If it turns out to need constant attention, that's useful information too.",
          "I'd ask what happens if I stop maintaining it. Can I get my information out? Can I return to the previous tool? Does a broken version interrupt something important, or does it just mean an experiment has run its course? Those answers change how much uncertainty I'm comfortable taking on.",
          "The incentive will keep shifting as the tools change. I want to stay open to that without treating every new capability as another thing I should now own. Sometimes building is the right use of an afternoon. Sometimes paying for the tool is what gives me the afternoon back.",
        ],
        annotations: [
          { at: 1, place: "left", text: "First question now: can I get my data out" },
        ],
      },
    ],
  },
  {
    id: "room-to-figure-it-out",
    title: "Room to figure it out",
    publishedAt: "2026-05-21",
    acknowledgements: "Expanded from a draft about family, distance, and independence. It is written from my own experience and the conversations behind it, not as a description of anyone else's family.",
    // Source: supplied draft screenshot, 01.19.00; reflection on family and independence.
    paragraphs: [
      "I've been thinking about when people get their first real opportunity to figure things out on their own. In a draft, I compared the expectation of leaving home for college or work in the US with the stronger expectation of staying close to family in parts of Latin America and the Caribbean.",
      "That's a broad comparison, and there are plenty of lives it doesn't describe. Still, the question underneath it interests me: how much room do we give someone to practice independence while they still have support?",
      "Moving out is one way to get that room. It isn't the only one, and an address doesn't tell you how much responsibility a person carries. What I keep coming back to is the experience of making a decision and being the person who has to deal with what follows.",
    ],
    annotations: [
      { at: 0, place: "right", text: "My cousins and I answered this differently" },
    ],
    sections: [
      {
        heading: "Everyday decisions are practice",
        paragraphs: [
          "A lot of independence is very ordinary. Organizing your time. Working out how to get somewhere. Making an appointment you would rather avoid. Deciding how to spend money when there isn't enough for every option. These aren't dramatic milestones, but they give you repeated chances to use your own judgment.",
          "If someone else always steps in before a decision becomes uncomfortable, you can miss that practice. The help may be generous and well intentioned. It can still leave you less prepared for the moment when nobody is available to take over.",
          "This is the tension I was trying to get at in the draft. A family can offer a lot of care while making it difficult for a young person to try something unfamiliar. The wish to protect someone can extend beyond protecting them from harm and into protecting them from ordinary uncertainty.",
        ],
      },
      {
        heading: "Leaving is not equally available to everyone",
        paragraphs: [
          "I don't want to turn moving out at eighteen into a test of ambition or maturity. Being able to leave depends on what you can afford, where the opportunities are, and what responsibilities you have at home. Two people can make different choices for equally serious reasons.",
          "There is also a lot to value in staying close. Shared meals, help when someone is ill, relationships that don't have to be scheduled weeks in advance. I wouldn't want a version of independence that treats all of that as something to outgrow.",
          "The distinction I'd make is between having support available and needing permission for every meaningful choice. You can live with family and be trusted to run your own life. You can live far away and still feel that every decision requires approval. Distance alone doesn't answer the question.",
        ],
      },
      {
        heading: "Support should leave some room",
        paragraphs: [
          "The balance I'd like to see is room to make manageable mistakes while help is still within reach. Let someone plan the trip, handle the application, solve the scheduling problem, or choose a direction that isn't the family's first preference. Be available when they're stuck without automatically taking the decision away.",
          "That asks for something from both sides. The person learning needs to take responsibility, including for the boring parts. The people helping need to tolerate a process they might have handled differently. Neither part sounds especially comfortable, which may be why the balance is hard to find.",
          "I don't think there is one correct age to leave, or one correct distance to put between yourself and home. I do think there should be increasing room to act on your own judgment. Staying close to the people who care about you ought to leave space for becoming someone they don't have to guide through every next step.",
        ],
        annotations: [
          { at: 0, place: "left", text: "Let them book the wrong flight once" },
        ],
      },
    ],
  },
  {
    id: "a-song-we-all-know",
    title: "A song we all know",
    publishedAt: "2026-04-08",
    acknowledgements: "Expanded from a post of mine on X about the song of the summer. Thanks to everyone who has sent me a track since; it is still the better way to hear one.",
    // Source: https://x.com/rafaelmedian/status/1940027633594458581
    paragraphs: [
      "I posted that it feels like there isn't a song of the summer anymore. Everyone gets their own tailored bubble of music. A song can seem unavoidable in one person's world and barely exist in someone else's.",
      "I don't mean that popular songs have disappeared. I'm talking about the feeling of assuming we all know the same one. The song you can mention without playing a clip first. The opening few seconds that make a whole room react at once.",
      "Personalized discovery gives us plenty to enjoy. The part I'm wondering about is what happens to the overlap. If each of us gets a better soundtrack for ourselves, do we lose a little of the soundtrack we had together?",
    ],
    annotations: [
      { at: 0, place: "right", text: "Asked three friends, got three summers" },
    ],
    sections: [
      {
        heading: "A good recommendation can make your world feel complete",
        paragraphs: [
          "There is something very convenient about being handed more of what you already like. You don't need to know the artist's name or spend an evening looking for a new album. Another song appears, it fits the mood, and you keep listening. As a product experience, that can feel almost effortless.",
          "It also makes your own listening habits a strange guide to what everyone else is hearing. If a track keeps showing up for you, it's easy to assume it's showing up everywhere. Then you mention it to someone whose recommendations have been following a completely different path.",
          "That gap is interesting to me. Two people can spend similar amounts of time in the same app and leave with very different impressions of what is happening in music. Sharing a platform doesn't necessarily mean sharing much of the experience inside it.",
        ],
      },
      {
        heading: "The shared song didn't have to be your favorite",
        paragraphs: [
          "Part of a song of the summer was that you couldn't entirely choose it. It was playing somewhere, someone else put it on, and eventually you knew it. You might have loved it or been completely tired of it. Either way, it became a reference you could share.",
          "I find that different from receiving a recommendation that perfectly matches my taste. The shared song has a social use beyond whether I would save it. It gives people something to recognize, sing along to, joke about, or associate with a particular stretch of time.",
          "There are tradeoffs in that kind of common culture too. A small set of songs getting most of the attention leaves less room for everything else. I like being able to find music outside that narrow selection. I just don't think more individual choice makes the shared part irrelevant.",
        ],
      },
      {
        heading: "Leave a little room for someone else's taste",
        paragraphs: [
          "Maybe what I'm missing is less about the size of a hit and more about how music reaches me. A song sent by a friend comes with that person attached. A playlist someone makes for a gathering has to negotiate several tastes at once. There is a reason to listen that isn't simply that the next track resembles the last one I enjoyed.",
          "I'd like more of those openings in the products we use. A way to step into someone else's listening for a while. A shared queue where the occasional unexpected choice is part of the point. Something that makes the distance between our separate recommendations easier to cross.",
          "I still want to discover music that feels like it was made for me. I also want the occasional song that belongs to a room full of people. Sometimes the best thing about a track is looking up when it starts and seeing that everyone else knows it too.",
        ],
        annotations: [
          { at: 0, place: "left", text: "It arrives with the friend attached" },
        ],
      },
    ],
  },
  {
    id: "designing-matcha",
    title: "Designing Matcha",
    publishedAt: "2026-03-02",
    acknowledgements: "Matcha was designed at the 0x Project, with its product, engineering, and research teams. The screens here are theirs as much as mine; the reading of them is my own.",
    cover: { src: "/Projects/shot-small-16-poster.webp", alt: "Matcha discovery homepage with token search and market overview", width: 640, height: 480 },
    paragraphs: [
      "A swap can fit inside a small rectangle: two tokens, an amount, a button. Designing that rectangle is only part of designing a trading product. Someone still has to find the token, decide whether they want it, choose an account, understand the quote, and work out what happened after they signed.",
      "My work on Matcha covered those surrounding parts as well as the trade itself. I worked on the homepage, token pages, wallets, the trade module, mobile, and the product's dark theme. Looking across them, the question I find most useful is fairly ordinary: what does someone have to remember when they move from here to the next screen?",
    ],
    annotations: [
      { at: 1, place: "right", text: "The swap box was never the hard part" },
    ],
    sections: [
      {
        heading: "Different reasons to arrive",
        paragraphs: [
          "On the homepage, search, market browsing, and wallet connection give people different ways in. A person with a token in mind shouldn't have to browse a showcase first. Someone who is just looking around needs more than an empty trade form. I led the page structure around those different starting points.",
          "That creates a real layout problem. Giving every route equal emphasis makes the page compete with itself. Giving one route all the space makes the others hard to find. The hierarchy has to make a first move obvious while leaving the other doors visible.",
        ],
        image: projectImage("preview-shot-16"),
      },
      {
        heading: "The space around the trade",
        paragraphs: [
          "The token page puts market data, charts, trade controls, and order history together. That lets research lead into a trade without a trip to an unrelated page. It also means more things are asking for attention in the same view. A chart can use almost any amount of space you give it; the quote still needs to be readable beside it.",
          "The wallet flow has a less visible kind of continuity. People can switch wallets while keeping their quote and inputs. The account and balance change, but the work of entering a trade doesn't need to disappear with them. Preserving that work matters just as much to the experience as arranging the panels.",
        ],
        image: projectImage("preview-shot-21"),
      },
      {
        heading: "A system has to survive the awkward states",
        paragraphs: [
          "The main screens are the easiest part of this work to show. A wallet that is still loading, a token check that hasn't returned, or a quote waiting for confirmation is harder to explain in a portfolio image. Those states still belong to the product, and I designed them alongside the more presentable ones.",
          "The dark theme needed the same attention across surfaces, component states, and charts. On mobile, the information had to take a different order because it couldn't all sit side by side. Consistency meant keeping the meaning of a control or a status recognizable as its surroundings changed.",
        ],
        image: projectImage("preview-shot-22"),
      },
      {
        heading: "What the screens can tell you",
        paragraphs: [
          "These images show the structure and the decisions I worked on. They don't tell me whether someone felt confident during a particular trade, or where they hesitated. I wouldn't want to turn a tidy screenshot into evidence for that.",
          "What I can point to is the connection between the pieces: a token carried from discovery into research, a wallet change that preserves the form, and transaction details available before signing. That's the part of this work I want the portfolio to make visible. The individual screens make more sense when you can see what they allow someone to do next.",
        ],
        annotations: [
          { at: 0, place: "left", text: "A tidy screenshot proves nothing here" },
        ],
        image: projectImage("preview-shot-14"),
      },
    ],
  },
  {
    id: "designing-for-active-traders",
    title: "Designing for active traders",
    publishedAt: "2026-02-10",
    acknowledgements: "Matcha Pro was designed at the 0x Project, alongside the product and engineering teams who built and shipped it.",
    paragraphs: [
      "There's a version of interface simplicity that photographs very well: one action, a few numbers, plenty of empty space. It's useful for a focused task. It becomes less convincing when the task involves repeatedly checking a chart, an order, a balance, and a live quote.",
      "Matcha Pro brings live charts, token signals, transactions, and order management into a denser workspace. I led its product structure and interaction design. The density is the interesting part of that work, because adding information only helps if someone can keep finding what they came back for.",
    ],
    annotations: [
      { at: 0, place: "right", text: "Photographs better than it works" },
    ],
    sections: [
      {
        heading: "Familiar places for changing information",
        paragraphs: [
          "In a workspace used repeatedly, position does some of the work that labels do on a first visit. A person can learn where to look for an open order or a balance. If the layout keeps changing to accommodate whichever panel has the most content, that familiarity becomes less useful.",
          "My preference here is for a stable arrangement with a clear hierarchy inside it. The numbers and activity can change while their places stay recognizable. Density becomes easier to read when related details stay together and each region has an identifiable purpose.",
        ],
        annotations: [
          { at: 0, place: "left", text: "By visit five you look, you don't read" },
        ],
        image: projectImage("preview-shot-23"),
      },
      {
        heading: "Visible doesn't have to mean loud",
        paragraphs: [
          "A chart, a transaction list, and an order control don't all need the same visual emphasis to remain available. Borders, labels, and spacing can give a panel a place without making it compete with every other panel. Making everything bold would defeat the reason for putting it together.",
          "The main Matcha trade page has a related problem at a different density: it brings the quote, chart, balances, open orders, and history into one layout. In both cases, the work is deciding which relationships are useful to see at the same time.",
        ],
        image: projectImage("preview-shot-1"),
      },
      {
        heading: "A dedicated workspace is a choice",
        paragraphs: [
          "Keeping advanced tools in Matcha Pro gives them a dedicated home alongside the standard swap experience. That separation has a cost: there are two contexts for the product to maintain and explain. I think it's worth acknowledging that whenever a more specialized interface is presented as an obvious improvement.",
          "A denser screen earns its place when the surrounding information helps with the task in front of someone. The number of panels isn't evidence by itself. I'd judge the workspace by whether the person can return to the same question, find the relevant detail, and continue their work without hunting for it again.",
        ],
      },
    ],
  },
  {
    id: "quote-to-confirmation",
    title: "From quote to confirmation",
    publishedAt: "2025-11-12",
    acknowledgements: "The trade module was designed at the 0x Project with its product and engineering teams. The token checks shown here use GoPlus data.",
    cover: { src: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg", alt: "Matcha trade module showing the quote, review, and confirmation interface", width: 1600, height: 1200 },
    paragraphs: [
      "The moment before signing a transaction deserves some space. Up to that point, a person has been editing a form. Now they're being asked to act on it. A large confirmation button is easy to design; a useful explanation of what that button commits them to takes more care.",
      "I owned the quote, fee, route, and transaction states in Matcha's trade module. The work included amount entry and token selection, but the part I want to talk about here is the handoff from entering a trade to reviewing it.",
    ],
    annotations: [
      { at: 0, place: "right", text: "Up to here it is still just a form" },
    ],
    sections: [
      {
        heading: "Give the numbers a clear meaning",
        paragraphs: [
          "The amount entered, the amount expected back, and the network cost answer different questions. If they all look like equally weighted rows of numbers, a person has to work out the hierarchy for themselves. If the secondary details are made too quiet, the form looks simpler at the expense of being inspectable.",
          "In the module, the cost, route, and received amount are available before signing. I want the review to be readable in two passes: first, enough to recognize the trade; then, enough detail to check it. That second pass needs to be possible without losing track of the token pair and amount that started the flow.",
        ],
        annotations: [
          { at: 1, place: "left", text: "Recognize it first, check it second" },
        ],
        image: projectImage("preview-shot-19"),
      },
      {
        heading: "A warning needs room for uncertainty",
        paragraphs: [
          "The GoPlus integration added token checks covering source code, tax, minting, and honeypot signals. I designed the loading, pending, warning, and result states. That distinction between states matters: a check that hasn't returned should never read like a reassuring result.",
          "I think of these checks as additional information at the point of a decision. Their presentation shouldn't promise more certainty than the result provides. A row of completed checks can look very authoritative, especially next to a button, so the words and visual emphasis need to be as considered as the warning color.",
        ],
        image: projectImage("preview-shot-20"),
      },
      {
        heading: "Let the review earn its place",
        paragraphs: [
          "An extra step is only useful if it helps someone notice something they might otherwise miss. Repeating the form with a new heading can become a habit of clicking through. Changing the arrangement too much creates a different problem: now the person has to learn how to read their own trade again.",
          "The balance I care about is familiarity with a deliberate pause. Keep the transaction recognizable. Bring its consequences into view. Make it easy to go back if something looks wrong. The review has done its job when a person can explain what they're about to approve, even if they decide not to approve it.",
        ],
      },
    ],
  },
]
