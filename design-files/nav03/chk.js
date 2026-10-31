
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const STILL=new URLSearchParams(location.search).has('still');
const RM=STILL?{matches:true}:matchMedia('(prefers-reduced-motion: reduce)');
if(STILL) document.documentElement.classList.add('still');
const NS='http://www.w3.org/2000/svg';
const ICON={
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>'
};

/* ============ Content: every live link, each with its own illustration ============ */
const NAV=[
 {id:'insurance',label:'Shipping Insurance',current:true,lead:'Protect shipments from covered loss, damage, and theft.',over:'Explore shipping insurance',scene:'shieldParcel',
  groups:[{t:'Coverage by shipment',l:[['Multi-Carrier Shipments','Parcel and freight across UPS, FedEx, DHL, and USPS','globeRoutes'],['UPS Shipments','Coverage designed for packages shipped with UPS','truck'],['Special Commodities','High-value, perishable, and specialty goods','gemCase']]},
          {t:'Get started',l:[['Select My Coverage','Answer a few questions to find the right fit','gauge'],['Get a Quote','Estimate cost for your shipping volume','coins']]}]},
 {id:'solutions',label:'Solutions',lead:'Tools that reduce risk before, during, and after delivery.',over:'See all solutions',scene:'layers',
  groups:[{t:'Products',cols:2,l:[['CommerceShield','Order risk signals and chargeback protection','scanTile'],['DeliveryDefense','Address confidence scores before you ship','house'],['Delivery Orchestration','Choose delivery options that lower risk','route'],['InsureShield® Shipping Insurance','Protection against loss, damage, and theft','bigShield']]}]},
 {id:'claims',label:'Claims',href:'#'},
 {id:'partners',label:'Partners',lead:'Connect InsureShield to the platforms you already ship with.',over:'Partners overview',scene:'storefront',
  groups:[{t:'Work with us',l:[['Connect with a Partner','Add coverage inside the platforms you use','linkBlocks'],['Become a Partner','Offer InsureShield to your customers','building']]}]},
 {id:'resources',label:'Resources',lead:'Guides, stories, and support for shippers.',over:'All resources',scene:'docStack',
  groups:[{t:'Learn',l:[['Insights','Articles on shipping risk and protection','chart'],['Whitepapers & Guides','In-depth research and how-to guides','document'],['Customer Stories','How businesses recover faster','storefront']]},{t:'Get help',l:[['Help & Support','Answers about coverage, billing, and claims','bubble']]}]},
 {id:'about',label:'About',lead:'News, availability, and how to reach us.',over:'About InsureShield',scene:'globePlinth',
  groups:[{t:'Company',l:[['Announcements','Product and company news','docStack'],['In The News','Press coverage of UPS Capital','document'],['Product Availability','Where coverage is offered','mapPins']]},{t:'Talk to us',l:[['Contact Us','Reach our team','bubble']]}]}
];
const MENUS=NAV.filter(n=>!n.href), byId=id=>MENUS.find(m=>m.id===id);
const amp=s=>s.replace(/&/g,'&amp;');
const allLinks=m=>m.groups.flatMap(g=>g.l);

/* ======================================================================
   ISO ENGINE — three.js does the 3D maths (camera, transforms, normals);
   every frame is written out as plain SVG paths, so it stays vector.
   Timing follows the live site's illustration tracks:
   guides 0–.3 · edges .04–.46 · hidden edges .1–.4 · planes .42–.86 ·
   hidden clear .55–.88 · guides retract .66–1  (of a 1.4s build), then one action.
   ====================================================================== */
const CAM=new THREE.OrthographicCamera(-1,1,1,-1,.1,100); CAM.position.set(10,8.2,10); CAM.lookAt(0,0,0); CAM.updateMatrixWorld(true);
const VIEW=CAM.matrixWorldInverse.clone(), DIR=CAM.position.clone().normalize(), PX=44;
const BUILD_S=1.4;
const INK='#121212', MUTE='#b2b2bb', TEAL='#0a8080', DEEP='#075a5a';
const TONES={
  base:{t:'#ffffff',l:'#e7f2f2',r:'#cfe5e5'}, soft:{t:'#f3f9f9',l:'#ffffff',r:'#e7f2f2'},
  light:{t:'#cfe5e5',l:'#9fcbcb',r:'#6fb1b1'}, acc:{t:'#3f9898',l:'#0a8080',r:'#075a5a'},
  dark:{t:'#5f5753',l:'#363230',r:'#2a2725'}, glass:{t:TEAL,l:TEAL,r:TEAL,o:.14,stroke:TEAL}
};
const E={c:x=>Math.max(0,Math.min(1,x)),out:x=>1-Math.pow(1-E.c(x),3),
  back:x=>{x=E.c(x);const a=1.5,b=a+1;return 1+b*Math.pow(x-1,3)+a*Math.pow(x-1,2);},
  io:x=>{x=E.c(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}};
const seg=(t,a,b)=>E.c((t-a)/(b-a));
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const f1=n=>(Math.round(n*10)/10).toString();
function pj(v){ const p=v.clone().applyMatrix4(VIEW); return [p.x*PX,-p.y*PX]; }
function newell(vs){ const n=V3(0,0,0); for(let i=0;i<vs.length;i++){const a=vs[i],b=vs[(i+1)%vs.length]; n.x+=(a.y-b.y)*(a.z+b.z); n.y+=(a.z-b.z)*(a.x+b.x); n.z+=(a.x-b.x)*(a.y+b.y);} return n.normalize(); }
function hull(P){ const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]); const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]); const lo=[],up=[];
  for(const q of p){ while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0) lo.pop(); lo.push(q); }
  for(let i=p.length-1;i>=0;i--){ const q=p[i]; while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up); }
const dpath=(P,close)=>'M'+P.map(q=>f1(q[0])+' '+f1(q[1])).join('L')+(close?'Z':'');
const dash=dp=>dp<1?` pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1-dp).toFixed(3)}"`:'';

/* --- geometry: convex solids. Faces are auto-oriented outward. --- */
function solid(verts,faces,o={}){
  const c=verts.reduce((a,v)=>a.add(v),V3(0,0,0)).multiplyScalar(1/verts.length);
  faces.forEach(f=>{ const vs=f.i.map(k=>verts[k]); const fc=vs.reduce((a,v)=>a.add(v.clone()),V3(0,0,0)).multiplyScalar(1/vs.length); if(newell(vs).dot(fc.sub(c))<0) f.i.reverse(); });
  return {kind:'solid',verts,faces,tone:o.tone||'base',smooth:!!o.smooth,lines:o.lines||[],node:new THREE.Object3D()};
}
function box(w,h,d,o={}){ const x=w/2,z=d/2,y0=o.center?-h/2:0,y1=y0+h;
  const v=[V3(-x,y0,-z),V3(x,y0,-z),V3(x,y1,-z),V3(-x,y1,-z),V3(-x,y0,z),V3(x,y0,z),V3(x,y1,z),V3(-x,y1,z)];
  return solid(v,[{i:[0,1,2,3]},{i:[4,5,6,7]},{i:[0,4,7,3]},{i:[1,5,6,2]},{i:[3,2,6,7]},{i:[0,1,5,4]}],o); }
function frustum(n,r0,r1,h,o={}){ const v=[],f=[],y0=o.center?-h/2:0;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2; v.push(V3(Math.cos(a)*r0,y0,Math.sin(a)*r0));}
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2; v.push(V3(Math.cos(a)*r1,y0+h,Math.sin(a)*r1));}
  for(let i=0;i<n;i++){const j=(i+1)%n; f.push({i:[i,j,n+j,n+i]});}
  f.push({i:[...Array(n).keys()],cap:true}); f.push({i:[...Array(n).keys()].map(k=>k+n),cap:true});
  return solid(v,f,Object.assign({smooth:true},o)); }
const prism=(n,r,h,o)=>frustum(n,r,r,h,o);
function extrude(pts,d,o={}){ const n=pts.length,v=[],f=[];
  pts.forEach(([x,y])=>v.push(V3(x,y,d/2))); pts.forEach(([x,y])=>v.push(V3(x,y,-d/2)));
  for(let i=0;i<n;i++){const j=(i+1)%n; f.push({i:[i,j,n+j,n+i]});}
  f.push({i:[...Array(n).keys()],cap:true}); f.push({i:[...Array(n).keys()].map(k=>k+n),cap:true});
  return solid(v,f,o); }
function gem(o={}){ const v=[],f=[],n=8;
  for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2; v.push(V3(Math.cos(a)*.34,.52,Math.sin(a)*.34));}
  for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2; v.push(V3(Math.cos(a)*.62,.3,Math.sin(a)*.62));}
  v.push(V3(0,-.34,0));
  f.push({i:[...Array(n).keys()]});
  for(let i=0;i<n;i++){const j=(i+1)%n; f.push({i:[i,j,n+j,n+i]}); f.push({i:[n+i,n+j,2*n]});}
  return solid(v,f,o); }
