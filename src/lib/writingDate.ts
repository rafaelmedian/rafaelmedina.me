// Dates are stored as plain YYYY-MM-DD, so they are read at UTC midnight rather
// than in the reader's zone, where a western offset would roll them back a day.
export const noteDate = (publishedAt: string) => new Date(`${publishedAt}T00:00:00Z`)
// Category headings no longer supply a year, so the compact row date carries it.
const archiveDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "2-digit", timeZone: "UTC" })

export function archiveDate(publishedAt: string) {
  return archiveDateFormat.formatToParts(noteDate(publishedAt)).map((part) =>
    part.type === "year" ? `'${part.value}` : part.type === "literal" && part.value.includes(",") ? " " : part.value,
  ).join("").replace(/\s+/g, " ").trim()
}
