/* InsureShield V2 builder: creates the Stage and Diorama header concepts on the
   "InsureShield V2" page with auto layout, components, variants, variables,
   text styles, prototype interactions and vector illustrations. */
const DATA = /*__DATA__*/null;
const LOGO_B64 = /*__LOGO__*/'';
const TAG = 'insureshield-v2-builder';
const PAGE_NAME = 'InsureShield V2';
const W = 1440, SIDE = 152;               // 1200 container with 32px gutters, centred in 1440
const warnings = [];
const warn = (where, e) => { warnings.push(where + ': ' + (e && e.message ? e.message : e)); console.warn(where, e); };

/* ---------------- Content ---------------- */
const NAV = [
  { id: 'insurance', label: 'Shipping Insurance', current: true, lead: 'Protect shipments from covered loss, damage, and theft.', over: 'Explore shipping insurance', scene: 'shieldParcel',
    groups: [{ t: 'Coverage by shipment', l: [['Multi-Carrier Shipments', 'Parcel and freight across UPS, FedEx, DHL, and USPS', 'globeRoutes'], ['UPS Shipments', 'Coverage designed for packages shipped with UPS', 'truck'], ['Special Commodities', 'High-value, perishable, and specialty goods', 'gemCase']] },
             { t: 'Get started', l: [['Select My Coverage', 'Answer a few questions to find the right fit', 'gauge'], ['Get a Quote', 'Estimate cost for your shipping volume', 'coins']] }] },
  { id: 'solutions', label: 'Solutions', lead: 'Tools that reduce risk before, during, and after delivery.', over: 'See all solutions', scene: 'layers',
    groups: [{ t: 'Products', cols: 2, l: [['CommerceShield', 'Order risk signals and chargeback protection', 'scanTile'], ['DeliveryDefense', 'Address confidence scores before you ship', 'house'], ['Delivery Orchestration', 'Choose delivery options that lower risk', 'route'], ['InsureShield® Shipping Insurance', 'Protection against loss, damage, and theft', 'bigShield']] }] },
  { id: 'claims', label: 'Claims', href: true },
  { id: 'partners', label: 'Partners', lead: 'Connect InsureShield to the platforms you already ship with.', over: 'Partners overview', scene: 'storefront',
    groups: [{ t: 'Work with us', l: [['Connect with a Partner', 'Add coverage inside the platforms you use', 'linkBlocks'], ['Become a Partner', 'Offer InsureShield to your customers', 'building']] }] },
  { id: 'resources', label: 'Resources', lead: 'Guides, stories, and support for shippers.', over: 'All resources', scene: 'docStack',
    groups: [{ t: 'Learn', l: [['Insights', 'Articles on shipping risk and protection', 'chart'], ['Whitepapers & Guides', 'In-depth research and how-to guides', 'document'], ['Customer Stories', 'How businesses recover faster', 'storefront']] }, { t: 'Get help', l: [['Help & Support', 'Answers about coverage, billing, and claims', 'bubble']] }] },
  { id: 'about', label: 'About', lead: 'News, availability, and how to reach us.', over: 'About InsureShield', scene: 'globePlinth',
    groups: [{ t: 'Company', l: [['Announcements', 'Product and company news', 'docStack'], ['In The News', 'Press coverage of UPS Capital', 'document'], ['Product Availability', 'Where coverage is offered', 'mapPins']] }, { t: 'Talk to us', l: [['Contact Us', 'Reach our team', 'bubble']] }] }
];
const MENUS = NAV.filter(n => !n.href);
const LINKS = m => m.groups.flatMap(g => g.l);
const SCENE_LABEL = { shieldParcel: 'Parcel shield', globeRoutes: 'Globe routes', truck: 'Truck', gemCase: 'Gem case', gauge: 'Gauge', coins: 'Quote coins', layers: 'Layers', scanTile: 'Scan tile', house: 'House', route: 'Route', bigShield: 'Shield', linkBlocks: 'Linked blocks', building: 'Building', docStack: 'Document stack', chart: 'Chart', document: 'Document', storefront: 'Storefront', bubble: 'Speech bubble', mapPins: 'Map pins', globePlinth: 'Globe' };

/* ---------------- Tokens ---------------- */
const TOK = {
  'color/primary/default': '#0a8080', 'color/primary/pressed': '#075a5a', 'color/primary/hover': '#6fb1b1', 'color/primary/elevated': '#3f9898',
  'color/primary/container': '#cfe5e5', 'color/primary/low': '#e7f2f2', 'color/primary/lowest': '#f3f9f9', 'color/primary/high': '#9fcbcb',
  'color/ink/default': '#121212', 'color/ink/medium': '#5f5753', 'color/ink/low': '#85858e', 'color/ink/nav': '#2b2a29', 'color/ink/on-primary': '#ffffff',
  'color/surface/bright': '#ffffff', 'color/surface/default': '#f8f8fb', 'color/surface/low': '#efeff2', 'color/surface/inverse': '#363230',
  'color/outline/default': '#85858e', 'color/outline/variant': '#b2b2bb', 'color/outline/low': '#1a1a1f'
};
const TOK_ALPHA = { 'color/outline/low': 0.12 };
const SPACE = { 4: 'space/1', 8: 'space/2', 12: 'space/3', 16: 'space/4', 24: 'space/5', 32: 'space/6', 48: 'space/7', 64: 'space/8', 96: 'space/9' };
const RADIUS = { 4: 'radius/sm', 8: 'radius/md', 999: 'radius/pill' };
const VAR = {}, TS = {}, ES = {}, PENDING = [];
const EASE = { type: 'CUSTOM_CUBIC_BEZIER', easingFunctionCubicBezier: { x1: 0.2, y1: 0, x2: 0, y2: 1 } };

