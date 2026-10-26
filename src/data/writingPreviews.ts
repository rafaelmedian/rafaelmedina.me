import type { WritingId } from "./writingIds"
import { writingFields } from "./writingIndex"

// The three miniature pages on the folder. The full articles reuse these
// fields, so the lightweight preview stays in step without copying content.
// The name and the date come off the index the whole site reads a note's
// heading from, so the miniature cannot drift from the article it previews.
export const writingPreviews = [
  {
    ...writingFields("project-context-in-markdown"),
    paragraphs: [
      "I'm writing a lot more Markdown files lately. Stuff I'd have put in Linear, or next to the design system in Figma, now lives in files called `PROJECT_STATUS.md` and `DESIGN_QA.md`. I never decided to change how I work. I just kept needing a place for things both I and an agent could read.",
      "A task needs some history. A design decision needs a reason. A bug needs a note about what was supposed to happen. When that's spread across five tools, I end up copying it between them. The files started as a way to stop doing that.",
      "It's a pretty boring fix. A heading, a few sentences, a list of what's still open. Enough to pick the work back up without rebuilding the whole conversation in my head.",
    ]
  },
  {
    ...writingFields("ai-design-needs-control"),
    paragraphs: [
      "Building a site with only Claude is wild when you already have the Figma file open. You know exactly what you want. The layout, the spacing, how it all fits together, it's right there. And getting the code to match it still takes a lot of back and forth.",
      "On X I put it as three stretches: the first 60% flies, the next 30% is ages of saying 'no, not like that,' and the last 10% feels like god mode. I made those numbers up, they're a feeling. What gets me is how fast it swings from amazing to infuriating and back.",
      "Once the structure is right, changes are almost instant. Before that, every small request turns into explaining the layout again. I always get stuck in the middle part.",
    ]
  },
  {
    ...writingFields("building-it-yourself-isnt-free"),
    paragraphs: [
      "Whenever someone says you can just build the tool yourself now, I have two reactions. First, excitement, because a lot more of those ideas are doable now. Second, a small accounting question: what are we counting as the cost?",
      "In a reply I drafted, I listed tokens, time, and running costs. Pretty boring objection to a very exciting idea. Being able to make the thing doesn't mean I want to be on the hook for it.",
      "The answer keeps moving. Something too expensive or annoying to build today could be an easy afternoon project next year. Something that looks cheap in a demo can quietly eat a chunk of your week.",
    ]
  }
] satisfies { id: WritingId; title: string; paragraphs: string[] }[]
