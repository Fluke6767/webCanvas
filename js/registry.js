// ============================================================
// webCanvas Registry
// ============================================================

const registry = {
  template: [],
  category: [],
  style: [],
  theme: [],
  element: []
};


// ============================================================
// REGISTER
// ============================================================

export function register(item) {

  if (!item || !item.type || !item.id) {
    console.warn(
      "webCanvas: invalid registry item",
      item
    );

    return item;
  }

  if (!registry[item.type]) {
    console.warn(
      `webCanvas: unknown registry type "${item.type}"`
    );

    return item;
  }

  const list =
    registry[item.type];

  const existingIndex =
    list.findIndex(
      (entry) =>
        entry.id === item.id
    );

  // ถ้ามีอยู่แล้ว → อัปเดตข้อมูล
  if (existingIndex !== -1) {

    list[existingIndex] = {
      ...list[existingIndex],
      ...item
    };

  } else {

    // ถ้ายังไม่มี → เพิ่มใหม่
    list.push({
      ...item
    });
  }

  return item;
}


// ============================================================
// GET ALL
// ============================================================

export function getAll(type) {

  if (!registry[type]) {
    return [];
  }

  return [
    ...registry[type]
  ];
}


// ============================================================
// GET BY ID
// ============================================================

export function get(
  type,
  id
) {

  if (
    !registry[type] ||
    !id
  ) {
    return null;
  }

  return (
    registry[type].find(
      (item) =>
        item.id === id
    ) || null
  );
}


// ============================================================
// SEARCH TEMPLATES
// ============================================================

export function searchTemplates(
  query = ""
) {

  const q =
    String(query)
      .trim()
      .toLowerCase();

  const templates =
    getAll("template");

  // ไม่มีคำค้นหา
  if (!q) {
    return templates;
  }

  return templates.filter(
    (template) => {

      const searchable = [

        template.id,

        template.name,

        template.category,

        template.style,

        template.theme,

        ...(Array.isArray(
          template.tags
        )
          ? template.tags
          : [])

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);
    }
  );
}


// ============================================================
// CLEAR REGISTRY
// ============================================================

export function clearRegistry() {

  Object.keys(
    registry
  ).forEach(
    (type) => {

      registry[type] = [];
    }
  );
}


// ============================================================
// DEBUG
// ============================================================

export function getRegistryStats() {

  return {

    templates:
      registry.template.length,

    categories:
      registry.category.length,

    styles:
      registry.style.length,

    themes:
      registry.theme.length,

    elements:
      registry.element.length
  };
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default registry;
