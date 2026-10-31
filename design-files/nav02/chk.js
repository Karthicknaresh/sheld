
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const ICON = {
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'
};

/* ------------ Content (every live link kept) ------------ */
const NAV = [
 {id:'insurance',label:'Shipping Insurance',current:true,lead:'Protect shipments from covered loss, damage, and theft.',over:'Explore shipping insurance',
  groups:[{t:'Coverage by shipment',l:[['Multi-Carrier Shipments','Parcel and freight across UPS, FedEx, DHL, and USPS'],['UPS Shipments','Coverage designed for packages shipped with UPS'],['Special Commodities','High-value, perishable, and specialty goods']]},
          {t:'Get started',l:[['Select My Coverage','Answer a few questions to find the right fit'],['Get a Quote','Estimate cost for your shipping volume']]}],
  feat:{k:'Guide',t:'Carrier liability vs shipping insurance'}},
 {id:'solutions',label:'Solutions',lead:'Tools that reduce risk before, during, and after delivery.',over:'See all solutions',
  groups:[{t:'Products',cols:2,l:[['CommerceShield','Order risk signals and chargeback protection'],['DeliveryDefense','Address confidence scores before you ship'],['Delivery Orchestration','Choose delivery options that lower risk'],['InsureShield® Shipping Insurance','Protection against loss, damage, and theft']]}],
  feat:{k:'Related',t:'Protect high-value goods with Parcel Pro®'}},
 {id:'claims',label:'Claims',href:'#'},
 {id:'partners',label:'Partners',lead:'Connect InsureShield to the platforms you already ship with.',over:'Partners overview',
  groups:[{t:'Work with us',l:[['Connect with a Partner','Add coverage inside the platforms you use'],['Become a Partner','Offer InsureShield to your customers']]}],
  chips:['Shopify','ShipStation','Shippo','AfterShip','WooCommerce']},
 {id:'resources',label:'Resources',lead:'Guides, stories, and support for shippers.',over:'All resources',
  groups:[{t:'Learn',l:[['Insights','Articles on shipping risk and protection'],['Whitepapers & Guides','In-depth research and how-to guides'],['Customer Stories','How businesses recover faster']]},{t:'Get help',l:[['Help & Support','Answers about coverage, billing, and claims']]}],
  feat:{k:'Customer story',t:'Proof keeps ice cream frozen & customers happy'}},
 {id:'about',label:'About',lead:'News, availability, and how to reach us.',over:'About InsureShield',
  groups:[{t:'Company',l:[['Announcements','Product and company news'],['In The News','Press coverage of UPS Capital'],['Product Availability','Where coverage is offered']]},{t:'Talk to us',l:[['Contact Us','Reach our team']]}]}
];
const MENUS = NAV.filter(n=>!n.href);
const byId = id => MENUS.find(m=>m.id===id);
const amp = s => s.replace(/&/g,'&amp;');