function line(pts,o={}){ return Object.assign({kind:'line',pts,node:new THREE.Object3D()},o); }
function plate(w,d){ const x=w/2,z=d/2; return line([[-x,0,-z],[x,0,-z],[x,0,z],[-x,0,z]],{closed:true,color:MUTE,w:1,dashed:'3 4',plate:true}); }
function globe(r){ return {kind:'globe',r,spin:0,node:new THREE.Object3D()}; }
function arc(g,a,b,h=.32){ return {kind:'arc',g,a,b,h,node:new THREE.Object3D()}; }
function ball(r,tone='acc'){ return {kind:'ball',r,tone,node:new THREE.Object3D()}; }
const circ=(r,y,n=28)=>Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return [Math.cos(a)*r,y,Math.sin(a)*r];});

const SHIELD=[[-.75,1.62],[0,1.82],[.75,1.62],[.75,.95],[.58,.42],[.32,.13],[0,0],[-.32,.13],[-.58,.42],[-.75,.95]];
const CHECK=[[-.33,.95],[-.08,.68],[.38,1.24]];
function roundRect(w,h,r,k=4){ const p=[],cs=[[w/2-r,h/2-r,0],[-w/2+r,h/2-r,1],[-w/2+r,-h/2+r,2],[w/2-r,-h/2+r,3]];
  cs.forEach(([cx,cy,q])=>{ for(let i=0;i<=k;i++){const a=(q*90+i*90/k)*Math.PI/180; p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);} }); return p; }

/* --- scene builder --- */
function S(){ const root=new THREE.Group(), parts=[], n={};
  return {root,parts,n,top:2.2,dur:2.6,
    add(p,{at=[0,0,0],rot=[0,0,0],sc=null,parent=root,t0=0,name}={}){ p.node.position.set(...at); p.node.rotation.set(...rot); if(sc) p.node.scale.set(...sc); parent.add(p.node); p.t0=t0; parts.push(p); if(name) n[name]=p; return p; },
    grp(name,{at=[0,0,0],rot=[0,0,0],parent=root}={}){ const g=new THREE.Group(); g.position.set(...at); g.rotation.set(...rot); parent.add(g); n[name]=g; return g; } };
}

