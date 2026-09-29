const registry = {
  templates: [],
  categories: [],
  styles: [],
  themes: [],
  elements: []
};

const typeMap = {
  template: "templates",
  category: "categories",
  style: "styles",
  theme: "themes",
  element: "elements"
};

function getRegistryKey(type) {
  return typeMap[type] || null;
}

export function register(item) {
  if (!item || !item.type || !item.id) {
    throw new Error("Registry item needs type and id");
  }

  const key = getRegistryKey(item.type);

  if (!key) {
    throw new Error(`Unknown registry type: ${item.type}`);
  }

  const exists = registry[key].some(
    (entry) => entry.id === item.id
  );

  if (exists) {
    return;
  }

  registry[key].push({
    ...item
  });
}

export function getAll(type) {
  const key = getRegistryKey(type);

  if (!key) {
    return [];
  }

  return [...registry[key]];
}

export function get(type, id) {
  if (!id) {
    return undefined;
  }

  return getAll(type).find(
    (item) => item.id === id
  );
}

export function searchTemplates(query = "") {
  const q = String(query)
    .toLowerCase()
    .trim();

  const templates = getAll("template");

  if (!q) {
    return templates;
  }

  return templates.filter((template) => {
    const searchable = [
      template.name,
      template.category,
      template.style,
      template.theme,
      ...(template.tags || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(q);
  });
}

export default registry;
