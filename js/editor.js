import {
  getAll,
  get
} from "./registry.js";

import "./catalog.js";

const params =
  new URLSearchParams(
    location.search
  );

const templateId =
  params.get("template");

const template =
  get(
    "template",
    templateId
  ) ||
  getAll("template")[0];

const $ = (selector) =>
  document.querySelector(
    selector
  );

const editorTitle =
  $("#editorTitle");

const templateInfo =
  $("#templateInfo");

const sectionList =
  $("#sectionList");

const canvas =
  $("#websiteCanvas");

const primaryColor =
  $("#primaryColor");

const bgColor =
  $("#bgColor");

const sectionTitles = {

  navbar: "Navigation",

  hero: "Hero",

  features: "Features",

  about: "About",

  projects: "Projects",

  pricing: "Pricing",

  menu: "Menu",

  gallery: "Gallery",

  products: "Products",

  contact: "Contact",

  footer: "Footer"
};

let selectedElement =
  null;

/* =========================
   ESCAPE
========================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

/* =========================
   THEME
========================= */

const theme =
  get(
    "theme",
    template?.theme
  );

const defaultPrimary =
  theme?.colors?.primary ||
  "#2563eb";

const defaultBackground =
  theme?.colors?.background ||
  "#ffffff";

if (primaryColor) {
  primaryColor.value =
    defaultPrimary;
}

if (bgColor) {
  bgColor.value =
    defaultBackground;
}

/* =========================
   TITLE
========================= */

if (editorTitle) {

  editorTitle.textContent =
    template?.name ||
    "New Website";
}

/* =========================
   CREATE SECTION
========================= */

function createSection(
  type,
  index
) {

  const title =
    sectionTitles[type] ||
    type;

  const hero =
    type === "hero";

  return `
    <section
      class="
        wc-section
        ${hero ? "hero-section" : ""}
      "
      data-section="${escapeHTML(type)}"
      data-index="${index}"
    >

      <div class="wc-section-content">

        <div class="wc-element-label">
          HEADING
        </div>

        <h1
          class="wc-element wc-text"
          contenteditable="true"
          draggable="true"
          data-element="heading"
          spellcheck="false"
        >
          ${
            hero
              ? "Build something amazing with webCanvas."
              : escapeHTML(title)
          }
        </h1>

        <div class="wc-element-label">
          TEXT
        </div>

        <p
          class="wc-element wc-text"
          contenteditable="true"
          draggable="true"
          data-element="paragraph"
          spellcheck="false"
        >
          ${
            hero
              ? "Create beautiful websites faster with webCanvas."
              : "This section is ready to customize."
          }
        </p>

        <div class="wc-element-label">
          BUTTON
        </div>

        <button
          class="wc-element wc-button"
          type="button"
          draggable="true"
          data-element="button"
        >
          Get Started
        </button>

      </div>

    </section>
  `;
}

/* =========================
   RENDER
========================= */

function renderSite() {

  if (!canvas) {
    return;
  }

  const primary =
    primaryColor?.value ||
    defaultPrimary;

  const background =
    bgColor?.value ||
    defaultBackground;

  const sections =
    template?.sections?.length
      ? template.sections
      : [
          "hero",
          "features",
          "contact"
        ];

  canvas.innerHTML = `
    <div
      class="site"
      style="
        --primary:${primary};
        --site-bg:${background};
        --site-text:${
          theme?.colors?.text ||
          "#111827"
        };
        background:${background};
      "
    >

      ${sections
        .map(
          (section, index) =>
            createSection(
              section,
              index
            )
        )
        .join("")}

    </div>
  `;

  setupElementSelection();
  setupElementDragging();

  updateTemplateInfo();
}

/* =========================
   SELECTION
========================= */

function setupElementSelection() {

  canvas
    .querySelectorAll(
      ".wc-section"
    )
    .forEach(
      (section) => {

        section.addEventListener(
          "click",
          (event) => {

            if (
              event.target.closest(
                ".wc-element"
              )
            ) {
              return;
            }

            selectElement(
              section
            );
          }
        );
      }
    );

  canvas
    .querySelectorAll(
      ".wc-element"
    )
    .forEach(
      (element) => {

        element.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            selectElement(
              element
            );
          }
        );

        element.addEventListener(
          "focus",
          () => {

            selectElement(
              element
            );
          }
        );
      }
    );
}

function selectElement(
  element
) {

  canvas
    .querySelectorAll(
      ".wc-selected"
    )
    .forEach(
      (item) => {

        item.classList.remove(
          "wc-selected"
        );
      }
    );

  element.classList.add(
    "wc-selected"
  );

  selectedElement =
    element;

  if (!templateInfo) {
    return;
  }

  const type =
    element.dataset.element ||
    element.dataset.section ||
    "section";

  templateInfo.textContent =
    JSON.stringify(
      {
        selected: type,
        tag:
          element.tagName
            .toLowerCase(),
        text:
          element.innerText
            ?.trim() || ""
      },
      null,
      2
    );
}

/* =========================
   SECTION LIST
========================= */

function renderSectionList() {

  if (!sectionList) {
    return;
  }

  const sections =
    template?.sections?.length
      ? template.sections
      : [
          "hero",
          "features",
          "contact"
        ];

  sectionList.innerHTML =
    sections
      .map(
        (
          section,
          index
        ) => `
          <button
            class="section-item"
            type="button"
            data-section-index="${index}"
          >
            <span>
              ${index + 1}
            </span>

            ${
              sectionTitles[
                section
              ] || section
            }
          </button>
        `
      )
      .join("");

  sectionList
    .querySelectorAll(
      "[data-section-index]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset
                  .sectionIndex
              );

            const section =
              canvas.querySelector(
                `[data-index="${index}"]`
              );

            section?.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            if (section) {
              selectElement(
                section
              );
            }
          }
        );
      }
    );
}

