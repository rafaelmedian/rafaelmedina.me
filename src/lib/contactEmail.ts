// Shared by the browser and the contact worker so an accepted address can send.
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/

export function isContactEmail(email: string): boolean {
  return email.length <= 254 && emailPattern.test(email.trim())
}
