export type ProcessStep = {
  /** Left column of the entry grid, where the résumé carries dates and
      Services carries an engagement shape: here it is the step's place in the
      run, numbered the way the table of contents numbers the page. */
  step: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Kickoff",
    description:
      "One conversation about the business before anything about the interface: what the product has to do, who it is losing today, and what has to be true in six months for this to have been worth it. I leave with the goal we are designing against and the constraints I have to design inside.",
  },
  {
    step: "02",
    title: "Research",
    description:
      "I talk to the people who actually use the thing, and read what the product already knows: support threads, session recordings, the last three attempts at this. It is usually a week, and it is the cheapest week in the project, because most of what it produces is a list of things not to build.",
  },
  {
    step: "03",
    title: "Directions",
    description:
      "You see work inside the first two weeks and it is deliberately unfinished. Two or three directions that disagree with each other, so the decision is about which problem we are solving rather than which shade of blue. Polish is cheap once the direction is right and expensive before.",
  },
  {
    step: "04",
    title: "Prototype",
    description:
      "Once a direction holds I build it: real components, real data, real states. A working interaction settles questions a static mockup can only argue about, which is how the empty state, the error and the timing get designed instead of discovered in QA.",
  },
  {
    step: "05",
    title: "Ship",
    description:
      "I stay through implementation, reviewing builds, fixing what only shows up on a real device, and leaving your engineers components and rules they can keep building on. The engagement ends when the work is in production, not when the file is tidy.",
  },
]
