/* =======================================================================
   Gedeelde code voor de Engels-terminologielijsten.
   Elke pagina zet eerst  const TERMS = [ ["term","definition","group"], ... ];
   en laadt daarna dit bestand. Het tekent de begrippenlijst + de oefenmodule
   (flashcards, meerkeuze en typen, fouten komen terug tot je ze goed hebt).
   ======================================================================= */
(function(){
const css = `
  .terms{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:12px}
  .terms .row{display:grid;grid-template-columns:minmax(0,12rem) minmax(0,1fr);gap:14px;padding:10px 14px;border-top:1px solid var(--line)}
  .terms .row:first-child{border-top:0}
  .terms .row b{color:var(--moss-d)}
  @media (max-width:560px){.terms .row{grid-template-columns:minmax(0,1fr);gap:2px}}
  .tr{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-top:14px;font-family:ui-sans-serif,system-ui,sans-serif}
  .tr .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .tr .lbl{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--amber);font-weight:700;margin:0 0 6px}
  .tr .group{margin-bottom:14px}
  .opt{cursor:pointer;border:1px solid var(--leaf-d);background:var(--leaf);color:var(--moss-d);padding:7px 14px;border-radius:999px;font:inherit;font-size:14px;font-weight:600}
  .opt[aria-pressed="true"]{background:var(--moss);color:#fff;border-color:var(--moss)}
  .go{cursor:pointer;border:0;background:var(--moss);color:#fff;padding:11px 22px;border-radius:10px;font:inherit;font-weight:700;font-size:15px}
  .go.alt{background:var(--leaf);color:var(--moss-d);border:1px solid var(--leaf-d)}
  .go:focus-visible,.opt:focus-visible,.ch:focus-visible,.tr input:focus-visible{outline:3px solid var(--amber);outline-offset:2px}
  .bar{flex:1;height:8px;border-radius:99px;background:var(--leaf);overflow:hidden}
  .bar i{display:block;height:100%;background:var(--moss);transition:width .25s}
  .cnt{font-size:13px;color:var(--soil);font-variant-numeric:tabular-nums}
  .q{font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;font-size:19px;line-height:1.45;margin:14px 0}
  .q.big{font-size:26px;font-weight:700;color:var(--moss-d)}
  .ask{font-size:13px;color:var(--soil)}
  .grp{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--amber);font-weight:700}
  .flip{cursor:pointer;display:block;width:100%;text-align:left;background:var(--paper);border:2px dashed var(--leaf-d);border-radius:10px;padding:14px 16px;font:inherit;color:inherit}
  .flip:hover{border-color:var(--moss)}
  .back{border-top:1px solid var(--line);margin-top:10px;padding-top:10px}
  .chs{display:grid;gap:8px}
  .ch{cursor:pointer;display:flex;gap:10px;text-align:left;background:#fff;border:2px solid var(--line);border-radius:10px;padding:10px 12px;font:inherit;font-size:15px;color:inherit}
  .ch:hover:not(:disabled){border-color:var(--moss)}
  .ch kbd{font:inherit;font-size:12px;color:var(--soil);border:1px solid var(--line);border-radius:5px;padding:0 6px;height:fit-content}
  .ch.ok{border-color:#2f8a57;background:#e5f4ea}
  .ch.no{border-color:#b9473f;background:#fbe9e7}
  .ch:disabled{cursor:default}
  .tr input{flex:1 1 220px;min-width:0;font:inherit;font-size:17px;padding:10px 12px;border:2px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink)}
  .fb{border-radius:10px;padding:10px 12px;margin-top:12px;font-size:15px}
  .fb.ok{background:#e5f4ea} .fb.ok b{color:#2f8a57}
  .fb.typo{background:#fdf4e7} .fb.typo b{color:var(--amber)}
  .fb.no{background:#fbe9e7} .fb.no b{color:#b9473f}
  .fb del{color:#b9473f}
  .act{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:12px}
  .hint{font-size:12px;color:var(--soil);margin-top:8px}
  .score{font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;font-size:44px;font-weight:700;color:var(--moss-d);line-height:1}
  .miss{margin-top:12px;border:1px solid var(--line);border-radius:10px;overflow:hidden}
  .miss div{padding:8px 12px;border-top:1px solid var(--line);font-size:14px}
  .miss div:first-child{border-top:0}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

const esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const slug = s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const CARDS = TERMS.map((c,i)=>({id:i,t:c[0],d:c[1],g:c[2]||""}));

/* ---- begrippenlijst + nav ---- */
const groups = [];
CARDS.forEach(c=>{let g=groups.find(x=>x.naam===c.g); if(!g){g={naam:c.g,cards:[]};groups.push(g)} g.cards.push(c)});
const main = document.getElementById("main"), nav = document.getElementById("nav");
nav.innerHTML = groups.map(g=>`<a href="#${g.naam?slug(g.naam):"terms"}">${esc(g.naam||"Terms")}</a>`).join("") + `<a href="#practise">Practise</a>`;
main.innerHTML = groups.map(g=>`
<section id="${g.naam?slug(g.naam):"terms"}">
  <span class="bs">${g.cards.length} terms</span>
  <h2>${esc(g.naam||"Key terms")}</h2>
  <div class="terms">${g.cards.map(c=>`<div class="row"><b>${esc(c.t)}</b><span>${esc(c.d)}</span></div>`).join("")}</div>
</section>`).join("") + `
<section id="practise">
  <h2 style="color:var(--moss-d)">Practise</h2>
  <p class="goal">Learn the terms like in StudyGo. Wrong answers come back until you get them right.</p>
  <div class="tr" id="tr"></div>
</section>`;

/* ---- antwoord nakijken ---- */
const norm = s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9]+/g," ").trim();
function accepted(term){
  const out = new Set([norm(term)]);
  term.split("/").forEach(p=>{
    out.add(norm(p)); out.add(norm(p.replace(/\(.*?\)/g,"")));
    out.add(norm(p.replace(/\b(character|sound)\b/gi,"")));
  });
  out.delete(""); return [...out];
}
function lev(a,b){let p=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[b.length]}
function check(input,term){
  const x = norm(input).replace(/ /g,""); if(!x) return "no";
  const alts = accepted(term).map(a=>a.replace(/ /g,""));
  if(alts.includes(x)) return "ok";
  if(alts.some(a=>a.length>=5 && lev(a,x)<=(a.length>=10?2:1))) return "typo";
  return "no";
}

/* ---- oefenmodule ---- */
const tr = document.getElementById("tr");
const MODES = {learn:"Flashcards", choice:"Multiple choice", type:"Write it"};
let mode = "type", dir = "d2t", S = null;

function setup(){
  S = null;
  tr.innerHTML = `
    <div class="group"><p class="lbl">How do you want to practise?</p>
      <div class="row">${Object.entries(MODES).map(([k,n])=>`<button class="opt" data-mode="${k}" aria-pressed="${k===mode}">${n}</button>`).join("")}</div></div>
    <div class="group" ${mode==="type"?"hidden":""}><p class="lbl">Ask with</p>
      <div class="row"><button class="opt" data-dir="d2t" aria-pressed="${dir==="d2t"}">Definition → term</button>
      <button class="opt" data-dir="t2d" aria-pressed="${dir==="t2d"}">Term → definition</button></div></div>
    <button class="go" id="start">Start · ${CARDS.length} terms</button>`;
  tr.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;setup()});
  tr.querySelectorAll("[data-dir]").forEach(b=>b.onclick=()=>{dir=b.dataset.dir;setup()});
  tr.querySelector("#start").onclick=()=>start(CARDS);
}
function start(cards){
  S = {cards, queue:shuffle(cards), total:cards.length, done:0, first:0, missed:new Set(), dir:mode==="type"?"d2t":dir};
  next();
}
function next(){
  if(!S.queue.length) return results();
  S.cur = S.queue.shift();
  ({learn:learn, choice:choice, type:type})[mode](S.cur);
}
function mark(card,ok){
  if(ok){S.done++; if(!S.missed.has(card.id)) S.first++}
  else{S.missed.add(card.id); S.queue.splice(Math.min(S.queue.length,3+Math.floor(Math.random()*3)),0,card)}
}
function frame(inner){
  tr.innerHTML = `<div class="row"><button class="opt" id="stop">Stop</button>
    <div class="bar"><i style="width:${Math.round(S.done/S.total*100)}%"></i></div>
    <span class="cnt">${S.done} / ${S.total}</span></div>${inner}`;
  tr.querySelector("#stop").onclick = results;
}
const ask = c=> S.dir==="t2d"
  ? `${c.g?`<div class="grp">${esc(c.g)}</div>`:""}<div class="ask">What does this mean?</div><div class="q big">${esc(c.t)}</div>`
  : `${c.g?`<div class="grp">${esc(c.g)}</div>`:""}<div class="ask">Which term is this?</div><div class="q">${esc(c.d)}</div>`;

function learn(c){
  frame(`<div style="margin-top:14px"><button class="flip" id="flip">${ask(c)}
      <div class="back" id="back" hidden><div class="ask">Answer</div><div class="q ${S.dir==="t2d"?"":"big"}">${esc(S.dir==="t2d"?c.d:c.t)}</div></div>
      <div class="hint" id="tap">Click to turn the card</div></button></div>
    <div class="act" id="rate" hidden><button class="go alt" id="no">Not yet</button><button class="go" id="yes">I knew it</button></div>`);
  tr.querySelector("#flip").onclick=()=>{tr.querySelector("#back").hidden=false;tr.querySelector("#tap").hidden=true;tr.querySelector("#rate").hidden=false;tr.querySelector("#yes").focus()};
  tr.querySelector("#yes").onclick=()=>{mark(c,true);next()};
  tr.querySelector("#no").onclick=()=>{mark(c,false);next()};
}
function choice(c){
  const pool = CARDS.filter(x=>x.id!==c.id);
  const same = shuffle(pool.filter(x=>c.g&&x.g===c.g)), rest = shuffle(pool.filter(x=>!c.g||x.g!==c.g));
  const opts = shuffle([c, ...[...same.slice(0,2), ...rest].slice(0,3)]);
  frame(`${ask(c)}<div class="chs">${opts.map((o,i)=>`<button class="ch" data-id="${o.id}"><kbd>${i+1}</kbd><span>${esc(S.dir==="t2d"?o.d:o.t)}</span></button>`).join("")}</div><div id="fb"></div>`);
  let done = false;
  const pick = id=>{ if(done) return; done = true;
    tr.querySelectorAll(".ch").forEach(b=>{b.disabled=true; if(+b.dataset.id===c.id) b.classList.add("ok"); else if(+b.dataset.id===id) b.classList.add("no")});
    mark(c, id===c.id);
    tr.querySelector("#fb").innerHTML = `<div class="act"><button class="go" id="nx">Next</button></div>`;
    tr.querySelector("#nx").onclick = next; tr.querySelector("#nx").focus();
  };
  tr.querySelectorAll(".ch").forEach(b=>b.onclick=()=>pick(+b.dataset.id));
  S.keys = e=>{const n=+e.key; if(n>=1&&n<=opts.length) pick(opts[n-1].id)};
}
function type(c){
  frame(`${ask(c)}<form class="row" id="f" autocomplete="off"><input id="inp" aria-label="Your answer" placeholder="Type the term…" spellcheck="false" autocapitalize="off"><button class="go" type="submit">Check</button></form>
    <div id="fb"></div><div class="hint">Don’t know it? Press Enter on an empty box to see the answer.</div>`);
  const inp = tr.querySelector("#inp"); inp.focus({preventScroll:true});
  let checked = false;
  tr.querySelector("#f").onsubmit = e=>{
    e.preventDefault(); if(checked) return; checked = true; inp.readOnly = true;
    const v = inp.value, r = check(v, c.t), ok = r!=="no";
    const fb = r==="ok" ? `<div class="fb ok"><b>Correct!</b></div>`
      : r==="typo" ? `<div class="fb typo"><b>Almost! Check your spelling.</b> The answer is <strong>${esc(c.t)}</strong>, you wrote <del>${esc(v)}</del>.</div>`
      : `<div class="fb no"><b>${v.trim()?"Not right.":"The answer:"}</b> ${v.trim()?`You wrote <del>${esc(v)}</del>. `:""}The answer is <strong>${esc(c.t)}</strong>.</div>`;
    tr.querySelector("#fb").innerHTML = fb + `<div class="act">${!ok&&v.trim()?`<button class="go alt" id="ov">I was right anyway</button>`:""}<button class="go" id="nx">Next</button></div>`;
    mark(c, ok);
    const ov = tr.querySelector("#ov");
    if(ov) ov.onclick = ()=>{ S.queue.splice(S.queue.indexOf(c),1); S.missed.delete(c.id); mark(c,true); next() };
    tr.querySelector("#nx").onclick = next; tr.querySelector("#nx").focus();
  };
}
function results(){
  const missed = CARDS.filter(c=>S.missed.has(c.id));
  const grade = Math.max(1, 1 + 9*S.first/S.total);
  const cards = S.cards; S.keys = null;
  tr.innerHTML = `<p class="lbl">${S.queue.length?"Stopped early":"Finished"} · ${MODES[mode]}</p>
    <div class="row" style="gap:24px;align-items:flex-end">
      <div><div class="score">${S.first} / ${S.total}</div><div class="cnt">right first time</div></div>
      <div><div class="score" style="color:${grade>=5.5?"#2f8a57":"#b9473f"}">${grade.toFixed(1)}</div><div class="cnt">as a grade</div></div></div>
    <div class="act" style="justify-content:flex-start">
      ${missed.length?`<button class="go" id="again">Practise my ${missed.length} mistake${missed.length>1?"s":""}</button>`:""}
      <button class="go ${missed.length?"alt":""}" id="redo">Do it again</button><button class="go alt" id="menu">Change mode</button></div>
    ${missed.length?`<div class="miss">${missed.map(c=>`<div><b>${esc(c.t)}</b>: ${esc(c.d)}</div>`).join("")}</div>`:`<p class="hint">No mistakes. Nice work!</p>`}`;
  if(missed.length) tr.querySelector("#again").onclick=()=>start(missed);
  tr.querySelector("#redo").onclick=()=>start(cards);
  tr.querySelector("#menu").onclick=setup;
}
document.addEventListener("keydown",e=>{ if(S&&S.keys&&e.target.tagName!=="INPUT"&&!tr.querySelector("#nx")) S.keys(e) });
setup();
})();
