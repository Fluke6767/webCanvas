# webCanvas Template Starter

## Folder

```text
my-template/
├── template.js
├── preview.png
├── config.json
└── assets/
```

## template.js

```js
export default {
  id: "my-template",
  name: "My Template",
  category: "portfolio",
  style: "modern",
  theme: "ocean",
  tags: ["portfolio", "modern"],
  sections: [
    "navbar",
    "hero",
    "about",
    "projects",
    "contact",
    "footer"
  ]
};
```

## Register it

In V0.1, add the template to `js/catalog.js` with:

```js
register({
  type: "template",
  id: "my-template",
  name: "My Template",
  category: "portfolio",
  style: "modern",
  theme: "ocean",
  tags: ["portfolio", "modern"],
  popularity: 0,
  createdAt: "2026-09-29",
  sections: ["navbar","hero","about","projects","contact","footer"]
});
```

The goal is to move this registration into a dynamic Supabase/community system in a later version.
