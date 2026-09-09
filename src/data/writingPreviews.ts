import type { WritingId } from "./writingIds"

// The three miniature pages on the folder. The full articles reuse these
// fields, so the lightweight preview stays in step without copying content.
export const writingPreviews = [
  {
    id: "project-context-in-markdown",
    title: "My project context is moving into Markdown",
    paragraphs: [
      "I've found myself creating more Markdown files lately. Things I would have put in Linear, or kept beside a design system in Figma, are ending up in files called `PROJECT_STATUS.md` and `DESIGN_QA.md`. It wasn't a big decision to change my workflow. I just kept needing somewhere to put information that both I and an agent could use.",
      "A task needs a little history. A design decision needs a reason. A bug needs an explanation of what should have happened. When those details are scattered across tools, I become the person carrying them between places. The files started as a way to do less of that.",
      "What interests me is how ordinary the solution is. A heading, a few sentences, a list of things that still need attention. Enough context to pick up the work without reconstructing the whole conversation first.",
    ]
  },
  {
    id: "ai-design-needs-control",
    title: "AI design needs more control",
    paragraphs: [
      "Claude-only web design is wild when you already have a Figma design in front of you. There is very little mystery about what you want. You can see the layout, the spacing, the way the pieces belong together. Getting the code to arrive at that same place can still take a surprising amount of back and forth.",
      "I described it on X as three stretches: the first 60% flies, the next 30% takes ages of saying 'no, not like that,' and the final 10% feels like god mode. Those numbers describe the feeling, not a benchmark. The strange part is how quickly the experience swings from impressive to frustrating and back again.",
      "Once the structure is right, changes can feel almost instant. Before that, even a small request can turn into another round of explaining the layout. That middle stretch is where I keep getting stuck.",
    ]
  },
  {
    id: "building-it-yourself-isnt-free",
    title: "Building it yourself still costs something",
    paragraphs: [
      "Whenever someone says you can just build a tool yourself now, I have two reactions. The first is excitement, because more of those ideas are becoming possible. The second is a small accounting question: what are we including in the cost?",
      "In a draft reply, I listed tokens, time, and running costs. It was a fairly ordinary objection to a very exciting possibility. Being able to make the thing doesn't settle whether I want to be responsible for it.",
      "I think the decision will keep moving. Something that is too expensive or frustrating to build today might become a reasonable afternoon project later. Something that looks cheap in a demo might become a surprisingly demanding part of your week.",
    ]
  }
] satisfies { id: WritingId; title: string; paragraphs: string[] }[]