/* ------------ Iso SVG illustrations (site line style) ------------ */
const ISO = (function(){
  const C=Math.cos(Math.PI/6);
  function scene(scale){
    const s=scale||13, parts=[], pts=[];
    const P=(x,y,z)=>{ const p=[(x-y)*C*s,(x+y)*.5*s-z*s]; pts.push(p); return p; };
    const f=p=>p.map(n=>n.toFixed(1)).join(',');
    return {
      P,
      box(x,y,z,w,d,h,cls=''){
        const t=[P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)].map(f).join(' ');
        const l=[P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)].map(f).join(' ');
        const r=[P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)].map(f).join(' ');
        parts.push(`<g class="${cls}"><polygon class="f-l" points="${l}"/><polygon class="f-r" points="${r}"/><polygon class="f-t" points="${t}"/></g>`);
      },
      shieldX(x,y,z,w,h){ // upright shield on a plane facing +x
        const uv=[[0,1],[.5,1.08],[1,1],[1,.42],[.82,.12],[.5,-.05],[.18,.12],[0,.42]];
        const pp=uv.map(([u,v])=>f(P(x,y+u*w,z+v*h))).join(' ');
        const tk=[[.26,.52],[.44,.34],[.76,.74]].map(([u,v])=>f(P(x,y+u*w,z+v*h))).join(' ');
        parts.push(`<polygon class="shield" points="${pp}"/><polyline class="tick" points="${tk}"/>`);
      },
      raw(svg){ parts.push(svg); },
      out(label){
        const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
        const x0=Math.min(...xs)-4, y0=Math.min(...ys)-4, w=Math.max(...xs)-x0+4, h=Math.max(...ys)-y0+4;
        return `<svg class="iso" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" aria-hidden="true">${parts.join('')}</svg>`;
      }
    };
  }
  return {
    insurance(){ const s=scene(); s.box(-1,-1,0,9,9,.01,'plate'); s.box(0,1,0,5,5,3.6); s.box(0,3.2,3.6,5,.6,.02,'soft'); s.shieldX(6.2,2.4,.6,2.6,3.2); return s.out(); },
    solutions(){ const s=scene(); s.box(-1,-1,0,9,9,.01,'plate'); s.box(0,0,0,7,7,.9); s.box(1,1,.9,5,5,.9,'soft'); s.box(2,2,1.8,3,3,.9); s.box(2.8,2.8,2.7,1.4,1.4,1.4,'acc'); return s.out(); },
    partners(){ const s=scene(); s.box(-1,-1,0,10,8,.01,'plate'); s.box(0,0,0,3.2,3.2,3.2); s.box(3.2,1.1,1.6,2.4,1,.6,'soft'); s.box(5.6,0,0,3.2,3.2,3.2,'acc'); return s.out(); },
    resources(){ const s=scene(); s.box(-1,-1,0,9,9,.01,'plate'); s.box(0,0,0,6,7,.35); s.box(.3,-.2,.35,6,7,.35,'soft'); s.box(.1,.1,.7,6,7,.35);
      const a=s.P(1.2,1.6,1.05), b=s.P(4.6,1.6,1.05), c=s.P(1.2,3,1.05), d=s.P(4,3,1.05), e=s.P(1.2,4.4,1.05), g=s.P(3.2,4.4,1.05);
      s.raw(`<line class="line-acc" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><line class="line-acc" x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}"/><line class="line-acc" x1="${e[0]}" y1="${e[1]}" x2="${g[0]}" y2="${g[1]}"/>`); return s.out(); },
    about(){ const s=scene(); s.box(-1,-1,0,8,8,.01,'plate'); s.box(1,1,0,4,4,1.2,'soft');
      const c=s.P(3,3,4.4); const r=34; s.P(3,3,4.4+3); s.P(3,3,1.2);
      s.raw(`<circle class="globe" cx="${c[0]}" cy="${c[1]}" r="${r}"/><ellipse class="meridian" cx="${c[0]}" cy="${c[1]}" rx="${r*.42}" ry="${r}"/><ellipse class="meridian" cx="${c[0]}" cy="${c[1]}" rx="${r}" ry="${r*.36}"/><ellipse class="ring" cx="${c[0]}" cy="${c[1]}" rx="${r*1.3}" ry="${r*.42}" transform="rotate(-14 ${c[0]} ${c[1]})"/>`);
      s.P(3-4.2,3+4.2,4.4); s.P(3+4.2,3-4.2,4.4); return s.out(); }
  };
})();

/* ------------ Markup per concept ------------ */
const itemHTML = (l,i) => `<li><a class="it" href="#" style="--i:${i}" data-desc="${amp(l[1])}"><span class="it-l">${amp(l[0])}${ICON.arrow}</span><span class="it-d">${amp(l[1])}</span></a></li>`;
function groupsHTML(m){ let i=0; return m.groups.map(g=>`<div class="grp" style="--cols:${g.cols||1}"><p class="gt" style="--i:${i++}">${g.t}</p><ul>${g.l.map(l=>itemHTML(l,i++)).join('')}</ul></div>`).join(''); }

