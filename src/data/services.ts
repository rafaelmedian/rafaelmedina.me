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
      "Discovery, research, UX and UI through to shipped screens. The shape of the Matcha rebuild and BoldVoice: one designer owning the problem from the first interview to what ships.",
  },
  {
    shape: "Monthly",
    title: "Fractional to full-time design partner",
    description:
      "A standing engagement for a team without an in-house designer — a few days a week, or full time when the roadmap needs it: new surfaces, design review, and a system your engineers can keep building on after I step back.",
  },
  {
    shape: "1 – 2 weeks",
    title: "Design sprint and UX audit",
    description:
      "A fixed engagement: user research, a teardown of the product you have today, and a direction you can start building against at the end of it.",
  },
]
