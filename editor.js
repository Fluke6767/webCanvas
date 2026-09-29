import { getAll, get } from "./registry.js";
import "./catalog.js";

const params = new URLSearchParams(location.search);
const template = get("template", params.get("template")) || getAll("template")[0];
const $ = s => document.querySelector(s);

$("#editorTitle").textContent = template ? template.name : "New Website";
$("#templateInfo").textContent = JSON.stringify(template, null, 2);

const sectionList = $("#sectionList");
const canvas = $("#websiteCanvas");

const sectionTitles = {
  navbar:"Navigation", hero:"Hero", features:"Features", about:"About",
  projects:"Projects", pricing:"Pricing", menu:"Menu", gallery:"Gallery",
  contact:"Contact", footer:"Footer"
};

function renderSite() {
  const theme = get("theme", template?.theme);
  const primary = $("#primaryColor").value || theme?.colors.primary || "#2563eb";
  const bg = $("#bgColor").value || theme?.colors.background || "#fff";
  canvas.innerHTML = `<div class="site" style="--primary:${primary};background:${bg}">
    ${(template?.sections || ["hero","features","contact"]).map((s,i)=>`
      <section class="${s==="hero"?"hero-section":""}">
        <h1>${sectionTitles[s] || s}</h1>
        <p>${s==="hero" ? "Build something amazing with webCanvas." : "This section is ready to customize."}</p>
      </section>`).join("")}
  </div>`;
}

sectionList.innerHTML = (template?.sections || []).map((s,i)=>`<div class="section-item" draggable="true" data-section="${s}">${i+1}. ${sectionTitles[s]||s}</div>`).join("");
$("#primaryColor").addEventListener("input", renderSite);
$("#bgColor").addEventListener("input", renderSite);
$("#previewBtn").onclick=()=>location.href=`preview.html?template=${template.id}`;
$("#exportBtn").onclick=()=>alert("V0.1: Export engine is scaffolded. Next version will generate downloadable HTML/CSS/JS.");

renderSite();