const BUILD = {
  morph(){
    return `<div class="mx" id="mx"><div class="mx-box"><div class="mx-surface"></div><div class="mx-view">${MENUS.map(m=>`
      <div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}">
        <div class="lyr-g">
          <div class="lead" style="grid-row:span 2"><span class="lead-k">${m.label}</span><p class="lead-t">${m.lead}</p><a class="ul-link" href="#">${m.over}${ICON.arrow}</a><div class="lead-art">${ISO[m.id]()}</div></div>
          <div class="links">${groupsHTML(m)}</div>
          ${m.feat?`<a class="feat" href="#"><span><span class="feat-k">${m.feat.k}</span><span class="feat-t">${amp(m.feat.t)}</span></span>${ICON.arrow}</a>`:m.chips?`<div class="feat" style="justify-content:flex-start"><span class="feat-k">Integrations</span><span class="chips">${m.chips.map(c=>`<span>${c}</span>`).join('')}</span></div>`:''}
        </div>
      </div>`).join('')}</div></div></div>`;
  },
  rail(){
    return `<div class="rail" id="rail"><div class="ctr"><div class="rail-view">${MENUS.map(m=>{ let i=0; return `
      <div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}">
        <a class="rail-sec" href="#" style="--i:${i++}" data-desc="${amp(m.lead)}">${m.label} overview ${ICON.arrow}</a>
        ${m.groups.flatMap(g=>g.l).map(l=>`<a class="rail-a" href="#" style="--i:${i++}" data-desc="${amp(l[1])}">${amp(l[0])}</a>`).join('')}
      </div>`;}).join('')}</div><p class="rail-desc" aria-hidden="true"><span></span></p></div></div>`;
  },
  lattice(){
    return `<div class="mega" id="mega"><div class="ctr"><div class="stage"><div class="c-host" aria-hidden="true"></div><div class="stage-cap"><span class="st"></span><span class="ss"></span></div></div><div class="mega-view">${MENUS.map(m=>{
      const n = m.groups.reduce((a,g)=>a+1+g.l.length,0);
      return `<div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}"><div class="cols">${groupsHTML(m)}</div>
        <div class="mfoot" style="--i:${n}"><a class="ul-link" href="#">${m.over}${ICON.arrow}</a>${m.feat?`<span>${m.feat.k}: ${amp(m.feat.t)}</span>`:m.chips?`<span>Works with ${m.chips.join(', ')}</span>`:''}</div></div>`;}).join('')}</div></div></div>`;
  }
};

