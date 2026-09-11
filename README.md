# rafaelmedina.me 👋

Hey, I’m Rafael Medina, a product designer based in Punta Cana.
**This is my personal site and the repo behind it.** Selected work, writing,
a little life outside the screen, and plenty of things to hover over.

Think of it as a desk you can poke around. Projects sit beside a folder of notes,
a folded résumé, and a stack of photos.

**[Visit the site](https://rafaelmedina.me/)**

## 🪄 Things to explore

- **The work mosaic.** Artwork and video previews open into a gallery.
  Each project has its own shareable link.
- **The folded résumé.** It lives inside the gallery. Arrow keys take you from
  a project into my résumé and out the other side. There’s a PDF too.
- **Notes and photos.** A writing folder with pencil marks and margin notes.
  A photo stack with a little life between the project cards.
- **About and contact.** My background, services, and ways to reach me.
  Tiny reaction clips give the contact controls some personality.

## 🛠 How it’s built

**React 19, TypeScript, Vite, and Tailwind CSS 4.** CSS handles component styling
and animation. Base UI provides interface primitives. Lucide supplies the icons.

The build generates HTML for the homepage, projects, and résumé. Those pages
work without JavaScript. Once React starts, project and résumé links open in
the interactive gallery.

GitHub Pages hosts the site. GitHub Actions runs lint, build, Worker type-checks,
and Playwright tests. Merging to `main` deploys it. Built output is never edited
or committed.

## 🧠 Details worth a closer look

- **The pencil has a build script.** Rough.js draws the writing marks.
  Playwright turns them into PNGs, and CSS masks colour them. Stable random
  seeds keep the same wobble on every rebuild.
- **Even the résumé gets a test.** Chromium generates the PDF.
  A Playwright test checks its content against the site. The generator refuses
  to write a second page.
- **The memes have a performance budget.** GIFs become small animated WebPs.
  Still images take their place for reduced motion.
- **The design system is a page.** `/design-system` shows the real components,
  colours, type, and motion. It’s dev-only, so it adds no production weight.

## 🚧 Still on my list

The site is live. As of **September 9, 2026**, these are the remaining follow-ups:

- [x] **Connect shared note likes.** Done — the Worker and its D1 database are
  live, and merging to `main` redeploys them before the site.
- [ ] **Review six archived pieces of writing.** Decide which ones to publish
  from [the archive](docs/archive/writings.md).
- [ ] **Test the contact inbox.** Confirm `hey@rafaelmedina.me` receives mail.
  Keep the site and résumé in sync if the address changes.

## 💻 Run locally

Use **Node 22**, matching CI:

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. Visit `/design-system` for the visual reference.

```sh
npm run lint       # Check TypeScript/JavaScript and CSS style
npm run build      # Type-check, build, and prerender
npm run preview    # Serve the production build
npm run test:e2e   # Build and run Playwright tests
```

To run tests alongside another workspace, select unused preview and API ports:

```sh
E2E_PORT=4184 LIKES_API_URL=http://127.0.0.1:8799 npm run test:e2e
```

The [runbook](docs/operations.md) covers test setup, environment variables,
asset generation, and likes deployment. [AGENTS.md](AGENTS.md) holds the repo’s
working conventions.
