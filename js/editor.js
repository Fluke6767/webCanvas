import { getAll, get } from "./registry.js";
import "./catalog.js";

const params = new URLSearchParams(location.search);
const template =
  get("template", params.get("template")) ||
  getAll("template")[0];

const $ = (selector) => document.querySelector(selector);

$("#editorTitle").textContent = template?.name || "New Website";
$("#templateInfo").textContent = JSON.stringify(template, null, 2);

const sectionList = $("#sectionList");
const canvas = $("#websiteCanvas");

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

function createSection(type, index) {
  const title = sectionTitles[type] || type;

  return `
    <section
      class="wc-section ${type === "hero" ? "hero-section" : ""}"
      data-section="${type}"
      data-index="${index}"
      tabindex="0"
    >
      <div class="wc-section-content">
        <h1
          class="wc-element wc-text"
          contenteditable="true"
          data-element="heading"
          spellcheck="false"
        >${type === "hero" ? "Build something amazing with webCanvas." : title}</h1>

        <p
          class="wc-element wc-text"
          contenteditable="true"
          data-element="paragraph"
          spellcheck="false"
        >This section is ready to customize.</p>

        <button
          class="wc-element wc-button"
          type="button"
          data-element="button"
        >Get Started</button>
      </div>
    </section>
  `;
}

function renderSite() {
  if (!canvas) return;

  const theme = get("theme", template?.theme);

  const primary =
    $("#primaryColor")?.value ||
    theme?.colors?.primary ||
    "#2563eb";

  const bg =
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
        --primary:${primary};
        --site-bg:${bg};
        background:${bg};
      "
    >
      ${sections
        .map((section, index) => createSection(section, index))
        .join("")}
    </div>
  `;

  setupElementSelection();
}

function setupElementSelection() {
  canvas.querySelectorAll(".wc-section").forEach((section) => {
    section.addEventListener("click", (event) => {
      if (event.target.closest(".wc-element")) return;

      selectElement(section);
    });
  });

  canvas.querySelectorAll(".wc-element").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      selectElement(element);
    });

    element.addEventListener("focus", () => {
      selectElement(element);
    });
  });
}

function selectElement(element) {
  canvas
    .querySelectorAll(".wc-selected")
    .forEach((item) => item.classList.remove("wc-selected"));

  element.classList.add("wc-selected");

  const type =
    element.dataset.element ||
    element.dataset.section ||
    "section";

  $("#templateInfo").textContent =
    `Selected: ${type}\n\n` +
    JSON.stringify(
      {
        element: type,
        tag: element.tagName.toLowerCase(),
        text: element.innerText
      },
      null,
      2
    );
}

sectionList.innerHTML = (
  template?.sections || []
)
  .map(
    (section, index) => `
      <div
        class="section-item"
        draggable="true"
        data-section="${section}"
        data-index="${index}"
      >
        ${index + 1}. ${sectionTitles[section] || section}
      </div>
    `
  )
  .join("");

$("#primaryColor")?.addEventListener("input", renderSite);
$("#bgColor")?.addEventListener("input", renderSite);

$("#previewBtn").onclick = () => {
  if (!template) return;

  location.href =
    `preview.html?template=${encodeURIComponent(template.id)}`;
};

$("#exportBtn").onclick = () => {
  alert(
    "Export engine will be added in a later webCanvas version."
  );
};

renderSite();
