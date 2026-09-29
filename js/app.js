import { getAll, searchTemplates } from "./registry.js";
import "./catalog.js";

const $ = (selector) => document.querySelector(selector);

const grids = {
  recommended: $("#recommendedGrid"),
  popular: $("#popularGrid"),
  new: $("#newGrid")
};

function templateCard(t) {
  const colors = {
    ocean: ["#2563eb", "#7c3aed"],
    midnight: ["#0f172a", "#4c1d95"],
    sunset: ["#f97316", "#dc2626"]
  };

  const [a, b] = colors[t.theme] || ["#64748b", "#94a3b8"];

  return `
    <article class="template-card">
      <div
        class="thumb"
        style="--a:${a};--b:${b}"
      >
        <div class="thumb-ui">
          <b></b>
        </div>
      </div>

      <div class="card-body">
        <h4>${t.name}</h4>

        <div class="meta">
          ${t.category} · ${t.style}
        </div>

        <div class="card-actions">
          <span>🔥 ${t.popularity}</span>

          <button
            class="use-btn"
            data-use="${t.id}"
          >
            Use template
          </button>
        </div>
      </div>
    </article>
  `;
}

function render(list, target) {
  if (!target) return;

  target.innerHTML = list
    .map(templateCard)
    .join("");

  target.querySelectorAll("[data-use]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.use;

      window.location.href =
        `editor.html?template=${encodeURIComponent(id)}`;
    });
  });
}

function refresh(query = "") {
  let list = searchTemplates(query);

  const categoryFilter = $("#categoryFilter");
  const styleFilter = $("#styleFilter");

  const category = categoryFilter
    ? categoryFilter.value
    : "all";

  const style = styleFilter
    ? styleFilter.value
    : "all";

  if (category !== "all") {
    list = list.filter(
      (template) => template.category === category
    );
  }

  if (style !== "all") {
    list = list.filter(
      (template) => template.style === style
    );
  }

  const recommended = [...list]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  const popular = [...list]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  const newest = [...list]
    .sort((a, b) =>
      String(b.createdAt).localeCompare(
        String(a.createdAt)
      )
    )
    .slice(0, 8);

  render(recommended, grids.recommended);
  render(popular, grids.popular);
  render(newest, grids.new);
}

function setupFilters() {
  const categoryFilter = $("#categoryFilter");
  const styleFilter = $("#styleFilter");
  const searchInput = $("#searchInput");

  const categories = getAll("category");
  const styles = getAll("style");

  if (categoryFilter) {
    categories.forEach((category) => {
      categoryFilter.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.id}">
          ${category.name}
        </option>`
      );
    });
  }

  if (styleFilter) {
    styles.forEach((style) => {
      styleFilter.insertAdjacentHTML(
        "beforeend",
        `<option value="${style.id}">
          ${style.name}
        </option>`
      );
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      refresh(event.target.value);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      refresh(searchInput?.value || "");
    });
  }

  if (styleFilter) {
    styleFilter.addEventListener("change", () => {
      refresh(searchInput?.value || "");
    });
  }
}

function setupCategories() {
  const categoryGrid = $("#categoryGrid");

  if (!categoryGrid) return;

  const categories = getAll("category");

  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category"
          data-cat="${category.id}"
        >
          ${category.icon} ${category.name}
        </button>
      `
    )
    .join("");

  categoryGrid
    .querySelectorAll("[data-cat]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.cat;
        const categoryFilter = $("#categoryFilter");
        const searchInput = $("#searchInput");

        if (categoryFilter) {
          categoryFilter.value = category;
        }

        refresh(searchInput?.value || "");

        window.location.hash = "templates";
      });
    });
}

function setupButtons() {
  const createBtn = $("#createBtn");
  const generateBtn = $("#generateBtn");
  const starterBtn = $("#starterBtn");

  if (createBtn) {
    createBtn.addEventListener("click", () => {
      window.location.href = "editor.html";
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const searchInput = $("#searchInput");
      const query = searchInput?.value.trim() || "";

      refresh(query);
      window.location.hash = "templates";
    });
  }

  if (starterBtn) {
    starterBtn.addEventListener("click", () => {
      window.location.href =
        "docs/TEMPLATE_STARTER.md";
    });
  }
}

function init() {
  console.log("webCanvas: app starting...");

  console.log(
    "webCanvas: templates =",
    getAll("template")
  );

  console.log(
    "webCanvas: categories =",
    getAll("category")
  );

  setupFilters();
  setupCategories();
  setupButtons();
  refresh();

  console.log("webCanvas: app ready");
}

init();
