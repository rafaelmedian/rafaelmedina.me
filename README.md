# Rafael Medina Portfolio

Static production build for [rafaelmedina.me](https://rafaelmedina.me/), a portfolio site for Rafael Medina.

This workspace is the generated GitHub Pages output, not the source application. The page is served from `index.html` and the hashed assets under `assets/`.

## Structure

- `index.html` - main HTML entry point and metadata.
- `404.html` - GitHub Pages fallback page.
- `assets/` - bundled JavaScript, CSS, and image assets.
- `Projects/` - project preview images and videos.
- `fonts/` - local font files.
- `icons/` and `logos/` - brand and UI assets.
- `robots.txt`, `sitemap.xml`, `site.webmanifest` - crawl and app metadata.
- `CNAME` - custom domain for GitHub Pages.

## Local Preview

Run a static server from the repository root:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Deployment

This directory is intended for the `gh-pages` branch and the custom domain in `CNAME`:

```text
rafaelmedina.me
```

Because the build uses hashed filenames, update both `index.html` and the referenced files together when replacing generated assets.

## Editing Notes

- Keep asset paths root-relative, matching the current GitHub Pages deployment.
- Do not remove `CNAME` unless the custom domain is changing.
- If changing layout or styles directly in `assets/index-*.css`, verify the site locally at both desktop and mobile widths.