/* =========================
   DRAGGING
========================= */

function setupElementDragging() {

  canvas
    .querySelectorAll(
      ".wc-element"
    )
    .forEach(
      (element) => {

        element.addEventListener(
          "dragstart",
          (event) => {

            selectedElement =
              element;

            element.classList.add(
              "wc-dragging"
            );

            event.dataTransfer.effectAllowed =
              "move";

            event.dataTransfer.setData(
              "text/plain",
              "webcanvas-element"
            );
          }
        );

        element.addEventListener(
          "dragend",
          () => {

            element.classList.remove(
              "wc-dragging"
            );

            clearDropIndicators();
          }
        );
      }
    );

  canvas
    .querySelectorAll(
      ".wc-section-content"
    )
    .forEach(
      (container) => {

        container.addEventListener(
          "dragover",
          (event) => {

            if (
              !selectedElement
            ) {
              return;
            }

            event.preventDefault();

            clearDropIndicators();

            const target =
              getDropTarget(
                container,
                event.clientY
              );

            if (
              target &&
              target !==
                selectedElement
            ) {

              target.classList.add(
                "wc-drop-target"
              );

            } else {

              container.classList.add(
                "wc-drop-end"
              );
            }
          }
        );

        container.addEventListener(
          "drop",
          (event) => {

            if (
              !selectedElement
            ) {
              return;
            }

            event.preventDefault();

            const element =
              selectedElement;

            const target =
              getDropTarget(
                container,
                event.clientY
              );

            if (
              target &&
              target !== element
            ) {

              const rect =
                target.getBoundingClientRect();

              const before =
                event.clientY <
                rect.top +
                  rect.height / 2;

              if (before) {

                container.insertBefore(
                  element,
                  target
                );

              } else {

                container.insertBefore(
                  element,
                  target.nextSibling
                );
              }

            } else {

              container.appendChild(
                element
              );
            }

            clearDropIndicators();

            selectElement(
              element
            );
          }
        );
      }
    );
}

function getDropTarget(
  container,
  mouseY
) {

  const elements =
    [
      ...container.querySelectorAll(
        ".wc-element"
      )
    ].filter(
      (element) =>
        element !==
        selectedElement
    );

  let closest =
    null;

  let distance =
    Infinity;

  elements.forEach(
    (element) => {

      const rect =
        element.getBoundingClientRect();

      const center =
        rect.top +
        rect.height / 2;

      const current =
        Math.abs(
          mouseY -
            center
        );

      if (
        current <
        distance
      ) {

        distance =
          current;

        closest =
          element;
      }
    }
  );

  return closest;
}

function clearDropIndicators() {

  canvas
    .querySelectorAll(
      ".wc-drop-target, .wc-drop-end"
    )
    .forEach(
      (element) => {

        element.classList.remove(
          "wc-drop-target",
          "wc-drop-end"
        );
      }
    );
}

/* =========================
   INFO
========================= */

function updateTemplateInfo() {

  if (!templateInfo) {
    return;
  }

  templateInfo.textContent =
    JSON.stringify(
      template,
      null,
      2
    );
}

/* =========================
   EXPORT
========================= */

function exportWebsite() {

  const site =
    canvas?.querySelector(
      ".site"
    );

  if (!site) {
    alert(
      "ไม่มีเว็บไซต์ให้ Export"
    );

    return;
  }

  const exported =
    site.cloneNode(true);

  exported
    .querySelectorAll(
      ".wc-element-label"
    )
    .forEach(
      (label) =>
        label.remove()
    );

  exported
    .querySelectorAll(
      "[contenteditable]"
    )
    .forEach(
      (element) =>
        element.removeAttribute(
          "contenteditable"
        )
    );

  exported
    .querySelectorAll(
      "[draggable]"
    )
    .forEach(
      (element) =>
        element.removeAttribute(
          "draggable"
        )
    );

  exported
    .querySelectorAll(
      ".wc-selected"
    )
    .forEach(
      (element) =>
        element.classList.remove(
          "wc-selected"
        )
    );

  const html = `
<!doctype html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
  ${escapeHTML(
    template?.name ||
      "webCanvas Website"
  )}
</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    sans-serif;
  color: ${theme?.colors?.text || "#111827"};
}

.site {
  min-height: 100vh;
}

.site section {
  padding: 70px;
}

.hero-section {
  background:
    var(--primary);
  color: white;
}

.wc-button {
  display: inline-block;
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background:
    var(--primary);
  color: white;
}

</style>

</head>

<body>

${exported.outerHTML}

</body>

</html>
`;

  const blob =
    new Blob(
      [html],
      {
        type:
          "text/html;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `${
      template?.id ||
      "webcanvas-website"
    }.html`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    url
  );
}

/* =========================
   PREVIEW
========================= */

$("#previewBtn")
  ?.addEventListener(
    "click",
    () => {

      if (!template) {
        return;
      }

      location.href =
        `preview.html?template=${encodeURIComponent(
          template.id
        )}`;
    }
  );

/* =========================
   COLORS
========================= */

primaryColor?.addEventListener(
  "input",
  renderSite
);

bgColor?.addEventListener(
  "input",
  renderSite
);

/* =========================
   EXPORT BUTTON
========================= */

$("#exportBtn")
  ?.addEventListener(
    "click",
    exportWebsite
  );

/* =========================
   START
========================= */

renderSectionList();

renderSite();
