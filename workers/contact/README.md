# Website contact delivery

The static GitHub Pages site posts to this Cloudflare Worker. The Worker sends
to `CONTACT_TO` through [Resend's email API](https://resend.com/docs/api-reference/emails/send-email),
with the visitor in `reply_to`; visitors cannot choose a recipient or sender.
There is no app database, attachment storage, or request-body logging. Resend and
the inbox still process and retain mail according to their own settings.

## Connect delivery

1. Verify a sending domain in Resend and create a sending API key. Choose a
   sender on that domain, such as `Website <hello@rafaelmedina.me>`.
2. Set server-side secrets interactively (never add these to a `VITE_` variable):

   ```sh
   npx wrangler secret put RESEND_API_KEY --config workers/contact/wrangler.jsonc
   npx wrangler secret put CONTACT_FROM --config workers/contact/wrangler.jsonc
   ```

3. Confirm `CONTACT_TO` matches `siteLinks.email` and that rate-limit namespace
   `1002` is unused by other Workers in the Cloudflare account, then deploy:

   ```sh
   npm run contact:check
   npm run contact:test
   npm run contact:deploy
   ```

4. Put the complete Worker endpoint (including `/contact`) in the GitHub Actions
   repository variable `VITE_CONTACT_API_URL`, and in `.env.local` for local use.
   The site's next main-branch build reads that public URL. Deploy Worker changes
   explicitly with `contact:deploy`; the existing Pages workflow only builds the site.

The widget remains a development preview until its real video is enabled. No
live delivery has been tested or configured by this change. A missing sender/key
returns a visible 503 error, never a simulated success.

## Local development

Use a gitignored `workers/contact/.dev.vars` for `RESEND_API_KEY` and
`CONTACT_FROM`, then run `npm run contact:dev` alongside `npm run dev`. Without an
override the dev UI posts to `http://127.0.0.1:8788/contact`. The API returns 503
until secrets are provided; do not treat a local preview as a successful send.

`npm run contact:test` stubs the provider and sends no email. Browser tests stub
the Worker endpoint and verify error preservation and retry IDs. Production
provider acceptance is reported as sent; downstream inbox delivery is asynchronous.

Retries share a [Resend idempotency key](https://resend.com/docs/dashboard/emails/idempotency-keys)
for identical content during the page session. The anonymous form permits five
attempts per minute per IP using [Cloudflare's rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
Rate limits are per Cloudflare location; shared IPs share a quota. There is no
visitor database or email auto-reply.