/* --- the scenes (draw order = array order, back to front) --- */
const SCENES={
 shieldParcel(){ const s=S(); s.top=2.1;
   s.add(plate(4.4,4.4));
   s.add(box(2,1.4,2,{lines:[{pts:[[-1,1.402,0],[1,1.402,0]],color:TEAL,w:3,delay:.35},{pts:[[1.002,1.4,0],[1.002,.95,0]],color:TEAL,w:3,delay:.45}]}),{at:[-.55,0,-.55],t0:.06});
   const g=s.grp('sh',{at:[1,0,1],rot:[0,Math.PI/4,0]});
   s.add(extrude(SHIELD,.24,{tone:'acc',smooth:true,lines:[{pts:CHECK.map(([x,y])=>[x,y,.125]),color:'#fff',w:2.4,delay:.95}]}),{parent:g,t0:.2});
   s.update=(t,n)=>{ n.sh.position.y=.2*E.out(seg(t,1.35,1.85)); }; return s; },

 globeRoutes(){ const s=S(); s.top=3.2; s.loop=true;
   s.add(plate(4,4));
   s.add(prism(32,.78,.22,{tone:'soft'}),{t0:.04});
   s.add(prism(16,.08,.42,{tone:'base'}),{at:[0,.22,0],t0:.1});
   const g=s.add(globe(1.2),{at:[0,1.86,0],t0:.12});
   s.add(arc(g,[8,-95],[42,-12]),{t0:.75}); s.add(arc(g,[-18,-72],[22,4],.24),{t0:.95});
   s.update=t=>{ g.spin=Math.sin(t*.35)*.22; }; return s; },

 truck(){ const s=S(); s.top=2.1;
   s.add(plate(4.8,3.2));
   const hub={pts:circ(.13,.101,20),color:'#9fcbcb',w:1.2,closed:true,delay:.3};
   [-1.15,.95].forEach(x=>s.add(prism(24,.33,.2,{tone:'dark',center:true,lines:[hub]}),{at:[x,.33,-.72],rot:[Math.PI/2,0,0],t0:.32}));
   const b=s.grp('body');
   s.add(box(3.5,.18,1,{tone:'dark'}),{parent:b,at:[-.15,.3,0],t0:.04});
   s.add(box(2.4,1.5,1.24,{lines:[{pts:[[-.9,.35,.621],[.9,.35,.621]],color:TEAL,w:2.6,delay:.5}]}),{parent:b,at:[-.6,.48,0],t0:.08});
   s.add(box(1,1.1,1.24,{tone:'acc',lines:[
     {pts:[[.501,.5,-.46],[.501,.5,.46],[.501,.9,.46],[.501,.9,-.46]],closed:true,fill:'#cfe5e5',color:INK,w:1,delay:.4},
     {pts:[[-.35,.5,.621],[.32,.5,.621],[.32,.9,.621],[-.35,.9,.621]],closed:true,fill:'#cfe5e5',color:INK,w:1,delay:.45}]}),{parent:b,at:[1.12,.48,0],t0:.18});
   [-1.15,.95].forEach(x=>s.add(prism(24,.33,.2,{tone:'dark',center:true,lines:[hub]}),{at:[x,.33,.72],rot:[Math.PI/2,0,0],t0:.34}));
   s.update=(t,n)=>{ n.body.position.y=.14*(1-E.back(seg(t,1.2,1.8))); }; return s; },

 gemCase(){ const s=S(); s.top=2.6; s.loop=true;
   s.add(plate(4,4));
   const h=s.grp('hinge',{at:[0,.75,-.9]});
   s.add(box(2,.22,1.8,{tone:'soft'}),{parent:h,at:[0,0,.9],t0:.1});
   s.add(box(2,.75,1.8),{t0:.04});
   s.add(box(1.7,.02,1.5,{tone:'light'}),{at:[0,.75,0],t0:.22});
   const g=s.grp('gem',{at:[0,1.1,0]});
   s.add(gem({tone:'acc'}),{parent:g,t0:.36});
   s.update=(t,n)=>{ n.hinge.rotation.x=-(1.68+.28*E.out(seg(t,.9,1.6))); n.gem.position.y=1.06+.3*E.out(seg(t,1.25,1.9)); n.gem.rotation.y=t*.32; }; return s; },

 gauge(){ const s=S(); s.top=1.7;
   s.add(plate(4,4));
   s.add(box(2.7,.4,2.1,{tone:'soft'}),{t0:.04});
   const R=V3(1,0,-1).normalize(), F=V3(-1,0,-1).normalize();
   const at=(th,r,y)=>{ const v=R.clone().multiplyScalar(Math.cos(th)*r).add(F.clone().multiplyScalar(Math.sin(th)*r)); return [v.x,y,v.z]; };
   const ticks=[]; for(let k=0;k<=10;k++){const th=Math.PI*k/10; ticks.push({pts:[at(th,.78,.101),at(th,.93,.101)],color:INK,w:1,delay:.35+k*.02});}
   const zone=[]; for(let k=0;k<=16;k++) zone.push(at(Math.PI*k/40,.99,.101));
   s.add(prism(48,1.06,.1,{lines:[...ticks,{pts:zone,color:TEAL,w:3.4,delay:.55}]}),{at:[0,.4,0],t0:.12});
   const nd=s.grp('needle',{at:[0,.502,0]});
   s.add(line([[-.16,0,0],[.8,0,0]],{color:DEEP,w:3}),{parent:nd,t0:.7});
   s.add(prism(16,.1,.07,{tone:'acc'}),{at:[0,.5,0],t0:.72});
   const ang=th=>Math.atan2(-(R.z*Math.cos(th)+F.z*Math.sin(th)),R.x*Math.cos(th)+F.x*Math.sin(th));
   s.update=(t,n)=>{ const th=Math.PI-(Math.PI-.62)*E.back(seg(t,1.25,2.2)); n.needle.rotation.y=ang(th); }; return s; },

 coins(){ const s=S(); s.top=1.4; s.dur=2.9;
   s.add(plate(4.2,4.2));
   const L=(z,x0,x1,c=INK,w=1)=>({pts:[[x0,.051,z],[x1,.051,z]],color:c,w,delay:.35});
   s.add(box(1.9,.05,2.5,{lines:[L(-.85,-.6,.35,TEAL,3),L(-.4,-.6,.6),L(-.05,-.6,.5),L(.3,-.6,.6),L(.8,.1,.65,TEAL,3)]}),{at:[-.85,0,-.5],rot:[0,.12,0],t0:.04});
   s.n.coins=[]; const top={pts:circ(.3,.131,28),color:DEEP,w:1,closed:true,delay:.25};
   const stack=(x,z,k,d0)=>{ for(let i=0;i<k;i++){ const g=s.grp('c'+x+i,{at:[x,i*.13,z]}); s.add(prism(32,.45,.13,{tone:'light',lines:i===k-1?[top]:[]}),{parent:g,t0:.18+i*.05}); s.n.coins.push({g,y:i*.13,d:d0+i*.11}); } };
   stack(1.35,.35,4,1.2); stack(.55,1.25,3,1.55);
   s.update=(t,n)=>{ n.coins.forEach(c=>{ c.g.position.y=c.y+.7*(1-E.back(seg(t,c.d,c.d+.45))); }); }; return s; },

 layers(){ const s=S(); s.top=1.8;
   s.add(plate(4.2,4.2));
   const L=[[3,.32,'base'],[2.2,.32,'soft'],[1.45,.32,'light'],[.72,.72,'acc']]; let y=0; s.n.L=[];
   L.forEach(([w,h,tone],i)=>{ const g=s.grp('l'+i,{at:[0,y,0]}); s.add(box(w,h,w,{tone}),{parent:g,t0:.04+i*.07}); s.n.L.push({g,y}); y+=h; });
   s.update=(t,n)=>{ n.L.forEach((l,i)=>{ if(i) l.g.position.y=l.y+.5*(1-E.out(seg(t,1.1+i*.12,1.5+i*.12))); }); }; return s; },

 scanTile(){ const s=S(); s.top=1.7; s.loop=true;
   s.add(plate(4.2,4.2));
   s.add(box(2.8,.2,2.8),{t0:.04});
   [[-.8,-.8],[.8,-.8],[-.8,.8]].forEach(([x,z],i)=>s.add(box(.7,.05,.7,{tone:'acc',lines:[{pts:[[-.18,.051,-.18],[.18,.051,-.18],[.18,.051,.18],[-.18,.051,.18]],closed:true,color:'#fff',w:1.2,delay:.4}]}),{at:[x,.2,z],t0:.2+i*.05}));
   [[.25,.2],[.7,.4],[.3,.75],[.85,.85],[.05,.55]].sort((a,b)=>a[0]+a[1]-b[0]-b[1]).forEach(([x,z],i)=>s.add(box(.2,.05,.2,{tone:'light'}),{at:[x,.2,z],t0:.3+i*.03}));
   const b=s.grp('beam',{at:[-1.4,.2,0]});
   s.add(box(.03,1.25,2.9,{tone:'glass'}),{parent:b,t0:.6});
   s.add(line([[0,1.25,-1.45],[0,1.25,1.45]],{color:TEAL,w:2}),{parent:b,t0:.6});
   s.update=(t,n)=>{ const p=t<1.3?0:((t-1.3)/2.6)%1; n.beam.position.x=-1.4+2.8*E.io(p<.5?p*2:2-p*2); }; return s; },

 house(){ const s=S(); s.top=2.4;
   s.add(plate(4.4,4.4));
   s.add(box(2,1.3,1.8,{lines:[
     {pts:[[1.002,0,-.15],[1.002,.85,-.15],[1.002,.85,.35],[1.002,0,.35]],fill:'#9fcbcb',color:INK,w:1,delay:.4},
     {pts:[[-.65,.55,.902],[-.1,.55,.902],[-.1,.95,.902],[-.65,.95,.902]],closed:true,fill:'#e7f2f2',color:INK,w:1,delay:.45}]}),{at:[-.35,0,-.3],t0:.04});
   s.add(extrude([[-1.18,0],[1.18,0],[0,.85]],2.05,{tone:'acc'}),{at:[-.35,1.3,-.3],rot:[0,0,0],t0:.14});
   s.add(box(.72,.02,.9,{tone:'soft'}),{at:[1.08,0,.05],t0:.3});
   const p=s.grp('parcel',{at:[1.08,.02,.05]});
   s.add(box(.44,.34,.44,{tone:'light',lines:[{pts:[[-.22,.341,0],[.22,.341,0]],color:DEEP,w:1.6,delay:.3}]}),{parent:p,t0:.5});
   s.update=(t,n)=>{ n.parcel.scale.y=Math.max(.001,E.back(seg(t,1.3,1.8))); }; return s; },

 route(){ const s=S(); s.top=1.2; s.loop=true;
   s.add(plate(4.8,3.4));
   const A=[-1.8,0,.9], B=[1.75,0,-.9];
   s.add(line([A,[-1.8,0,-.9],B],{color:MUTE,w:1.4,dashed:'4 5'}),{t0:.1});
   const path=[A,[.15,0,.9],[.15,0,-.9],B];
   s.add(line(path,{color:INK,w:1.6}),{t0:.2});
   s.add(prism(28,.34,.22,{tone:'soft'}),{at:A,t0:.06});
   s.add(box(.62,.62,.62,{tone:'acc'}),{at:B,t0:.14});
   const segs=[]; let tot=0; for(let i=0;i<path.length-1;i++){const a=V3(...path[i]),b=V3(...path[i+1]); const l=a.distanceTo(b); segs.push({a,b,l}); tot+=l;}
   s.n.arrows=[0,1,2].map(i=>{ const g=s.grp('a'+i); s.add(extrude([[.24,0],[-.16,.18],[-.16,-.18]],.1,{tone:'acc'}),{parent:g,rot:[-Math.PI/2,0,0],at:[0,.06,0],t0:.85+i*.08}); return g; });
   s.update=(t,n)=>{ n.arrows.forEach((g,i)=>{ const u=((Math.max(0,t-.9)*.11)+(.18+i*.28))%1; let d=u*tot; for(const sg of segs){ if(d<=sg.l){ const p=sg.a.clone().lerp(sg.b,d/sg.l); g.position.set(p.x,0,p.z); g.rotation.y=Math.atan2(-(sg.b.z-sg.a.z),sg.b.x-sg.a.x); break; } d-=sg.l; } }); }; return s; },

 bigShield(){ const s=S(); s.top=2.9;
   s.add(plate(4,4));
   s.add(prism(40,1.15,.3,{tone:'soft'}),{t0:.04});
   const g=s.grp('sh',{at:[0,.3,0],rot:[0,Math.PI/4,0]}); g.scale.setScalar(1.28);
   s.add(extrude(SHIELD,.24,{tone:'acc',smooth:true,lines:[{pts:CHECK.map(([x,y])=>[x,y,.125]),color:'#fff',w:2.6,delay:.95}]}),{parent:g,t0:.16});
   s.update=(t,n)=>{ n.sh.position.y=.3+.18*E.out(seg(t,1.35,1.85)); }; return s; },

 linkBlocks(){ const s=S(); s.top=1.4;
   s.add(plate(5,3.4));
   const a=s.grp('a'); s.add(box(1.2,1.2,1.2,{lines:[{pts:[[.601,.6,-.15],[.601,.6,.15]],color:DEEP,w:3,delay:.4}]}),{parent:a,t0:.04});
   const br=s.grp('br',{at:[0,.47,0]}); s.add(box(1.1,.26,.38,{tone:'light'}),{parent:br,t0:1});
   const b=s.grp('b'); s.add(box(1.2,1.2,1.2,{tone:'acc'}),{parent:b,t0:.1});
   s.update=(t,n)=>{ const k=E.out(seg(t,.9,1.5)); n.a.position.x=-1.6+.45*k; n.b.position.x=1.6-.45*k; n.br.scale.x=Math.max(.001,E.out(seg(t,1.3,1.75))); }; return s; },

 building(){ const s=S(); s.top=2.6;
   s.add(plate(4.4,4.4));
   const tw=s.grp('tw',{at:[-.3,0,-.3]});
   const win=[]; [.5,.95,1.4,1.85].forEach(y=>{ win.push({pts:[[.801,y,-.55],[.801,y,.55]],color:INK,w:1,delay:.4}); win.push({pts:[[-.55,y,.801],[.55,y,.801]],color:INK,w:1,delay:.42}); });
   win.push({pts:[[.801,.3,0],[.801,2.1,0]],color:'#9fcbcb',w:1,delay:.45},{pts:[[0,.3,.801],[0,2.1,.801]],color:'#9fcbcb',w:1,delay:.45});
   s.add(box(1.6,2.4,1.6,{lines:win}),{parent:tw,t0:.04});
   s.add(box(1.72,.1,1.72,{tone:'acc'}),{parent:tw,at:[0,2.4,0],t0:.35});
   s.add(box(1.4,.9,1.2,{tone:'soft',lines:[{pts:[[.701,0,-.2],[.701,.6,-.2],[.701,.6,.2],[.701,0,.2]],fill:'#9fcbcb',color:INK,w:1,delay:.4}]}),{at:[1.2,0,.35],t0:.22});
   s.update=(t,n)=>{ n.tw.scale.y=Math.max(.001,E.out(seg(t,.0,.7))); }; return s; },

 docStack(){ const s=S(); s.top=1;
   s.add(plate(4,4));
   const lines=[[-.7,-.9,.3,TEAL,3],[-.7,-.45,.7],[-.7,-.1,.55],[-.7,.25,.7],[-.7,.6,.4]].map(([x0,z,x1,c=INK,w=1])=>({pts:[[x0,.081,z],[x1,.081,z]],color:c,w,delay:.4}));
   s.n.sh=[]; [['base',0],['soft',.14],['base',-.08]].forEach(([tone,r],i)=>{ const g=s.grp('s'+i,{at:[0,i*.08,0],rot:[0,r,0]}); s.add(box(2.2,.08,2.8,{tone,lines:i===2?lines:[]}),{parent:g,t0:.04+i*.08}); s.n.sh.push({g,y:i*.08}); });
   s.update=(t,n)=>{ n.sh.forEach((o,i)=>{ if(i) o.g.position.y=o.y+.55*(1-E.out(seg(t,1.05+i*.14,1.45+i*.14))); }); }; return s; },

 chart(){ const s=S(); s.top=2.6;
   s.add(plate(4,4));
   s.add(box(1.3,.08,.9),{t0:.04});
   s.add(box(.24,.9,.24,{tone:'soft'}),{at:[0,.08,0],t0:.08});
   s.add(box(.12,1.6,2.5),{at:[0,.95,0],t0:.12});
   s.n.bars=[]; [[-.8,.45],[-.3,.7],[.2,.55],[.7,1.05]].forEach(([z,h],i)=>{ const g=s.grp('b'+i,{at:[.09,1.1,z]}); s.add(box(.06,h,.3,{tone:'acc'}),{parent:g,t0:.5+i*.05}); s.n.bars.push(g); });
   s.add(line([[.13,1.1+.45+.15,-.8],[.13,1.1+.7+.15,-.3],[.13,1.1+.55+.15,.2],[.13,1.1+1.05+.15,.7]],{color:DEEP,w:2}),{t0:1.05});
   s.update=(t,n)=>{ n.bars.forEach((g,i)=>g.scale.y=Math.max(.001,E.out(seg(t,1.1+i*.1,1.5+i*.1)))); }; return s; },

 document(){ const s=S(); s.top=.8;
   s.add(plate(4,4));
   s.add(box(2,.05,2.6,{tone:'soft'}),{at:[-.14,0,-.12],t0:.04});
   const P=[[-1,-1.3],[1,-1.3],[1,.8],[.5,1.3],[-1,1.3]];
   const L=(x0,y,x1,c=INK,w=1)=>({pts:[[x0,y,.036],[x1,y,.036]],color:c,w,delay:.45});
   s.add(extrude(P,.07,{lines:[L(-.7,.9,.15,TEAL,3),L(-.7,.45,.7),L(-.7,.1,.7),L(-.7,-.25,.5),L(-.7,-.6,.6),
     {pts:[[.5,1.3,.037],[1,.8,.037],[.5,.8,.037]],closed:true,fill:'#cfe5e5',color:INK,w:1,delay:.7}]}),{at:[0,.085,0],rot:[-Math.PI/2,0,0],t0:.1});
   return s; },

 storefront(){ const s=S(); s.top=1.8;
   s.add(plate(4.4,4));
   s.add(box(2.4,1.4,1.7,{lines:[
     {pts:[[1.201,0,-.55],[1.201,.85,-.55],[1.201,.85,-.08],[1.201,0,-.08]],fill:'#9fcbcb',color:INK,w:1,delay:.4},
     {pts:[[1.201,.3,.12],[1.201,.82,.12],[1.201,.82,.68],[1.201,.3,.68]],closed:true,fill:'#e7f2f2',color:INK,w:1,delay:.45}]}),{t0:.04});
   s.add(box(2.5,.14,1.8,{tone:'soft'}),{at:[0,1.4,0],t0:.14});
   const aw=s.grp('aw',{at:[1.2,1.12,0]});
   s.add(extrude([[0,0],[.56,-.28],[.56,-.4],[0,-.12]],1.7,{tone:'acc',lines:[-.5,0,.5].map(z=>({pts:[[.04,-.05,z],[.52,-.3,z]],color:'#fff',w:1.2,delay:.4}))}),{parent:aw,t0:.24});
   s.update=(t,n)=>{ n.aw.rotation.z=-.5*(1-E.back(seg(t,1.2,1.75))); }; return s; },

 bubble(){ const s=S(); s.top=2.6;
   s.add(plate(4,4));
   const g=s.grp('bb',{at:[0,.5,0],rot:[0,Math.PI/4,0]});
   s.add(extrude([[-.62,-.74],[-.12,-.74],[-.8,-1.18]],.3),{parent:g,t0:.1});
   const dots=[-.5,0,.5].map((x,i)=>({pts:circ(.11,0,16).map(([a,_,b])=>[x+a,b,.152]),closed:true,fill:TEAL,color:TEAL,w:1,delay:.9+i*.12}));
   s.add(extrude(roundRect(2.4,1.5,.36),.3,{smooth:true,lines:dots}),{parent:g,at:[0,.1,0],t0:.04});
   s.update=(t,n)=>{ n.bb.position.y=.5+.14*E.out(seg(t,1.2,1.8)); }; return s; },

 mapPins(){ const s=S(); s.top=1.5; s.dur=3;
   s.add(plate(4.4,4.2));
   s.add(box(3.4,.14,2.8,{lines:[
     {pts:[[-1.4,.141,-1],[-.4,.141,-1.1],[-.1,.141,-.3],[-.7,.141,.2],[-1.3,.141,-.2]],closed:true,fill:'#cfe5e5',color:INK,w:1,delay:.35},
     {pts:[[.2,.141,.1],[1.3,.141,-.3],[1.4,.141,.8],[.6,.141,1.1],[.1,.141,.7]],closed:true,fill:'#cfe5e5',color:INK,w:1,delay:.4}]}),{t0:.04});
   s.n.pins=[[-.85,-.5,1.2],[.65,-.15,1.4],[.4,.75,1.6]].map(([x,z,d],i)=>{ const g=s.grp('p'+i,{at:[x,.14,z]});
     s.add(line(circ(.18,.002,20),{closed:true,color:TEAL,w:1}),{parent:g,t0:.6});
     s.add(line([[0,0,0],[0,.7,0]],{color:INK,w:1.4}),{parent:g,t0:.6});
     s.add(ball(.17),{parent:g,at:[0,.8,0],t0:.62}); return {g,d}; });
   s.update=(t,n)=>{ n.pins.forEach(p=>{ p.g.position.y=.14+.9*(1-E.back(seg(t,p.d,p.d+.5))); }); }; return s; },

 globePlinth(){ const s=S(); s.top=3; s.loop=true;
   s.add(plate(4,4));
   s.add(box(1.8,.45,1.8,{tone:'soft'}),{t0:.04});
   s.add(prism(16,.08,.2,{tone:'base'}),{at:[0,.45,0],t0:.08});
   const g=s.add(globe(1.12),{at:[0,1.76,0],t0:.12});
   s.update=t=>{ g.spin=t*.2; }; return s; }
};

