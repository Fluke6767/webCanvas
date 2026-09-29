const registry = {
  templates: [],
  categories: [],
  styles: [],
  themes: [],
  elements: []
};

export function register(item) {
  if (!item || !item.type || !item.id) throw new Error("Registry item needs type and id");
  if (!registry[item.type + "s"]) throw new Error(`Unknown registry type: ${item.type}`);
  registry[item.type + "s"].push(item);
}

export function getAll(type) {
  return [...(registry[type + "s"] || [])];
}

export function get(type, id) {
  return getAll(type).find(x => x.id === id);
}

export function searchTemplates(query = "") {
  const q = query.toLowerCase().trim();
  if (!q) return getAll("template");
  return getAll("template").filter(t =>
    [t.name, t.category, t.style, t.theme, ...(t.tags || [])]
      .join(" ").toLowerCase().includes(q)
  );
}

export default registry;
