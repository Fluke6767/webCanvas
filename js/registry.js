import { register } from "./registry.js";

/* =========================
   CATEGORIES
========================= */

register({
  type: "category",
  id: "business",
  name: "Business",
  icon: "💼"
});

register({
  type: "category",
  id: "portfolio",
  name: "Portfolio",
  icon: "👤"
});

register({
  type: "category",
  id: "marketing",
  name: "Marketing",
  icon: "📢"
});

register({
  type: "category",
  id: "shop",
  name: "Shop",
  icon: "🛍️"
});

register({
  type: "category",
  id: "restaurant",
  name: "Restaurant",
  icon: "🍔"
});

register({
  type: "category",
  id: "personal",
  name: "Personal",
  icon: "✨"
});

/* =========================
   STYLES
========================= */

register({
  type: "style",
  id: "modern",
  name: "Modern"
});

register({
  type: "style",
  id: "minimal",
  name: "Minimal"
});

register({
  type: "style",
  id: "luxury",
  name: "Luxury"
});

register({
  type: "style",
  id: "futuristic",
  name: "Futuristic"
});

register({
  type: "style",
  id: "glass",
  name: "Glass"
});

/* =========================
   THEMES
========================= */

register({
  type: "theme",
  id: "ocean",
  name: "Ocean Blue",
  colors: {
    primary: "#2563eb",
    secondary: "#dbeafe",
    background: "#ffffff",
    text: "#111827"
  }
});

register({
  type: "theme",
  id: "midnight",
  name: "Midnight",
  colors: {
    primary: "#8b5cf6",
    secondary: "#312e81",
    background: "#0f172a",
    text: "#f8fafc"
  }
});

register({
  type: "theme",
  id: "sunset",
  name: "Sunset",
  colors: {
    primary: "#f97316",
    secondary: "#fed7aa",
    background: "#fff7ed",
    text: "#431407"
  }
});

/* =========================
   TEMPLATES
========================= */

register({
  type: "template",
  id: "modern-company",
  name: "Modern Company",
  category: "business",
  style: "modern",
  theme: "ocean",
  tags: [
    "company",
    "business",
    "modern",
    "corporate"
  ],
  popularity: 98,
  createdAt: "2026-09-29",
  sections: [
    "navbar",
    "hero",
    "features",
    "about",
    "contact",
    "footer"
  ]
});

register({
  type: "template",
  id: "developer-dark",
  name: "Developer Dark",
  category: "portfolio",
  style: "futuristic",
  theme: "midnight",
  tags: [
    "developer",
    "portfolio",
    "dark",
    "coding"
  ],
  popularity: 95,
  createdAt: "2026-09-29",
  sections: [
    "navbar",
    "hero",
    "projects",
    "about",
    "contact",
    "footer"
  ]
});

register({
  type: "template",
  id: "startup-launch",
  name: "Startup Launch",
  category: "marketing",
  style: "modern",
  theme: "ocean",
  tags: [
    "startup",
    "landing",
    "marketing"
  ],
  popularity: 91,
  createdAt: "2026-09-29",
  sections: [
    "navbar",
    "hero",
    "features",
    "pricing",
    "contact",
    "footer"
  ]
});

register({
  type: "template",
  id: "luxury-cafe",
  name: "Luxury Cafe",
  category: "restaurant",
  style: "luxury",
  theme: "sunset",
  tags: [
    "cafe",
    "restaurant",
    "food",
    "luxury"
  ],
  popularity: 88,
  createdAt: "2026-09-29",
  sections: [
    "navbar",
    "hero",
    "menu",
    "gallery",
    "contact",
    "footer"
  ]
});

register({
  type: "template",
  id: "minimal-personal",
  name: "Minimal Personal",
  category: "personal",
  style: "minimal",
  theme: "ocean",
  tags: [
    "personal",
    "minimal",
    "profile"
  ],
  popularity: 84,
  createdAt: "2026-09-28",
  sections: [
    "navbar",
    "hero",
    "about",
    "contact",
    "footer"
  ]
});

register({
  type: "template",
  id: "glass-shop",
  name: "Glass Shop",
  category: "shop",
  style: "glass",
  theme: "ocean",
  tags: [
    "shop",
    "store",
    "product",
    "glass"
  ],
  popularity: 81,
  createdAt: "2026-09-27",
  sections: [
    "navbar",
    "hero",
    "features",
    "products",
    "contact",
    "footer"
  ]
});
