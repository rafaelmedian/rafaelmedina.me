# CV Section Design

## Goal

Add a permanent CV section at the bottom of the portfolio, after the About section. The section should translate the supplied 2026 CV into an accessible, responsive web format that feels native to the existing site.

## Content and privacy

The supplied CV is the source of truth for roles, dates, outcomes, education, skills, and development tools. The website will not publish the phone number or personal Gmail address shown in that document. Contact actions will use the site's existing public email address and LinkedIn URL.

The section will include:

- Work experience at 0x Project, BoldVoice, Moody's, TM (Chainlink, Twilio, and Onit), and Incubeta (Google).
- Education at NOVA Community College and ITLA.
- Product design skills and development tools from the CV.
- Public email and LinkedIn actions.

The supplied PDF will not be copied into `public/` or offered as a download because it contains private contact details.

## Page structure

Create a focused `CvSection` component and render it after `AboutPanel` in `SimpleFeed`. Keep CV content in a small typed data module so dates, roles, and bullet points remain separate from presentation markup.

The section will use semantic HTML:

- A section landmark with `id="cv"` and a visible `CV` heading.
- Ordered experience entries with company, dates, role, and concise accomplishment bullets.
- Separate Education, Skills, and Development subsections.
- Descriptive external link labels for LinkedIn and email.

No new client state or data fetching is required. The content is static and included in prerendered HTML.

## Visual design

The CV will use the site's existing neutral surface, border, typography, spacing, focus-ring, and pill-link language. On wide screens, experience occupies the main column while Education, Skills, and Development form a narrower supporting column. On small screens, all content becomes a single reading column without horizontal overflow.

The section should read as editorial résumé content rather than another portfolio-card mosaic. Entries will use restrained separators and hierarchy, with dates visually secondary to company and role. Motion is unnecessary; the section remains immediately readable and follows reduced-motion preferences automatically.

## Error handling and maintenance

Because the content is local and static, there is no runtime error state. External links open safely with `rel="noreferrer"`. Missing optional accomplishment bullets should render no list rather than an empty element.

Future CV updates should require editing only the typed CV data and, when necessary, the supplied source document.

## Verification

Add an end-to-end regression test that confirms:

- The CV section follows the About section.
- The newest and oldest work entries render in the correct order.
- Private phone and Gmail details are absent.
- The public email and LinkedIn links are present.
- The section stays within narrow mobile viewports.

Run lint, the production build, and the full Playwright suite.