/* ------------ three.js objects for concept 3 ------------ */
const Scene3D = (function(){
  let R=null, scene, cam, host=null, raf=0, run=false, failed=false, cur=null, old=null, clock=0, last=0, hop=1, curId=null;
  const COL={white:0xffffff, low:0xe7f2f2, mid:0xcfe5e5, high:0x9fcbcb, teal:0x0a8080, deep:0x075a5a, ink:0x121212};
  function init(){
    if(R) return true; if(failed || typeof THREE==='undefined') return false;
    try{
      R=new THREE.WebGLRenderer({antialias:true,alpha:true}); R.setPixelRatio(Math.min(devicePixelRatio||1,2)); R.setClearColor(0,0);
      scene=new THREE.Scene(); cam=new THREE.OrthographicCamera(-3,3,3,-3,.1,100); cam.position.set(10,8.2,10); cam.lookAt(0,.45,0);
      scene.add(new THREE.AmbientLight(0xffffff,.8)); const d=new THREE.DirectionalLight(0xffffff,.38); d.position.set(3,6,1.5); scene.add(d);
    }catch(e){ failed=true; R=null; return false; }
    return true;
  }
  function part(geo,color,x,y,z,o={}){
    const g=new THREE.Group(); g.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color})));
    if(o.edges!==false) g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),new THREE.LineBasicMaterial({color:COL.ink,transparent:true,opacity:.82})));
    g.position.set(x,y,z); if(o.ry) g.rotation.y=o.ry; if(o.rx) g.rotation.x=o.rx; if(o.rz) g.rotation.z=o.rz;
    g.userData.target=g.position.clone(); return g;
  }
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  function plate(){ const g=new THREE.Group(); const geo=new THREE.PlaneGeometry(4.6,4.6); geo.rotateX(-Math.PI/2);
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineDashedMaterial({color:0xb2b2bb,dashSize:.12,gapSize:.1})));
    g.children[0].computeLineDistances(); g.userData.target=g.position.clone(); return g; }
  function shield(){
    const s=new THREE.Shape(); s.moveTo(0,.95); s.lineTo(.72,.72); s.lineTo(.72,.08); s.quadraticCurveTo(.66,-.6,0,-.95); s.quadraticCurveTo(-.66,-.6,-.72,.08); s.lineTo(-.72,.72); s.closePath();
    const g=part(new THREE.ExtrudeGeometry(s,{depth:.22,bevelEnabled:false}),COL.teal,0,0,0);
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.3,.02,.23),new THREE.Vector3(-.06,-.24,.23),new THREE.Vector3(.34,.26,.23)]),new THREE.LineBasicMaterial({color:0xffffff})));
    return g;
  }
  const SC={
    insurance(){ const sh=shield(); sh.position.set(1.15,1.05,1.05); sh.rotation.y=Math.PI/4; sh.userData.target=sh.position.clone();
      return [plate(),part(B(2.2,1.5,2.2),COL.white,-.55,.75,-.45),part(B(2.22,.04,.44),COL.high,-.55,1.52,-.45,{edges:false}),sh]; },
    solutions(){ return [plate(),part(B(3,.34,3),COL.white,0,.17,0),part(B(2.2,.34,2.2),COL.low,0,.51,0),part(B(1.45,.34,1.45),COL.mid,0,.85,0),part(B(.72,.72,.72),COL.teal,0,1.38,0)]; },
    partners(){ return [plate(),part(B(1.3,1.3,1.3),COL.white,-1.05,.65,.2),part(B(1.3,1.3,1.3),COL.teal,1.05,.65,-.2),part(B(.9,.26,.36),COL.high,0,.92,0,{ry:-.18})]; },
    resources(){ return [plate(),part(B(2.3,.12,2.9),COL.white,0,.06,0),part(B(2.3,.12,2.9),COL.low,.06,.2,-.05,{ry:.14}),part(B(2.3,.12,2.9),COL.white,-.02,.34,.02,{ry:-.08}),part(B(.26,.04,1.1),COL.teal,.7,.42,.95,{ry:-.08})]; },
    about(){ return [plate(),part(B(1.7,.42,1.7),COL.low,0,.21,0),part(new THREE.IcosahedronGeometry(1.05,1),COL.white,0,1.55,0),part(new THREE.TorusGeometry(1.4,.035,6,64),COL.teal,0,1.55,0,{edges:false,rx:Math.PI/2.4,rz:.25})]; }
  };
  function make(id){ const g=new THREE.Group(); const ps=SC[id](); ps.forEach((p,i)=>{p.userData.i=i; g.add(p);}); g.userData={t:0,ps}; return g; }
  function dispose(g){ g.traverse(o=>{ o.geometry&&o.geometry.dispose(); o.material&&o.material.dispose(); }); scene.remove(g); }
  const eo=t=>1-Math.pow(1-t,3);
  function size(){ if(!R||!host) return; const w=host.clientWidth||1,h=host.clientHeight||1; R.setSize(w,h,false); const a=w/h,s=2.85; cam.left=-s*a;cam.right=s*a;cam.top=s;cam.bottom=-s;cam.updateProjectionMatrix(); }
  function settle(g){ g.userData.ps.forEach(p=>{p.position.copy(p.userData.target);p.scale.setScalar(1);}); g.rotation.y=0; g.position.y=0; g.userData.t=99; }
  function tick(now){
    if(!run) return; const dt=Math.min(.05,(now-last)/1000||0); last=now; clock+=dt;
    if(cur){ cur.userData.t+=dt; const T=cur.userData.t;
      cur.userData.ps.forEach(p=>{ const k=eo(Math.max(0,Math.min(1,(T-p.userData.i*.08)/.5))); p.position.set(p.userData.target.x,p.userData.target.y+(1-k)*1.8,p.userData.target.z); p.scale.setScalar(Math.max(.001,k)); });
      hop=Math.min(1,hop+dt/.38); cur.rotation.y=Math.sin(clock*.45)*.14; cur.position.y=Math.sin(clock*1.1)*.035+Math.sin(hop*Math.PI)*.16; }
    if(old){ old.userData.o=(old.userData.o||0)+dt; const k=Math.min(1,old.userData.o/.18); old.scale.setScalar(Math.max(.001,1-k)); old.position.y=-k*.5; if(k>=1){dispose(old);old=null;} }
    R.render(scene,cam); raf=requestAnimationFrame(tick);
  }
  return {
    attach(el){ if(!init()){ el.innerHTML='<p class="c-fallback">Still illustration shown when 3D is unavailable</p>'; host=null; return; } host=el; if(R.domElement.parentNode!==el) el.appendChild(R.domElement); size(); },
    show(id){ if(!R||!host) return; const rm=RM.matches;
      if(id!==curId){ curId=id; if(old){dispose(old);old=null;} if(cur){ if(rm) dispose(cur); else old=cur; } cur=make(id); scene.add(cur); hop=1; }
      size(); if(rm){ settle(cur); if(old){dispose(old);old=null;} R.render(scene,cam); return; }
      if(!run){ run=true; last=performance.now(); raf=requestAnimationFrame(tick); } },
    nudge(){ if(run) hop=0; },
    stop(){ run=false; cancelAnimationFrame(raf); },
    reset(){ this.stop(); if(scene){ cur&&dispose(cur); old&&dispose(old); } cur=old=null; curId=null; host=null; },
    size
  };
})();

/* ------------ Header controller ------------ */
const hdr=$('#hdr'), list=$('#nav-list'), ind=$('.nav-ind'), ddRoot=$('#dd-root');
list.innerHTML = NAV.map(n=> n.href
  ? `<li><a class="nav-t" href="${n.href}">${n.label}</a></li>`
  : `<li><button class="nav-t" type="button" data-id="${n.id}" aria-expanded="false" aria-controls="dd-${n.id}"${n.current?' aria-current="page"':''}>${n.label}${ICON.chev}</button></li>`).join('');
