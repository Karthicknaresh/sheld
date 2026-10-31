
(function(){
"use strict";

/* ---------------- Icons ---------------- */
const I = {
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18"/>',
  truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
  gem:'<path d="M6 4h12l3 5-9 11L3 9zM3 9h18M9.5 4 12 9l2.5-5M12 9v11"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  quote:'<path d="M6 2.5h9l5 5V21.5H6zM15 2.5v5h5M9.5 13h7M9.5 17h4.5"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  scan:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/>',
  pin:'<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 000-6H9a3 3 0 010-6h7"/>',
  link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  plug:'<path d="M9 2.5v5M15 2.5v5M6 7.5h12v3.5a6 6 0 01-12 0zM12 17v4.5"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0012 3z"/>',
  doc:'<path d="M6 2.5h9l5 5V21.5H6zM15 2.5v5h5M9.5 12.5h7M9.5 16.5h7"/>',
  story:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 10.5h7"/>',
  help:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  mega:'<path d="M3 10v4h4l8 5V5L7 10zM18.5 9a4 4 0 010 6"/>',
  news:'<path d="M4 5h13v14H6a2 2 0 01-2-2zM17 9h3v8a2 2 0 01-2 2M8 9h5M8 13h5"/>',
  map:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
  chat:'<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  lang:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  claim:'<path d="M6 2.5h9l5 5V21.5H6zM15 2.5v5h5"/><path d="M9 14.5l2.2 2.2 4.3-4.5"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  right:'<path d="M9 6l6 6-6 6"/>',
  left:'<path d="M15 6l-6 6 6 6"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};
const svg = (n, sw=1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n]}</svg>`;

/* ---------------- Content (all current links preserved) ---------------- */
const NAV = [
  { id:'insurance', label:'Shipping Insurance', current:true,
    summary:'Protect shipments from covered loss, damage and theft.', overview:'Shipping insurance overview',
    groups:[
      { title:'Coverage by shipment', links:[
        {label:'Multi-Carrier Shipments', desc:'Parcel and freight across UPS, FedEx, DHL and USPS', icon:'globe'},
        {label:'UPS Shipments', desc:'Coverage designed for packages shipped with UPS', icon:'truck'},
        {label:'Special Commodities', desc:'High-value, perishable and specialty goods', icon:'gem'} ]},
      { title:'Get started', links:[
        {label:'Select My Coverage', desc:'Answer a few questions to find the right fit', icon:'sliders'},
        {label:'Get a Quote', desc:'Estimate cost for your shipping volume', icon:'quote'} ]}
    ],
    feature:{kicker:'Guide', title:'Carrier liability vs shipping insurance', body:'Why a carrier’s liability is not the same as insuring the value of what you ship.', cta:'Read the guide'}
  },
  { id:'solutions', label:'Solutions',
    summary:'Tools that reduce risk before, during and after delivery.', overview:'See all solutions',
    groups:[
      { title:'Products', cols:2, links:[
        {label:'CommerceShield', desc:'Order risk signals and chargeback protection', icon:'scan'},
        {label:'DeliveryDefense', desc:'Address confidence scores before you ship', icon:'pin'},
        {label:'Delivery Orchestration', desc:'Choose delivery options that lower risk', icon:'route'},
        {label:'InsureShield® Shipping Insurance', desc:'Protection against loss, damage and theft', icon:'shield'} ]}
    ],
    feature:{kicker:'Related', title:'Protect high-value goods with Parcel Pro®', body:'Specialized shipping, embedded insurance and claims support in one web application.', cta:'Visit Parcel Pro'}
  },
  { id:'claims', label:'Claims', href:'#' },
  { id:'partners', label:'Partners',
    summary:'Connect InsureShield to the platforms you already ship with.', overview:'Partners overview',
    groups:[
      { title:'Work with us', links:[
        {label:'Connect with a Partner', desc:'Add coverage inside the platforms you use', icon:'link'},
        {label:'Become a Partner', desc:'Offer InsureShield to your customers', icon:'plug'} ]}
    ],
    chips:['Shopify','ShipStation','Shippo','AfterShip','WooCommerce']
  },
  { id:'resources', label:'Resources',
    summary:'Guides, stories and support for shippers.', overview:'All resources',
    groups:[
      { title:'Learn', links:[
        {label:'Insights', desc:'Articles on shipping risk and protection', icon:'bulb'},
        {label:'Whitepapers & Guides', desc:'In-depth research and how-to guides', icon:'doc'},
        {label:'Customer Stories', desc:'How businesses recover faster', icon:'story'} ]},
      { title:'Get help', links:[
        {label:'Help & Support', desc:'Answers about coverage, billing and claims', icon:'help'} ]}
    ],
    feature:{kicker:'Customer story', title:'Proof keeps ice cream frozen & customers happy', body:'Shipping insurance designed for perishables.', cta:'Read the story'}
  },
  { id:'about', label:'About',
    summary:'News, availability and how to reach us.', overview:'About InsureShield',
    groups:[
      { title:'Company', links:[
        {label:'Announcements', desc:'Product and company news', icon:'mega'},
        {label:'In The News', desc:'Press coverage of UPS Capital', icon:'news'},
        {label:'Product Availability', desc:'Where coverage is offered', icon:'map'} ]},
      { title:'Talk to us', links:[
        {label:'Contact Us', desc:'Reach our team', icon:'chat'} ]}
    ]
  }
];
const MENUS = NAV.filter(s => !s.href);

const OPTIONS = {
  A:{ name:'A · Morph', tag:'A single panel that reshapes and slides between menus, keeping you oriented as you explore.',
      why:'Stakeholders asked for the fluid tab-to-tab motion seen on the reference sites. Here the motion carries meaning: the caret and panel stay tied to the item that opened them, and content slides in the direction you moved, so visitors build a mental map of the menu.',
      best:'Most visitors, and especially first-time shippers comparing coverage types, who benefit from icons and descriptions.',
      watch:['Needs careful hover-intent tuning so it doesn’t feel twitchy.','Panel sizes differ per menu; keep the content widths consistent so the morph stays small.','Production build should use FLIP transforms instead of animating width and height.'],
      motion:[['Panel appears (fade, 8px drop, slight scale)','base · enter'],['Resize and move to the next item','slow · standard'],['Content slides 48px in the direction of travel','slow · standard'],['Hover pill follows the pointer','base · standard']] },
  B:{ name:'B · Quiet', tag:'A calm, full-width panel focused on scanning. The motion is a single sliding underline.',
      why:'Closest to today’s structure, so returning customers and claimants relearn nothing. A section intro explains each menu in a sentence, and the wide layout makes room for future links without redesign.',
      best:'Teams that need the lowest risk and fastest build, or a header that must run on AEM pages during migration.',
      watch:['Less memorable, and gives stakeholders little of the motion they asked for.','Two header rows take 104px of height; check the hide-on-scroll threshold.'],
      motion:[['Teal underline slides to the open item','base · standard'],['Panel height adjusts to the menu','base · standard'],['Content crossfade (no movement)','fast · standard']] },
  C:{ name:'C · Illustrated', tag:'A live isometric scene that builds a different object for each menu, matching the page’s illustrations.',
      why:'The new Shipping Insurance page already tells its story with line-drawn isometric illustrations. Carrying them into the header makes the brand recognizable at the very first interaction, and each object gives the section a visual name (parcel and shield for coverage, a globe for About).',
      best:'Campaign moments and brand-led launches where the header is part of the first impression.',
      watch:['Adds three.js (about 150 KB gzipped). Load it only on first open, and fall back to a still image if WebGL is unavailable.','Less room for links than A or B.','The object must never move while someone is reading links; it only reacts to their pointer.'],
      motion:[['Panel height opens','slow · standard'],['Object assembles piece by piece','about 600ms, staggered'],['Gentle sway while idle (pauses when the panel closes)','continuous, low amplitude'],['Object hops when you point at a link','about 350ms']] }
};

/* ---------------- Markup builders ---------------- */
const esc = s => s.replace(/&/g,'&amp;');
function linkHTML(l, withArrow){
  return `<li><a class="lk" href="#" data-plain><span class="ico">${svg(l.icon)}</span><span><span class="lb">${esc(l.label)}${withArrow?` <span class="arrow">→</span>`:''}</span><span class="ds">${esc(l.desc)}</span></span></a></li>`;
}
function groupsHTML(s, cls){
  return s.groups.map(g => `<div class="${cls}" style="--cols:${g.cols||1}"><p class="gtitle">${esc(g.title)}</p><ul class="glist">${g.links.map(l=>linkHTML(l,true)).join('')}</ul></div>`).join('');
}
function logoHTML(){
  return `<a class="p-logo" href="#" data-plain aria-label="InsureShield home"><span class="mark" aria-hidden="true">LOGO</span><span class="word" aria-hidden="true">InsureShield<sup>®</sup></span></a>`;
}
function triggersHTML(v){
  return NAV.map(s => s.href
    ? `<li><a class="t-link" href="#" data-plain>${s.label}</a></li>`
    : `<li><button class="t-btn" type="button" data-id="${s.id}" aria-expanded="false" aria-controls="${v}-c-${s.id}"${s.current?' data-current':''}><span>${s.label}</span>${svg('chev',2)}</button></li>`
  ).join('');
}

function contentA(s){
  const foot = s.feature
    ? `<a class="a-foot" href="#" data-plain><span><span class="fk">${s.feature.kicker}</span><span class="ft">${esc(s.feature.title)}</span><span class="prop">Proposed</span></span><span class="go">${s.feature.cta} ${svg('arrow',2)}</span></a>`
    : s.chips ? `<div class="a-foot"><span><span class="fk">Integrations</span><span class="chips" style="display:inline-flex">${s.chips.map(c=>`<span>${c}</span>`).join('')}</span></span></div>` : '';
  return `<div class="p-content" id="A-c-${s.id}" data-id="${s.id}" role="region" aria-label="${s.label}"><div class="a-inner">${groupsHTML(s,'a-group')}</div>${foot}</div>`;
}
function contentB(s){
  const side = s.feature
    ? `<a class="b-feat" href="#" data-plain><span class="fk">${s.feature.kicker} <span class="prop">Proposed</span></span><span class="ft">${esc(s.feature.title)}</span><span class="fb">${esc(s.feature.body)}</span><span class="go">${s.feature.cta} →</span></a>`
    : s.chips ? `<div class="b-feat"><span class="fk">Integrations</span><div class="chips">${s.chips.map(c=>`<span>${c}</span>`).join('')}</div></div>` : '<div></div>';
  return `<div class="p-content" id="B-c-${s.id}" data-id="${s.id}" role="region" aria-label="${s.label}"><div class="b-inner"><div class="b-intro"><p class="bt">${s.label}</p><p class="bs">${esc(s.summary)}</p><a class="bo" href="#" data-plain>${s.overview}</a></div><div class="b-groups">${groupsHTML(s,'b-group')}</div>${side}</div></div>`;
}
function contentC(s){
  const feat = s.feature ? `<div class="c-feat"><span>${s.feature.kicker}:</span><a href="#" data-plain>${esc(s.feature.title)}</a></div>`
    : s.chips ? `<div class="c-feat"><span>Integrations:</span><span>${s.chips.join(' · ')}</span></div>` : '';
  return `<div class="p-content" id="C-c-${s.id}" data-id="${s.id}" role="region" aria-label="${s.label}"><div class="c-inner"><div class="c-groups">${groupsHTML(s,'c-group')}</div>${feat}</div></div>`;
}

function desktopHTML(v){
  const actionsSingle = `<div class="p-actions">
      <button class="icon-btn" type="button" aria-label="Search">${svg('search',1.8)}</button>
      <a class="u-link" href="#" data-plain aria-label="Language: United States – English">${svg('lang')}<span>EN</span></a>
      <a class="u-link" href="#" data-plain>Log in</a>
      <a class="btn btn-primary btn-sm" href="#" data-plain>Get a quote</a>
    </div>`;
  let panel = '', extra = '', util = '';
  if(v==='A'){
    extra = `<span class="a-hl" aria-hidden="true"></span>`;
    panel = `<div class="a-pos"><div class="a-card">${MENUS.map(contentA).join('')}</div><span class="a-caret" aria-hidden="true"></span></div>`;
  } else if(v==='B'){
    util = `<div class="p-util"><a href="#" data-plain>Contact us</a><a href="#" data-plain>${svg('lang')}United States – English</a><a href="#" data-plain>${svg('user')}Log in</a></div>`;
    extra = `<span class="b-ind" aria-hidden="true"></span>`;
    panel = `<div class="b-panel">${MENUS.map(contentB).join('')}</div>`;
  } else {
    panel = `<div class="c-panel"><div class="c-grid"><div class="c-stage"><div class="c-host" aria-hidden="true"></div><div class="c-cap"><span class="ct"></span><span class="cs"></span></div></div><div class="c-view">${MENUS.map(contentC).join('')}</div></div></div>`;
  }
  const actions = v==='B' ? `<div class="p-actions"><button class="icon-btn" type="button" aria-label="Search">${svg('search',1.8)}</button><a class="btn btn-primary btn-sm" href="#" data-plain>Get a quote</a></div>` : actionsSingle;
  return `<div class="d-only p-desk">
    <div class="p-scrim"></div>
    <header class="p-header">
      ${util}
      <div class="p-bar">
        ${logoHTML()}
        <nav aria-label="Main" style="height:100%"><ul class="p-list">${extra}${triggersHTML(v)}</ul></nav>
        ${actions}
        ${v==='B'?'':''}
      </div>
      ${v==='A'?panel:''}
      ${v!=='A'?`<div style="position:relative">${panel}</div>`:''}
    </header>
    <div class="fp" aria-hidden="true">
      <div><p class="k">InsureShield® Shipping Insurance</p><h2>Shipping insurance for <u>lost</u> shipments</h2><p>InsureShield® Shipping Insurance helps businesses recover faster after covered loss or damage to a shipment.</p><div class="cta"><span class="btn btn-primary">Quote monthly cost</span><span class="btn btn-secondary">Talk to an expert</span></div></div>
      <div class="art"><span>Page illustration</span></div>
    </div>
  </div>`;
}

function mobileHTML(v){
  const l1 = v==='B'
    ? NAV.map(s => s.href
        ? `<li><a class="m-row" href="#" data-plain>${s.label}${svg('right',2)}</a></li>`
        : `<li><button class="m-row m-acc" type="button" aria-expanded="false" aria-controls="mb-${s.id}"><span>${s.label}${s.current?'<span class="cur">You are here</span>':''}</span>${svg('chev',2)}</button><div class="m-acc-panel" id="mb-${s.id}"><div><div class="inner">${s.groups.map(g=>`<p class="gtitle">${esc(g.title)}</p><ul class="glist">${g.links.map(l=>linkHTML(l,false)).join('')}</ul>`).join('')}</div></div></div></li>`).join('')
    : NAV.map(s => s.href
        ? `<li><a class="m-row" href="#" data-plain>${s.label}${svg('right',2)}</a></li>`
        : `<li><button class="m-row" type="button" data-drill="${s.id}"><span>${s.label}${s.current?'<span class="cur">You are here</span>':''}</span>${svg('right',2)}</button></li>`).join('');
  const util = `<div class="m-util"><a href="#" data-plain>${svg('user')}Log in</a><a href="#" data-plain>${svg('chat')}Contact us</a><a href="#" data-plain>${svg('search')}Search</a><a href="#" data-plain>${svg('lang')}United States – English</a></div>`;
  const l2 = v==='B' ? '' : `<div class="m-level m-l2"><button class="m-back" type="button">${svg('left',2)}All menus</button>${v==='C'?'<div class="m-stage"><div class="c-host" aria-hidden="true"></div></div>':''}${MENUS.map(s=>`<div class="p-content" data-id="${s.id}" role="region" aria-label="${s.label}"><p class="m-title">${s.label}</p><p class="m-sum">${esc(s.summary)}</p>${s.groups.map(g=>`<p class="gtitle">${esc(g.title)}</p><ul class="glist">${g.links.map(l=>linkHTML(l,false)).join('')}</ul>`).join('')}${s.feature?`<a class="m-feat" href="#" data-plain><span class="fk">${s.feature.kicker}</span><span class="ft">${esc(s.feature.title)}</span></a>`:''}</div>`).join('')}</div>`;
  return `<div class="m-only p-mob">
    <header class="p-header">
      <div class="m-bar">${logoHTML()}<div class="m-right"><button class="icon-btn" type="button" aria-label="Search">${svg('search',1.8)}</button><button class="burger" type="button" aria-expanded="false" aria-controls="${v}-drawer" aria-label="Menu"><span class="lines" aria-hidden="true"><i></i><i></i><i></i></span></button></div></div>
    </header>
    <div class="m-drawer" id="${v}-drawer" hidden>
      <nav class="m-viewport" aria-label="Main">
        <div class="m-track">
          <div class="m-level m-l1-wrap"><ul class="m-l1">${l1}</ul>${util}</div>
          ${l2}
        </div>
      </nav>
      <div class="m-foot"><a class="btn btn-primary" href="#" data-plain>Get a quote</a><a class="btn btn-secondary" href="#" data-plain>${svg('claim')}Claims</a></div>
    </div>
    <div class="m-fp" aria-hidden="true"><p class="k">InsureShield® Shipping Insurance</p><h2>Shipping insurance for <u>lost</u> shipments</h2><p>InsureShield® Shipping Insurance helps businesses recover faster after covered loss or damage to a shipment.</p><div class="cta"><span class="btn btn-primary">Quote monthly cost</span><span class="btn btn-secondary">Talk to an expert</span></div></div>
  </div>`;
}

/* ---------------- three.js scene (Option C) ---------------- */
const Scene3D = (function(){
  let renderer=null, scene, camera, host=null, raf=0, running=false, failed=false;
  let current=null, outgoing=null, clock=0, last=0, hop=1, currentId=null;
  const COL = { body:0xf3f9f9, light:0xe7f2f2, mid:0xcfe5e5, high:0x9fcbcb, teal:0x0a8080, edge:0x075a5a, plate:0xffffff };
  function ok(){ return typeof THREE !== 'undefined' && !failed; }
  function init(){
    if(renderer || !ok()) return !!renderer;
    try{
      renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
      renderer.setClearColor(0x000000, 0);
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-3,3,3,-3,0.1,100);
      camera.position.set(10, 8.2, 10); camera.lookAt(0, 0.55, 0);
      scene.add(new THREE.AmbientLight(0xffffff, 0.78));
      const d = new THREE.DirectionalLight(0xffffff, 0.42); d.position.set(3, 6, 1.5); scene.add(d);
    }catch(e){ failed = true; renderer = null; return false; }
    return true;
  }
  function part(geo, color, x, y, z, opts={}){
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color}));
    g.add(m);
    if(opts.edges !== false){
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({color: opts.edgeColor||COL.edge, transparent:true, opacity:.85}));
      g.add(e);
    }
    g.position.set(x,y,z);
    if(opts.ry) g.rotation.y = opts.ry;
    if(opts.rx) g.rotation.x = opts.rx;
    if(opts.rz) g.rotation.z = opts.rz;
    g.userData.target = g.position.clone();
    return g;
  }
  const box = (w,h,d) => new THREE.BoxGeometry(w,h,d);
  function plate(){ return part(box(4.4,.14,4.4), COL.plate, 0, -.07, 0); }
  function shield(){
    const s = new THREE.Shape();
    s.moveTo(0,.95); s.lineTo(.72,.7); s.lineTo(.72,.05); s.quadraticCurveTo(.68,-.62,0,-.95); s.quadraticCurveTo(-.68,-.62,-.72,.05); s.lineTo(-.72,.7); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, {depth:.22, bevelEnabled:false});
    const g = part(geo, COL.teal, 0,0,0, {edgeColor:COL.edge});
    const pts = [new THREE.Vector3(-.3,.02,.23), new THREE.Vector3(-.06,-.24,.23), new THREE.Vector3(.34,.26,.23)];
    const chk = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color:0xffffff}));
    g.add(chk);
    return g;
  }
  const BUILD = {
    insurance(){
      const parts=[plate()];
      parts.push(part(box(2.2,1.5,2.2), COL.body, -.55, .75, -.45));
      parts.push(part(box(2.22,.03,.42), COL.high, -.55, 1.515, -.45, {edges:false}));
      parts.push(part(box(.42,.03,2.22), COL.high, -.55, 1.52, -.45, {edges:false}));
      const sh = shield(); sh.position.set(1.15, 1.05, 1.05); sh.rotation.y = Math.PI/4; sh.userData.target = sh.position.clone(); parts.push(sh);
      return parts;
    },
    solutions(){
      return [plate(),
        part(box(3,.32,3), COL.body, 0,.16,0),
        part(box(2.2,.32,2.2), COL.light, 0,.48,0),
        part(box(1.45,.32,1.45), COL.mid, 0,.8,0),
        part(box(.72,.72,.72), COL.teal, 0,1.32,0)];
    },
    partners(){
      return [plate(),
        part(box(1.3,1.3,1.3), COL.body, -1.05,.65,.2),
        part(box(1.3,1.3,1.3), COL.teal, 1.05,.65,-.2),
        part(box(.9,.26,.36), COL.high, 0,.92,0, {ry:-.18}),
        part(box(.24,.24,.24), COL.mid, -1.05,1.45,.2),
        part(box(.24,.24,.24), COL.mid, 1.05,1.45,-.2)];
    },
    resources(){
      const p=[plate(),
        part(box(2.3,.1,2.9), COL.body, 0,.07,0),
        part(box(2.3,.1,2.9), COL.light, .05,.2,-.05, {ry:.14}),
        part(box(2.3,.1,2.9), COL.plate, -.02,.33,.02, {ry:-.08})];
      [[-.6],[-.15],[.3]].forEach(([z],i)=>p.push(part(box(i===0?1.5:1.1,.02,.1), COL.high, -.1,.395,z, {edges:false, ry:-.08})));
      p.push(part(box(.26,.04,1.1), COL.teal, .7,.4,.95, {ry:-.08}));
      return p;
    },
    about(){
      const globe = part(new THREE.IcosahedronGeometry(1.05,1), COL.body, 0,1.55,0);
      const ringG = new THREE.TorusGeometry(1.4,.035,6,64);
      const ring = part(ringG, COL.teal, 0,1.55,0, {edges:false, rx:Math.PI/2.4, rz:.25});
      return [plate(), part(box(1.7,.42,1.7), COL.light, 0,.21,0), globe, ring];
    }
  };
  function make(id){
    const g = new THREE.Group();
    const parts = (BUILD[id]||BUILD.insurance)();
    parts.forEach((p,i)=>{ p.userData.i=i; g.add(p); });
    g.userData = {t:0, parts};
    return g;
  }
  function dispose(g){
    g.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); });
    scene.remove(g);
  }
  const easeOut = t => 1-Math.pow(1-t,3);
  function size(){
    if(!renderer || !host) return;
    const w = host.clientWidth||1, h = host.clientHeight||1;
    renderer.setSize(w, h, false);
    const a = w/h, s = 2.9;
    camera.left=-s*a; camera.right=s*a; camera.top=s; camera.bottom=-s; camera.updateProjectionMatrix();
  }
  function poseAssembled(g){
    g.userData.parts.forEach(p=>{ p.position.copy(p.userData.target); p.scale.setScalar(1); });
    g.userData.t = 99;
  }
  function frame(now){
    if(!running) return;
    const dt = Math.min(.05, (now-last)/1000 || 0); last = now; clock += dt;
    if(current){
      current.userData.t += dt;
      const T = current.userData.t;
      current.userData.parts.forEach(p=>{
        const k = easeOut(Math.max(0, Math.min(1, (T - p.userData.i*.075)/.45)));
        p.position.set(p.userData.target.x, p.userData.target.y + (1-k)*2.2, p.userData.target.z);
        p.scale.setScalar(Math.max(.001,k));
      });
      hop = Math.min(1, hop + dt/.35);
      current.rotation.y = Math.sin(clock*.5)*.12;
      current.position.y = Math.sin(clock*1.2)*.04 + Math.sin(hop*Math.PI)*.18;
    }
    if(outgoing){
      outgoing.userData.out = (outgoing.userData.out||0) + dt;
      const k = Math.min(1, outgoing.userData.out/.2);
      outgoing.scale.setScalar(Math.max(.001,1-k)); outgoing.position.y = -k*.6;
      if(k>=1){ dispose(outgoing); outgoing=null; }
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  return {
    attach(el){
      if(!el) return;
      if(!init()){ el.innerHTML = '<p class="c-fallback">3D illustration unavailable here. A still image would show in production.</p>'; host=null; return; }
      host = el; if(renderer.domElement.parentNode !== el) el.appendChild(renderer.domElement); size();
    },
    show(id, reduced){
      if(!renderer || !host) return;
      if(id === currentId && current){ this.start(reduced); return; }
      currentId = id;
      if(outgoing){ dispose(outgoing); outgoing=null; }
      if(current){ if(reduced){ dispose(current); } else { outgoing = current; } }
      current = make(id); scene.add(current); hop = 1;
      if(reduced){ poseAssembled(current); current.rotation.y = 0; current.position.y = 0; size(); renderer.render(scene,camera); this.stop(); return; }
      this.start(reduced);
    },
    nudge(){ if(running) hop = 0; },
    start(reduced){
      if(!renderer || !host) return;
      size();
      if(reduced){ if(current){ poseAssembled(current); current.rotation.y=0; current.position.y=0; } renderer.render(scene,camera); return; }
      if(running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    },
    stop(){ running=false; cancelAnimationFrame(raf); },
    reset(){ this.stop(); if(scene){ if(current) dispose(current); if(outgoing) dispose(outgoing); } current=outgoing=null; currentId=null; host=null; },
    resize: size
  };
})();

/* ---------------- Controllers ---------------- */
const stage = document.getElementById('stage');
const frameEl = document.getElementById('frame');
const rmToggle = document.getElementById('rm-toggle');
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => mq.matches || rmToggle.checked;
let state = { opt:'A', dev:'desktop' };
let cleanup = [];
const on = (el, ev, fn, opts) => { el.addEventListener(ev, fn, opts); cleanup.push(()=>el.removeEventListener(ev, fn, opts)); };

function setupDesktop(root, v){
  const header = root.querySelector('.p-header');
  const triggers = [...root.querySelectorAll('.t-btn')];
  const list = root.querySelector('.p-list');
  const panel = root.querySelector(v==='A'?'.a-pos':v==='B'?'.b-panel':'.c-panel');
  const contents = [...panel.querySelectorAll('.p-content')];
  const ids = triggers.map(t=>t.dataset.id);
  const hl = root.querySelector('.a-hl'), ind = root.querySelector('.b-ind'), caret = root.querySelector('.a-caret');
  let openId=null, tOpen=0, tClose=0;
  contents.forEach(c=>{ c.inert = true; });

  function placeBar(el, t){
    if(!el || !t) return;
    const lb = list.getBoundingClientRect(), tb = t.getBoundingClientRect();
    if(el===ind){ el.style.width = (tb.width-24)+'px'; el.style.transform = `translateX(${tb.left-lb.left+12}px)`; }
    else { el.style.width = tb.width+'px'; el.style.transform = `translateX(${tb.left-lb.left}px)`; }
  }
  function layout(active, trig, wasOpen){
    if(v==='A'){
      const hb = header.getBoundingClientRect(), tb = trig.getBoundingClientRect();
      const w = active.offsetWidth, h = active.offsetHeight;
      let left = tb.left - hb.left + tb.width/2 - w/2;
      left = Math.max(16, Math.min(left, hb.width - w - 16));
      const cx = tb.left - hb.left + tb.width/2 - left;
      if(!wasOpen) panel.classList.add('no-anim');
      panel.style.width = w+'px'; panel.style.height = h+'px'; panel.style.transform = `translateX(${left}px)`;
      caret.style.setProperty('--caret-x', cx+'px');
      panel.querySelector('.a-card').style.setProperty('--caret', cx+'px');
      if(!wasOpen){ void panel.offsetWidth; panel.classList.remove('no-anim'); }
    } else if(v==='B'){
      panel.style.height = active.offsetHeight+'px';
      placeBar(ind, trig); ind.classList.add('on');
    } else {
      panel.style.height = Math.max(active.offsetHeight, 300)+'px';
      const s = MENUS.find(m=>m.id===trig.dataset.id);
      root.querySelector('.c-cap .ct').textContent = s.label;
      root.querySelector('.c-cap .cs').textContent = s.summary;
    }
  }
  function show(id){
    clearTimeout(tOpen); clearTimeout(tClose);
    const wasOpen = !!openId; const idx = ids.indexOf(id); if(idx<0) return;
    openId = id;
    triggers.forEach(t=>t.setAttribute('aria-expanded', String(t.dataset.id===id)));
    contents.forEach((c,i)=>{ const act = i===idx; c.classList.toggle('is-active', act); c.inert = !act; c.style.setProperty('--shift', i<idx?-1:i>idx?1:0); });
    layout(contents[idx], triggers[idx], wasOpen);
    panel.classList.add('is-open'); root.classList.add('is-open');
    if(v==='C'){
      if(!wasOpen) Scene3D.attach(root.querySelector('.c-panel .c-host'));
      Scene3D.show(id, reduced());
    }
  }
  function hide(focusBack){
    clearTimeout(tOpen); clearTimeout(tClose);
    if(!openId) return;
    const t = triggers[ids.indexOf(openId)];
    openId = null;
    triggers.forEach(t=>t.setAttribute('aria-expanded','false'));
    contents.forEach(c=>{ c.inert = true; });
    panel.classList.remove('is-open'); root.classList.remove('is-open');
    if(v==='B'){ panel.style.height = '0px'; ind.classList.remove('on'); }
    if(v==='C'){ panel.style.height = '0px'; Scene3D.stop(); }
    if(v==='A'){ contents.forEach(c=>c.classList.remove('is-active')); }
    if(hl && !header.matches(':hover')) hl.classList.remove('on');
    if(focusBack && t) t.focus();
  }
  const isMouse = e => e.pointerType === 'mouse';
  triggers.forEach(t=>{
    on(t,'pointerenter', e=>{
      if(!isMouse(e)) return;
      if(hl){ placeBar(hl,t); hl.classList.add('on'); }
      clearTimeout(tClose);
      if(openId){ if(openId!==t.dataset.id) show(t.dataset.id); }
      else { clearTimeout(tOpen); tOpen = setTimeout(()=>show(t.dataset.id), 80); }
    });
    on(t,'click', ()=>{ openId===t.dataset.id ? hide(false) : show(t.dataset.id); });
    on(t,'keydown', e=>{
      if(e.key==='ArrowDown'){ e.preventDefault(); show(t.dataset.id); const c = contents[ids.indexOf(t.dataset.id)]; const f = c.querySelector('a'); if(f) setTimeout(()=>f.focus(), 30); }
    });
  });
  root.querySelectorAll('.t-link').forEach(a=>on(a,'pointerenter', e=>{
    if(!isMouse(e)) return; if(hl){ placeBar(hl,a); hl.classList.add('on'); }
    clearTimeout(tOpen); if(openId){ clearTimeout(tClose); tClose = setTimeout(()=>hide(false), 240); }
  }));
  on(header,'pointerleave', e=>{ if(!isMouse(e)) return; clearTimeout(tOpen); if(hl && !openId) hl.classList.remove('on'); tClose = setTimeout(()=>{ hide(false); if(hl) hl.classList.remove('on'); }, 240); });
  on(header,'pointerenter', e=>{ if(isMouse(e) && openId) clearTimeout(tClose); });
  on(header,'keydown', e=>{ if(e.key==='Escape' && openId){ e.preventDefault(); hide(true); } });
  on(header,'focusout', e=>{ if(openId && !header.contains(e.relatedTarget)) hide(false); });
  on(document,'pointerdown', e=>{ if(openId && !header.contains(e.target)) hide(false); });
  if(v==='C') panel.querySelectorAll('.lk').forEach(a=>{ on(a,'pointerenter', ()=>Scene3D.nudge()); on(a,'focus', ()=>Scene3D.nudge()); });
  on(window,'resize', ()=>{ if(openId){ const i=ids.indexOf(openId); layout(contents[i], triggers[i], true); if(v==='C') Scene3D.resize(); } });
}

function trapFocus(container, e){
  const f = [...container.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.offsetParent!==null && !el.closest('[inert]'));
  if(!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
}

function setupMobile(root, v){
  const burger = root.querySelector('.burger');
  const drawer = root.querySelector('.m-drawer');
  const track = root.querySelector('.m-track');
  const l1 = root.querySelector('.m-l1-wrap');
  const l2 = root.querySelector('.m-l2');
  const header = root.querySelector('.p-mob .p-header');
  let lastDrill = null, tHide = 0;
  if(l2) l2.inert = true;
  function open(){
    clearTimeout(tHide);
    drawer.hidden = false; void drawer.offsetWidth; drawer.classList.add('is-open');
    burger.setAttribute('aria-expanded','true'); burger.setAttribute('aria-label','Close menu');
    const f = l1.querySelector('.m-row'); if(f) setTimeout(()=>f.focus({preventScroll:true}), 30);
  }
  function close(){
    drawer.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Menu');
    if(track){ track.classList.remove('is-deep'); l1.inert=false; if(l2) l2.inert=true; }
    Scene3D.stop();
    tHide = setTimeout(()=>{ drawer.hidden = true; }, reduced()?0:200);
    burger.focus({preventScroll:true});
  }
  on(burger,'click', ()=> burger.getAttribute('aria-expanded')==='true' ? close() : open());
  const keyFn = e=>{
    if(drawer.hidden) return;
    if(e.key==='Escape'){ e.preventDefault(); if(track && track.classList.contains('is-deep')) back(); else close(); }
    if(e.key==='Tab'){ trapFocus(root.querySelector('.p-mob'), e); }
  };
  on(root.querySelector('.p-mob'),'keydown', keyFn);
  function back(){
    track.classList.remove('is-deep'); l1.inert = false; l2.inert = true; Scene3D.stop();
    if(lastDrill) setTimeout(()=>lastDrill.focus({preventScroll:true}), reduced()?0:320);
  }
  if(v==='B'){
    root.querySelectorAll('.m-acc').forEach(b=>on(b,'click', ()=>{
      const open = b.getAttribute('aria-expanded')==='true';
      root.querySelectorAll('.m-acc').forEach(o=>o.setAttribute('aria-expanded','false'));
      b.setAttribute('aria-expanded', String(!open));
    }));
  } else {
    root.querySelectorAll('[data-drill]').forEach(b=>on(b,'click', ()=>{
      lastDrill = b;
      const id = b.dataset.drill;
      l2.querySelectorAll('.p-content').forEach(c=>c.classList.toggle('is-active', c.dataset.id===id));
      l2.scrollTop = 0;
      track.classList.add('is-deep'); l1.inert = true; l2.inert = false;
      if(v==='C'){ Scene3D.attach(l2.querySelector('.c-host')); Scene3D.show(id, reduced()); }
      setTimeout(()=>l2.querySelector('.m-back').focus({preventScroll:true}), reduced()?0:320);
    }));
    on(l2.querySelector('.m-back'),'click', back);
    if(v==='C') l2.querySelectorAll('.lk').forEach(a=>on(a,'pointerenter', ()=>Scene3D.nudge()));
  }
}

function render(){
  cleanup.forEach(fn=>fn()); cleanup = [];
  Scene3D.reset();
  const v = state.opt;
  frameEl.innerHTML = `<div class="p-root v-${v}${v==='B'?' has-utility':''}">${desktopHTML(v)}${mobileHTML(v)}</div>`;
  const root = frameEl.firstElementChild;
  // Links inside the prototype are inactive
  root.addEventListener('click', e=>{ const a = e.target.closest('a[data-plain]'); if(a) e.preventDefault(); });
  if(state.dev==='desktop') setupDesktop(root, v); else setupMobile(root, v);
  renderDetail(v);
}

function renderDetail(v){
  const o = OPTIONS[v];
  document.getElementById('opt-detail').innerHTML = `
    <div style="display:grid;gap:var(--s4);align-content:start;min-width:0">
      <div><p class="eyebrow">Option ${v}</p><h3>${o.name.split(' · ')[1]}</h3><p class="tag">${o.tag}</p></div>
      <dl>
        <div><dt>Why this works</dt><dd>${o.why}</dd></div>
        <div><dt>Best for</dt><dd>${o.best}</dd></div>
        <div><dt>Watch-outs</dt><dd><ul>${o.watch.map(w=>`<li>${w}</li>`).join('')}</ul></dd></div>
      </dl>
    </div>
    <div style="display:grid;gap:var(--s3);align-content:start;min-width:0">
      <p class="eyebrow">Motion in this option</p>
      <ul class="motion-list">${o.motion.map(m=>`<li><span>${m[0]}</span><code>${m[1]}</code></li>`).join('')}</ul>
      <p class="muted" style="font-size:.875rem">Mobile: ${v==='B'?'an accordion. Each menu expands in place and only one is open at a time.':'a drill-down. Choosing a menu slides its links in from the right, with a clear "All menus" back button'+(v==='C'?', and the section’s 3D object at the top.':'.')} "Get a quote" and "Claims" stay pinned at the bottom of the drawer.</p>
    </div>`;
}

/* ---------------- Toolbar ---------------- */
const wideEnough = () => window.innerWidth >= 900;
function syncDevice(){
  const devBtn = document.getElementById('dev-desktop');
  if(!wideEnough()){
    devBtn.disabled = true; devBtn.title = 'Desktop preview needs a wider window';
    if(state.dev==='desktop'){ state.dev='mobile'; }
    document.getElementById('kbd-hint').hidden = true;
  } else { devBtn.disabled = false; devBtn.title=''; document.getElementById('kbd-hint').hidden = false; }
  stage.dataset.device = state.dev;
  document.querySelectorAll('[data-dev]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.dev===state.dev)));
  document.getElementById('stage-note').textContent = !wideEnough()
    ? 'Desktop preview needs a window at least 900px wide, so the mobile version is shown.'
    : 'Shown on the Shipping Insurance page, so that menu item shows the "current section" marker.';
}
document.querySelectorAll('[data-opt]').forEach(b=>b.addEventListener('click', ()=>{
  state.opt = b.dataset.opt;
  document.querySelectorAll('[data-opt]').forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
  try{ localStorage.setItem('nav01-opt', state.opt); }catch(e){}
  render();
}));
document.querySelectorAll('[data-dev]').forEach(b=>b.addEventListener('click', ()=>{
  if(b.disabled) return; state.dev = b.dataset.dev; syncDevice(); render();
}));
rmToggle.addEventListener('change', ()=>{ stage.classList.toggle('is-reduced', rmToggle.checked); render(); });
let lastWide = wideEnough();
window.addEventListener('resize', ()=>{ const w = wideEnough(); if(w!==lastWide){ lastWide=w; if(w && state.dev==='mobile' && !state.userMobile){ state.dev='desktop'; } syncDevice(); render(); } });
document.getElementById('dev-mobile').addEventListener('click', ()=>{ state.userMobile = true; });
document.getElementById('dev-desktop').addEventListener('click', ()=>{ state.userMobile = false; });

try{ const s = localStorage.getItem('nav01-opt'); if(s && OPTIONS[s]){ state.opt = s; document.querySelectorAll('[data-opt]').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.opt===s))); } }catch(e){}
syncDevice();
render();
})();

