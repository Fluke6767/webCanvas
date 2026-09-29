import {
  getAll,
  searchTemplates
} from "./registry.js";

import "./catalog.js";

const $ = (selector) =>
  document.querySelector(selector);

const grids = {
  recommended: $("#recommendedGrid"),
  popular: $("#popularGrid"),
  new: $("#newGrid")
};

/* =========================
   HELPERS
========================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getThemeColors(themeId) {
  const themes = {
    ocean: [
      "#2563eb",
      "#7c3aed"
    ],

    midnight: [
      "#0f172a",
      "#4c1d95"
    ],

    sunset: [
      "#f97316",
      "#dc2626"
    ]
  };

  return (
    themes[themeId] || [
      "#64748b",
      "#94a3b8"
    ]
  );
}

/* =========================
   TEMPLATE CARD
========================= */

function templateCard(template) {
  const [
    colorA,
    colorB
  ] = getThemeColors(
    template.theme
  );

  const category = getAll("category")
    .find(
      (item) =>
        item.id === template.category
    );

  const style = getAll("style")
    .find(
      (item) =>
        item.id === template.style
    );

  return `
    <article class="template-card">

      <div
        class="thumb"
        style="
          --a:${colorA};
          --b:${colorB};
        "
      >
        <div class="thumb-ui">
          <div class="thumb-top"></div>
          <div class="thumb-title"></div>
          <div class="thumb-content"></div>
        </div>
      </div>

      <div class="card-body">

        <h4>
          ${escapeHTML(template.name)}
        </h4>

        <div class="meta">
          ${category?.name || template.category}
          ·
          ${style?.name || template.style}
        </div>

        <div class="card-actions">

          <span class="popularity">
            🔥 ${template.popularity}
          </span>

          <button
            class="use-btn"
            data-use="${escapeHTML(template.id)}"
          >
            Use template
          </button>

        </div>

      </div>

    </article>
  `;
}

/* =========================
   RENDER TEMPLATES
========================= */

function renderTemplates(
  list,
  target
) {
  if (!target) {
    return;
  }

  if (!list.length) {
    target.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <strong>No templates found</strong>
        <span>
          ลองเปลี่ยนคำค้นหาหรือ Filter
        </span>
      </div>
    `;

    return;
  }

  target.innerHTML = list
    .map(templateCard)
    .join("");

  target
    .querySelectorAll("[data-use]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.use;

          location.href =
            `editor.html?template=${encodeURIComponent(id)}`;
        }
      );
    });
}

/* =========================
   FILTER + SEARCH
========================= */

function refresh(query = "") {

  let templates =
    searchTemplates(query);

  const categoryFilter =
    $("#categoryFilter");

  const styleFilter =
    $("#styleFilter");

  const category =
    categoryFilter?.value ||
    "all";

  const style =
    styleFilter?.value ||
    "all";

  if (category !== "all") {

    templates =
      templates.filter(
        (template) =>
          template.category ===
          category
      );
  }

  if (style !== "all") {

    templates =
      templates.filter(
        (template) =>
          template.style ===
          style
      );
  }

  const recommended =
    [...templates]
      .sort(
        (a, b) =>
          b.popularity -
          a.popularity
      )
      .slice(0, 8);

  const popular =
    [...templates]
      .sort(
        (a, b) =>
          b.popularity -
          a.popularity
      )
      .slice(0, 8);

  const newest =
    [...templates]
      .sort(
        (a, b) =>
          String(b.createdAt)
            .localeCompare(
              String(a.createdAt)
            )
      )
      .slice(0, 8);

  renderTemplates(
    recommended,
    grids.recommended
  );

  renderTemplates(
    popular,
    grids.popular
  );

  renderTemplates(
    newest,
    grids.new
  );
}

/* =========================
   FILTERS
========================= */

function setupFilters() {

  const categoryFilter =
    $("#categoryFilter");

  const styleFilter =
    $("#styleFilter");

  const searchInput =
    $("#searchInput");

  if (categoryFilter) {

    getAll("category")
      .forEach((category) => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          category.id;

        option.textContent =
          category.name;

        categoryFilter.appendChild(
          option
        );
      });
  }

  if (styleFilter) {

    getAll("style")
      .forEach((style) => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          style.id;

        option.textContent =
          style.name;

        styleFilter.appendChild(
          option
        );
      });
  }

  searchInput?.addEventListener(
    "input",
    () => {
      refresh(
        searchInput.value
      );
    }
  );

  categoryFilter?.addEventListener(
    "change",
    () => {
      refresh(
        searchInput?.value || ""
      );
    }
  );

  styleFilter?.addEventListener(
    "change",
    () => {
      refresh(
        searchInput?.value || ""
      );
    }
  );
}

/* =========================
   CATEGORIES
========================= */

function setupCategories() {

  const categoryGrid =
    $("#categoryGrid");

  if (!categoryGrid) {
    return;
  }

  const categories =
    getAll("category");

  categoryGrid.innerHTML =
    categories
      .map(
        (category) => `
          <button
            class="category"
            data-cat="${escapeHTML(category.id)}"
          >
            <span class="category-icon">
              ${category.icon}
            </span>

            <span>
              ${escapeHTML(category.name)}
            </span>
          </button>
        `
      )
      .join("");

  categoryGrid
    .querySelectorAll("[data-cat]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const category =
            button.dataset.cat;

          const categoryFilter =
            $("#categoryFilter");

          const searchInput =
            $("#searchInput");

          if (categoryFilter) {
            categoryFilter.value =
              category;
          }

          refresh(
            searchInput?.value ||
              ""
          );

          location.hash =
            "templates";

          setTimeout(() => {

            document
              .querySelector(
                "#templates"
              )
              ?.scrollIntoView({
                behavior: "smooth"
              });

          }, 50);
        }
      );
    });
}

/* =========================
   BUTTONS
========================= */

function setupButtons() {

  $("#createBtn")
    ?.addEventListener(
      "click",
      () => {
        location.href =
          "editor.html";
      }
    );

  $("#generateBtn")
    ?.addEventListener(
      "click",
      () => {

        const input =
          $("#searchInput");

        refresh(
          input?.value.trim() ||
            ""
        );

        location.hash =
          "templates";

        document
          .querySelector(
            "#templates"
          )
          ?.scrollIntoView({
            behavior: "smooth"
          });
      }
    );

  $("#starterBtn")
    ?.addEventListener(
      "click",
      () => {

        location.href =
          "TEMPLATE_STARTER.md";
      }
    );
}

/* =========================
   HASH
========================= */

function handleHash() {

  const hash =
    location.hash.replace(
      "#",
      ""
    );

  if (
    hash === "templates"
  ) {

    setTimeout(() => {

      document
        .querySelector(
          "#templates"
        )
        ?.scrollIntoView();

    }, 100);
  }
}

/* =========================
   INIT
========================= */

function init() {

  console.log(
    "webCanvas starting..."
  );

  console.log(
    "Templates:",
    getAll("template")
  );

  console.log(
    "Categories:",
    getAll("category")
  );

  console.log(
    "Styles:",
    getAll("style")
  );

  setupFilters();
  setupCategories();
  setupButtons();

  refresh();

  handleHash();

  console.log(
    "webCanvas ready"
  );
}

init();