const triggers=$$('.nav-t[data-id]'), ids=triggers.map(t=>t.dataset.id);
let opt='morph', openId=null, tOpen=0, tClose=0, layers=[];

function placeInd(t){
  if(!t){ ind.classList.remove('on'); return; }
  const nr=$('.nav').getBoundingClientRect(), tr=t.getBoundingClientRect();
  ind.style.width=(tr.width-24)+'px'; ind.style.translate=`${tr.left-nr.left+12}px 0`; ind.classList.add('on');
}
function swapLayers(id, prev, axis){
  const dir = prev ? Math.sign(ids.indexOf(id)-ids.indexOf(prev)) : 0;
  layers.forEach(l=>{
    const isNew=l.dataset.id===id, isOld=l.dataset.id===prev && prev!==id;
    if(isNew){ l.style.setProperty(axis==='y'?'--fy':'--fx', (axis==='y'?dir*10:dir*28)+'px'); l.classList.remove('out'); void l.offsetWidth; l.classList.add('in'); l.inert=false; }
    else if(isOld){ l.style.setProperty(axis==='y'?'--ty':'--tx', (axis==='y'?-dir*10:-dir*28)+'px'); l.classList.remove('in'); l.classList.add('out'); l.inert=true; }
    else { l.classList.remove('in','out'); l.inert=true; }
  });
}
let descSpan=null;
function setDesc(text){
  if(!descSpan || descSpan.textContent===text) return;
  if(RM.matches){ descSpan.textContent=text; return; }
  descSpan.classList.add('leave');
  setTimeout(()=>{ descSpan.textContent=text; descSpan.classList.remove('leave'); descSpan.classList.add('enter'); void descSpan.offsetWidth; descSpan.classList.remove('enter'); }, 120);
}
const OPEN = {
  morph(id, prev){
    const mx=$('#mx'), lyr=$(`#dd-${id}`), t=triggers[ids.indexOf(id)];
    const hr=hdr.getBoundingClientRect(), tr=t.getBoundingClientRect();
    const w=lyr.offsetWidth, h=lyr.offsetHeight;
    let x=tr.left-hr.left+tr.width/2-w/2; x=Math.max(24,Math.min(x,hr.width-w-24));
    if(!prev) mx.classList.add('instant');
    mx.style.width=w+'px'; mx.style.height=h+'px'; mx.style.translate=`${x}px 0`;
    mx.style.setProperty('--ox',(tr.left-hr.left+tr.width/2-x)+'px');
    if(!prev){ void mx.offsetWidth; mx.classList.remove('instant'); }
    swapLayers(id, prev, 'x'); mx.classList.add('open');
  },
  rail(id, prev){
    const rail=$('#rail'); descSpan=$('.rail-desc span');
    if(!prev){ descSpan.textContent=byId(id).lead; }
    else setDesc(byId(id).lead);
    swapLayers(id, prev, 'y'); rail.classList.add('open');
  },
  lattice(id, prev){
    const mega=$('#mega'), lyr=$(`#dd-${id}`);
    swapLayers(id, prev, 'y');
    const h=Math.max(280, lyr.offsetHeight)+52; mega.style.height=h+'px'; mega.classList.add('open');
    const m=byId(id); $('.stage-cap .st',mega).textContent=m.label; $('.stage-cap .ss',mega).textContent=m.lead;
    if(!prev) Scene3D.attach($('.c-host',mega)); Scene3D.show(id);
  }
};
const CLOSE = {
  morph(){ const mx=$('#mx'); mx.classList.remove('open'); setTimeout(()=>{ if(!openId) layers.forEach(l=>l.classList.remove('in','out')); }, 220); },
  rail(){ $('#rail').classList.remove('open'); layers.forEach(l=>l.classList.remove('in','out')); },
  lattice(){ const mega=$('#mega'); mega.classList.remove('open'); mega.style.height='0px'; Scene3D.stop(); layers.forEach(l=>l.classList.remove('in','out')); }
};
function show(id){
  clearTimeout(tOpen); clearTimeout(tClose);
  if(openId===id) return;
  const prev=openId; openId=id;
  triggers.forEach(t=>t.setAttribute('aria-expanded',String(t.dataset.id===id)));
  placeInd(triggers[ids.indexOf(id)]);
  document.body.classList.add('menu-open');
  OPEN[opt](id, prev);
}
function hide(focusBack){
  clearTimeout(tOpen); clearTimeout(tClose);
  if(!openId) return;
  const t=triggers[ids.indexOf(openId)]; openId=null;
  triggers.forEach(x=>x.setAttribute('aria-expanded','false'));
  layers.forEach(l=>l.inert=true);
  placeInd(null); document.body.classList.remove('menu-open');
  CLOSE[opt]();
  if(focusBack&&t) t.focus();
}
const mouse=e=>e.pointerType==='mouse';
triggers.forEach(t=>{
  t.addEventListener('pointerenter',e=>{ if(!mouse(e)) return; clearTimeout(tClose);
    if(openId) show(t.dataset.id); else { clearTimeout(tOpen); tOpen=setTimeout(()=>show(t.dataset.id),90); } });
  t.addEventListener('click',()=> openId===t.dataset.id ? hide(false) : show(t.dataset.id));
  t.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ e.preventDefault(); show(t.dataset.id); const f=$(`#dd-${t.dataset.id} a`); f&&setTimeout(()=>f.focus(),40); } });
});
$$('.nav-t:not([data-id])').forEach(a=>a.addEventListener('pointerenter',e=>{ if(!mouse(e)) return; clearTimeout(tOpen); if(openId){ clearTimeout(tClose); tClose=setTimeout(()=>hide(false),200); } }));
hdr.addEventListener('pointerleave',e=>{ if(!mouse(e)) return; clearTimeout(tOpen); tClose=setTimeout(()=>hide(false),240); });
hdr.addEventListener('pointerenter',e=>{ if(mouse(e)) clearTimeout(tClose); });
hdr.addEventListener('keydown',e=>{ if(e.key==='Escape'&&openId){ e.preventDefault(); hide(true); } });
hdr.addEventListener('focusout',e=>{ if(openId && !hdr.contains(e.relatedTarget)) hide(false); });
document.addEventListener('pointerdown',e=>{ if(openId && !hdr.contains(e.target)) hide(false); });
window.addEventListener('scroll',()=>{ if(openId) hide(false); },{passive:true});
window.addEventListener('resize',()=>{ if(openId){ const id=openId; openId=null; show(id); } Scene3D.size(); });
ddRoot.addEventListener('click',e=>{ if(e.target.closest('a')) e.preventDefault(); });
ddRoot.addEventListener('pointerover',e=>{
  const a=e.target.closest('[data-desc]'); if(!a) return;
  if(opt==='rail') setDesc(a.dataset.desc);
  if(opt==='lattice' && a.classList.contains('it')) Scene3D.nudge();
});
ddRoot.addEventListener('focusin',e=>{ const a=e.target.closest('[data-desc]'); if(a&&opt==='rail') setDesc(a.dataset.desc); });