/* --- renderer: scene + time -> SVG markup --- */
function renderScene(sc,t,mode,o={}){
  sc.update&&sc.update(t,sc.n);
  sc.root.updateMatrixWorld(true);
  const T=t/BUILD_S, outline=mode==='outline';
  const ink=outline?MUTE:INK, col=o.collect;
  let s='';
  // centre guide: extends, then retracts (live site's "guides" track)
  const gE=E.out(seg(T,0,.3)), gR=E.io(seg(T,.66,1));
  if(gE>0 && gR<1 && !o.final){ const a=pj(V3(0,0,0)), b=pj(V3(0,sc.top*gE,0)), c=pj(V3(0,sc.top*gR,0));
    s+=`<path d="M${f1(a[0])} ${f1(c[1])}L${f1(b[0])} ${f1(b[1])}" stroke="${TEAL}" stroke-width="1" stroke-dasharray="2 3" fill="none" opacity=".7"/>`; }
  let gOpen=false;
  for(let pi=0;pi<sc.parts.length;pi++){ const p=sc.parts[pi];
    if(o.named){ if(gOpen) s+='</g>'; s+=`<g id="${partName(p,pi)}">`; gOpen=true; }
    const lt=(t-p.t0)/BUILD_S;
    const draw=o.strokeDone?1:E.io(seg(lt,.04,.46)), plane=o.plane!=null?o.plane:E.out(seg(lt,.42,.86)), hid=E.c(seg(lt,.1,.4))*(1-seg(lt,.55,.88));
    if(draw<=.02 && !o.strokeDone) continue;
    const M=p.node.matrixWorld;
    if(p.kind==='line'){
      const P=p.pts.map(a=>pj(V3(...a).applyMatrix4(M))); if(col) col.push(...P);
      if(p.plate){ s+=`<path d="${dpath(P,true)}" fill="none" stroke="${MUTE}" stroke-width="1" stroke-dasharray="3 4" opacity="${draw.toFixed(2)}"/>`; continue; }
      const c=outline?MUTE:p.color||INK;
      s+=`<path d="${dpath(P,p.closed)}" fill="${p.fill&&!outline?p.fill:'none'}" fill-opacity="${plane.toFixed(2)}" stroke="${c}" stroke-width="${p.w||1}" stroke-linecap="round" stroke-linejoin="round"${p.dashed?` stroke-dasharray="${p.dashed}"`:dash(draw)}/>`;
      continue;
    }
    if(p.kind==='ball'){
      const c=pj(V3().setFromMatrixPosition(M)), r=p.r*PX*V3().setFromMatrixScale(M).x; if(col) col.push([c[0]-r,c[1]-r],[c[0]+r,c[1]+r]);
      const tn=TONES[p.tone]; s+=`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${outline?'#fff':tn.l}" fill-opacity="${plane.toFixed(2)}" stroke="${ink}" stroke-width="1.15"${dash(draw)}/>`;
      continue;
    }
    if(p.kind==='globe'){
      const C=V3().setFromMatrixPosition(M), c=pj(C), R=p.r; const r=R*PX; if(col) col.push([c[0]-r,c[1]-r],[c[0]+r,c[1]+r]);
      s+=`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="#fff" fill-opacity="${plane.toFixed(2)}" stroke="${ink}" stroke-width="1.15"${dash(draw)}/>`;
      const fronts=(fn)=>{ let d='',on=false; for(let i=0;i<=64;i++){ const v=fn(i/64*Math.PI*2); const vis=v.dot(DIR)>0; const q=pj(C.clone().add(v)); if(vis){ d+=(on?'L':'M')+f1(q[0])+' '+f1(q[1]); on=true; } else on=false; } return d; };
      let g='';
      for(let k=0;k<6;k++){ const a=k*Math.PI/6+p.spin; g+=fronts(th=>V3(Math.cos(th)*Math.cos(a),Math.sin(th),-Math.cos(th)*Math.sin(a)).multiplyScalar(R)); }
      [-.6,0,.6].forEach(ph=>{ g+=fronts(th=>V3(Math.cos(ph)*Math.cos(th),Math.sin(ph),Math.cos(ph)*Math.sin(th)).multiplyScalar(R)); });
      const go=o.strokeDone?1:E.c(seg(lt,.3,.7));
      if(go>0) s+=`<path d="${g}" fill="none" stroke="${outline?MUTE:'#6fb1b1'}" stroke-width="1" opacity="${go.toFixed(2)}"/>`;
      continue;
    }
    if(p.kind==='arc'){
      const C=V3().setFromMatrixPosition(p.g.node.matrixWorld), R=p.g.r, rr=R*PX, cc=pj(C);
      const U=([la,lo])=>{ const a=la*Math.PI/180, b=lo*Math.PI/180+p.g.spin; return V3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b)); };
      const ua=U(p.a), ub=U(p.b), om=Math.acos(Math.min(1,ua.dot(ub)));
      let d='',on=false; const N=40, upto=Math.round(N*draw);
      for(let i=0;i<=upto;i++){ const u=i/N; const v=ua.clone().multiplyScalar(Math.sin((1-u)*om)/Math.sin(om)).add(ub.clone().multiplyScalar(Math.sin(u*om)/Math.sin(om)));
        const w=C.clone().add(v.multiplyScalar(R*(1+p.h*Math.sin(Math.PI*u)))); const q=pj(w); const off=w.clone().sub(C);
        const vis=off.dot(DIR)>0 || Math.hypot(q[0]-cc[0],q[1]-cc[1])>rr; if(vis){ d+=(on?'L':'M')+f1(q[0])+' '+f1(q[1]); on=true; } else on=false; }
      if(d) s+=`<path d="${d}" fill="none" stroke="${outline?MUTE:TEAL}" stroke-width="2" stroke-linecap="round"/>`;
      continue;
    }
    // solid
    const W=p.verts.map(v=>v.clone().applyMatrix4(M)), P=W.map(pj); if(col) col.push(...P);
    const tn=TONES[p.tone]; let front='', back='';
    for(const f of p.faces){
      const n=newell(f.i.map(k=>W[k])); const vis=n.dot(DIR)>1e-3; const fp=f.i.map(k=>P[k]);
      if(!vis){ if(hid>0 && !p.smooth && !o.final) back+=`<path d="${dpath(fp,true)}" fill="none" stroke="${outline?MUTE:'#85858e'}" stroke-width=".8" stroke-dasharray="2 3" opacity="${hid.toFixed(2)}"/>`; continue; }
      const key=n.y>.55?'t':(Math.abs(n.x)>=Math.abs(n.z)?'r':'l');
      const fill=outline?'#ffffff':tn[key]; const fo=((tn.o!=null&&!outline)?tn.o:1)*plane;
      if(p.smooth && !f.cap) front+=`<path d="${dpath(fp,true)}" fill="${fill}" fill-opacity="${fo.toFixed(2)}" stroke="${fill}" stroke-opacity="${fo.toFixed(2)}" stroke-width="1"/>`;
      else front+=`<path d="${dpath(fp,true)}" fill="${fill}" fill-opacity="${fo.toFixed(2)}" stroke="${(tn.stroke&&!outline)?tn.stroke:ink}" stroke-width="1.15" stroke-linejoin="round"${dash(draw)}/>`;
    }
    if(p.smooth){ front+=`<path d="${dpath(hull(P),true)}" fill="none" stroke="${ink}" stroke-width="1.15" stroke-linejoin="round"${dash(draw)}/>`; }
    for(const L of p.lines){ const ld=o.strokeDone?1:E.io(seg(lt-(L.delay||0)/BUILD_S,0,.32)); if(ld<=.02) continue;
      const LP=L.pts.map(a=>pj(V3(...a).applyMatrix4(M))); const c=outline?MUTE:L.color||INK;
      front+=`<path d="${dpath(LP,L.closed||!!L.fill)}" fill="${L.fill&&!outline?L.fill:'none'}" fill-opacity="${(o.plane!=null?o.plane:E.c(ld*1.4-.4)).toFixed(2)}" stroke="${c}" stroke-width="${L.w||1}" stroke-linecap="round" stroke-linejoin="round"${dash(ld)}/>`; }
    s+=back+front;
  }
  if(gOpen) s+='</g>';
  return s;
}
function partName(p,i){
  const n=String(i).padStart(2,'0');
  if(p.kind==='line') return p.plate?'Plate':`Line ${n}`;
  if(p.kind==='ball') return `Pin head ${n}`;
  if(p.kind==='globe') return 'Globe';
  if(p.kind==='arc') return `Route ${n}`;
  return `${p.smooth?'Round':'Block'} ${p.tone==='acc'?'accent ':''}${n}`;
}

