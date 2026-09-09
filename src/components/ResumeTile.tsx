import { useId, type Ref } from "react";

import { cvExperience } from "../data/cv";
import { resumePath } from "../lib/projectMetadata";

const previewExperience = cvExperience.slice(0, 2);

function previewCompany(company: string) {
  return company === "0x Project" ? "0x / Matcha" : company;
}

/* The tile is the sheet seen from across the room, so an entry gets its lead
   point and nothing else: at a few millimetres of type per role, a second line
   is a wall nobody stops to read, and it pushes the roles below off the page.
   The reader shows the pair. */
function previewHighlight(highlight: string | [string, string]) {
  return Array.isArray(highlight) ? highlight[0] : highlight;
}

/* The corner is drawn in a 77x80 box that sits on the sheet's lower-right
   corner, in the units of the 237x280 Figma "Paper" sheet. CUT_OUTLINE is the
   sliced corner from the comp's sheet outline: the underside shows through it.
   PAGE_OUTLINE is the rest of the box, the sheet side of that cut; it trims the
   curl so its own stroke never crosses the seam. The curl is the lifted corner
   itself, exported in its own 60x59 box and flipped upright because the comp is
   mirrored. Scaling this one SVG from the corner grows the whole fold. */
const CUT_OUTLINE =
  "M8.264 80C14.524 80 20.537 77.554 25.019 73.184L69.755 29.564C74.387 25.047 77 18.851 77 12.381V80Z";
const PAGE_OUTLINE =
  "M0 0H77V12.381C77 18.851 74.387 25.047 69.755 29.564L25.019 73.184C20.537 77.554 14.524 80 8.264 80H0Z";
const CURL_OUTLINE =
  "M60.1348 57.5372L59.3194 58.7648L59.2657 58.7433C59.2248 58.7271 59.1609 58.703 59.0743 58.671C58.9 58.6068 58.6326 58.5121 58.2725 58.3986C57.5523 58.1715 56.459 57.866 54.9893 57.5587C52.0497 56.9442 47.6013 56.3243 41.6114 56.3243C22.3185 56.3243 7.58881 40.5458 7.86039 21.3009C7.86388 21.0537 7.86392 20.8143 7.86136 20.5831C7.80003 15.0476 5.97561 10.2922 4.15336 6.90931C3.24358 5.22042 2.33806 3.88094 1.66214 2.96595C1.32431 2.50863 1.04449 2.15736 0.850621 1.92298C0.753759 1.80587 0.678175 1.71807 0.627965 1.66028C0.602856 1.63138 0.584395 1.60943 0.572301 1.59583C0.566361 1.58915 0.561246 1.58507 0.558629 1.58216C0.557612 1.58103 0.557168 1.57977 0.556676 1.57923L1.6348 0.537235L60.1348 57.5372Z";

/**
 * The folded CV sheet on the work grid. It reads as one of the grid's tiles and
 * behaves like one: it links to the résumé's own prerendered page, and a plain
 * click opens that page as a slide of the preview gallery instead. `ref` is the
 * tile the gallery grows out of.
 */