function setOpt(o){
  if(!BUILD[o]) o='morph';
  hide(false); Scene3D.reset();
  opt=o; document.body.dataset.opt=o;
  ddRoot.innerHTML=BUILD[o]();
  layers=$$('.lyr',ddRoot); layers.forEach(l=>l.inert=true);
  $$('.switch a').forEach(a=>a.setAttribute('aria-current',String(a.dataset.o===o)));
  Lattice.setInteractive(o==='lattice');
}

/* ------------ Hero lattice (canvas) ------------ */
const Lattice=(function(){
  const cv=$('canvas.lattice'), ctx=cv.getContext('2d'); let W=0,H=0,dpr=1,nodes=[],cols=0,rows=0,interactive=false,mx=-999,my=-999,raf=0,active=false;
  const SP=58, C=Math.cos(Math.PI/6);
  function build(){
    const r=cv.getBoundingClientRect(); W=r.width; H=r.height; dpr=Math.min(devicePixelRatio||1,2);
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    nodes=[]; const dx=SP*C, dy=SP/2; cols=Math.ceil(W/dx)+2; rows=Math.ceil(H/SP)+2;
    for(let c=0;c<cols;c++) for(let r=0;r<rows;r++){ const x=c*dx, y=r*SP+(c%2?dy:0)-dy; nodes.push({x,y,c,r,lift:0}); }
    draw();
  }
  const at=(c,r)=> (c<0||r<0||c>=cols||r>=rows)?null:nodes[c*rows+r];
  function fade(x){ const s=W*.38; return Math.max(0,Math.min(1,(x-s)/(W*.22))); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const cyCenter=H*.48;
    for(const n of nodes){
      const a=fade(n.x); if(a<=0) continue;
      const vy = 1-Math.min(1,Math.abs(n.y-cyCenter)/(H*.62));
      const al=a*Math.max(0,vy);
      if(al<=.02) continue;
      const nb=[at(n.c,n.r+1), at(n.c+1, n.c%2? n.r : n.r-1), at(n.c+1, n.c%2? n.r+1 : n.r)];
      // draw cube-like hex pattern: skip some edges for an isometric "lattice" rhythm
      nb.forEach((m,k)=>{ if(!m) return; if(((n.c+n.r+k)%3)===0) return;
        const lift=(n.lift+m.lift)/2; const t=Math.min(1,lift);
        ctx.strokeStyle = t>0.05 ? `rgba(10,128,128,${(0.12+0.5*t)*al})` : `rgba(26,26,31,${0.09*al})`;
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(n.x, n.y-n.lift*8); ctx.lineTo(m.x, m.y-m.lift*8); ctx.stroke(); });
    }
    for(const n of nodes){
      const a=fade(n.x); const vy=1-Math.min(1,Math.abs(n.y-cyCenter)/(H*.62)); const al=a*Math.max(0,vy); if(al<=.02) continue;
      const t=Math.min(1,n.lift);
      ctx.fillStyle = t>0.05 ? `rgba(10,128,128,${(0.35+0.6*t)*al})` : `rgba(26,26,31,${0.28*al})`;
      ctx.beginPath(); ctx.arc(n.x, n.y-n.lift*8, 1.5+t*1.2, 0, Math.PI*2); ctx.fill();
    }
  }
  function loop(){
    let moving=false;
    for(const n of nodes){ const d=Math.hypot(n.x-mx,n.y-my); const target = d<150 ? (1-d/150) : 0; const nl=n.lift+(target-n.lift)*.12; if(Math.abs(nl-n.lift)>.002) moving=true; n.lift=nl; }
    draw();
    if(moving || active) raf=requestAnimationFrame(loop); else raf=0;
  }
  const hero=$('.hero');
  hero.addEventListener('pointermove',e=>{ if(!interactive||RM.matches) return; const r=cv.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; active=true; if(!raf) raf=requestAnimationFrame(loop); });
  hero.addEventListener('pointerleave',()=>{ mx=my=-999; active=false; if(interactive && !raf) raf=requestAnimationFrame(loop); });
  addEventListener('resize',()=>build());
  return { build, setInteractive(v){ interactive=v; mx=my=-999; active=false; nodes.forEach(n=>n.lift=0); draw(); } };
})();