/* --- a live SVG view --- */
class IsoView{
  constructor(svg,{w=320,h=270}={}){ this.svg=svg; this.W=w; this.H=h; svg.setAttribute('preserveAspectRatio','xMidYMid meet'); this.raf=0; }
  fit(sc){ const col=[]; renderScene(sc,30,'full',{collect:col,final:true}); let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; col.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);});
    const k=Math.max(1,(x1-x0+36)/this.W,(y1-y0+36)/this.H), w=this.W*k, h=this.H*k; this.svg.setAttribute('viewBox',`${f1((x0+x1)/2-w/2)} ${f1((y0+y1)/2-h/2)} ${f1(w)} ${f1(h)}`); }
  play(name,o={}){
    const mode=o.mode||'full';
    if(!o.force && this.name===name && this.mode===mode) return;
    if(this.g){ const old=this.g; old.classList.add('out'); setTimeout(()=>old.remove(),220); }
    this.name=name; this.mode=mode; this.opts=o; this.sc=SCENES[name](); this.fit(this.sc);
    this.g=document.createElementNS(NS,'g'); this.g.setAttribute('class','iso-g'); this.svg.appendChild(this.g);
    this.t0=performance.now()+(o.delay||0)*1000; this.run();
  }
  run(){ cancelAnimationFrame(this.raf); const g=this.g, sc=this.sc;
    if(RM.matches || this.opts.instant){ g.innerHTML=renderScene(sc,30,this.mode,{final:true}); return; }
    const step=now=>{ if(g!==this.g) return; const t=Math.max(0,(now-this.t0)/1000)+(this.opts.skip||0);
      if(RM.matches || this.opts.instant){ g.innerHTML=renderScene(sc,30,this.mode,{final:true}); return; }
      g.innerHTML=renderScene(sc,t,this.mode,this.opts);
      if(t<sc.dur || (sc.loop && this.mode==='full')) this.raf=requestAnimationFrame(step); };
    this.raf=requestAnimationFrame(step); }
  pause(){ cancelAnimationFrame(this.raf); }
  resume(){ if(this.sc) this.run(); }
  svgString(){ const sc=SCENES[this.name](); const col=[]; const body=renderScene(sc,30,'full',{collect:col,final:true}); return `<svg xmlns="${NS}" viewBox="${this.svg.getAttribute('viewBox')}" width="${this.W*2}" height="${this.H*2}">${body}</svg>`; }
}

/* ============ Toast + copy for Figma ============ */
const toast=(m)=>{ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(toast.h); toast.h=setTimeout(()=>t.classList.remove('on'),2200); };
function copyText(txt){
  const ok=()=>toast('SVG copied. Paste it into Figma as vectors.');
  const fb=()=>{ const ta=document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); ok(); }catch(e){ toast('Copy is blocked here. Select the text instead.'); } ta.remove(); };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok,fb); else fb();
}