export function ResumeTile({
  ref,
  onOpen,
  onPrefetch,
}: {
  ref?: Ref<HTMLAnchorElement>;
  onOpen?: () => void;
  /* The reader is a slide of a lazily loaded gallery, so this tile warms the
     same chunk a project tile does rather than paying for it at click time. */
  onPrefetch?: () => void;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pageId = `resume-page-${id}`;
  const seamId = `resume-seam-${id}`;
  const liftId = `resume-lift-${id}`;
  const shadeId = `resume-curl-shade-${id}`;
  const rollId = `resume-curl-roll-${id}`;

  return (
    <a
      href={resumePath}
      ref={ref}
      className="mosaic-row-card resume-tile"
      aria-label="Open résumé"
      onPointerEnter={onPrefetch}
      onPointerDown={onPrefetch}
      onFocus={onPrefetch}
      onClick={(event) => {
        // A modified click stays the browser's: the sheet has a real page to
        // open in a new tab. A plain one opens it over the feed.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onOpen?.();
      }}
    >
      <span className="resume-tile-paper" aria-hidden="true">
        <span className="resume-tile-backing" />
        <span className="resume-tile-sheet">
          <span className="resume-tile-copy">
            <span className="resume-tile-title">CV</span>
            {previewExperience.map((job) => (
              <span
                className="resume-tile-entry"
                key={`${job.company}-${job.dates}`}
              >
                <span className="resume-tile-entry-head">
                  <strong>{previewCompany(job.company)}</strong>
                  <span>{job.dates}</span>
                </span>
                <p>{previewHighlight(job.highlight)}</p>
              </span>
            ))}
          </span>
          <svg
            className="resume-tile-fold"
            viewBox="0 0 77 80"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={pageId}>
                <path d={PAGE_OUTLINE} />
              </clipPath>
              <linearGradient
                id={seamId}
                x1="47.387"
                y1="51.374"
                x2="50.18"
                y2="54.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#000000" stopOpacity="0.18" />
                <stop offset="1" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              {/* The curl's lift. One drop shadow at this size collapses into
                  a gray outline tracing the curl, which reads as dirt on the
                  page rather than a corner off it, so the lift is three passes
                  on the same silhouette: a near-opaque contact edge, a mid
                  penumbra, and a wide ambient wash, each faint enough that the
                  sum stays under the single shadow's old density. They are
                  built from SourceAlpha and merged under SourceGraphic -- three
                  stacked feDropShadows would each re-emit the curl and darken
                  the ones below. Filter percentages are of the curl's own box,
                  so 100% around it clears even the widest blur, and sRGB keeps
                  the falloff matched to the CSS shadows on the sheet. */}
              <filter
                id={liftId}
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" />
                <feOffset dx="-0.4" dy="-0.4" />
                <feComponentTransfer result="contact">
                  <feFuncA type="linear" slope="0.09" />
                </feComponentTransfer>
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" />
                <feOffset dx="-1.4" dy="-1.4" />
                <feComponentTransfer result="penumbra">
                  <feFuncA type="linear" slope="0.06" />
                </feComponentTransfer>
                <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" />
                <feOffset dx="-3" dy="-3" />
                <feComponentTransfer result="ambient">
                  <feFuncA type="linear" slope="0.04" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="ambient" />
                  <feMergeNode in="penumbra" />
                  <feMergeNode in="contact" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient
                id={shadeId}
                cx="0"
                cy="0"
                r="1"
                gradientTransform="matrix(46.8621 -48.5715 152.004 145.411 1.88079 61.8151)"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ffffff" />
                <stop offset="0.492461" stopColor="#f9fbff" />
                <stop offset="0.879808" stopColor="#e6e6e6" />
              </radialGradient>
              <linearGradient
                id={rollId}
                x1="33.6114"
                y1="30.5257"
                x2="12.322"
                y2="51.8151"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ffffff" />
                <stop
                  offset="0.374836"
                  stopColor="#bfbfbf"
                  stopOpacity="0.9"
                />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            {/* The underside showing through the cut, shaded along the seam. */}
            <path d={CUT_OUTLINE} fill="#d5d5d7" />
            <path d={CUT_OUTLINE} fill={`url(#${seamId})`} />
            {/* The lifted corner, trimmed to the sheet side of the cut. */}
            <g clipPath={`url(#${pageId})`}>
              <g filter={`url(#${liftId})`}>
                <g transform="translate(17.88 22.08) scale(1.0085) matrix(1 0 0 -1 0 59.4576)">
                  <path d={CURL_OUTLINE} fill={`url(#${shadeId})`} />
                  <path
                    d={CURL_OUTLINE}
                    fill={`url(#${rollId})`}
                    fillOpacity="0.46"
                  />
                  <path
                    d={CURL_OUTLINE}
                    fill="none"
                    stroke="#e1e1e1"
                    strokeWidth="1.5"
                  />
                </g>
              </g>
            </g>
          </svg>
        </span>
      </span>
    </a>
  );
}
