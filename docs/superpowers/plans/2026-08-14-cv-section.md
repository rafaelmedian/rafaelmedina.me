# CV Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a privacy-safe, responsive CV section after About using the supplied 2026 résumé as the content source.

**Architecture:** Store typed résumé content in `src/data/cv.ts`, render it through a focused `CvSection` component, and mount that component after `AboutPanel` in `SimpleFeed`. Keep the content static so it is included in prerendered HTML, with responsive presentation handled entirely in `src/index.css`.

**Tech Stack:** React 19, TypeScript, CSS, Vite prerendering, Playwright.

## Global Constraints

- Do not publish the supplied PDF, phone number, or personal Gmail address.
- Use `hey@rafaelmedina.me` and the existing LinkedIn profile for contact actions.
- Keep the section after About and at the bottom of the main page content.
- Use semantic HTML and preserve the site's existing neutral visual language.
- Do not edit or commit generated `dist/` output.
- Preserve all unrelated and pre-existing workspace modifications.
- Do not commit overlapping implementation files without explicit user authorization.

---

## File Structure

- Create `src/data/cv.ts`: typed experience, education, skills, and development-tool content.
- Create `src/components/CvSection.tsx`: semantic CV markup and public contact links.
- Modify `src/components/SimpleFeed.tsx`: render `CvSection` after `AboutPanel`.
- Modify `src/index.css`: CV surface, hierarchy, two-column desktop layout, and mobile collapse.
- Modify `tests/e2e/portfolio-polish.spec.ts`: placement, chronology, privacy, contact-link, and viewport regression coverage.

### Task 1: Add the semantic CV content and place it after About

**Files:**
- Create: `src/data/cv.ts`
- Create: `src/components/CvSection.tsx`
- Modify: `src/components/SimpleFeed.tsx`
- Test: `tests/e2e/portfolio-polish.spec.ts`

**Interfaces:**
- Produces: `cvExperience: CvExperience[]`, `cvEducation: CvEducation[]`, `cvSkills: string[]`, and `cvDevelopment: string[]` from `src/data/cv.ts`.
- Produces: `CvSection({ links }: { links: SiteLinks })` from `src/components/CvSection.tsx`.
- Consumes: `SiteLinks` from `src/data/portfolio.ts` and the existing `siteLinks` passed into `SimpleFeed`.

- [ ] **Step 1: Write the failing end-to-end test**

Add this test after the About placement test:

```ts
test("renders a privacy-safe CV after the about section", async ({ page }) => {
  await page.goto("/")

  const about = page.locator("#about-panel")
  const cv = page.locator("#cv")
  await expect(cv).toBeVisible()
  await expect(cv.getByRole("heading", { name: "CV", exact: true })).toBeVisible()

  const order = await page.locator("#about-panel, #cv").evaluateAll(([aboutNode, cvNode]) =>
    Boolean(aboutNode.compareDocumentPosition(cvNode) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  expect(order).toBe(true)

  const employers = cv.locator(".mosaic-cv-experience-item")
  await expect(employers.first()).toContainText("0x Project")
  await expect(employers.last()).toContainText("Incubeta")
  await expect(cv).toContainText("NOVA Community College")
  await expect(cv).toContainText("ITLA")
  await expect(cv.getByRole("link", { name: "Email Rafael" })).toHaveAttribute(
    "href",
    "mailto:hey@rafaelmedina.me",
  )
  await expect(cv.getByRole("link", { name: "Rafael Medina on LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/rafaelmedian",
  )

  await expect(cv).not.toContainText("hellorafaelmedina@gmail.com")
  await expect(cv).not.toContainText("786 9580")
})
```

- [ ] **Step 2: Run the test and verify it fails for the missing section**

Run:

```bash
npx playwright test tests/e2e/portfolio-polish.spec.ts --grep "privacy-safe CV"
```

Expected: FAIL because `#cv` does not exist.

- [ ] **Step 3: Create typed CV data**

Create `src/data/cv.ts` with these exact public fields:

```ts
export type CvExperience = {
  company: string
  location: string
  dates: string
  role: string
  achievements: string[]
  href?: string
}

export type CvEducation = {
  school: string
  location: string
  credential: string
  details?: string
}

export const cvExperience: CvExperience[] = [
  {
    company: "0x Project",
    location: "Remote, SF",
    dates: "Dec 2021 - Mar 2026",
    role: "Senior Product Designer",
    achievements: [
      "Redesigned Matcha.xyz from scratch and introduced monetization flows that generated sustainable revenue.",
      "Designed and shipped the 0x API dashboard in five weeks, contributing to API revenue scaling beyond $100K per month.",
      "Led marketing design strategy for 12 months across campaigns, video content, and web experiences that increased developer adoption.",
    ],
  },
  {
    company: "BoldVoice",
    location: "Remote, NYC",
    dates: "Jul 2021 - Dec 2021",
    role: "Product Designer (Contract)",
    achievements: [
      "Sole designer for an accent-training mobile app with more than 50K users, partnering directly with one developer to ship growth experiments.",
      "Prioritized high-ROI product improvements over a full redesign to maximize impact with limited resources.",
    ],
  },
  {
    company: "Moody's",
    location: "Remote, NYC",
    dates: "Jan 2021 - Jul 2021",
    role: "Product Designer (Contract)",
    achievements: [
      "Redesigned financial-analysis tools for institutional analysts, improving data discovery and workflow efficiency.",
      "Shaped UX for company profiles and government-entity features used by thousands of financial professionals.",
    ],
  },
  {
    company: "TM (Chainlink, Twilio, and Onit)",
    location: "Remote, Los Angeles",
    dates: "Dec 2018 - Dec 2020",
    role: "Product Designer & Frontend Developer",
    achievements: [
      "Chainlink: collaborated on internal tools and the brand system for a leading blockchain oracle network.",
      "Twilio: led a redesign of the developer-tools platform, supported by user interviews and UX research.",
      "Onit: rebuilt a drag-and-drop logic builder with React for legal workflow automation.",
    ],
  },
  {
    company: "Incubeta (Google)",
    location: "Remote, NYC",
    dates: "Jan 2018 - May 2018",
    role: "Product Designer & Developer (Contract)",
    href: "https://edudirectory.withgoogle.com/en",
    achievements: [
      "Designed Google Edu Directory, connecting schools globally with certified Google trainers.",
    ],
  },
]

export const cvEducation: CvEducation[] = [
  {
    school: "CCI Program - NOVA Community College",
    location: "Washington, DC",
    credential: "Computer Science, 2016 - 2018",
    details: "U.S. State Department scholarship recipient (1 of 5 from the Dominican Republic).",
  },
  {
    school: "ITLA - Las Americas Institute of Technology",
    location: "Dominican Republic",
    credential: "Associate's, Computer Science, 2015 - GPA 3.8, Full Scholarship",
  },
]

export const cvSkills = ["Web3 / DeFi products", "Figma", "Prototyping", "Web / Mobile", "Jitter", "Rive"]

export const cvDevelopment = [
  "TypeScript",
  "React",
  "Webflow",
  "Framer",
  "AI-assisted development",
]
```