/* ============ Header + concepts ============ */
const hdr=$('#hdr'), list=$('#nav-list'), ind=$('.nav-ind'), dd=$('#dd-root');
list.innerHTML=NAV.map(n=>n.href?`<li><a class="nav-t" href="${n.href}">${n.label}</a></li>`
  :`<li><button class="nav-t" type="button" data-id="${n.id}" aria-expanded="false" aria-controls="dd-${n.id}"${n.current?' aria-current="page"':''}>${n.label}${ICON.chev}</button></li>`).join('');
const triggers=$$('.nav-t[data-id]'), ids=triggers.map(t=>t.dataset.id);
let opt='stage', openId=null, tOpen=0, tClose=0, layers=[], view=null, cards=[], hoverT=0;

const itemHTML=(l,i)=>`<li><a class="it rise" href="#" style="--i:${i}" data-scene="${l[2]}" data-t="${amp(l[0])}" data-d="${amp(l[1])}"><span class="it-l">${amp(l[0])}${ICON.arrow}</span><span class="it-d">${amp(l[1])}</span></a></li>`;
const stageHTML=`<div class="stage"><svg class="isov" aria-hidden="true"></svg><button class="cp" type="button" aria-label="Copy illustration as SVG for Figma">${ICON.copy}Copy SVG</button></div>`;

const CONCEPT={
  stage:{
    html(){ return `<div class="mega A" id="mega"><div class="ctr"><div>${stageHTML}<div class="cap"><div><p class="cap-t"></p><p class="cap-d"></p></div></div></div><div class="view">${MENUS.map(m=>{ let i=0;
      return `<div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}"><div class="cols">${m.groups.map(g=>`<div class="grp" style="--cols:${g.cols||1}"><p class="gt rise" style="--i:${i++}">${g.t}</p><ul>${g.l.map(l=>itemHTML(l,i++)).join('')}</ul></div>`).join('')}</div>
      <div class="foot rise" style="--i:${i}"><a class="ul-link" href="#" data-scene="${m.scene}" data-t="${m.label}" data-d="${amp(m.lead)}">${m.over}${ICON.arrow}</a><span>Point at an option to preview it</span></div></div>`; }).join('')}</div></div></div>`; },
    mount(root){ view=new IsoView($('.isov',root)); },
    open(id,first){ const m=byId(id); view.play(m.scene,{force:first}); caption(m.label,m.lead,first); },
    hover(el){ view.play(el.dataset.scene); caption(el.dataset.t,el.dataset.d); },
    height(lyr){ return Math.max(lyr.offsetHeight, 340)+52; }
  },
  spotlight:{
    html(){ return `<div class="mega B" id="mega"><div class="ctr"><div class="list">${MENUS.map(m=>{ let i=0;
      return `<div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}"><p class="gt rise" style="--i:${i++}">${m.label}</p><p class="lead rise" style="--i:${i++}">${m.lead}</p>
      <ul>${allLinks(m).map(l=>`<li><a class="sp-it rise" style="--i:${i++}" href="#" data-scene="${l[2]}" data-t="${amp(l[0])}" data-d="${amp(l[1])}">${amp(l[0])}${ICON.arrow}</a></li>`).join('')}<span class="sp-ind"></span></ul>
      <a class="ul-link rise" style="--i:${i}" href="#" data-scene="${m.scene}" data-t="${m.label}" data-d="${amp(m.lead)}">${m.over}${ICON.arrow}</a></div>`; }).join('')}</div>
      <div class="spot">${stageHTML}<div class="txt"><div class="sw"><span class="k"></span><h3></h3><p></p></div><a class="btn btn-secondary btn-sm" href="#">Learn more ${ICON.arrow}</a></div></div></div></div>`; },
    mount(root){ view=new IsoView($('.isov',root),{w:300,h:280}); },
    open(id,first){ const m=byId(id); view.play(m.scene,{force:first}); spotText(m.label,m.label,m.lead,first); const lyr=$(`#dd-${id}`); const i=$('.sp-ind',lyr); i.style.height='0px'; },
    hover(el){ view.play(el.dataset.scene); const lyr=el.closest('.lyr'); spotText(byId(lyr.dataset.id).label,el.dataset.t,el.dataset.d);
      const i=$('.sp-ind',lyr); if(el.classList.contains('sp-it')){ i.style.height=el.offsetHeight+'px'; i.style.translate=`0 ${el.offsetTop}px`; } else i.style.height='0px'; },
    height(lyr){ return Math.max(lyr.offsetHeight+8, $('.B .spot').offsetHeight)+52; }
  },
  diorama:{
    html(){ return `<div class="mega C" id="mega"><div class="ctr"><div class="view">${MENUS.map(m=>{ const L=allLinks(m); let i=0;
      return `<div class="lyr" data-id="${m.id}" id="dd-${m.id}" role="region" aria-label="${m.label}"><div class="head rise" style="--i:${i++}"><h3>${m.label}</h3><p>${m.lead}</p><a class="ul-link" href="#">${m.over}${ICON.arrow}</a></div>
      <div class="row" style="--n:${L.length}">${L.map(l=>`<a class="card rise" style="--i:${i++}" href="#" data-scene="${l[2]}"><div class="stage"><svg class="isov" aria-hidden="true"></svg></div><div class="tx"><span class="tl">${amp(l[0])}${ICON.arrow}</span><span class="td">${amp(l[1])}</span></div></a>`).join('')}</div></div>`; }).join('')}</div></div></div>`; },
    mount(){},
    open(id){ cards.forEach(c=>c.v.pause()); const lyr=$(`#dd-${id}`);
      cards=$$('.card',lyr).map((el,i)=>{ const v=new IsoView($('.isov',el),{w:240,h:200}); v.play(el.dataset.scene,{mode:'outline',force:true,delay:.08+i*.09}); return {el,v}; }); },
    hover(el){ cards.forEach(c=>{ const on=c.el===el; c.el.classList.toggle('act',on);
      if(on) c.v.play(c.el.dataset.scene,{mode:'full',force:c.v.mode!=='full',strokeDone:true,skip:.5});
      else if(c.v.mode!=='outline') c.v.play(c.v.name,{mode:'outline',instant:true,force:true}); }); },
    height(lyr){ return lyr.offsetHeight+48; }
  }
};
function caption(t,d,instant){ const box=$('.A .cap>div'); if(!box) return; const set=()=>{ $('.cap-t',box).textContent=t; $('.cap-d',box).textContent=d; };
  if(instant||RM.matches){ set(); return; } box.classList.add('leave'); setTimeout(()=>{ set(); box.classList.remove('leave'); box.classList.add('enter'); void box.offsetWidth; box.classList.remove('enter'); },130); }
function spotText(k,t,d,instant){ const sw=$('.B .txt .sw'); if(!sw) return; const set=()=>{ $('.k',sw).textContent=k; $('h3',sw).textContent=t; $('p',sw).textContent=d; };
  if(instant||RM.matches){ set(); return; } if($('h3',sw).textContent===t) return; sw.classList.add('leave'); setTimeout(()=>{ set(); sw.classList.remove('leave'); sw.classList.add('enter'); void sw.offsetWidth; sw.classList.remove('enter'); },130); }

function placeInd(t){ if(!t){ ind.classList.remove('on'); return; } const nr=$('.nav').getBoundingClientRect(), tr=t.getBoundingClientRect(); ind.style.width=(tr.width-24)+'px'; ind.style.translate=`${tr.left-nr.left+12}px 0`; ind.classList.add('on'); }
function show(id){
  clearTimeout(tOpen); clearTimeout(tClose); if(openId===id) return;
  const prev=openId; openId=id;
  triggers.forEach(t=>t.setAttribute('aria-expanded',String(t.dataset.id===id))); placeInd(triggers[ids.indexOf(id)]);
  document.body.classList.add('menu-open');
  const dir=prev?Math.sign(ids.indexOf(id)-ids.indexOf(prev)):0;
  layers.forEach(l=>{ const isNew=l.dataset.id===id, isOld=l.dataset.id===prev;
    if(isNew){ l.classList.remove('out'); l.classList.remove('in'); void l.offsetWidth; l.classList.add('in'); l.inert=false; $$('.act',l).forEach(a=>a.classList.remove('act')); }
    else if(isOld){ l.style.setProperty('--ty',(-dir*6)+'px'); l.classList.remove('in'); l.classList.add('out'); l.inert=true; }
    else { l.classList.remove('in','out'); l.inert=true; } });
  const mega=$('#mega'), C=CONCEPT[opt];
  mega.style.height=C.height($(`#dd-${id}`))+'px'; mega.classList.add('open');
  if(!prev && view) view.resume();
  C.open(id,!prev);
}
function hide(focusBack){
  clearTimeout(tOpen); clearTimeout(tClose); if(!openId) return;
  const t=triggers[ids.indexOf(openId)]; openId=null;
  triggers.forEach(x=>x.setAttribute('aria-expanded','false')); placeInd(null); document.body.classList.remove('menu-open');
  const mega=$('#mega'); mega.classList.remove('open'); mega.style.height='0px';
  layers.forEach(l=>{ l.inert=true; l.classList.remove('in','out'); });
  view&&view.pause(); cards.forEach(c=>c.v.pause());
  if(focusBack&&t) t.focus();
}
const mouse=e=>e.pointerType==='mouse';
triggers.forEach(t=>{
  t.addEventListener('pointerenter',e=>{ if(!mouse(e)) return; clearTimeout(tClose); if(openId) show(t.dataset.id); else { clearTimeout(tOpen); tOpen=setTimeout(()=>show(t.dataset.id),90); } });
  t.addEventListener('click',()=>openId===t.dataset.id?hide(false):show(t.dataset.id));
  t.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ e.preventDefault(); show(t.dataset.id); const f=$(`#dd-${t.dataset.id} [data-scene]`); f&&setTimeout(()=>f.focus(),40); } });
});
$$('.nav-t:not([data-id])').forEach(a=>a.addEventListener('pointerenter',e=>{ if(!mouse(e)) return; clearTimeout(tOpen); if(openId){ clearTimeout(tClose); tClose=setTimeout(()=>hide(false),200); } }));
hdr.addEventListener('pointerleave',e=>{ if(!mouse(e)) return; clearTimeout(tOpen); tClose=setTimeout(()=>hide(false),260); });
hdr.addEventListener('pointerenter',e=>{ if(mouse(e)) clearTimeout(tClose); });
hdr.addEventListener('keydown',e=>{ if(e.key==='Escape'&&openId){ e.preventDefault(); hide(true); } });
hdr.addEventListener('focusout',e=>{ if(openId&&!hdr.contains(e.relatedTarget)) hide(false); });
document.addEventListener('pointerdown',e=>{ if(openId&&!hdr.contains(e.target)) hide(false); });
window.addEventListener('scroll',()=>{ if(openId) hide(false); },{passive:true});
window.addEventListener('resize',()=>{ if(openId){ const id=openId; openId=null; show(id); } });

