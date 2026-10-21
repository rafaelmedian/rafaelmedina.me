// Dates of public posts are stored as YYYY-MM-DD and shown as "May 24, 2023".
// UTC on both sides so a post never reads a day early west of Greenwich.
const postDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

export const formatPostDate = (date: string) => postDate.format(new Date(`${date}T00:00:00Z`))
