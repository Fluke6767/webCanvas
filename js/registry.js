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
  return typeMap[type];
}

export function register(item) {
  if (!item || !item.type || !item.id) {
    throw new Error("Registry item needs type and id");
  }

  const key = getRegistryKey(item.type);

  if (!key || !registry[key]) {
    throw new Error(`Unknown registry type: ${item.type}`);
  }

  registry[key].push(item);
}

export function getAll(type) {
  const key = getRegistryKey(type);
  return key ? [...registry[key]] : [];
}

export function get(type, id) {
  return getAll(type).find((x) => x.id === id);
}

export function searchTemplates(query = "") {
  const q = query.toLowerCase().trim();

  if (!q) {
    return getAll("template");
  }

  return getAll("template").filter((t) =>
    [
      t.name,
      t.category,
      t.style,
      t.theme,
      ...(t.tags || [])
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

export default registry;
