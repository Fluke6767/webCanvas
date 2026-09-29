import { register } from "./registry.js";

register({type:"category",id:"business",name:"Business",icon:"💼"});
register({type:"category",id:"portfolio",name:"Portfolio",icon:"👤"});
register({type:"category",id:"marketing",name:"Marketing",icon:"📢"});
register({type:"category",id:"shop",name:"Shop",icon:"🛍️"});
register({type:"category",id:"restaurant",name:"Restaurant",icon:"🍔"});
register({type:"category",id:"personal",name:"Personal",icon:"✨"});

register({type:"style",id:"modern",name:"Modern"});
register({type:"style",id:"minimal",name:"Minimal"});
register({type:"style",id:"luxury",name:"Luxury"});
register({type:"style",id:"futuristic",name:"Futuristic"});
register({type:"style",id:"glass",name:"Glass"});

register({
  type:"theme", id:"ocean", name:"Ocean Blue",
  colors:{primary:"#2563eb",secondary:"#dbeafe",background:"#ffffff",text:"#111827"}
});
register({
  type:"theme", id:"midnight", name:"Midnight",
  colors:{primary:"#8b5cf6",secondary:"#312e81",background:"#0f172a",text:"#f8fafc"}
});
register({
  type:"theme", id:"sunset", name:"Sunset",
  colors:{primary:"#f97316",secondary:"#fed7aa",background:"#fff7ed",text:"#431407"}
});

const baseSections = ["navbar","hero","features","about","contact","footer"];

register({
  type:"template", id:"modern-company", name:"Modern Company",
  category:"business", style:"modern", theme:"ocean",
  tags:["company","business","modern"], popularity:98, createdAt:"2026-09-29",
  sections:baseSections
});
register({
  type:"template", id:"developer-dark", name:"Developer Dark",
  category:"portfolio", style:"futuristic", theme:"midnight",
  tags:["developer","portfolio","dark"], popularity:95, createdAt:"2026-09-29",
  sections:["navbar","hero","projects","about","contact","footer"]
});
register({
  type:"template", id:"startup-launch", name:"Startup Launch",
  category:"marketing", style:"modern", theme:"ocean",
  tags:["startup","landing","marketing"], popularity:91, createdAt:"2026-09-29",
  sections:["navbar","hero","features","pricing","contact","footer"]
});
register({
  type:"template", id:"luxury-cafe", name:"Luxury Cafe",
  category:"restaurant", style:"luxury", theme:"sunset",
  tags:["cafe","restaurant","food"], popularity:88, createdAt:"2026-09-29",
  sections:["navbar","hero","menu","gallery","contact","footer"]
});