/* ------------ Estimator ------------ */
(function(){
  const V=[10,25,50,75,100,150,200,250,300,400,500,600,700,800,1000,1250,1500,2000,2500,3000];
  const N=V.length; let lo=4, hi=14;
  const hist=$('#hist'), trk=$('#trk'), sel=$('#sel'), hl=$('#hd-lo'), hh=$('#hd-hi');
  hist.innerHTML=V.map((v,i)=>`<i style="height:${(14+Math.pow(i/(N-1),1.25)*86).toFixed(0)}%"></i>`).join('');
  const bars=$$('i',hist);
  const money=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const val=n=>'$'+n.toLocaleString('en-US');
  function render(){
    const a=lo/N*100, b=(hi+1)/N*100;
    sel.style.left=a+'%'; sel.style.width=(b-a)+'%'; hl.style.left=a+'%'; hh.style.left=b+'%';
    bars.forEach((el,i)=>el.classList.toggle('on',i>=lo&&i<=hi));
    $('#est-range').textContent=`${val(V[lo])} to ${val(V[hi])}`;
    $('#est-v').textContent=`${money(V[lo]*.008)} to ${money(V[hi]*.0105)}`;
    [[hl,lo],[hh,hi]].forEach(([el,i])=>{ el.setAttribute('aria-valuemin',V[0]); el.setAttribute('aria-valuemax',V[N-1]); el.setAttribute('aria-valuenow',V[i]); el.setAttribute('aria-valuetext',val(V[i])); });
  }
  const idxAt=x=>{ const r=trk.getBoundingClientRect(); return Math.max(0,Math.min(N,Math.round((x-r.left)/r.width*N))); };
  let mode=null, grab=0;
  trk.addEventListener('pointerdown',e=>{
    const t=e.target; trk.setPointerCapture(e.pointerId); trk.classList.add('drag');
    if(t===hl) mode='lo'; else if(t===hh) mode='hi'; else if(t===sel){ mode='band'; grab=idxAt(e.clientX)-lo; }
    else { const i=idxAt(e.clientX); mode = Math.abs(i-lo) < Math.abs(i-(hi+1)) ? 'lo':'hi'; move(e); }
  });
  function move(e){
    if(!mode) return; const i=idxAt(e.clientX);
    if(mode==='lo') lo=Math.min(Math.max(0,i),hi);
    else if(mode==='hi') hi=Math.max(Math.min(N-1,i-1),lo);
    else { const w=hi-lo; let n=Math.max(0,Math.min(N-1-w,i-grab)); lo=n; hi=n+w; }
    render();
  }
  trk.addEventListener('pointermove',move);
  trk.addEventListener('pointerup',()=>{ mode=null; trk.classList.remove('drag'); });
  const key=(which)=>e=>{
    const d = (e.key==='ArrowRight'||e.key==='ArrowUp')?1:(e.key==='ArrowLeft'||e.key==='ArrowDown')?-1:0; if(!d) return; e.preventDefault();
    if(which==='lo') lo=Math.min(Math.max(0,lo+d),hi); else hi=Math.max(Math.min(N-1,hi+d),lo); render();
  };
  hl.addEventListener('keydown',key('lo')); hh.addEventListener('keydown',key('hi'));
  render();
})();

