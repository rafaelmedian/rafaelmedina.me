import { writingPreviews } from "./writingPreviews"
import { writingFields, type WritingCategory } from "./writingIndex"
import type { WritingId } from "./writingIds"
import { portfolioCards } from "./portfolio"

export type WritingImage = {
  sourceUrl?: string
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

export type WritingTool = {
  package: string
  sourceUrl: string
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
// article and starts reading the margin. Where the reader floats a note's
// contents in the left gutter, a note written for that side hangs right.
export type WritingAnnotation = {
  text: string
  /** Zero-based paragraph within the block the note is pinned beside. */
  at: number
  place?: "left" | "right"
}

export type Writing = {
  id: WritingId
  title: string
  category: WritingCategory
  cover?: WritingImage
  paragraphs: string[]
  annotations?: WritingAnnotation[]
  image?: WritingImage
  code?: WritingCode
  /** An installable skill or utility presented inside the article. */
  tool?: WritingTool
  /** A curated list of resources, shared by the reader and static page. */
  links?: { title: string; href: string; description: string; favicon: string }[]
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
    ...writingFields("skills-i-reach-for"),
    paragraphs: [
      "The skills I keep installed for work with coding agents. Most of them are about interface details. The last one is mine, and it's about getting a change through review.",
    ],
    links: [
      {
        title: "Craft",
        favicon: "/writings/favicons/craft.png",
        href: "https://craft.gustavofior.com/",
        description: "Design engineering details for typography, layout, and motion.",
      },
      {
        title: "Superpowers",
        favicon: "/writings/favicons/github.png",
        href: "https://github.com/obra/superpowers",
        description: "Makes the agent plan, test, and review before it calls something done.",
      },
      {
        title: "Make Interfaces Feel Better",
        favicon: "/writings/favicons/jakub.png",
        href: "https://github.com/jakubkrehel/make-interfaces-feel-better",
        description: "Polish alignment, typography, shadows, and interactions.",
      },
      {
        title: "Transitions",
        favicon: "/writings/favicons/transitions.png",
        href: "https://transitions.dev/",
        description: "Build transitions and fine-tune their motion.",
      },
      {
        title: "Interface Craft",
        favicon: "/writings/favicons/interface-craft.png",
        href: "https://www.interfacecraft.dev/",
        description: "Storyboards, design critique, and live animation controls.",
      },
      {
        title: "Fixing Motion Performance",
        favicon: "/writings/favicons/ibelick.png",
        href: "https://github.com/ibelick/ui-skills",
        description: "Find and fix sluggish UI animations.",
      },
      {
        title: "Emil’s Design Engineering",
        favicon: "/writings/favicons/emil.png",
        href: "https://emilkowal.ski/skill",
        description: "Emil's notes on interfaces and motion, packaged for an agent.",
      },
      {
        title: "Review-ready PRs",
        favicon: "/favicon-32.png",
        href: "https://github.com/rafaelmedian/skills/tree/main/skills/review-ready-prs",
        description: "Commits, PR description, and screenshots someone can actually review.",
      },
    ],
  },
  {
    ...writingFields("review-ready-pull-requests"),
    tool: {
      package: "rafaelmedian/skills@review-ready-prs",
      sourceUrl: "https://github.com/rafaelmedian/skills/tree/main/skills/review-ready-prs",
    },
    paragraphs: [
      "A pull request is usually the last place the work still makes sense. The branch knows what I tried, what broke, and which check finally passed. Once it merges, most of that is gone, unless the commits and the PR description kept it.",
      "I want someone to understand the change before they open the diff. What changed, why, and how do I know it works. That speeds up the review, sure. The bigger payoff comes months later, when that PR is the only record of why the code looks the way it does.",
      "So I wrote it down as a skill, `review-ready-prs`. It reads the repo's own instructions first. Then it helps the agent split the commits, write the description, and put screenshots and test results where a reviewer will see them.",
    ],
    annotations: [
      { at: 0, place: "right", text: "The diff never says why" },
    ],
    sections: [
      {
        heading: "Three ways to use it",
        paragraphs: [
          "For a visual fix, try: `Use review-ready-prs to prepare this mobile toolbar fix for review. Capture the same viewport before and after, explain the alignment change, and report the checks that actually ran.` You should be able to compare the two screenshots and get it without pulling the branch.",
          "For a refactor, try: `Use review-ready-prs to separate this data-loading refactor from the behavior change. Explain the old and new request paths, and keep each commit independently reviewable.` Here a tiny flow diagram beats a screenshot of a page that looks the same.",
          "For a branch that is already finished, try: `Use review-ready-prs to audit this branch and draft its PR description. Match the summary to the commits, identify missing evidence, and do not push or rewrite history.` I use this one at the end, as a last check before I ask anyone to look.",
        ],
      },
      {
        heading: "A small fix on GitHub",
        paragraphs: [
          "The Back-button fix in the notes reader is a small one. The description says what looked wrong, keeps the layout fix and the regression test as separate changes, and reports the targeted test passing next to the failures in the full suite. I'd rather the reviewer see those failures than find them.",
          "These are real PRs from this site. They show the format. The skill didn't write them; it came after.",
        ],
        image: {
          src: "/writings/review-ready-prs/github-small-fix.webp",
          alt: "GitHub PR 190 description with two numbered changes and verification that distinguishes the passing targeted test from failures in the full suite.",
          width: 1268,
          height: 514,
          caption: "Read PR #190: the layout fix, its regression test, and the verification results.",
          sourceUrl: "https://github.com/rafaelmedian/rafaelmedina.me/pull/190",
        },
      },
      {
        heading: "A larger change on GitHub",
        paragraphs: [
          "The photo-wall PR is bigger. It opens with what the finished interaction does, then lists the changes in the order they landed: framing, layout, gestures, tests. You can review each one on its own instead of digging through one long summary.",
          "Today I'd also ask for a short recording of opening, panning, and closing the wall. You can't tell from a commit list whether a gesture feels right.",
        ],
        image: {
          src: "/writings/review-ready-prs/github-feature.webp",
          alt: "Excerpt of GitHub PR 194 showing the photo-wall overview followed by changes listed in commit order.",
          width: 1268,
          height: 1100,
          caption: "Read PR #194: an excerpt of the photo-wall overview and ordered changes.",
          sourceUrl: "https://github.com/rafaelmedian/rafaelmedina.me/pull/194",
        },
      },
      {
        heading: "The story starts in the commits",
        paragraphs: [
          "If I can't name a commit in one line, it's probably two commits. The title says what it does. The body says what was wrong, and if a measurement or a failing test forced the change, that goes in too. `Fix styles` tells you nothing.",
          "Order matters too. The refactor that makes room for a feature lands before the feature. Generated files go in with the change that generated them. And every commit should make sense on its own, without the reader needing half of the next one to follow it.",
          "Get that right and the PR description mostly writes itself. It walks through the commits in order and explains each one.",
        ],
      },
      {
        heading: "Put the proof next to the explanation",
        paragraphs: [
          "If the change is visual, show it. Before and after screenshots at the same size, or a short recording when timing, focus, or scrolling is the point. Nobody should have to check out a branch to find out whether the card moved.",
          "Changes you can't see still get a picture. A rough ASCII sketch of where a request goes now, or which file generates which, is enough. It doesn't need to be pretty. It needs to use the same names as the code.",
          "And it goes in the PR, not on my laptop. “Screenshots coming” doesn't count. If the agent can't upload them, the skill leaves the PR as a draft with the files ready for me to drop in.",
        ],
      },
      {
        heading: "A checklist should still sound like a person",
        paragraphs: [
          "A template can make every PR sound the same, and I don't want fifty descriptions that open with “This PR improves the experience of.” Use the actual names from the work. Say what the tradeoff was. List the checks that really ran, and if one failed, say so. That's worth more than a clean “all verified.”",
          "It also won't rewrite history, push, open a PR, or mark a draft ready unless you asked for that. A nice description isn't worth much if the agent did something else while writing it.",
          "It's the first thing in a small public library, and the wording will keep changing as I use it. That's why it's a skill and not a paragraph I paste into every repo. I fix it once, and each project still keeps its own rules.",
        ],
        annotations: [
          { at: 2, place: "left", text: "Its first real test was this PR" },
        ],
      },
    ],
    acknowledgements: "The skill came out of how I write commits and PRs on this site. The examples are generic on purpose, so your repo can keep its own voice.",
  },
  {
    ...writingPreviews[0],
    acknowledgements: "From my own draft. `PROJECT_STATUS.md` and `DESIGN_QA.md` are the two files I actually keep for this site.",
    // Source: supplied draft screenshot, 01.19.00; PROJECT_STATUS.md and DESIGN_QA.md.
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
          "An agent can read a component and see how it's built. It can't see why. The odd spacing might be on purpose. The screen might be an experiment. The thing that looks unfinished might be waiting on a decision, and polishing it now is wasted work.",
          "That's what I write down. The status file says what's settled and what's still open. The design QA file lists what feels off in the real interface. A few lines about the design system stop the next change from inventing a fourth version of the same button.",
          "And I read these files too. I don't want instructions that only make sense to an agent. If I open a project after two weeks away and the file reminds me what I was thinking, it already earned its place.",
        ],
      },
      {
        heading: "A file can become another place to forget things",
        paragraphs: [
          "A file doesn't stay true on its own, though. A status file describing last week is worse than none. It has a confident name and it sounds sure of itself, so someone will believe it. Usually the agent.",
          "Every new file is a small chore. Two files describing the same decision will eventually disagree. And if every passing thought turns into a rule, the project gets harder to understand, not easier.",
          "I'd rather keep a short note about what we decided than a long log where every dead end looks as important as the current plan. History is fine. It just has to be obvious which parts still apply.",
        ],
      },
      {
        heading: "Use the format that helps the next step",
        paragraphs: [
          "I haven't given up on canvases or task trackers. Sometimes one picture saves three paragraphs. A team needs somewhere to assign work and see who's blocked. A folder of text files is bad at both.",
          "But for the context I keep repeating, a small file next to the code is where I start now. I can edit it mid-task, and the next session doesn't start from zero.",
          "Before I add another one, I ask what it'll help me or the agent understand next time. If I can't answer that, I don't make the file.",
        ],
        annotations: [
          { at: 0, place: "left", text: "Kept Linear for the team parts anyway" },
        ],
      },
    ],
  },
  {
    ...writingPreviews[1],
    acknowledgements: "From two of my posts on X and a draft I wrote around the same time. It's my own Figma-to-code workflow. I'm not saying anyone else works this way.",
    // Sources: supplied draft screenshot, 01.18.48, and Rafael's public posts:
    // https://x.com/rafaelmedian/status/2020873645401276488
    // https://x.com/rafaelmedian/status/2020875883116937589
    annotations: [
      { at: 0, place: "right", text: "And I still typed three paragraphs describing it" },
    ],
    sections: [
      {
        heading: "Close is a difficult place to work from",
        paragraphs: [
          "A rough first version is easy to love. There was nothing, and now there's a page. Almost right is harder. Now you see everything that's slightly off: a panel that's too wide, a heading that wraps too early, a mobile layout that fits but reads in the wrong order.",
          "None of that is unusual design work. In Figma I'd just grab the thing and move it. In a chat I have to describe it, describe what I want instead, and then check nothing else moved. Asking takes a sentence. Checking takes ten minutes.",
          "That's why I said vibe coding feels like bowling. Some throws are perfect. Some miss in ways I couldn't have predicted. When I know exactly what I want to change, I don't want the suspense.",
        ],
      },
      {
        heading: "Getting connected is only the beginning",
        paragraphs: [
          "In one draft I called this 'MCP hell.' I was going from v0 to Claude Code, and most of my time went into getting the layout and structure to match Figma. After that, iterating was fast. Getting there was what cost me.",
          "So I don't get too excited when two tools can finally talk to each other. Sure, the agent can read the design now. Knowing which parts of it have to survive in the browser is a different problem, and I'm still the one explaining that.",
          "What I want is to fix one thing and leave the rest alone. Move this. Keep that. Show me what happened on mobile. The speed only helps if I can say that directly.",
        ],
      },
      {
        heading: "I want both speeds",
        paragraphs: [
          "In that post I said I'd use Framer for structure and AI for shaders, animation, and trying ideas. That was me being annoyed that week. It isn't a rule for anyone else's workflow.",
          "It could flip. Visual tools might get better at steering generation. Agents might let me point at part of the page and change just that. Either one fixes my problem.",
          "I want to ask for a whole page and then nudge one detail, in the same place. Then I could spend my time deciding what feels right, instead of explaining why the last try still doesn't.",
        ],
        annotations: [
          { at: 1, place: "left", text: "Less sure about this than I was in July" },
        ],
      },
    ],
  },
  {
    ...writingPreviews[2],
    acknowledgements: "From a reply I drafted about tokens, time, and running costs. The math is mine, and it changes every time the tools do.",
    // Source: supplied draft screenshot, 01.19.00; reply about tokens, time, and running costs.
    annotations: [
      { at: 1, place: "right", text: "I always forget the upkeep" },
    ],
    sections: [
      {
        heading: "The first working version has a very good sales pitch",
        paragraphs: [
          "A small tool that does exactly what you asked for is hard to argue with. No screens you never open. You can reword it, drop a step, lay it out the way you work. And you don't have to wait for someone else's roadmap.",
          "But the first version is when you know the least about living with it. Say it pulls data from some other service. Getting that onto a page is easy. Then the API changes, or the data shows up late, or a number looks wrong and you have to figure out why.",
          "That doesn't make it a bad idea. It just belongs in the math. If I only compare the subscription to what the first version cost me in tokens, I'm leaving out most of the work I'm signing up for.",
        ],
      },
      {
        heading: "Your attention belongs in the calculation",
        paragraphs: [
          "Time is easy to ignore when building is fun. An evening messing with a tool can be worth it on its own. Not every experiment has to save money. Learning something and having fun are good enough reasons.",
          "Replacing something I rely on is different. If it's part of my daily work, fixing it eats into that work. Even a quick fix means noticing it broke, remembering how I built it, and checking the fix holds.",
          "When I pay for a product, part of what I'm paying for is that it's someone else's problem when it breaks. They don't always handle it well, but that's what the price is for. The comparison only works if I count that.",
        ],
      },
      {
        heading: "Make the decision small enough to revisit",
        paragraphs: [
          "For something small and just for me, I'll happily build it and see if I keep using it. I'm not rebuilding a whole product, just trying an idea. If it needs constant babysitting, now I know.",
          "I ask what happens if I stop maintaining it. Can I get my data out? Can I go back to what I used before? If it breaks, does something important stop, or did an experiment just end? That decides how much risk I'm fine with.",
          "The math will keep moving as the tools get better. I want to stay open to it without feeling like I have to own everything I could build now. Sometimes building it is a good afternoon. Sometimes paying is how I get the afternoon back.",
        ],
        annotations: [
          { at: 1, place: "left", text: "First question now: can I get my data out" },
        ],
      },
    ],
  },
  {
    ...writingFields("room-to-figure-it-out"),
    acknowledgements: "From a draft about family, distance, and independence. It comes from my own experience and conversations around it. It's not about anyone else's family.",
    // Source: supplied draft screenshot, 01.19.00; reflection on family and independence.
    paragraphs: [
      "I keep thinking about when people first get to figure things out on their own. In a draft I compared the US, where you're kind of expected to leave home for college or work, with parts of Latin America and the Caribbean, where staying close to family is the default.",
      "That's a huge generalization and plenty of people don't fit it. But the question under it stuck with me. How much room does someone get to practice being on their own while they still have people to fall back on?",
      "Moving out is one way to get that room. Not the only one, and where you live says little about how much you're responsible for. What I care about is making a call and then being the one who deals with what happens next.",
    ],
    annotations: [
      { at: 0, place: "right", text: "My cousins and I answered this differently" },
    ],
    sections: [
      {
        heading: "Everyday decisions are practice",
        paragraphs: [
          "Most independence is boring. Planning your week. Figuring out how to get somewhere. Calling to make the appointment you've been putting off. Deciding what to spend on when the money doesn't cover everything. None of it is a milestone. It's just practice using your own judgment, over and over.",
          "If someone always steps in before it gets uncomfortable, you miss that practice. The help comes from love. It still leaves you less ready for the day nobody's around to take over.",
          "That's what I was trying to say in the draft. A family can care a lot and still make it hard to try something new. Protecting someone from harm slowly turns into protecting them from not knowing how things will go.",
        ],
      },
      {
        heading: "Leaving is not equally available to everyone",
        paragraphs: [
          "I don't want moving out at eighteen to be a test of who's ambitious or grown up. Whether you can leave depends on money, where the jobs are, and who needs you at home. Two people can choose differently for equally good reasons.",
          "And staying close has a lot going for it. Dinners together. Someone around when you're sick. Seeing people without booking them three weeks out. I don't want a kind of independence that treats all that as something to grow out of.",
          "The difference I care about is between having support and needing permission. You can live with your parents and still run your own life. You can live an ocean away and still feel like every decision needs a sign-off. Distance doesn't settle it.",
        ],
      },
      {
        heading: "Support should leave some room",
        paragraphs: [
          "What I'd want is room to make small mistakes while help is still close. Let them plan the trip, fill out the application, sort out the schedule, or pick something the family wouldn't have picked. Be there when they're stuck, without taking the decision away.",
          "Both sides have to give something. The person learning has to own it, boring parts included. The people helping have to watch them do it differently than they would have. Neither is comfortable, which is probably why this is hard.",
          "There's no right age to leave and no right distance from home. But the room to use your own judgment should keep growing. You should be able to stay close to your family and still become someone they don't have to walk through every step.",
        ],
        annotations: [
          { at: 0, place: "left", text: "Let them book the wrong flight once" },
        ],
      },
    ],
  },
  {
    ...writingFields("a-song-we-all-know"),
    acknowledgements: "From a post of mine on X about the song of the summer. Thanks to everyone who's sent me a track since. Still the best way to find one.",
    // Source: https://x.com/rafaelmedian/status/1940027633594458581
    paragraphs: [
      "I posted that it feels like there's no song of the summer anymore. Everyone's in their own music bubble. A song can be everywhere for you and basically not exist for the person next to you.",
      "Hits still exist. I mean the feeling that we all know the same one. The song you can bring up without pulling out your phone to play it. The first few seconds that make a whole room go “oh!”",
      "I like what the algorithm finds me. I just wonder about the overlap. If everyone gets a better soundtrack of their own, do we lose some of the one we shared?",
    ],
    annotations: [
      { at: 0, place: "right", text: "Asked three friends, got three summers" },
    ],
    sections: [
      {
        heading: "A good recommendation can make your world feel complete",
        paragraphs: [
          "It's really convenient to be handed more of what you already like. You don't need the artist's name or a free evening to dig for an album. The next song shows up, it fits, you keep going. As a product, it's almost effortless.",
          "It also makes your own feed a bad guide to what anyone else is hearing. A track keeps coming up for you, so you figure it's everywhere. Then you bring it up and the other person has never heard it.",
          "Two people can spend the same hours in the same app and come away with totally different ideas of what's big right now. Same platform, barely any of the same music.",
        ],
      },
      {
        heading: "The shared song didn't have to be your favorite",
        paragraphs: [
          "Part of a song of the summer was that you didn't pick it. It was playing at the store, someone put it on at a party, and at some point you just knew it. Maybe you loved it, maybe you were sick of it. Either way, everyone got the reference.",
          "That's not the same as a recommendation that fits my taste perfectly. The shared song is useful even if I'd never save it. People sing along, make jokes about it, and years later it means that one summer.",
          "That had downsides too. When a handful of songs get all the attention, everything else gets less. I'm glad I can find music outside that. I just don't think more choice makes the shared part pointless.",
        ],
      },
      {
        heading: "Leave a little room for someone else's taste",
        paragraphs: [
          "Maybe what I miss isn't big hits. It's how songs used to get to me. A song a friend sends comes with that friend. A playlist for a party has to work for a bunch of people at once. I'm listening for a reason other than “it sounds like the last one you liked.”",
          "I'd like apps to make more room for that. Let me listen through someone else's ears for a while. A shared queue where the weird pick is the point. Anything that gets me out of my own bubble for a bit.",
          "I still want music that feels made for me. I also want the odd song that belongs to a whole room. Sometimes the best part of a track is looking up when it starts and seeing everyone else knows it too.",
        ],
        annotations: [
          { at: 0, place: "left", text: "It arrives with the friend attached" },
        ],
      },
    ],
  },
  {
    ...writingFields("designing-matcha"),
    acknowledgements: "I designed Matcha at the 0x Project with its product, engineering, and research teams. The screens are theirs as much as mine. What I say about them here is just me.",
    cover: { src: "/Projects/shot-small-16-poster.webp", alt: "Matcha discovery homepage with token search and market overview", width: 640, height: 480 },
    paragraphs: [
      "A swap fits in a small box: two tokens, an amount, a button. That box is a small part of a trading product. People still have to find the token, decide they want it, pick a wallet, understand the quote, and figure out what happened after they signed.",
      "I worked on all of that, not only the trade: the homepage, token pages, wallets, the trade module, mobile, and the dark theme. The question I kept asking was pretty basic. What does someone have to remember when they go from this screen to the next one?",
    ],
    annotations: [
      { at: 1, place: "right", text: "The swap box was never the hard part" },
    ],
    sections: [
      {
        heading: "Different reasons to arrive",
        paragraphs: [
          "The homepage has three ways in: search, browsing the market, and connecting a wallet. If you already know the token, you shouldn't have to scroll past a showcase. If you're just looking around, an empty trade form gives you nothing. I led the page structure around those starting points.",
          "That's a real layout problem. Give all three the same weight and the page fights itself. Give one all the space and the others disappear. The first move has to be obvious, and the other two still have to be easy to find.",
        ],
        image: projectImage("preview-shot-16"),
      },
      {
        heading: "The space around the trade",
        paragraphs: [
          "The token page puts market data, the chart, the trade form, and order history on one screen, so you can go from research to trading without leaving. It also means a lot of things want your attention at once. A chart will take all the space you give it, and the quote still has to be readable next to it.",
          "The wallet flow has a quieter detail. You can switch wallets and keep your quote and what you typed. The account and balance change, but the trade you were setting up stays. Nobody notices that until it's missing.",
        ],
        image: projectImage("preview-shot-21"),
      },
      {
        heading: "A system has to survive the awkward states",
        paragraphs: [
          "The main screens are the easy part to show off. A wallet still loading, a token check that hasn't come back, a quote waiting on confirmation, those don't make great portfolio shots. They're still the product, and I designed them along with the pretty ones.",
          "Dark mode had to work everywhere: surfaces, every component state, the charts. On mobile everything had to be reordered, since nothing fits side by side. Keeping it consistent meant a button or a status had to mean the same thing wherever it ended up.",
        ],
        image: projectImage("preview-shot-22"),
      },
      {
        heading: "What the screens can tell you",
        paragraphs: [
          "These images show the structure and the calls I made. They can't tell me if someone felt sure about a trade, or where they hesitated, and I'm not going to pretend a clean screenshot proves that.",
          "What I can show is how the pieces connect. A token you found carries into its page. Switching wallets doesn't wipe the form. The transaction details are there before you sign. That's what I want people to notice. Each screen makes more sense once you see where it leads.",
        ],
        annotations: [
          { at: 0, place: "left", text: "Screenshots can't show hesitation" },
        ],
        image: projectImage("preview-shot-14"),
      },
    ],
  },
  {
    ...writingFields("designing-for-active-traders"),
    acknowledgements: "I designed Matcha Pro at the 0x Project with the product and engineering teams who built and shipped it.",
    paragraphs: [
      "There's a kind of simple UI that looks great in a screenshot: one button, a few numbers, lots of white space. Fine for one focused task. Not so fine when you're checking a chart, an order, a balance, and a live quote over and over.",
      "Matcha Pro puts live charts, token signals, transactions, and order management in one dense workspace. I led the product structure and interaction design. The hard part was the density. More information only helps if people can still find what they came back for.",
    ],
    annotations: [
      { at: 0, place: "right", text: "Great on Dribbble, though" },
    ],
    sections: [
      {
        heading: "Familiar places for changing information",
        paragraphs: [
          "When you use a screen every day, where things are starts doing the job labels did on day one. You learn where your open orders live, where your balance is. If the layout shifts around whichever panel has the most in it, you lose that.",
          "So I kept the layout fixed and put the hierarchy inside it. The numbers change; where they sit doesn't. Dense is fine when related things sit together and each area has one job.",
        ],
        annotations: [
          { at: 0, place: "left", text: "By the fifth visit nobody reads labels" },
        ],
        image: projectImage("preview-shot-23"),
      },
      {
        heading: "Visible doesn't have to mean loud",
        paragraphs: [
          "A chart, a transaction list, and an order form don't all need to shout to be there. Borders, labels, and spacing give each panel its spot without fighting the others. Make everything bold and you've lost the point of putting it all on one screen.",
          "The regular Matcha trade page has the same problem with less on it: quote, chart, balances, open orders, and history in one layout. Either way, the job is deciding what's worth seeing side by side.",
        ],
        image: projectImage("preview-shot-1"),
      },
      {
        heading: "A dedicated workspace is a choice",
        paragraphs: [
          "Putting the advanced tools in Matcha Pro gives them their own place next to the normal swap. That has a cost. Now there are two products to maintain and explain, and people tend to skip that part when they call a pro mode an upgrade.",
          "A denser screen is worth it when the extra stuff helps with what you're doing right now. More panels isn't the goal. The test is whether you can come back with the same question, find the answer, and keep going without hunting for it.",
        ],
      },
    ],
  },
  {
    ...writingFields("quote-to-confirmation"),
    acknowledgements: "I designed the trade module at the 0x Project with its product and engineering teams. The token checks use GoPlus data.",
    cover: { src: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg", alt: "Matcha trade module showing the quote, review, and confirmation interface", width: 1600, height: 1200 },
    paragraphs: [
      "The moment before you sign a transaction needs a little space. Until then you've been filling out a form. Now you're about to act on it. A big confirm button is easy. Explaining what that button commits you to is the actual work.",
      "I owned the quote, fee, route, and transaction states in Matcha's trade module. I also did amount entry and token selection, but here I want to talk about the step from entering a trade to reviewing it.",
    ],
    annotations: [
      { at: 0, place: "right", text: "Up to here it is still just a form" },
    ],
    sections: [
      {
        heading: "Give the numbers a clear meaning",
        paragraphs: [
          "What you're paying, what you'll get back, and the network fee answer different questions. Show them as three identical rows and people have to sort out what matters themselves. Make the secondary stuff too faint and the form looks clean, but you can't really check it.",
          "In the module, cost, route, and what you'll receive are all there before you sign. I wanted two passes. First glance: yes, that's my trade. Second look: the details to check it. And during that second look you shouldn't lose track of which tokens and how much.",
        ],
        annotations: [
          { at: 1, place: "left", text: "Recognize it first, check it second" },
        ],
        image: projectImage("preview-shot-19"),
      },
      {
        heading: "A warning needs room for uncertainty",
        paragraphs: [
          "The GoPlus integration added token checks for source code, tax, minting, and honeypots. I designed the loading, pending, warning, and result states. Those need to look different. A check that hasn't come back yet should never look like a pass.",
          "The checks are extra information right when you're deciding. They shouldn't sound more certain than they are. A row of green checkmarks next to a button looks very official, so the wording and weight matter as much as the warning color.",
        ],
        image: projectImage("preview-shot-20"),
      },
      {
        heading: "Let the review earn its place",
        paragraphs: [
          "An extra step is only worth it if it helps you catch something you'd have missed. If it's just the same form with a new title, people learn to click straight through. Rearrange it too much and now they have to relearn how to read their own trade.",
          "So: keep it familiar, and add a real pause. The trade should still look like your trade. Show what will happen. Make going back easy if something's off. The review worked if you could explain what you're about to approve, even if you end up not approving it.",
        ],
      },
    ],
  },
]