function rgb(hex) { const n = parseInt(hex.replace('#', '').slice(0, 6), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; }
function paint(token, opacity) {
  const hex = TOK[token] || token; let p = { type: 'SOLID', color: rgb(hex) };
  const a = opacity != null ? opacity : TOK_ALPHA[token]; if (a != null) p.opacity = a;
  const v = VAR[token]; if (v) { try { p = figma.variables.setBoundVariableForPaint(p, 'color', v); if (a != null) p.opacity = a; } catch (e) { warn('bind paint ' + token, e); } }
  return p;
}
function bindNum(node, field, value, map) {
  const name = map && map[value]; if (!name || !VAR[name]) return;
  try { node.setBoundVariable(field, VAR[name]); } catch (e) { warn('bind ' + field, e); }
}
function setPad(f, [t, r, b, l]) {
  f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l;
  bindNum(f, 'paddingTop', t, SPACE); bindNum(f, 'paddingRight', r, SPACE); bindNum(f, 'paddingBottom', b, SPACE); bindNum(f, 'paddingLeft', l, SPACE);
}
function setRadius(f, r) { f.cornerRadius = r; ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(k => bindNum(f, k, r, RADIUS)); }
function tag(n) { try { n.setPluginData(TAG, '1'); } catch (e) {} return n; }

/* ---------------- Node helpers (everything is auto layout) ---------------- */
function frame(name, o = {}) {
  const f = o.component ? figma.createComponent() : figma.createFrame();
  f.name = name; f.fills = o.fill ? [paint(o.fill)] : [];
  if (o.dir) {
    f.layoutMode = o.dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
    f.itemSpacing = o.gap || 0; bindNum(f, 'itemSpacing', o.gap || 0, SPACE);
    setPad(f, o.pad || [0, 0, 0, 0]);
    f.primaryAxisAlignItems = o.main || 'MIN'; f.counterAxisAlignItems = o.cross || 'MIN';
    if (o.wrap) { f.layoutWrap = 'WRAP'; f.counterAxisSpacing = o.wrapGap || 0; }
  }
  if (o.w != null || o.h != null) {
    f.resize(o.w != null ? o.w : f.width, o.h != null ? o.h : f.height);
    if (o.dir) {
      if (o.w != null) { if (o.dir === 'HORIZONTAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED'; }
      if (o.h != null) { if (o.dir === 'VERTICAL') f.primaryAxisSizingMode = 'FIXED'; else f.counterAxisSizingMode = 'FIXED'; }
    }
  }
  if (o.radius != null) setRadius(f, o.radius);
  if (o.stroke) {
    f.strokes = [paint(o.stroke)]; f.strokeAlign = 'INSIDE';
    if (o.strokeSides) { const s = o.strokeSides; f.strokeTopWeight = s[0]; f.strokeRightWeight = s[1]; f.strokeBottomWeight = s[2]; f.strokeLeftWeight = s[3]; }
    else f.strokeWeight = o.strokeW || 1;
  }
  f.clipsContent = !!o.clip;
  if (o.effect && ES[o.effect]) { const st = ES[o.effect]; f.effects = st.effects; PENDING.push(() => f.setEffectStyleIdAsync(st.id)); }
  return f;
}
function add(parent, child, o = {}) {
  parent.appendChild(child);
  if (o.abs) { child.layoutPositioning = 'ABSOLUTE'; if (o.x != null) child.x = o.x; if (o.y != null) child.y = o.y; if (o.cons) child.constraints = o.cons; return child; }
  try { if (o.h) child.layoutSizingHorizontal = o.h; if (o.v) child.layoutSizingVertical = o.v; } catch (e) { warn('sizing ' + child.name, e); }
  return child;
}
async function text(chars, style, color, name) {
  const t = figma.createText();
  t.fontName = TS[style].fontName;
  try { await t.setTextStyleIdAsync(TS[style].id); } catch (e) { warn('text style ' + style, e); }
  t.characters = chars; t.fills = [paint(color)]; t.name = name || chars.slice(0, 40);
  return t;
}
function rect(name, w, h, fill, r) { const x = figma.createRectangle(); x.name = name; x.resize(w, h); x.fills = fill ? [paint(fill)] : []; if (r != null) setRadius(x, r); return x; }
function spacer(name = 'Spacer') { const f = frame(name, { dir: 'HORIZONTAL' }); f.resize(1, 1); return f; }
function variant(set, props) { const name = Object.entries(props).map(([k, v]) => k + '=' + v).join(', '); const c = set.children.find(v => v.name === name); if (!c) throw new Error('No variant ' + name + ' in ' + set.name); return c; }
function inst(comp) { return comp.createInstance(); }
async function react(node, reactions) { try { await node.setReactionsAsync(reactions); } catch (e) { warn('interaction on ' + node.name, e); } }
const go = (dest, dur = 0.32, type = 'SMART_ANIMATE') => ({ type: 'NODE', destinationId: dest.id, navigation: 'CHANGE_TO', transition: { type, easing: EASE, duration: dur }, preserveScrollPosition: false });
const setVar = (name, value) => { const v = VAR[name]; if (!v) return null; const rt = v.resolvedType; return { type: 'SET_VARIABLE', variableId: v.id, variableValue: { type: rt, resolvedType: rt, value } }; };
const acts = (...a) => a.filter(Boolean);
function combine(comps, name, layout) {
  const set = figma.combineAsVariants(comps, figma.currentPage); set.name = name;
  set.layoutMode = layout && layout.dir || 'HORIZONTAL'; set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
  set.itemSpacing = layout && layout.gap != null ? layout.gap : 24; set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 24;
  if (layout && layout.wrapW) { set.layoutWrap = 'WRAP'; set.counterAxisSpacing = layout.gap != null ? layout.gap : 24; set.primaryAxisSizingMode = 'FIXED'; set.resize(layout.wrapW, set.height); }
  set.fills = [paint('color/surface/default')]; set.strokes = [paint('#9747ff')]; set.dashPattern = [6, 4]; set.strokeWeight = 1; set.cornerRadius = 8;
  return set;
}

/* ---------------- Foundations ---------------- */
async function collection(name) { const cols = await figma.variables.getLocalVariableCollectionsAsync(); return cols.find(c => c.name === name) || figma.variables.createVariableCollection(name); }
async function defVar(col, name, type, value, scopes) {
  const all = await figma.variables.getLocalVariablesAsync(type);
  let v = all.find(x => x.name === name && x.variableCollectionId === col.id);
  if (!v) v = figma.variables.createVariable(name, col, type);
  v.setValueForMode(col.modes[0].modeId, value); if (scopes) try { v.scopes = scopes; } catch (e) {}
  VAR[name] = v; return v;
}
async function buildVariables() {
  const mom = await collection('Momentum / InsureShield'); try { mom.renameMode(mom.modes[0].modeId, 'Light'); } catch (e) {}
  for (const [k, hex] of Object.entries(TOK)) { const c = rgb(hex); await defVar(mom, k, 'COLOR', { r: c.r, g: c.g, b: c.b, a: TOK_ALPHA[k] != null ? TOK_ALPHA[k] : 1 }); }
  for (const [px, name] of Object.entries(SPACE)) await defVar(mom, name, 'FLOAT', +px, ['GAP', 'WIDTH_HEIGHT']);
  for (const [px, name] of Object.entries(RADIUS)) await defVar(mom, name, 'FLOAT', +px, ['CORNER_RADIUS']);
  await defVar(mom, 'size/control-md', 'FLOAT', 44, ['WIDTH_HEIGHT']); await defVar(mom, 'size/control-sm', 'FLOAT', 36, ['WIDTH_HEIGHT']);
  await defVar(mom, 'layout/page-width', 'FLOAT', 1440, ['WIDTH_HEIGHT']); await defVar(mom, 'layout/container-inset', 'FLOAT', SIDE, ['GAP']);

  const mot = await collection('Motion'); try { mot.renameMode(mot.modes[0].modeId, 'Default'); } catch (e) {}
  await defVar(mot, 'motion/duration/fast', 'FLOAT', 100); await defVar(mot, 'motion/duration/base', 'FLOAT', 200); await defVar(mot, 'motion/duration/slow', 'FLOAT', 320);
  await defVar(mot, 'motion/delay/hover-intent', 'FLOAT', 90); await defVar(mot, 'motion/delay/close', 'FLOAT', 240); await defVar(mot, 'motion/delay/option-intent', 'FLOAT', 70);
  await defVar(mot, 'motion/illustration/build', 'FLOAT', 1400); await defVar(mot, 'motion/illustration/fill', 'FLOAT', 600);
  await defVar(mot, 'motion/easing/standard', 'STRING', 'cubic-bezier(0.2, 0, 0, 1)'); await defVar(mot, 'motion/easing/enter', 'STRING', 'cubic-bezier(0, 0, 0, 1)'); await defVar(mot, 'motion/easing/exit', 'STRING', 'cubic-bezier(0.3, 0, 1, 1)');

  const nav = await collection('Nav state'); try { nav.renameMode(nav.modes[0].modeId, 'Default'); } catch (e) {}
  await defVar(nav, 'nav/open-menu', 'STRING', 'None'); await defVar(nav, 'nav/hovered-option', 'STRING', 'Overview');
  await defVar(nav, 'nav/is-open', 'BOOLEAN', false); await defVar(nav, 'nav/concept', 'STRING', 'Stage');
}
async function buildStyles() {
  const fonts = ['Regular', 'Medium', 'Semi Bold', 'Bold'];
  for (const s of fonts) await figma.loadFontAsync({ family: 'Inter', style: s });
  const defs = {
    'Display/LG': ['Semi Bold', 48, 56, -2.5], 'Heading/SM': ['Regular', 28, 36, -1], 'Title/LG': ['Medium', 24, 32, -1], 'Title/SM': ['Semi Bold', 16, 22, 0],
    'Body/LG': ['Regular', 20, 28, 0], 'Body/MD': ['Regular', 16, 24, 0], 'Body/SM': ['Regular', 14, 20, 0], 'Body/XS': ['Regular', 13, 19, 0], 'Body/2XS': ['Regular', 12, 16, 0],
    'Label/LG': ['Medium', 16, 24, 0], 'Label/MD': ['Medium', 15, 20, 0], 'Label/SM': ['Regular', 13, 16, 0], 'Link/SM': ['Medium', 14, 20, 0],
    'Overline': ['Semi Bold', 11, 16, 8], 'Numeric/Value': ['Regular', 30, 38, 0], 'Button/MD': ['Medium', 16, 24, 0], 'Button/SM': ['Medium', 15, 20, 0]
  };
  const existing = await figma.getLocalTextStylesAsync();
  for (const [k, [style, size, lh, ls]] of Object.entries(defs)) {
    const name = 'Momentum/' + k; let s = existing.find(x => x.name === name) || figma.createTextStyle();
    s.name = name; s.fontName = { family: 'Inter', style }; s.fontSize = size; s.lineHeight = { unit: 'PIXELS', value: lh }; s.letterSpacing = { unit: 'PERCENT', value: ls };
    if (k === 'Overline') s.textCase = 'UPPER';
    TS[k] = s;
  }
  const eff = await figma.getLocalEffectStylesAsync();
  const shadows = { 'Shadow 3': [[0, 2, 4, 0.06], [0, 4, 8, 0.08]], 'Shadow 4': [[0, 4, 8, 0.08], [0, 8, 16, 0.12]], 'Shadow 5': [[0, 8, 16, 0.12], [0, 16, 32, 0.16]] };
  for (const [k, list] of Object.entries(shadows)) {
    const name = 'Momentum/' + k; let s = eff.find(x => x.name === name) || figma.createEffectStyle(); s.name = name;
    s.effects = list.map(([x, y, r, a]) => ({ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a }, offset: { x, y }, radius: r, spread: 0, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false }));
    ES[k] = s;
  }
}

/* ---------------- Base components ---------------- */
const ICONS = {
  'Chevron down': '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#85858e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Arrow right': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#0a8080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Globe': '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5f5753" stroke-width="1.6"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18" stroke="#5f5753" stroke-width="1.6"/></svg>',
  'Search': '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#5f5753" stroke-width="1.8"/><path d="M20 20l-4.2-4.2" stroke="#5f5753" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Info': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5f5753" stroke-width="1.6"/><path d="M12 11v6M12 7.5v.5" stroke="#5f5753" stroke-width="1.6" stroke-linecap="round"/></svg>'
};
const IC = {};
function buildIcons() {
  for (const [name, svg] of Object.entries(ICONS)) { const n = figma.createNodeFromSvg(svg); const c = figma.createComponentFromNode(n); c.name = 'Icon / ' + name; c.fills = []; IC[name] = c; }
}
function recolor(node, token) { node.findAll(n => 'strokes' in n && n.strokes.length).forEach(n => { n.strokes = [paint(token)]; }); }

const B = {};
async function buildLogo() {
  const c = frame('Logo / InsureShield', { component: true, dir: 'HORIZONTAL' });
  const r = rect('Lockup', 118, 46);
  try { const img = figma.createImage(figma.base64Decode(LOGO_B64)); r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FIT' }]; } catch (e) { warn('logo image', e); r.fills = [paint('color/surface/low')]; }
  add(c, r); B.logo = c;
}
async function buildButtons() {
  const comps = [];
  for (const type of ['Primary', 'Secondary']) for (const size of ['MD', 'SM']) {
    const c = frame(`Type=${type}, Size=${size}`, { component: true, dir: 'HORIZONTAL', gap: 8, pad: size === 'MD' ? [8, 20, 8, 20] : [6, 16, 6, 16], cross: 'CENTER', main: 'CENTER', radius: 999, fill: type === 'Primary' ? 'color/primary/default' : null, stroke: type === 'Secondary' ? 'color/ink/default' : null });
    c.minHeight = size === 'MD' ? 44 : 36;
    const t = await text('Button', size === 'MD' ? 'Button/MD' : 'Button/SM', type === 'Primary' ? 'color/ink/on-primary' : 'color/ink/default', 'Label'); add(c, t);
    const a = inst(IC['Arrow right']); a.name = 'Arrow'; if (type === 'Primary') recolor(a, 'color/ink/on-primary'); else recolor(a, 'color/ink/default'); add(c, a);
    comps.push(c);
  }
  const set = combine(comps, 'Button');
  const kL = set.addComponentProperty('Label', 'TEXT', 'Button'), kA = set.addComponentProperty('Show arrow', 'BOOLEAN', false);
  set.children.forEach(v => { v.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: kL }; v.findOne(n => n.name === 'Arrow').componentPropertyReferences = { visible: kA }; });
  B.button = set; B.buttonKeys = { label: kL, arrow: kA };
}
function button(type, size, label, arrow) { const i = inst(variant(B.button, { Type: type, Size: size })); i.setProperties({ [B.buttonKeys.label]: label, [B.buttonKeys.arrow]: !!arrow }); i.name = 'Button / ' + label; return i; }

async function buildNavItem() {
  const comps = [];
  for (const s of ['Default', 'Hover', 'Open', 'Current']) {
    const c = frame('State=' + s, { component: true, dir: 'HORIZONTAL', gap: 6, pad: [0, 12, 0, 12], cross: 'CENTER', h: 44, radius: 4 });
    add(c, await text('Shipping Insurance', 'Label/MD', s === 'Open' ? 'color/primary/pressed' : s === 'Hover' ? 'color/ink/default' : 'color/ink/nav', 'Label'));
    const ch = inst(IC['Chevron down']); ch.name = 'Chevron'; add(c, ch); if (s === 'Open') { ch.rotation = 180; recolor(ch, 'color/primary/default'); }
    const bar = rect('Current marker', 10, 2, 'color/outline/variant', 2); add(c, bar, { abs: true, x: 12, y: 42 }); bar.resize(Math.max(1, c.width - 24), 2); bar.constraints = { horizontal: 'STRETCH', vertical: 'MAX' }; bar.visible = s === 'Current';
    comps.push(c);
  }
  const set = combine(comps, 'Nav item');
  const kL = set.addComponentProperty('Label', 'TEXT', 'Shipping Insurance'), kM = set.addComponentProperty('Has menu', 'BOOLEAN', true);
  set.children.forEach(v => { v.findOne(n => n.name === 'Label').componentPropertyReferences = { characters: kL }; v.findOne(n => n.name === 'Chevron').componentPropertyReferences = { visible: kM }; });
  B.nav = set; B.navKeys = { label: kL, menu: kM };
}
async function buildMenuLink() {
  const comps = [];
  for (const s of ['Default', 'Active']) {
    const c = frame('State=' + s, { component: true, dir: 'VERTICAL', gap: 2, pad: [10, 12, 10, 14], w: 250, radius: 8, fill: s === 'Active' ? 'color/primary/lowest' : null });
    const row = frame('Title row', { dir: 'HORIZONTAL', gap: 6, cross: 'CENTER' }); add(c, row, { h: 'FILL' });
    add(row, await text('Multi-Carrier Shipments', 'Label/MD', s === 'Active' ? 'color/primary/pressed' : 'color/ink/default', 'Title'));
    const a = inst(IC['Arrow right']); a.name = 'Arrow'; a.rescale(0.875); a.visible = s === 'Active'; add(row, a);
    add(c, await text('Parcel and freight across UPS, FedEx, DHL, and USPS', 'Body/XS', 'color/ink/medium', 'Description'), { h: 'FILL' });
    const bar = rect('Active bar', 2, 20, 'color/primary/default', 2); add(c, bar, { abs: true, x: 0, y: 12 }); bar.resize(2, Math.max(1, c.height - 24)); bar.constraints = { horizontal: 'MIN', vertical: 'STRETCH' }; bar.visible = s === 'Active';
    comps.push(c);
  }
  const set = combine(comps, 'Menu link');
  const kT = set.addComponentProperty('Title', 'TEXT', 'Multi-Carrier Shipments'), kD = set.addComponentProperty('Description', 'TEXT', 'Parcel and freight across UPS, FedEx, DHL, and USPS');
  set.children.forEach(v => { v.findOne(n => n.name === 'Title').componentPropertyReferences = { characters: kT }; v.findOne(n => n.name === 'Description').componentPropertyReferences = { characters: kD }; });
  B.link = set; B.linkKeys = { title: kT, desc: kD };
}
async function textLink(label) {
  const f = frame('Text link / ' + label, { dir: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  const t = await text(label, 'Link/SM', 'color/primary/pressed', 'Label'); t.textDecoration = 'UNDERLINE'; add(f, t);
  const a = inst(IC['Arrow right']); a.name = 'Arrow'; a.rescale(0.875); add(f, a); return f;
}
async function buildUtilityBar() {
  const c = frame('Utility bar', { component: true, dir: 'HORIZONTAL', gap: 4, pad: [0, SIDE, 0, SIDE], main: 'MAX', cross: 'CENTER', w: W, h: 32, fill: 'color/surface/bright', stroke: 'color/outline/low', strokeSides: [0, 0, 1, 0] });
  for (const [label, icon] of [['Log in'], ['Contact us'], ['United States - English', 'Globe'], ['Search', 'Search']]) {
    const l = frame('Utility link / ' + label, { dir: 'HORIZONTAL', gap: 6, pad: [6, 10, 6, 10], cross: 'CENTER' });
    if (icon) add(l, inst(IC[icon]));
    add(l, await text(label, 'Label/SM', 'color/ink/medium', 'Label')); add(c, l);
  }
  B.utility = c;
}
function svgComponent(name, svg) { const n = figma.createNodeFromSvg(svg); const c = figma.createComponentFromNode(n); c.name = name; c.fills = []; c.clipsContent = false; return c; }

/* ---------------- Illustrations (vectors, three states) ---------------- */
const ILL = {};
async function buildIllustrations() {
  for (const [key, states] of Object.entries(DATA.scenes)) {
    const comps = ['Outline', 'Drawn', 'Filled'].map(st => { const c = svgComponent('State=' + st, states[st]); return c; });
    const set = combine(comps, 'Illustration / ' + (SCENE_LABEL[key] || key));
    set.description = 'Isometric line illustration. Drawn auto-advances to Filled (Smart animate) to replay the build: edges first, then planes fill and the part settles.';
    ILL[key] = set;
    await react(variant(set, { State: 'Drawn' }), [{ trigger: { type: 'AFTER_TIMEOUT', timeout: 0.3 }, actions: [go(variant(set, { State: 'Filled' }), 0.6)] }]);
  }
}
function illus(key, state) { const i = inst(variant(ILL[key], { State: state })); i.name = 'Illustration'; return i; }

/* ---------------- Diorama cards (one set per option) ---------------- */
const CARD = {};
async function buildCards() {
  for (const m of MENUS) for (const [title, desc, scene] of LINKS(m)) {
    if (CARD[title]) continue;
    const comps = [];
    for (const s of ['Outline', 'Active']) {
      const c = frame('State=' + s, { component: true, dir: 'VERTICAL', w: 218, radius: 8, clip: true, fill: 'color/surface/bright', stroke: s === 'Active' ? 'color/primary/high' : 'color/outline/low', effect: s === 'Active' ? 'Shadow 3' : null });
      const st = frame('Stage', { dir: 'VERTICAL', main: 'CENTER', cross: 'CENTER', h: 150, fill: s === 'Active' ? 'color/primary/lowest' : 'color/surface/default', clip: true }); add(c, st, { h: 'FILL' });
      const il = illus(scene, s === 'Active' ? 'Drawn' : 'Outline'); il.rescale(0.55); add(st, il);
      const tx = frame('Text', { dir: 'VERTICAL', gap: 2, pad: [12, 16, 16, 16] }); add(c, tx, { h: 'FILL' });
      const row = frame('Title row', { dir: 'HORIZONTAL', gap: 6, cross: 'CENTER' }); add(tx, row, { h: 'FILL' });
      add(row, await text(title, 'Label/MD', s === 'Active' ? 'color/primary/pressed' : 'color/ink/default', 'Title'));
      const a = inst(IC['Arrow right']); a.name = 'Arrow'; a.rescale(0.875); a.visible = s === 'Active'; add(row, a);
      add(tx, await text(desc, 'Body/XS', 'color/ink/medium', 'Description'), { h: 'FILL' });
      comps.push(c);
    }
    const set = combine(comps, 'Diorama card / ' + title); CARD[title] = set;
    await react(variant(set, { State: 'Outline' }), [{ trigger: { type: 'ON_HOVER' }, actions: acts(go(variant(set, { State: 'Active' }), 0.2), setVar('nav/hovered-option', title)) }]);
  }
}

/* ---------------- Mega menu: Stage (Menu x Item variants) ---------------- */
async function buildStagePanel() {
  const comps = [], meta = [];
  for (const m of MENUS) {
    const items = [['Overview', m.lead, m.scene], ...LINKS(m)];
    for (const [item, desc, scene] of items) {
      const c = frame(`Menu=${m.label}, Item=${item}`, { component: true, dir: 'HORIZONTAL', gap: 48, pad: [24, SIDE, 32, SIDE], w: W, fill: 'color/surface/bright' });
      // stage column
      const col = frame('Stage column', { dir: 'VERTICAL', gap: 12, w: 360 }); add(c, col);
      const st = frame('Stage', { dir: 'VERTICAL', main: 'CENTER', cross: 'CENTER', w: 360, h: 270, radius: 8, clip: true, fill: 'color/primary/lowest' }); add(col, st, { h: 'FILL' });
      add(st, inst(B.dots), { abs: true, x: 0, y: 1 }); add(st, illus(scene, 'Drawn'));
      const cap = frame('Caption', { dir: 'VERTICAL', gap: 2 }); add(col, cap, { h: 'FILL' });
      add(cap, await text(item === 'Overview' ? m.label : item, 'Title/SM', 'color/ink/default', 'Caption title'), { h: 'FILL' });
      add(cap, await text(desc, 'Body/XS', 'color/ink/medium', 'Caption description'), { h: 'FILL' });
      // options column
      const view = frame('Options', { dir: 'VERTICAL', gap: 16 }); add(c, view, { h: 'FILL' });
      const cols = frame('Groups', { dir: 'HORIZONTAL', gap: 40 }); add(view, cols, { h: 'FILL' });
      const linkNodes = [];
      for (const g of m.groups) {
        const gr = frame('Group / ' + g.t, { dir: 'VERTICAL', gap: 8 }); add(cols, gr);
        add(gr, await text(g.t, 'Overline', 'color/ink/low', 'Group title'));
        const list = frame('List', { dir: g.cols ? 'HORIZONTAL' : 'VERTICAL', wrap: !!g.cols, gap: g.cols ? 24 : 0, w: g.cols ? 524 : 250 });
        add(gr, list);
        for (const [t, d] of g.l) { const li = inst(variant(B.link, { State: t === item ? 'Active' : 'Default' })); li.setProperties({ [B.linkKeys.title]: t, [B.linkKeys.desc]: d }); li.name = 'Menu link / ' + t; add(list, li); linkNodes.push([li, t]); }
      }
      const foot = frame('Footer', { dir: 'HORIZONTAL', gap: 16, cross: 'CENTER', pad: [16, 0, 0, 0], stroke: 'color/outline/low', strokeSides: [1, 0, 0, 0] }); add(view, foot, { h: 'FILL' });
      const ov = await textLink(m.over); add(foot, ov);
      add(foot, await text('Point at an option to preview it', 'Body/XS', 'color/ink/medium', 'Hint'));
      comps.push(c); meta.push({ c, m, item, linkNodes, ov });
    }
  }
  const set = combine(comps, 'Mega menu / Stage', { dir: 'HORIZONTAL', gap: 40, wrapW: W * 3 + 40 * 2 + 48 });
  set.description = 'Left: live illustration. Right: options. Hovering an option changes Item, which swaps the illustration (Drawn, then auto Filled).';
  for (const { m, item, linkNodes, ov } of meta) {
    for (const [li, t] of linkNodes) if (t !== item) await react(li, [{ trigger: { type: 'MOUSE_ENTER', delay: 0.07 }, actions: acts(go(variant(set, { Menu: m.label, Item: t }), 0.2), setVar('nav/hovered-option', t)) }]);
    if (item !== 'Overview') await react(ov, [{ trigger: { type: 'MOUSE_ENTER', delay: 0.07 }, actions: acts(go(variant(set, { Menu: m.label, Item: 'Overview' }), 0.2), setVar('nav/hovered-option', 'Overview')) }]);
  }
  B.stagePanel = set;
}

/* ---------------- Mega menu: Diorama ---------------- */
async function buildDioramaPanel() {
  const comps = [];
  for (const m of MENUS) {
    const c = frame(`Menu=${m.label}`, { component: true, dir: 'VERTICAL', gap: 16, pad: [24, SIDE, 32, SIDE], w: W, fill: 'color/surface/bright' });
    const head = frame('Heading', { dir: 'HORIZONTAL', gap: 16, cross: 'CENTER' }); add(c, head, { h: 'FILL' });
    add(head, await text(m.label, 'Title/SM', 'color/ink/default', 'Title'));
    add(head, await text(m.lead, 'Body/SM', 'color/ink/medium', 'Lead'));
    add(head, spacer(), { h: 'FILL' }); add(head, await textLink(m.over));
    const row = frame('Cards', { dir: 'HORIZONTAL', gap: 12 }); add(c, row, { h: 'FILL' });
    for (const [t] of LINKS(m)) { const ci = inst(variant(CARD[t], { State: 'Outline' })); ci.name = 'Diorama card / ' + t; add(row, ci, { h: 'FILL' }); }
    comps.push(c);
  }
  const set = combine(comps, 'Mega menu / Diorama', { dir: 'HORIZONTAL', gap: 40, wrapW: W * 2 + 40 + 48 });
  set.description = 'Every option is a card drawn in outline. Hovering a card switches it to Active (the illustration redraws and fills).';
  B.dioPanel = set;
}

/* ---------------- Main bar + Header (Menu variants) ---------------- */
async function mainBar(openLabel) {
  const bar = frame('Main bar', { dir: 'HORIZONTAL', gap: 24, pad: [0, SIDE, 0, SIDE], cross: 'CENTER', w: W, h: 64, fill: 'color/surface/bright', stroke: 'color/outline/low', strokeSides: [0, 0, 1, 0] });
  add(bar, inst(B.logo));
  const nav = frame('Nav', { dir: 'HORIZONTAL', gap: 2, pad: [0, 0, 0, 106], cross: 'CENTER' }); add(bar, nav);
  const items = {};
  for (const n of NAV) {
    const state = n.label === openLabel ? 'Open' : (n.current && !openLabel ? 'Current' : 'Default');
    const i = inst(variant(B.nav, { State: state })); i.setProperties({ [B.navKeys.label]: n.label, [B.navKeys.menu]: !n.href }); i.name = 'Nav item / ' + n.label; add(nav, i); items[n.label] = i;
  }
  add(bar, spacer(), { h: 'FILL' });
  add(bar, button('Primary', 'SM', 'Get a quote'));
  const target = items[openLabel || 'Shipping Insurance'];
  const ind = rect('Nav indicator', 10, 2, 'color/primary/default', 2); add(bar, ind, { abs: true });
  try { const bx = bar.absoluteTransform[0][2], tx = target.absoluteTransform[0][2]; ind.x = tx - bx + 12; ind.y = 62; ind.resize(Math.max(1, target.width - 24), 2); } catch (e) { warn('indicator', e); }
  ind.opacity = openLabel ? 1 : 0;
  return { bar, items };
}
async function buildHeader(concept) {
  const comps = [], meta = [];
  for (const menu of ['Closed', ...MENUS.map(m => m.label)]) {
    const open = menu !== 'Closed';
    const c = frame('Menu=' + menu, { component: true, dir: 'VERTICAL', w: W, fill: 'color/surface/bright', effect: open ? 'Shadow 4' : null });
    add(c, inst(B.utility), { h: 'FILL' });
    const { bar, items } = await mainBar(open ? menu : null); add(c, bar, { h: 'FILL' });
    const mask = frame('Panel mask', { dir: 'VERTICAL', clip: true }); add(c, mask, { h: 'FILL' });
    const label = open ? menu : 'Shipping Insurance';
    const panel = inst(concept === 'Stage' ? variant(B.stagePanel, { Menu: label, Item: 'Overview' }) : variant(B.dioPanel, { Menu: label }));
    panel.name = 'Mega menu'; add(mask, panel, { h: 'FILL' });
    if (!open) { mask.layoutSizingVertical = 'FIXED'; mask.resize(mask.width, 0.01); } else mask.layoutSizingVertical = 'HUG';
    comps.push(c); meta.push({ c, menu, items });
  }
  const set = combine(comps, 'Header / ' + concept, { dir: 'VERTICAL', gap: 80 });
  set.description = `InsureShield header, ${concept} concept. Mouse enter on a nav item opens its menu (Smart animate, 320ms, Momentum standard easing). Mouse leave closes it. Interactions also set the Nav state variables.`;
  for (const { c, menu, items } of meta) {
    for (const n of NAV) {
      const node = items[n.label];
      if (n.href) { if (menu !== 'Closed') await react(node, [{ trigger: { type: 'MOUSE_ENTER', delay: 0.2 }, actions: acts(go(variant(set, { Menu: 'Closed' }), 0.2), setVar('nav/open-menu', 'None'), setVar('nav/is-open', false)) }]); continue; }
      if (n.label === menu) continue;
      await react(node, [{ trigger: { type: 'MOUSE_ENTER', delay: menu === 'Closed' ? 0.09 : 0 }, actions: acts(go(variant(set, { Menu: n.label }), 0.32), setVar('nav/open-menu', n.label), setVar('nav/hovered-option', 'Overview'), setVar('nav/is-open', true)) }]);
    }
    if (menu !== 'Closed') await react(c, [{ trigger: { type: 'MOUSE_LEAVE', delay: 0.24 }, actions: acts(go(variant(set, { Menu: 'Closed' }), 0.2), setVar('nav/open-menu', 'None'), setVar('nav/is-open', false)) }]);
  }
  return set;
}

/* ---------------- Hero ---------------- */
async function buildHero() {
  const c = frame('Hero / Shipping insurance', { component: true, dir: 'HORIZONTAL', gap: 64, pad: [64, SIDE, 88, SIDE], cross: 'CENTER', w: W, fill: 'color/surface/bright', clip: true });
  add(c, inst(B.lattice), { abs: true, x: 0, y: 0, cons: { horizontal: 'STRETCH', vertical: 'STRETCH' } });
  const left = frame('Intro', { dir: 'VERTICAL', gap: 24 }); add(c, left, { h: 'FILL' });
  const h1 = await text('Shipping insurance for lost, damaged, or stolen shipments', 'Display/LG', 'color/ink/default', 'Headline');
  for (const w of ['lost', 'damaged', 'stolen']) { const s = h1.characters.indexOf(w); h1.setRangeFills(s, s + w.length, [paint('color/primary/default')]); try { h1.setRangeTextDecoration(s, s + w.length, 'UNDERLINE'); if (h1.setRangeTextDecorationStyle) h1.setRangeTextDecorationStyle(s, s + w.length, 'DOTTED'); } catch (e) {} }
  add(left, h1); h1.resize(500, h1.height); h1.textAutoResize = 'HEIGHT';
  add(left, await text('InsureShield® Shipping Insurance helps businesses recover faster after covered loss or damage to a shipment. Explore options for UPS packages, multi-carrier shipments, LTL freight, and international freight.', 'Body/LG', 'color/ink/medium', 'Body'), { h: 'FILL' });
  const actionsRow = frame('Actions', { dir: 'HORIZONTAL', gap: 12, pad: [8, 0, 0, 0] }); add(left, actionsRow); add(actionsRow, button('Secondary', 'MD', 'Talk to an expert'));
  // estimator card
  const card = frame('Estimator', { dir: 'VERTICAL', gap: 20, pad: [32, 32, 32, 32], w: 480, fill: 'color/surface/bright', stroke: 'color/ink/default' }); add(c, card);
  add(card, await text('What’s your average package value?', 'Heading/SM', 'color/ink/default', 'Question'), { h: 'FILL' });
  const chart = frame('Range chart', { dir: 'VERTICAL', gap: 10 }); add(card, chart, { h: 'FILL' });
  const hist = frame('Histogram', { dir: 'HORIZONTAL', gap: 3, cross: 'MAX', h: 64 }); add(chart, hist, { h: 'FILL' });
  for (let i = 0; i < 20; i++) { const b = rect('Bar ' + (i + 1), 10, Math.round(64 * (0.14 + Math.pow(i / 19, 1.25) * 0.86)), i >= 4 && i <= 14 ? 'color/primary/default' : 'color/primary/low'); add(hist, b, { h: 'FILL' }); }
  add(chart, await text('$100 to $1,000', 'Link/SM', 'color/ink/default', 'Range'));
  const trk = frame('Track', { dir: 'HORIZONTAL', cross: 'CENTER', h: 28 }); add(chart, trk, { h: 'FILL' });
  const seg = (n, w, f, r) => { const x = rect(n, w, 12, f, r); return x; };
  add(trk, seg('Track start', 83, 'color/primary/low', 6), { h: 'FILL' }); add(trk, rect('Handle low', 3, 26, 'color/primary/pressed', 2));
  add(trk, seg('Selected range', 229, 'color/primary/default', 0)); add(trk, rect('Handle high', 3, 26, 'color/primary/pressed', 2)); add(trk, seg('Track end', 98, 'color/primary/low', 6));
  const res = frame('Result', { dir: 'VERTICAL', gap: 4, pad: [8, 0, 0, 0] }); add(card, res, { h: 'FILL' });
  add(res, await text('Estimated premium per package', 'Body/MD', 'color/ink/medium', 'Result label'));
  add(res, await text('$0.80 to $10.50', 'Numeric/Value', 'color/ink/default', 'Result value'));
  add(card, button('Primary', 'MD', 'Estimate monthly premium', true));
  const note = frame('Note', { dir: 'HORIZONTAL', gap: 8, pad: [16, 0, 0, 0], stroke: 'color/outline/low', strokeSides: [1, 0, 0, 0] }); add(card, note, { h: 'FILL' });
  add(note, inst(IC['Info'])); add(note, await text('Estimate only. Actual pricing and availability depend on the shipment, customer, coverage option, and applicable policy terms.', 'Body/2XS', 'color/ink/medium', 'Disclaimer'), { h: 'FILL' });
  B.hero = c;
}

/* ---------------- Pages ---------------- */
function page(name, headerSet) {
  const f = frame(name, { dir: 'VERTICAL', pad: [96, 0, 0, 0], w: W, fill: 'color/surface/bright', clip: true });
  add(f, inst(B.hero), { h: 'FILL' });
  const h = inst(variant(headerSet, { Menu: 'Closed' })); h.name = 'Header'; add(f, h, { abs: true, x: 0, y: 0, cons: { horizontal: 'STRETCH', vertical: 'MIN' } });
  return f;
}

/* ---------------- Layout on canvas ---------------- */
function section(name, x, y, nodes, cols, gapX = 160, gapY = 160) {
  const s = figma.createSection(); s.name = name; tag(s);
  let cx = 120, cy = 160, rowH = 0, col = 0, maxW = 0;
  for (const n of nodes) {
    s.appendChild(n); n.x = cx; n.y = cy; rowH = Math.max(rowH, n.height); col++; maxW = Math.max(maxW, cx + n.width);
    if (col >= cols) { col = 0; cx = 120; cy += rowH + gapY; rowH = 0; } else cx += n.width + gapX;
  }
  s.x = x; s.y = y; s.resizeWithoutConstraints(maxW + 120, cy + rowH + 160);
  return s;
}

async function main() {
  let pg = figma.root.children.find(p => p.name === PAGE_NAME);
  if (!pg) { pg = figma.createPage(); pg.name = PAGE_NAME; warn('page', 'No page called "' + PAGE_NAME + '" was found in this file, so one was created'); }
  await figma.setCurrentPageAsync(pg);
  // remove only what an earlier run of this plugin created
  pg.children.filter(n => n.getPluginData && n.getPluginData(TAG) === '1').forEach(n => n.remove());
  const startX = pg.children.reduce((m, n) => Math.max(m, n.x + n.width), 0) + (pg.children.length ? 600 : 0);

  figma.notify('Building InsureShield V2… (foundations)', { timeout: 4000 });
  await buildVariables(); await buildStyles();
  buildIcons(); await buildLogo(); await buildButtons(); await buildNavItem(); await buildMenuLink(); await buildUtilityBar();
  B.dots = svgComponent('Pattern / Stage dots', DATA.stageDots);
  B.lattice = svgComponent('Pattern / Hero lattice', DATA.lattice);
  figma.notify('Building illustrations…', { timeout: 4000 });
  await buildIllustrations(); await buildCards();
  figma.notify('Building mega menus and headers…', { timeout: 4000 });
  await buildStagePanel(); await buildDioramaPanel();
  const hStage = await buildHeader('Stage'), hDio = await buildHeader('Diorama');
  await buildHero();

  const pStage = page('Shipping Insurance – Stage – Desktop 1440', hStage);
  const pDio = page('Shipping Insurance – Diorama – Desktop 1440', hDio);

  const sPages = section('InsureShield V2 · Pages', startX, 0, [pStage, pDio], 2);
  const base = [B.logo, B.button, B.nav, B.link, B.utility, B.dots, B.lattice, ...Object.values(IC)];
  const sFound = section('InsureShield V2 · Components · Foundations', startX, sPages.y + sPages.height + 400, base, 6, 120, 120);
  const sIll = section('InsureShield V2 · Components · Illustrations', startX, sFound.y + sFound.height + 400, Object.values(ILL), 3, 120, 120);
  const sCards = section('InsureShield V2 · Components · Diorama cards', startX, sIll.y + sIll.height + 400, Object.values(CARD), 4, 120, 120);
  const sMenus = section('InsureShield V2 · Components · Mega menus', startX, sCards.y + sCards.height + 400, [B.stagePanel, B.dioPanel], 1, 160, 240);
  const sHead = section('InsureShield V2 · Components · Header & hero', startX, sMenus.y + sMenus.height + 400, [hStage, hDio, B.hero], 3, 240, 240);

  try {
    const fl = (pg.flowStartingPoints || []).filter(f => f.name.indexOf('InsureShield V2') !== 0);
    pg.flowStartingPoints = [...fl, { nodeId: pStage.id, name: 'InsureShield V2 – Stage' }, { nodeId: pDio.id, name: 'InsureShield V2 – Diorama' }];
  } catch (e) { warn('flow starting points', e); }
  for (const p of PENDING) { try { await p(); } catch (e) { warn('effect style', e); } }
  figma.viewport.scrollAndZoomIntoView([sPages]);
}

main().then(() => {
  const msg = warnings.length ? `InsureShield V2 built with ${warnings.length} warning(s). See the console (Plugins > Development > Show console).` : 'InsureShield V2 built. Press Present on a "InsureShield V2" flow to try the menus.';
  if (warnings.length) console.log('Warnings:\n' + warnings.join('\n'));
  figma.closePlugin(msg);
}).catch(e => { console.error(e); figma.closePlugin('Build stopped: ' + (e && e.message ? e.message : e)); });
