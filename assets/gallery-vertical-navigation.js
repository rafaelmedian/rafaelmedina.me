const GALLERY_SELECTOR = ".preview-gallery-shell";
const RAIL_CLASS = "preview-gallery-rail";

const icons = {
  previous: '<path d="m18 15-6-6-6 6"></path>',
  next: '<path d="m6 9 6 6 6-6"></path>',
};

function createButton({ direction, label, shortcuts, key }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `preview-gallery-nav preview-gallery-nav-${direction}`;
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-keyshortcuts", shortcuts);
  button.innerHTML = `
    <svg
      aria-hidden="true"
      class="preview-gallery-nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${icons[direction]}
    </svg>
  `;
  button.addEventListener("click", () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        code: key,
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  return button;
}

function createRail() {
  const rail = document.createElement("div");
  rail.className = RAIL_CLASS;
  rail.setAttribute("role", "group");
  rail.setAttribute("aria-label", "Preview navigation");
  rail.append(
    createButton({
      direction: "previous",
      label: "Previous preview",
      shortcuts: "ArrowUp ArrowLeft",
      key: "ArrowUp",
    }),
    createButton({
      direction: "next",
      label: "Next preview",
      shortcuts: "ArrowDown ArrowRight",
      key: "ArrowDown",
    }),
  );
  return rail;
}

function positionRail(rail, gallery) {
  const popup = gallery.querySelector(".preview-gallery-popup");
  if (!popup) return;

  const bounds = popup.getBoundingClientRect();
  rail.style.setProperty(
    "--preview-gallery-rail-left",
    `${bounds.right + 16}px`,
  );
}

function syncRail() {
  const gallery = document.querySelector(GALLERY_SELECTOR);
  const rail = document.querySelector(`.${RAIL_CLASS}`);

  if (!gallery) {
    rail?.remove();
    return;
  }

  if (rail) {
    positionRail(rail, gallery);
    return;
  }

  const nextRail = createRail();
  const total = Number(
    gallery
      .querySelector(".preview-gallery-count")
      ?.textContent?.split("/")
      .at(-1)
      ?.trim(),
  );

  if (total <= 1) {
    nextRail.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
  }

  document.body.append(nextRail);
  positionRail(nextRail, gallery);
}

const observer = new MutationObserver(syncRail);
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("resize", syncRail);
syncRail();
