import { cvEducation, cvExperience } from "./cv"
import { faq } from "./faq"
import { services } from "./services"

const experience = cvExperience.map((entry) => {
  const highlight = Array.isArray(entry.highlight) ? entry.highlight.join(" ") : entry.highlight
  return `${entry.dates}: ${entry.role} at ${entry.company}, ${entry.location}. ${highlight}`
}).join("\n")

const education = cvEducation.map((entry) =>
  `${entry.dates}: ${entry.credential} at ${entry.school}, ${entry.location}. ${entry.details ?? ""}`,
).join("\n")

const serviceList = services.map((service) =>
  `${service.title} (${service.shape}): ${service.description}`,
).join("\n")

const commonQuestions = faq.map((entry) => `${entry.question}\n${entry.answer}`).join("\n")

/** Server-only grounding assembled from the same sources that render the site. */
export const profileChatContext = `
Rafael Medina is a senior product designer and front-end builder based in Punta Cana, Dominican Republic. He works remotely on Atlantic time. He has about ten years of experience across web3, fintech, and consumer products. His contact email is hey@rafaelmedina.me and calls can be booked at https://cal.com/rafaelmedian/30min.

Current and previous work:
${experience}

Education:
${education}

Ways to work together:
${serviceList}

Common questions:
${commonQuestions}

Selected work on the site includes a redesign of Matcha.xyz, Matcha's multi-wallet flow, token pages, mobile trading, rewards and referral flows, a family-story product, a dealership lead hub, and a privacy/security product. Rafael's role covers research, product strategy, UX, visual design, prototyping, design systems, front-end implementation, and close collaboration with engineers.
`.trim()
