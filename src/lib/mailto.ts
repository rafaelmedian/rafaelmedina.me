import { siteLinks } from "../data/portfolio"

/**
 * The subject a bare "write to me" link opens the draft with. A blank subject
 * left the visitor to invent one and left the inbox with "(no subject)"; the
 * bracket asks them to say who they are before the first line, which is the
 * thing a reply most needs to know.
 */
export const defaultEmailSubject = "Hello from [your name / company]"

/** A `mailto:` for the address, opening on `defaultEmailSubject`. */
export function emailHref(email: string = siteLinks.email, subject: string = defaultEmailSubject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}
