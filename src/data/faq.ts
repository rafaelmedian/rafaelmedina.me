export type FaqEntry = {
  question: string
  answer: string
}

/** The questions that arrive in the first reply to an enquiry, answered where
    the engagement shapes are rather than in an email nobody else reads. No
    figure is published: the rate is weekly or monthly, and what it comes to
    depends on the scope and duration we estimate before starting. A client who
    wants one number to approve gets the scope quoted as a single figure, paid
    monthly across the agreed timeline. */
export const faq: FaqEntry[] = [
  {
    question: "What does it cost?",
    answer:
      "Engagements are billed by the week or by the month, not by the deliverable. We start by estimating the scope and how long it will take, and the total follows from that. If you would rather have one number to approve, I quote the whole scope as a single figure and you pay it monthly across a timeline we set before the work starts. Tell me what you are building and roughly when you need it, and I will come back with both.",
  },
  {
    question: "How long does it take?",
    answer:
      "A sprint or audit runs one to two weeks and ends on a date we agree before it starts. End-to-end product work is measured in months, and how many depends on how much is still open at kickoff. You get that number in the proposal, not in a conversation after we have started.",
  },
  {
    question: "Do you write code as well?",
    answer:
      "Yes. I studied computer science and shipped front-end full time for years before I moved into design: React, TypeScript, the CSS and the motion. What is different now is a swarm of agents behind a tight end-to-end suite, which is what lets one person carry the work from the first sketch to production. This site is mine end to end. Your backend is not, and I work next to the engineers who own it.",
  },
  {
    question: "What do you need from me?",
    answer:
      "One person who can make decisions, access to the people who use the product, and about an hour a week. You do not need a spec written first: working out what to build is most of what you would be hiring me for.",
  },
  {
    question: "How do we work day to day?",
    answer:
      "A shared Slack or Telegram channel, and reviews when there is something worth reviewing instead of a standing meeting. I am on Atlantic time in Punta Cana, which covers the US East Coast almost exactly and most of the European afternoon.",
  },
]