- [ ] **Step 4: Create the semantic component**

Create `src/components/CvSection.tsx`. Render a `section` landmark with `id="cv"`, `className="mosaic-cv"`, `aria-labelledby="cv-title"`, a visible `h2#cv-title`, an ordered work list, Education, Skills, and Development subsections, plus:

```tsx
<a href={`mailto:${links.email}`} aria-label="Email Rafael">
  Email
</a>
<a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="Rafael Medina on LinkedIn">
  LinkedIn
</a>
```

Use `.mosaic-cv-experience-item` on each ordered-list item. Render an external company anchor only when `experience.href` is present. Do not include the supplied phone number, Gmail address, or PDF URL anywhere in the component or data module.

- [ ] **Step 5: Mount the CV at the page bottom**

Import `CvSection` in `src/components/SimpleFeed.tsx` and render:

```tsx
<AboutPanel links={links} />
<CvSection links={links} />
```

This exact ordering makes the CV the final content section while leaving the lazily mounted gallery dialog outside the document-flow content.

- [ ] **Step 6: Run the focused test and verify it passes**

Run:

```bash
npx playwright test tests/e2e/portfolio-polish.spec.ts --grep "privacy-safe CV"
```

Expected: PASS.

### Task 2: Add responsive CV presentation and viewport coverage

**Files:**
- Modify: `src/index.css`
- Modify: `tests/e2e/portfolio-polish.spec.ts`

**Interfaces:**
- Consumes: semantic class names produced by `CvSection`.
- Produces: a two-column desktop layout and single-column mobile layout with no horizontal overflow.

- [ ] **Step 1: Add a failing responsive-layout test**

Add this test after the CV content test:

```ts
test("uses a two-column CV on desktop and one column on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  const layout = page.locator(".mosaic-cv-layout")

  await expect(layout).toHaveCSS("display", "grid")
  expect(
    await layout.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
  ).toBe(2)

  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await layout.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
  ).toBe(1)

  const cvBox = await page.locator("#cv").boundingBox()
  expect(cvBox).not.toBeNull()
  expect(cvBox!.x).toBeGreaterThanOrEqual(0)
  expect(cvBox!.x + cvBox!.width).toBeLessThanOrEqual(390)
})
```

- [ ] **Step 2: Run the responsive-layout test before styling**

Run:

```bash
npx playwright test tests/e2e/portfolio-polish.spec.ts --grep "two-column CV"
```

Expected: FAIL because `.mosaic-cv-layout` is not yet a two-column CSS grid.

- [ ] **Step 3: Add CV styles**

In `src/index.css`, add scoped `.mosaic-cv*` rules that:

- Match the About section's horizontal padding and bottom spacing.
- Give `.mosaic-cv-panel` the existing neutral card surface, `24px` radius, and subtle border.
- Use `.mosaic-cv-layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(14rem, 0.8fr); }` on desktop.
- Use one column below `800px`.
- Keep dates and locations muted, company and role text readable, and achievement lists compact.
- Use existing focus-ring variables for email, LinkedIn, and optional employer links.
- Render Skills and Development as wrapping pill lists without fixed widths.
- Use `overflow-wrap: anywhere` for long external links and text.

- [ ] **Step 4: Run focused layout and content tests**

Run:

```bash
npx playwright test tests/e2e/portfolio-polish.spec.ts --grep "privacy-safe CV|primary layout inside"
```

Expected: PASS for CV content and all 320px, 375px, 768px, and 1440px viewport cases.

- [ ] **Step 5: Run complete verification**

Run:

```bash
git diff --check
npm run lint
npm run build
npm run test:e2e
```

Expected: all commands exit 0 and the full Playwright suite reports zero failures.

- [ ] **Step 6: Review the final diff without committing shared files**

Run:

```bash
git status --short
git diff -- src/data/cv.ts src/components/CvSection.tsx src/components/SimpleFeed.tsx src/index.css tests/e2e/portfolio-polish.spec.ts
```

Confirm that the CV files contain no phone number, personal Gmail address, or copied PDF asset. Leave the existing workspace modifications uncommitted for the user to review.
