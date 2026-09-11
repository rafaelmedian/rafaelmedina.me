// Contact fields are not logins, so password managers have nothing to save or
// fill there, yet their inline buttons land inside the field beside the send
// arrow. Each manager's documented opt-out keeps them out; the browser's own
// autofill still offers the address through `autoComplete="email"`.
export const ignorePasswordManagers = {
  "data-1p-ignore": "true", // 1Password
  "data-lpignore": "true", // LastPass
  "data-bwignore": "true", // Bitwarden
  "data-form-type": "other", // Dashlane
} as const