// hovering or focusing an option swaps the illustration (short intent delay so sweeping across doesn't flicker)
function activate(el){
  const lyr=el.closest('.lyr'); if(!lyr||!lyr.classList.contains('in')) return;
  $$('.act',lyr).forEach(a=>a!==el&&a.classList.remove('act')); if(!el.classList.contains('card')) el.classList.add('act');
  CONCEPT[opt].hover(el);
}
dd.addEventListener('pointerover',e=>{ const el=e.target.closest('[data-scene]'); if(!el) return; clearTimeout(hoverT); hoverT=setTimeout(()=>activate(el),70); });
dd.addEventListener('focusin',e=>{ const el=e.target.closest('[data-scene]'); if(el) activate(el); });
dd.addEventListener('click',e=>{ const cp=e.target.closest('.cp'); if(cp){ e.preventDefault(); view&&copyText(view.svgString()); return; } if(e.target.closest('a')) e.preventDefault(); });

function setOpt(o){
  if(!CONCEPT[o]) o='stage';
  hide(false); cards.forEach(c=>c.v.pause()); cards=[]; view&&view.pause(); view=null;
  opt=o; document.body.dataset.opt=o; dd.innerHTML=CONCEPT[o].html(); CONCEPT[o].mount(dd);
  layers=$$('.lyr',dd); layers.forEach(l=>l.inert=true);
  $$('.switch a').forEach(a=>a.setAttribute('aria-current',String(a.dataset.o===o)));
}

