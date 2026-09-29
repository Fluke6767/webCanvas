import {
  get,
  getAll
} from "./registry.js";

import "./catalog.js";

const params =
  new URLSearchParams(
    location.search
  );

const id =
  params.get("template");

const template =
  get(
    "template",
    id
  ) ||
  getAll("template")[0];

const preview =
  document.querySelector(
    "#preview"
  );

const titles = {

  navbar: "Navigation",

  hero:
    "Build Something Amazing",

  features:
    "Features",

  about:
    "About Us",

  projects:
    "Projects",

  pricing:
    "Pricing",

  menu:
    "Our Menu",

  gallery:
    "Gallery",

  products:
    "Products",

  contact:
    "Contact Us",

  footer:
    "Footer"
};

if (!preview) {
  throw new Error(
    "Preview container not found"
  );
}

if (!template) {

  preview.innerHTML = `
    <div class="preview-error">

      <h1>
        Template not found
      </h1>

      <p>
        ไม่พบ Template ที่ต้องการ
      </p>

      <a href="index.html">
        ← Back to webCanvas
      </a>

    </div>
  `;

} else {

  const theme =
    get(
      "theme",
      template.theme
    );

  const primary =
    theme?.colors?.primary ||
    "#2563eb";

  const background =
    theme?.colors?.background ||
    "#ffffff";

  const text =
    theme?.colors?.text ||
    "#111827";

  preview.style.setProperty(
    "--primary",
    primary
  );

  preview.style.setProperty(
    "--background",
    background
  );

  preview.style.setProperty(
    "--text",
    text
  );

  preview.innerHTML = `
    <div class="preview-site">

      ${
        (
          template.sections ||
          [
            "hero",
            "features",
            "contact"
          ]
        )
          .map(
            (section, index) => {

              const title =
                titles[section] ||
                section;

              const hero =
                section ===
                "hero";

              return `
                <section
                  class="
                    preview-section
                    ${
                      hero
                        ? "hero-section"
                        : ""
                    }
                  "
                >

                  <span
                    class="section-number"
                  >
                    ${index + 1}
                  </span>

                  <h1>
                    ${title}
                  </h1>

                  <p>
                    ${
                      hero
                        ? "A website created with webCanvas."
                        : "Customize this section in the webCanvas editor."
                    }
                  </p>

                  ${
                    hero
                      ? `
                        <button>
                          Get Started
                        </button>
                      `
                      : ""
                  }

                </section>
              `;
            }
          )
          .join("")
      }

    </div>
  `;
}
