import { getAll, get } from "./registry.js";
import "./catalog.js";

const params = new URLSearchParams(location.search);

const template =
  get("template", params.get("template")) ||
  getAll("template")[0];

const $ = (selector) => document.querySelector(selector);

const editorTitle = $("#editorTitle");
const templateInfo = $("#templateInfo");
const sectionList = $("#sectionList");
const canvas = $("#websiteCanvas");

editorTitle.textContent =
  template?.name || "New Website";

const sectionTitles = {
  navbar: "Navigation",
  hero: "Hero",
  features: "Features",
  about: "About",
  projects: "Projects",
  pricing: "Pricing",
  menu: "Menu",
  gallery: "Gallery",
  contact: "Contact",
  footer: "Footer"
};

let selectedElement = null;
let draggedElement = null;

/* =========================
   CREATE SECTION
========================= */

function createSection(type, index) {
  const title = sectionTitles[type] || type;

  return `
    <section
      class="wc-section ${type === "hero" ? "hero-section" : ""}"
      data-section="${type}"
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
            type === "hero"
              ? "Build something amazing with webCanvas."
              : title
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
          This section is ready to customize.
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
   RENDER SITE
========================= */

function renderSite() {
  if (!canvas) return;

  const theme = get("theme", template?.theme);

  const primary =
    $("#primaryColor")?.value ||
    theme?.colors?.primary ||
    "#2563eb";

  const background =
    $("#bgColor")?.value ||
    theme?.colors?.background ||
    "#ffffff";

  const sections =
    template?.sections?.length
      ? template.sections
      : ["hero", "features", "contact"];

  canvas.innerHTML = `
    <div
      class="site"
      style="
        --primary: ${primary};
        --site-bg: ${background};
        background: ${background};
      "
    >
      ${sections
        .map((section, index) =>
          createSection(section, index)
        )
        .join("")}
    </div>
  `;

  setupElementSelection();
  setupElementDragging();

  updateTemplateInfo();
}

/* =========================
   ELEMENT SELECTION
========================= */

function setupElementSelection() {
  canvas
    .querySelectorAll(".wc-section")
    .forEach((section) => {

      section.addEventListener("click", (event) => {

        if (
          event.target.closest(".wc-element")
        ) {
          return;
        }

        selectElement(section);
      });
    });

  canvas
    .querySelectorAll(".wc-element")
    .forEach((element) => {

      element.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          selectElement(element);
        }
      );

      element.addEventListener(
        "focus",
        () => {
          selectElement(element);
        }
      );
    });
}

function selectElement(element) {

  canvas
    .querySelectorAll(".wc-selected")
    .forEach((item) => {
      item.classList.remove(
        "wc-selected"
      );
    });

  element.classList.add(
    "wc-selected"
  );

  selectedElement = element;

  const type =
    element.dataset.element ||
    element.dataset.section ||
    "section";

  templateInfo.textContent =
    `Selected: ${type}\n\n` +
    JSON.stringify(
      {
        element: type,
        tag:
          element.tagName.toLowerCase(),
        text:
          element.innerText.trim()
      },
      null,
      2
    );
}

/* =========================
   DRAG ELEMENT
========================= */

function setupElementDragging() {

  canvas
    .querySelectorAll(".wc-element")
    .forEach((element) => {

      element.addEventListener(
        "dragstart",
        (event) => {

          draggedElement = element;

          element.classList.add(
            "wc-dragging"
          );

          event.dataTransfer.effectAllowed =
            "move";

          event.dataTransfer.setData(
            "text/plain",
            element.dataset.element ||
              "element"
          );
        }
      );

      element.addEventListener(
        "dragend",
        () => {

          element.classList.remove(
            "wc-dragging"
          );

          draggedElement = null;

          clearDropIndicators();
        }
      );
    });

  canvas
    .querySelectorAll(
      ".wc-section-content"
    )
    .forEach((container) => {

      container.addEventListener(
        "dragover",
        (event) => {

          if (!draggedElement) {
            return;
          }

          event.preventDefault();

          event.dataTransfer.dropEffect =
            "move";

          const target =
            getDropTarget(
              container,
              event.clientY
            );

          clearDropIndicators();

          if (
            target &&
            target !== draggedElement
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

          if (!draggedElement) {
            return;
          }

          event.preventDefault();

          const target =
            getDropTarget(
              container,
              event.clientY
            );

          if (
            target &&
            target !== draggedElement
          ) {

            const rect =
              target.getBoundingClientRect();

            const insertBefore =
              event.clientY <
              rect.top +
                rect.height / 2;

            if (insertBefore) {

              container.insertBefore(
                draggedElement,
                target
              );

            } else {

              container.insertBefore(
                draggedElement,
                target.nextSibling
              );
            }

          } else {

            container.appendChild(
              draggedElement
            );
          }

          selectElement(
            draggedElement
          );

          draggedElement = null;

          clearDropIndicators();
        }
      );
    });
}

/* =========================
   FIND DROP TARGET
========================= */

function getDropTarget(
  container,
  mouseY
) {

  const elements = [
    ...container.querySelectorAll(
      ".wc-element"
    )
  ].filter(
    (element) =>
      element !== draggedElement
  );

  let closest = null;
  let closestDistance = Infinity;

  elements.forEach((element) => {

    const rect =
      element.getBoundingClientRect();

    const center =
      rect.top +
      rect.height / 2;

    const distance =
      Math.abs(mouseY - center);

    if (
      distance <
      closestDistance
    ) {

      closestDistance =
        distance;

      closest = element;
    }
  });

  return closest;
}

/* =========================
   CLEAR DROP INDICATORS
========================= */

function clearDropIndicators() {

  canvas
    .querySelectorAll(
      ".wc-drop-target, .wc-drop-end"
    )
    .forEach((element) => {

      element.classList.remove(
        "wc-drop-target",
        "wc-drop-end"
      );
    });
}

/* =========================
   SECTION LIST
========================= */

function renderSectionList() {

  const sections =
    template?.sections?.length
      ? template.sections
      : ["hero", "features", "contact"];

  sectionList.innerHTML =
    sections
      .map(
        (section, index) => `
          <div
            class="section-item"
            data-section="${section}"
            data-index="${index}"
          >
            ${index + 1}.
            ${
              sectionTitles[section] ||
              section
            }
          </div>
        `
      )
      .join("");
}

/* =========================
   TEMPLATE INFO
========================= */

function updateTemplateInfo() {

  if (!templateInfo) return;

  templateInfo.textContent =
    JSON.stringify(
      template,
      null,
      2
    );
}

/* =========================
   COLORS
========================= */

$("#primaryColor")
  ?.addEventListener(
    "input",
    renderSite
  );

$("#bgColor")
  ?.addEventListener(
    "input",
    renderSite
  );

/* =========================
   PREVIEW
========================= */

$("#previewBtn").onclick = () => {

  if (!template) return;

  location.href =
    `preview.html?template=${encodeURIComponent(
      template.id
    )}`;
};

/* =========================
   EXPORT
========================= */

$("#exportBtn").onclick = () => {

  alert(
    "Export engine will be added later."
  );
};

/* =========================
   START
========================= */

renderSectionList();
renderSite();