/* ============ Hero lattice (interactive) ============ */
const Lattice=(function(){
  const cv=$('canvas.lattice'), ctx=cv.getContext('2d'); let W=0,H=0,nodes=[],cols=0,rows=0,mx=-999,my=-999,raf=0,active=false;
  const SP=58,C=Math.cos(Math.PI/6);
  function build(){ const r=cv.getBoundingClientRect(); W=r.width; H=r.height; const dpr=Math.min(devicePixelRatio||1,2); cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    nodes=[]; const dx=SP*C,dy=SP/2; cols=Math.ceil(W/dx)+2; rows=Math.ceil(H/SP)+2;
    for(let c=0;c<cols;c++) for(let r=0;r<rows;r++) nodes.push({x:c*dx,y:r*SP+(c%2?dy:0)-dy,c,r,lift:0}); draw(); }
  const at=(c,r)=>(c<0||r<0||c>=cols||r>=rows)?null:nodes[c*rows+r];
  const fade=x=>Math.max(0,Math.min(1,(x-W*.38)/(W*.22)));
  const alpha=n=>fade(n.x)*Math.max(0,1-Math.min(1,Math.abs(n.y-H*.48)/(H*.62)));
  function draw(){ ctx.clearRect(0,0,W,H);
    for(const n of nodes){ const al=alpha(n); if(al<=.02) continue;
      [at(n.c,n.r+1),at(n.c+1,n.c%2?n.r:n.r-1),at(n.c+1,n.c%2?n.r+1:n.r)].forEach((m,k)=>{ if(!m||((n.c+n.r+k)%3)===0) return; const t=Math.min(1,(n.lift+m.lift)/2);
        ctx.strokeStyle=t>.05?`rgba(10,128,128,${(.12+.5*t)*al})`:`rgba(26,26,31,${.09*al})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(n.x,n.y-n.lift*8); ctx.lineTo(m.x,m.y-m.lift*8); ctx.stroke(); }); }
    for(const n of nodes){ const al=alpha(n); if(al<=.02) continue; const t=Math.min(1,n.lift);
      ctx.fillStyle=t>.05?`rgba(10,128,128,${(.35+.6*t)*al})`:`rgba(26,26,31,${.28*al})`; ctx.beginPath(); ctx.arc(n.x,n.y-n.lift*8,1.5+t*1.2,0,Math.PI*2); ctx.fill(); } }
  function loop(){ let moving=false; for(const n of nodes){ const d=Math.hypot(n.x-mx,n.y-my); const tg=d<150?1-d/150:0; const nl=n.lift+(tg-n.lift)*.12; if(Math.abs(nl-n.lift)>.002) moving=true; n.lift=nl; } draw(); raf=(moving||active)?requestAnimationFrame(loop):0; }
  const hero=$('.hero');
  hero.addEventListener('pointermove',e=>{ if(RM.matches) return; const r=cv.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; active=true; if(!raf) raf=requestAnimationFrame(loop); });
  hero.addEventListener('pointerleave',()=>{ mx=my=-999; active=false; if(!raf) raf=requestAnimationFrame(loop); });
  addEventListener('resize',build); return {build};
})();

/* ============ Estimator ============ */
(function(){
  const V=[10,25,50,75,100,150,200,250,300,400,500,600,700,800,1000,1250,1500,2000,2500,3000], N=V.length; let lo=4,hi=14;
  const hist=$('#hist'),trk=$('#trk'),sel=$('#sel'),hl=$('#hd-lo'),hh=$('#hd-hi');
  hist.innerHTML=V.map((v,i)=>`<i style="height:${(14+Math.pow(i/(N-1),1.25)*86).toFixed(0)}%"></i>`).join(''); const bars=$$('i',hist);
  const money=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}), val=n=>'$'+n.toLocaleString('en-US');
  function render(){ const a=lo/N*100,b=(hi+1)/N*100; sel.style.left=a+'%'; sel.style.width=(b-a)+'%'; hl.style.left=a+'%'; hh.style.left=b+'%';
    bars.forEach((el,i)=>el.classList.toggle('on',i>=lo&&i<=hi)); $('#est-range').textContent=`${val(V[lo])} to ${val(V[hi])}`; $('#est-v').textContent=`${money(V[lo]*.008)} to ${money(V[hi]*.0105)}`;
    [[hl,lo],[hh,hi]].forEach(([el,i])=>{ el.setAttribute('aria-valuemin',V[0]); el.setAttribute('aria-valuemax',V[N-1]); el.setAttribute('aria-valuenow',V[i]); el.setAttribute('aria-valuetext',val(V[i])); }); }
  const idxAt=x=>{ const r=trk.getBoundingClientRect(); return Math.max(0,Math.min(N,Math.round((x-r.left)/r.width*N))); }; let mode=null,grab=0;
  trk.addEventListener('pointerdown',e=>{ const t=e.target; trk.setPointerCapture(e.pointerId); trk.classList.add('drag'); if(t===hl) mode='lo'; else if(t===hh) mode='hi'; else if(t===sel){ mode='band'; grab=idxAt(e.clientX)-lo; } else { const i=idxAt(e.clientX); mode=Math.abs(i-lo)<Math.abs(i-(hi+1))?'lo':'hi'; move(e); } });
  function move(e){ if(!mode) return; const i=idxAt(e.clientX); if(mode==='lo') lo=Math.min(Math.max(0,i),hi); else if(mode==='hi') hi=Math.max(Math.min(N-1,i-1),lo); else { const w=hi-lo; const n=Math.max(0,Math.min(N-1-w,i-grab)); lo=n; hi=n+w; } render(); }
  trk.addEventListener('pointermove',move); trk.addEventListener('pointerup',()=>{ mode=null; trk.classList.remove('drag'); });
  const key=w=>e=>{ const d=(e.key==='ArrowRight'||e.key==='ArrowUp')?1:(e.key==='ArrowLeft'||e.key==='ArrowDown')?-1:0; if(!d) return; e.preventDefault(); if(w==='lo') lo=Math.min(Math.max(0,lo+d),hi); else hi=Math.max(Math.min(N-1,hi+d),lo); render(); };
  hl.addEventListener('keydown',key('lo')); hh.addEventListener('keydown',key('hi')); render();
})();

/* ============ Mobile drawer ============ */
(function(){
  const dr=$('#mdrawer'), bt=$('.burger');
  dr.innerHTML=`<nav class="md-vp" aria-label="Main"><div class="md-track"><div class="md-lvl md-a"><ul class="md-l1">${NAV.map(n=>n.href?`<li><a class="md-row" href="#">${n.label}${ICON.right}</a></li>`:`<li><button class="md-row" type="button" data-drill="${n.id}">${n.label}${ICON.right}</button></li>`).join('')}</ul>
    <div class="md-util"><a href="#">Log in</a><a href="#">Contact us</a><a href="#">Search</a><a href="#">United States - English</a></div></div>
    <div class="md-lvl md-b" inert><button class="md-back" type="button">${ICON.left}All menus</button><div class="stage md-stage"><svg class="isov" aria-hidden="true"></svg></div>${MENUS.map(m=>`<div class="md-sec" data-id="${m.id}"><h2>${m.label}</h2><p>${m.lead}</p><ul>${allLinks(m).map((l,i)=>itemHTML(l,i)).join('')}</ul></div>`).join('')}</div></div></nav>
    <div class="md-foot"><a class="btn btn-primary" href="#">Get a quote</a><a class="btn btn-secondary" href="#">Claims</a></div>`;
  const tr=$('.md-track',dr), a=$('.md-a',dr), b=$('.md-b',dr), mv=new IsoView($('.md-stage .isov',dr),{w:340,h:200}); let last=null,th=0;
  function open(){ clearTimeout(th); document.documentElement.style.setProperty('--hdr-h',hdr.getBoundingClientRect().height+'px'); dr.hidden=false; void dr.offsetWidth; dr.classList.add('open'); bt.setAttribute('aria-expanded','true'); bt.setAttribute('aria-label','Close menu'); document.body.style.overflow='hidden'; setTimeout(()=>$('.md-row',dr).focus(),40); }
  function close(){ dr.classList.remove('open'); bt.setAttribute('aria-expanded','false'); bt.setAttribute('aria-label','Open menu'); document.body.style.overflow=''; tr.classList.remove('deep'); a.inert=false; b.inert=true; mv.pause(); th=setTimeout(()=>dr.hidden=true,220); bt.focus(); }
  bt.addEventListener('click',()=>bt.getAttribute('aria-expanded')==='true'?close():open());
  $$('[data-drill]',dr).forEach(x=>x.addEventListener('click',()=>{ last=x; const m=byId(x.dataset.drill); $$('.md-sec',dr).forEach(s=>s.classList.toggle('on',s.dataset.id===m.id)); b.scrollTop=0; tr.classList.add('deep'); a.inert=true; b.inert=false; mv.play(m.scene,{force:true,delay:.2}); setTimeout(()=>$('.md-back',dr).focus(),330); }));
  $('.md-back',dr).addEventListener('click',()=>{ tr.classList.remove('deep'); a.inert=false; b.inert=true; mv.pause(); last&&setTimeout(()=>last.focus(),330); });
  b.addEventListener('pointerover',e=>{ const el=e.target.closest('[data-scene]'); if(el) mv.play(el.dataset.scene); });
  dr.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  dr.addEventListener('click',e=>{ if(e.target.closest('a')) e.preventDefault(); });
})();
document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#"]'); if(a) e.preventDefault(); });

/* ============ Boot ============ */
const fromHash=()=>(location.hash||'').replace('#','')||'stage';
addEventListener('hashchange',()=>setOpt(fromHash()));
Lattice.build(); setOpt(fromHash());
const qs=new URLSearchParams(location.search), q=qs.get('open'), hv=qs.get('hover');
if(q) setTimeout(()=>{ show(q); if(hv!=null) setTimeout(()=>{ const el=$$(`#dd-${q} [data-scene]`)[+hv]; el&&activate(el); },500); },300);
window.__iso={SCENES,IsoView,renderScene};
if(qs.get('export')){
  const W=320,H=270, out={scenes:{}, lattice:'', stageDots:''};
  Object.keys(SCENES).forEach(k=>{
    const pre=SCENES[k](); const sDur=1.05;
    const bb=[]; renderScene(SCENES[k](),30,'full',{collect:bb,final:true,strokeDone:true}); renderScene(pre,sDur,'full',{collect:bb,final:true,strokeDone:true});
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; bb.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);});
    const kk=Math.max(1,(x1-x0+36)/W,(y1-y0+36)/H), w=W*kk, h=H*kk, vb=`${f1((x0+x1)/2-w/2)} ${f1((y0+y1)/2-h/2)} ${f1(w)} ${f1(h)}`;
    const wrap=b=>`<svg xmlns="${NS}" width="${W}" height="${H}" viewBox="${vb}" fill="none">${b}</svg>`;
    out.scenes[k]={
      Outline: wrap(renderScene(SCENES[k](),30,'outline',{final:true,strokeDone:true,named:true,plane:1})),
      Drawn:   wrap(renderScene(SCENES[k](),sDur,'full',{final:true,strokeDone:true,named:true,plane:0})),
      Filled:  wrap(renderScene(SCENES[k](),30,'full',{final:true,strokeDone:true,named:true,plane:1}))
    };
  });
  // hero lattice as static vectors (1440 x 620)
  (function(){ const LW=1440,LH=620,SP=58,C=Math.cos(Math.PI/6),dx=SP*C,dy=SP/2,cols=Math.ceil(LW/dx)+2,rows=Math.ceil(LH/SP)+2,nodes=[];
    for(let c=0;c<cols;c++) for(let r=0;r<rows;r++) nodes.push({x:c*dx,y:r*SP+(c%2?dy:0)-dy,c,r});
    const at=(c,r)=>(c<0||r<0||c>=cols||r>=rows)?null:nodes[c*rows+r];
    const al=n=>Math.max(0,Math.min(1,(n.x-LW*.38)/(LW*.22)))*Math.max(0,1-Math.min(1,Math.abs(n.y-LH*.48)/(LH*.62)));
    let L='',D='';
    nodes.forEach(n=>{ const a=al(n); if(a<=.02) return;
      [at(n.c,n.r+1),at(n.c+1,n.c%2?n.r:n.r-1),at(n.c+1,n.c%2?n.r+1:n.r)].forEach((m,k)=>{ if(!m||((n.c+n.r+k)%3)===0) return; L+=`<path d="M${f1(n.x)} ${f1(n.y)}L${f1(m.x)} ${f1(m.y)}" stroke="#1a1a1f" stroke-opacity="${(.09*a).toFixed(3)}"/>`; });
      D+=`<circle cx="${f1(n.x)}" cy="${f1(n.y)}" r="1.5" fill="#1a1a1f" fill-opacity="${(.28*a).toFixed(3)}"/>`; });
    out.lattice=`<svg xmlns="${NS}" width="${LW}" height="${LH}" viewBox="0 0 ${LW} ${LH}" fill="none"><g id="Lines">${L}</g><g id="Nodes">${D}</g></svg>`; })();
  // stage dot grid (360 x 268), radially faded
  (function(){ const SW=360,SH=268; let d=''; for(let y=7;y<SH;y+=14) for(let x=7;x<SW;x+=14){ const nx=(x-SW/2)/(SW*.5), ny=(y-SH*.58)/(SH*.5); const r=Math.hypot(nx,ny); const a=r<.35?1:Math.max(0,1-(r-.35)/.65); if(a>.03) d+=`<circle cx="${x}" cy="${y}" r="1" fill="#0a8080" fill-opacity="${(.19*a).toFixed(3)}"/>`; }
    out.stageDots=`<svg xmlns="${NS}" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}" fill="none">${d}</svg>`; })();
  const pre=document.createElement('pre'); pre.id='export'; pre.textContent=JSON.stringify(out); document.body.appendChild(pre);
}
if(qs.get('gallery')){ const T=+(qs.get('t')||30), md=qs.get('mode')||'full'; const ov=document.createElement('div'); ov.style.cssText='position:fixed;inset:0;z-index:999;background:#fff;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:8px;overflow:auto';
  Object.keys(SCENES).forEach(k=>{ const c=document.createElement('div'); c.style.cssText='border:1px solid #eee;position:relative;height:200px'; c.innerHTML=`<svg class="isov" style="width:100%;height:100%"></svg><span style="position:absolute;left:6px;top:4px;font:11px Inter">${k}</span>`; ov.appendChild(c);
    const v=new IsoView($('svg',c),{w:300,h:250}); const sc=SCENES[k](); v.fit(sc); const g=document.createElementNS(NS,'g'); $('svg',c).appendChild(g); g.innerHTML=renderScene(sc,T,md,T>=30?{final:true}:{}); });
  document.body.appendChild(ov); }
})();
