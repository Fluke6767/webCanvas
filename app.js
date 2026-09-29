import { getAll, searchTemplates } from "./registry.js";
import "./catalog.js";

const $ = s => document.querySelector(s);
const grids = {
  recommended: $("#recommendedGrid"),
  popular: $("#popularGrid"),
  new: $("#newGrid")
};

function templateCard(t) {
  const colors = {
    ocean:["#2563eb","#7c3aed"], midnight:["#0f172a","#4c1d95"], sunset:["#f97316","#dc2626"]
  }[t.theme] || ["#64748b","#94a3b8"];
  return `<article class="template-card">
    <div class="thumb" style="--a:${colors[0]};--b:${colors[1]}"><div class="thumb-ui"><b></b></div></div>
    <div class="card-body">
      <h4>${t.name}</h4>
      <div class="meta">${t.category} · ${t.style}</div>
      <div class="card-actions"><span>🔥 ${t.popularity}</span><button class="use-btn" data-use="${t.id}">Use template</button></div>
    </div>
  </article>`;
}

function render(list, target) {
  target.innerHTML = list.map(templateCard).join("");
  target.querySelectorAll("[data-use]").forEach(btn => {
    btn.onclick = () => location.href = `editor.html?template=${encodeURIComponent(btn.dataset.use)}`;
  });
}

function refresh(query="") {
  let list = searchTemplates(query);
  const category = $("#categoryFilter").value;
  const style = $("#styleFilter").value;
  if (category !== "all") list = list.filter(t => t.category === category);
  if (style !== "all") list = list.filter(t => t.style === style);
  render([...list].sort((a,b)=>b.popularity-a.popularity).slice(0,8), grids.recommended);
  render([...list].sort((a,b)=>b.popularity-a.popularity).slice(0,8), grids.popular);
  render([...list].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,8), grids.new);
}

const categories = getAll("category");
categories.forEach(c => $("#categoryFilter").insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.name}</option>`));
getAll("style").forEach(s => $("#styleFilter").insertAdjacentHTML("beforeend", `<option value="${s.id}">${s.name}</option>`));
$("#categoryGrid").innerHTML = categories.map(c => `<button class="category" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join("");
$("#categoryGrid").querySelectorAll("[data-cat]").forEach(b => b.onclick=()=>{ $("#categoryFilter").value=b.dataset.cat; refresh($("#searchInput").value); location.hash="templates"; });

$("#searchInput").addEventListener("input", e=>refresh(e.target.value));
$("#categoryFilter").addEventListener("change", ()=>refresh($("#searchInput").value));
$("#styleFilter").addEventListener("change", ()=>refresh($("#searchInput").value));

$("#createBtn").onclick = () => location.href="editor.html";
$("#generateBtn").onclick = () => {
  const q = $("#searchInput").value.trim();
  if (q) refresh(q);
  location.hash="templates";
};
$("#starterBtn").onclick = () => location.href="docs/TEMPLATE_STARTER.md";

refresh();
