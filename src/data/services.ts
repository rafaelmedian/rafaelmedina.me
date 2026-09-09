export type Service = {
  /** Engagement shape, set in the About sheet's left column where the résumé
      entries carry their dates — so the two stacks read as siblings. */
  shape: string
  title: string
  description: string
  /** Published figure for this engagement. Everything is quoted per scope
      today, so none carry one; setting it renders a price line under the
      description without any other change. */
  price?: string
}

export const services: Service[] = [
  {
    shape: "0 → 1",
    title: "End-to-end product design",
    description:
      "One designer owning the problem from the first user interview to the shipped screen: discovery, research, UX and UI, and the coded prototypes your engineers build against. The shape of the Matcha rebuild and of BoldVoice.",
  },
  {
    shape: "Monthly",
    title: "Fractional to full-time design partner",
    description:
      "A standing seat on a team with no in-house designer, a few days a week or full time when the roadmap needs it. New surfaces as they come up, review on what your engineers are already building, and a design system that keeps its shape between the two.",
  },
  {
    shape: "1 – 2 weeks",
    title: "Design sprint and UX audit",
    description:
      "Fixed scope, fixed date. I talk to your users, take apart the product you have today, and come back with a ranked list of what it is costing you and a direction for each one.",
  },
]
