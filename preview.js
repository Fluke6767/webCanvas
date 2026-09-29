import { get } from "./registry.js";
import "./catalog.js";

const id = new URLSearchParams(location.search).get("template");
const template = get("template", id);
const titles={hero:"Build Something Amazing",features:"Features",about:"About Us",projects:"Projects",pricing:"Pricing",menu:"Our Menu",gallery:"Gallery",contact:"Contact Us",navbar:"Navigation",footer:"Footer"};
const theme = get("theme", template?.theme);
document.querySelector("#preview").style.setProperty("--primary", theme?.colors.primary || "#2563eb");
document.querySelector("#preview").innerHTML = (template?.sections||["hero","features","contact"]).map(s=>`<section class="${s==="hero"?"hero-section":""}"><h1>${titles[s]||s}</h1><p>${s==="hero"?"A website created with webCanvas.":"Customize this section in the editor."}</p></section>`).join("");
