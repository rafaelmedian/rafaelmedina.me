/* The likes Worker's port is repo-wide, so a second checkout running its own
   suite collides with the first. `LIKES_API_URL` lets that second run point
   both the build and these direct API calls at a port of its own; unset, this
   is the port `playwright.config.ts` starts the Worker on. */
export const likesApiUrl = process.env.LIKES_API_URL ?? "http://127.0.0.1:8787"