/* ------------ Mobile drawer ------------ */
(function(){
  const dr=$('#mdrawer'), bt=$('.burger');
  dr.innerHTML=`<nav class="md-vp" aria-label="Main"><div class="md-track"><div class="md-lvl md-a"><ul class="md-l1">${NAV.map(n=>n.href?`<li><a class="md-row" href="#">${n.label}${ICON.right}</a></li>`:`<li><button class="md-row" type="button" data-drill="${n.id}">${n.label}${ICON.right}</button></li>`).join('')}</ul>
    <div class="md-util"><a href="#">Log in</a><a href="#">Contact us</a><a href="#">Search</a><a href="#">United States - English</a></div></div>
    <div class="md-lvl md-b" inert><button class="md-back" type="button">${ICON.left}All menus</button>${MENUS.map(m=>{let i=0;return `<div class="md-sec" data-id="${m.id}"><h2>${m.label}</h2><p class="lead-t">${m.lead}</p>${m.groups.map(g=>`<p class="gt">${g.t}</p><ul>${g.l.map(l=>itemHTML(l,i++)).join('')}</ul>`).join('')}</div>`;}).join('')}</div></div></nav>
    <div class="md-foot"><a class="btn btn-primary" href="#">Get a quote</a><a class="btn btn-secondary" href="#">Claims</a></div>`;
  const tr=$('.md-track',dr), a=$('.md-a',dr), b=$('.md-b',dr);
  let last=null, th=0;
  function open(){ clearTimeout(th); document.documentElement.style.setProperty('--hdr-h',hdr.getBoundingClientRect().height+'px'); dr.hidden=false; void dr.offsetWidth; dr.classList.add('open'); bt.setAttribute('aria-expanded','true'); bt.setAttribute('aria-label','Close menu'); document.body.style.overflow='hidden'; setTimeout(()=>$('.md-row',dr).focus(),40); }
  function close(){ dr.classList.remove('open'); bt.setAttribute('aria-expanded','false'); bt.setAttribute('aria-label','Open menu'); document.body.style.overflow=''; tr.classList.remove('deep'); a.inert=false; b.inert=true; th=setTimeout(()=>dr.hidden=true,220); bt.focus(); }
  bt.addEventListener('click',()=> bt.getAttribute('aria-expanded')==='true'?close():open());
  $$('[data-drill]',dr).forEach(x=>x.addEventListener('click',()=>{ last=x; $$('.md-sec',dr).forEach(s=>s.classList.toggle('on',s.dataset.id===x.dataset.drill)); b.scrollTop=0; tr.classList.add('deep'); a.inert=true; b.inert=false; setTimeout(()=>$('.md-back',dr).focus(),330); }));
  $('.md-back',dr).addEventListener('click',()=>{ tr.classList.remove('deep'); a.inert=false; b.inert=true; last&&setTimeout(()=>last.focus(),330); });
  dr.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  dr.addEventListener('click',e=>{ if(e.target.closest('a')) e.preventDefault(); });
})();

document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#"]'); if(a) e.preventDefault(); });

/* ------------ Boot ------------ */
function fromHash(){ return (location.hash||'').replace('#','') || 'morph'; }
addEventListener('hashchange',()=>setOpt(fromHash()));
Lattice.build();
setOpt(fromHash());
const q=new URLSearchParams(location.search).get('open');
if(q) setTimeout(()=>show(q),300);
})();
