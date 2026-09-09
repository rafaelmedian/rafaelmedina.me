const currentMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  year: "numeric",
  timeZone: "America/Santo_Domingo",
})

const monthNameFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
})

function getAvailabilityMonth(date = new Date()) {
  const parts = currentMonthFormatter.formatToParts(date)
  const year = Number(parts.find((part) => part.type === "year")!.value)
  const month = Number(parts.find((part) => part.type === "month")!.value)
  return new Date(Date.UTC(year, month, 1))
}

export function formatAvailability(date = new Date()) {
  return `Available in ${monthNameFormatter.format(getAvailabilityMonth(date))}`
}
