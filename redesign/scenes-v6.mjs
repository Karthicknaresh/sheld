// InsureShield nav V6 · "Light up the dream" — drawn from concepts/v6-dream.json with iso.js.
// Every scene is a three-beat story. acts map: { objectName: { b, act?, from?, d?, slow? } }
//   b = beat (0 world switches on · 1 the moment · 2 the teal outcome); the object takes its colour on its
//   beat and plays its change then. A nested actG({act:'out', b}) inside an object makes a part leave on a
//   later beat (a coral mark that appears on beat 1 and is resolved on beat 2).
// Lit windows: a dark pane (charcoal) leaves and a bright pane (chalk-light) arrives on the beat = lights on.
import { scene, box, cylinder, prism, faceRect, faceRibbon, actG, routeDetail } from './iso.js';
import { H } from './scenes.mjs';
const { put, shadowOnly, disc, medal, parcel, sheets, SHIELD } = H;

// ---------------------------------------------------------------- helpers
const pane = (plane, at, u, v, w, h, b, d = 0) => [actG({ act: 'out', b, d }, faceRect({ plane, at, u, v, w, h, tone: 'charcoal-strong' })), actG({ act: 'in', b, d }, faceRect({ plane, at, u, v, w, h, tone: 'chalk-light' }))];
/** Home with lit windows (right face) and a door; roof as its own object. */
function home(s, { at: [x, z], w = 30, h = 22, d = 30, roof = 14, name, b = 0, windows = 2, lit = b }) {
  const det = [faceRect({ plane: 'x', at: x + w, u: z + d * 0.62, v: 0, w: d * 0.24, h: h * 0.6, tone: 'surface-lowest' })];
  for (let i = 0; i < windows; i++) det.push(...pane('x', x + w, z + d * (0.12 + i * 0.25), h * 0.45, d * 0.16, h * 0.28, lit, i * 3));
  det.push(...pane('z', z + d, x + w * 0.3, h * 0.45, w * 0.36, h * 0.28, lit, 6));
  put(s, box({ at: [x, 0, z], size: [w, h, d], material: 'neutral', name, details: det }));
  s.add(prism({ outline: [[0, h], [d, h], [d / 2, h + roof]], origin: [x, 0, z + d], plane: 'x', thickness: w, material: 'neutral', name: name + '-roof' }));
  return { [name]: { b }, [name + '-roof']: { b } };
}
/** Shop with a big lit window, a door and an awning (awning can be a neutral → teal twin). */
function shop(s, { at: [x, z], w = 32, h = 28, d = 36, name, b = 0, lit = b, awning }) {
  const det = [...pane('x', x + w, z + d * 0.08, h * 0.3, d * 0.46, h * 0.38, lit), faceRect({ plane: 'x', at: x + w, u: z + d * 0.64, v: 0, w: d * 0.24, h: h * 0.62, tone: 'surface-lowest' }), ...pane('z', z + d, x + w * 0.2, h * 0.3, w * 0.5, h * 0.38, lit, 4)];
  put(s, box({ at: [x, 0, z], size: [w, h, d], material: 'neutral', name, details: det }));
  const aw = (m, n) => box({ at: [x + w, h * 0.74, z], size: [7, 3, d], material: m, name: n });
  const acts = { [name]: { b } };
  if (awning != null) { s.add(aw('neutral', name + '-awning-rest')); s.add(aw('teal', name + '-awning')); acts[name + '-awning-rest'] = { act: 'out', b: awning }; acts[name + '-awning'] = { act: 'in', b: awning }; }
  else { s.add(aw('neutral', name + '-awning')); acts[name + '-awning'] = { b }; }
  return acts;
}
const stripes = ([x, , z], [W, Hh, D], tone) => { const v = Hh * 0.42, hh = Math.max(2, Hh * 0.16);
  return [faceRect({ plane: 'x', at: x + W, u: z, v, w: D, h: hh, tone }), faceRect({ plane: 'z', at: z + D, u: x, v, w: W, h: hh, tone })]; };
const tealTape = ([x, y, z], [w, h, d], b, dd = 0) => actG({ act: 'in', b, d: dd }, faceRect({ plane: 'y', at: y + h, u: x, v: z + d / 2 - d * 0.09, w, h: d * 0.18, tone: 'teal-strong' }));
const shieldM = ({ at: [x, y, z], w, h, t = 6, name }) => { const sh = prism({ outline: SHIELD(w, h), origin: [x, y, z], plane: 'z', thickness: t, material: 'teal', frontTone: 'teal-strong', name });
  const cx = x + w / 2; sh.details = [faceRibbon({ plane: 'z', at: z + t, points: [[cx - w * 0.25, y + h * 0.62], [cx - w * 0.06, y + h * 0.5], [cx + w * 0.25, y + h * 0.74]], w: w * 0.11, tone: 'teal-tint' })]; return sh; };
const pinM = ({ tip: [x, y, z], name, s = 1, material = 'teal' }) => prism({ outline: [[0, 26], [14, 26], [14, 16], [7, 4], [0, 16]].map(([u, v]) => [u * s, (v - 4) * s]), origin: [x - 2 * s, y, z + 7 * s], plane: 'x', thickness: 4 * s, material, frontTone: material === 'teal' ? 'teal-strong' : undefined, name });
/** coral exception mark that appears on beat `on` and is resolved (leaves) on beat `off` */
function coralMark(s, c, r, name, on, off) { const m = medal({ c, r, material: 'coral', mark: 'bar', name }); const inner = m.details; m.details = [actG({ act: 'out', b: off }, ...inner)];
  // the medal body also leaves on `off`: wrap the whole object via acts (in on `on`), and fade its faces with an out-group
  s.add(m); return { [name]: { act: 'in', b: on } }; }
// the ground plate hugs the objects (+ margin), so each story fills its card instead of a wide empty floor
const W = (title, build) => () => { const s = scene(); const acts = build(s) || {};
  const ob = s.items.filter((o) => o.kind === 'object' && o.bounds), x0 = Math.min(...ob.map((o) => o.bounds.min[0])), x1 = Math.max(...ob.map((o) => o.bounds.max[0])),
    z0 = Math.min(...ob.map((o) => o.bounds.min[2])), z1 = Math.max(...ob.map((o) => o.bounds.max[2]));
  s.items.unshift(s.groundPlate({ min: [x0 - 14, z0 - 14], max: [x1 + 14, z1 + 14] }).items.pop());
  return { s, title, acts }; };

// ---------------------------------------------------------------- the 19 stories
export const DREAM = {
  mMulti: W('A small shop lights up; three carrier-striped parcels at its door are sealed with teal tape', (s) => {
    const acts = shop(s, { at: [-58, -40], name: 'shop' });
    const tones = ['carrier-ups', 'carrier-dhl-yellow', 'blue-strong'];
    [[-10, 8], [10, -6], [12, 16]].forEach(([x, z], i) => { const a = [x, 0, z], sz = [16, 14, 16], n = `p${i}`;
      put(s, parcel({ at: a, size: sz, name: n, details: [...stripes(a, sz, tones[i]), tealTape(a, sz, 2, i * 3)] })); acts[n] = { act: 'in move', from: [-14, 0, 0], b: 1, d: i * 3, slow: true }; });
    return acts;
  }),
  mUps: W('A home lights up; a UPS parcel lands on the step and the mat under it turns teal', (s) => {
    const acts = home(s, { at: [-50, -44], w: 40, h: 30, d: 44, roof: 18, name: 'home' });
    s.add(box({ at: [-6, 0, -26], size: [34, 2, 30], material: 'neutral', name: 'mat-rest' }));
    put(s, box({ at: [-6, 0, -26], size: [34, 2, 30], material: 'teal', name: 'mat' }));
    const a = [2, 2, -18], sz = [18, 16, 18];
    put(s, parcel({ at: a, size: sz, name: 'ups', details: stripes(a, sz, 'carrier-ups') }));
    return { ...acts, 'mat-rest': { act: 'out', b: 2 }, mat: { act: 'in', b: 2 }, ups: { act: 'in move', from: [0, 26, 0], b: 1, slow: true } };
  }),
  mSpecial: W('A blue safe opens on a plate and a teal check ring rises above it', (s) => {
    put(s, box({ at: [-34, 0, -34], size: [68, 3, 68], material: 'neutral', name: 'plate' }));
    put(s, box({ at: [-18, 3, -18], size: [36, 36, 36], material: 'blue', name: 'safe', details: [faceRect({ plane: 'x', at: 18, u: -14, v: 9, w: 28, h: 26, tone: 'teal-tint' })] }));
    s.add(box({ at: [18, 6, -12], size: [3, 30, 28], material: 'blue', name: 'door', details: [disc([21, 21, 2], 3.5, 'x', 'blue-light')] }));
    s.add(medal({ c: [-2, 62, -4], r: 10, name: 'ring' }));
    return { plate: { b: 0 }, safe: { b: 0 }, door: { act: 'move', from: [0, 0, -26], b: 1, slow: true }, ring: { act: 'in move', from: [0, -10, 0], b: 2, slow: true } };
  }),
  mSelect: W('A question sheet whose rings tick, then a teal shield lights up beside it', (s) => {
    const det = []; const acts = { sheet: { b: 0 } };
    [0, 1, 2].forEach((i) => { const z = -26 + i * 22; det.push(faceRect({ plane: 'y', at: 2, u: -12, v: z - 1, w: 30, h: 2, tone: 'outline-variant' })); });
    put(s, box({ at: [-40, 0, -40], size: [64, 2, 72], material: 'chalk', name: 'sheet', details: det }));
    [0, 1, 2].forEach((i) => { const z = -26 + i * 22, n = `ring${i}`; const r = cylinder({ center: [-24, 2, z], r: 7, h: 2, material: 'teal', name: n });
      r.details = [actG({ act: 'in', b: 1, d: i * 4 }, faceRibbon({ plane: 'y', at: 4, points: [[-28, z], [-25, z + 3], [-19, z - 3]], w: 2, tone: 'teal-tint' }))]; s.add(r); acts[n] = { b: 1, d: i * 4 }; });
    put(s, shieldM({ at: [30, 0, -36], w: 30, h: 48, name: 'shield' }));
    acts.shield = { act: 'in', b: 2, slow: true };
    return acts;
  }),
  mQuote: W('A stack of parcels with coins rising beside it, the top one teal', (s) => {
    const acts = {};
    [[-44, 0, -8, 24], [-40, 22, -4, 18], [-14, 0, 10, 20]].forEach(([x, y, z, k], i) => { const o = parcel({ at: [x, y, z], size: [k, k * 0.9, k], name: `p${i}` }); y ? s.add(o) : put(s, o); acts[`p${i}`] = { b: 0 }; });
    for (let i = 0; i < 5; i++) { const o = cylinder({ center: [28, i * 6, -10], r: 13, h: 6, material: i === 4 ? 'teal' : 'chalk', name: `c${i}` }); i ? s.add(o) : put(s, o);
      acts[`c${i}`] = i === 4 ? { act: 'in move', from: [0, 18, 0], b: 2, slow: true } : { act: 'in move', from: [0, 10, 0], b: 1, d: i * 3, slow: true }; }
    return acts;
  }),
  mDefense: W('Two homes light up and a teal pin lands at one door', (s) => {
    // beat 0: the street wakes (home A lit) · beat 1: a teal pin drops at home B's door · beat 2: home B's windows light up = the right door
    const acts = { ...home(s, { at: [-66, -30], w: 30, h: 22, d: 30, roof: 14, name: 'homeA' }), ...home(s, { at: [-4, -56], w: 30, h: 22, d: 30, roof: 14, name: 'homeB', lit: 2 }) };
    put(s, cylinder({ center: [40, 0, -28], r: 9, h: 2, material: 'neutral', name: 'puck' }));
    put(s, pinM({ tip: [40, 2, -28], name: 'pin', s: 1.2 }));
    return { ...acts, puck: { b: 0 }, pin: { act: 'in move', from: [0, 34, 0], b: 1, slow: true } };
  }),
  mOrchestrate: W('A coral cloud over one branch; the other branch lights teal to a home', (s) => {
    const acts = home(s, { at: [40, -66], w: 30, h: 22, d: 30, roof: 14, name: 'home' });
    s.route({ points: [[-64, 40], [-30, 18], [0, 30], [30, 50]], tone: 'outline-variant', width: 2.2 });
    s.route({ points: [[-64, 40], [-30, 18], [10, -10], [44, -32]], act: 'in', b: 2, width: 2.2 });
    const CL = [[0, 0], [40, 0], [40, 8], [34, 18], [24, 22], [12, 18], [4, 12], [0, 6]];
    s.add(prism({ outline: CL, origin: [-6, 48, 34], plane: 'z', thickness: 8, material: 'coral', name: 'cloud' }));
    return { ...acts, cloud: { act: 'in', b: 1 } };
  }),
  mCommerce: W('A laptop lights up, a coral mark appears and becomes a teal check ring', (s) => {
    put(s, box({ at: [-24, 0, -24], size: [48, 4, 44], material: 'neutral', name: 'base', details: [faceRect({ plane: 'y', at: 4, u: -18, v: -18, w: 36, h: 30, tone: 'surface-lowest' })] }));
    put(s, box({ at: [-27, 0, -24], size: [3, 38, 44], material: 'chalk', name: 'screen', details: pane('x', -24, -20, 6, 36, 28, 0) }));
    s.add(medal({ c: [-8, 64, -2], r: 10, material: 'coral', mark: 'bar', name: 'risk' }));
    s.add(medal({ c: [-8, 64, -1], r: 12, name: 'ring' }));
    return { base: { b: 0 }, screen: { b: 0 }, risk: { act: 'in', b: 1 }, ring: { act: 'in', b: 2 } };
  }),
  mInsure: W('A parcel turns coral, then a large teal shield lights up behind it', (s) => {
    put(s, shieldM({ at: [-30, 0, -48], w: 56, h: 86, name: 'shield' }));
    const a = [-16, 0, -6], sz = [36, 30, 36];
    put(s, parcel({ at: a, size: sz, name: 'parcel' }));
    s.add(parcel({ at: a, size: sz, material: 'coral', name: 'dent' }));
    s.add(parcel({ at: a, size: sz, material: 'teal', name: 'made-whole' }));   // covers the coral on beat 2: the value made whole
    return { parcel: { b: 0 }, dent: { act: 'in', b: 1 }, 'made-whole': { act: 'in', b: 2, slow: true }, shield: { act: 'in', b: 2, slow: true } };
  }),
  mConnect: W('A laptop lights up, a teal block seats on it and a route lights out', (s) => {
    put(s, box({ at: [-50, 0, -30], size: [44, 4, 40], material: 'neutral', name: 'base', details: [faceRect({ plane: 'y', at: 4, u: -44, v: -24, w: 32, h: 26, tone: 'surface-lowest' })] }));
    put(s, box({ at: [-53, 0, -30], size: [3, 34, 40], material: 'chalk', name: 'screen', details: pane('x', -50, -26, 6, 32, 24, 0) }));
    put(s, box({ at: [-20, 4, -2], size: [12, 9, 12], material: 'teal', name: 'dock' }));
    s.route({ points: [[-8, 10], [20, 0], [48, -20], [64, -34]], act: 'in', b: 2, width: 2 });
    return { base: { b: 0 }, screen: { b: 0 }, dock: { act: 'in move', from: [0, 22, 0], b: 1, slow: true } };
  }),
  mBecome: W('A shop lights up, parcels leave and its awning turns teal', (s) => {
    const acts = shop(s, { at: [-54, -40], w: 36, h: 32, d: 44, name: 'shop', awning: 2 });
    [[4, -8], [24, 6]].forEach(([x, z], i) => { const a = [x, 0, z], sz = [16, 14, 16]; put(s, parcel({ at: a, size: sz, name: `p${i}`, details: [tealTape(a, sz, 2, i * 3)] })); acts[`p${i}`] = { act: 'in move', from: [-18, 0, 0], b: 1, d: i * 4, slow: true }; });
    return acts;
  }),
  mHelp: W('One window lights up, a document arrives and a teal check ring lights over it', (s) => {
    const acts = home(s, { at: [-56, -46], w: 40, h: 30, d: 44, roof: 18, name: 'home', windows: 1 });
    const doc = prism({ outline: [[0, 0], [22, 0], [22, 22], [16, 28], [0, 28]], origin: [10, 0, 14], plane: 'x', thickness: 3, material: 'chalk', name: 'doc' });
    doc.details = [0, 1, 2].map((i) => faceRect({ plane: 'x', at: 13, u: -8 - 10, v: 18 - i * 5, w: i ? 8 : 12, h: 1.4, tone: 'outline-variant' }));
    put(s, doc);
    s.add(medal({ c: [6, 46, 4], r: 9, name: 'ring' }));
    return { ...acts, doc: { act: 'in move', from: [0, 0, 24], b: 1, slow: true }, ring: { act: 'in', b: 2 } };
  }),
  mStories: W('A dark shop with a coral mark; coins rise and its windows light up again', (s) => {
    const acts = shop(s, { at: [-54, -40], w: 36, h: 32, d: 44, name: 'shop', lit: 2 });
    const risk = medal({ c: [-4, 50, -14], r: 8, material: 'coral', mark: 'bar', name: 'risk' }); s.add(risk);
    for (let i = 0; i < 4; i++) { const o = cylinder({ center: [22, i * 5, 12], r: 10, h: 5, material: 'teal', name: `c${i}` }); i ? s.add(o) : put(s, o); acts[`c${i}`] = { act: 'in move', from: [0, 10, 0], b: 1, d: i * 3, slow: true }; }
    return { ...acts, risk: { act: 'out', b: 0, ab: 1 } };   // coral from the start of the story, resolved as the coins rise
  }),
  mInsights: W('Bars on a sheet light up one by one, the tallest teal', (s) => {
    put(s, box({ at: [-48, 0, -36], size: [92, 2, 68], material: 'chalk', name: 'sheet' }));
    const acts = { sheet: { b: 0 } };
    [[-34, 14], [-14, 22], [26, 18]].forEach(([x, h], i) => { put(s, box({ at: [x, 2, -6], size: [12, h, 12], material: 'kraft', name: `bar${i}` })); acts[`bar${i}`] = { act: 'in', b: 1, d: i * 3 }; });
    shadowOnly(s, box({ at: [6, 2, -6], size: [12, 36, 12], material: 'kraft', name: 'top' }));
    s.add(box({ at: [6, 2, -6], size: [12, 36, 12], material: 'kraft', name: 'top-rest' })); s.add(box({ at: [6, 2, -6], size: [12, 36, 12], material: 'teal', name: 'top' }));
    return { ...acts, 'top-rest': { act: 'in', b: 1, d: 9 }, top: { act: 'in', b: 2 } };
  }),
  mGuides: W('A stack of guides with a teal route drawing across the top and a teal tab', (s) => {
    const t = sheets(s, { at: [-36, -34], w: 68, d: 62, n: 4, t: 4, name: 'g', lines: false });
    const top = s.items.filter((o) => o.kind === 'object').pop();
    top.details = [routeDetail({ points: [[-28, 18], [-10, 4], [8, 10], [26, -16]], y: t, act: 'in', b: 1, dash: 4, gap: 3, width: 2 })];
    put(s, box({ at: [16, t - 8, 22], size: [10, 2, 14], material: 'teal', name: 'tab' }));
    const acts = { tab: { act: 'in move', from: [0, 0, -12], b: 2, slow: true } };
    for (let i = 0; i < 4; i++) acts[`g${i}`] = { b: 0 };
    return acts;
  }),
  mContact: W('A home lights up and its teal mailbox raises its flag', (s) => {
    const acts = home(s, { at: [-58, -54], w: 40, h: 30, d: 44, roof: 18, name: 'home' });
    const x = 22, z = 6, Y = 30;
    put(s, box({ at: [x - 2, 0, z - 2], size: [4, Y, 4], material: 'neutral', name: 'post' }));
    const f = z + 9, down = [faceRect({ plane: 'z', at: f, u: x - 10, v: Y + 8, w: 20, h: 3, tone: 'surface-lowest' })], up = [faceRect({ plane: 'z', at: f, u: x + 7, v: Y + 8, w: 3, h: 20, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: x + 10, v: Y + 21, w: 9, h: 7, tone: 'surface-lowest' })];
    put(s, box({ at: [x - 16, Y, z - 9], size: [32, 18, 18], material: 'teal', name: 'mbox', details: [actG({ act: 'out', b: 2 }, ...down), actG({ act: 'in', b: 2 }, ...up)] }));
    return { ...acts, post: { b: 1 }, mbox: { b: 1 } };
  }),
  mAvail: W('Pins land on a row of pucks; the nearest lights teal', (s) => {
    const acts = {};
    [[-50, -30], [-20, -10], [12, 10]].forEach(([x, z], i) => { put(s, cylinder({ center: [x, 0, z], r: 11, h: 4, material: 'neutral', name: `pk${i}` })); acts[`pk${i}`] = { b: 0 };
      put(s, pinM({ tip: [x, 4, z], name: `pin${i}`, s: 1 })); acts[`pin${i}`] = { act: 'in move', from: [0, 26, 0], b: 1, d: i * 4, slow: true }; });
    s.add(cylinder({ center: [12, 0, 10], r: 11, h: 4, material: 'teal', name: 'mine' }));
    return { ...acts, mine: { act: 'in', b: 2 } };
  }),
  mAnnounce: W('A home lights up and a teal sheet lands on its mat', (s) => {
    const acts = home(s, { at: [-54, -48], w: 40, h: 30, d: 44, roof: 18, name: 'home' });
    put(s, box({ at: [-6, 0, -30], size: [32, 2, 34], material: 'neutral', name: 'mat' }));
    s.add(box({ at: [0, 2, -22], size: [20, 2, 24], material: 'chalk', name: 'news-rest' }));
    put(s, box({ at: [0, 2, -22], size: [20, 2, 24], material: 'teal', name: 'news', details: [0, 1, 2].map((i) => faceRect({ plane: 'y', at: 4, u: 4, v: -18 + i * 5, w: i ? 8 : 12, h: 1.4, tone: 'teal-tint' })) }));
    return { ...acts, mat: { b: 0 }, 'news-rest': { act: 'in move', from: [0, 26, 0], b: 1, slow: true }, news: { act: 'in', b: 2 } };
  }),
  mNews: W('Printed sheets with headlines and a teal shield standing up on top', (s) => {
    const t = sheets(s, { at: [-40, -30], w: 70, d: 56, n: 4, t: 4, name: 'n', lines: false });
    const top = s.items.filter((o) => o.kind === 'object').pop();
    top.details = [actG({ act: 'in', b: 1 }, ...[0, 1, 2, 3].map((i) => faceRect({ plane: 'y', at: t, u: -32, v: -20 + i * 10, w: i ? 36 : 50, h: i ? 2 : 4, tone: i ? 'outline-variant' : 'charcoal-strong' })))];
    put(s, shieldM({ at: [10, t, -8], w: 22, h: 34, t: 4, name: 'shield' }));
    const acts = { shield: { act: 'in move', from: [0, -10, 0], b: 2, slow: true } };
    for (let i = 0; i < 4; i++) acts[`n${i}`] = { b: 0 };
    return acts;
  })
};

// helpers shared with V7 (primitives + the beat wrapper; no compositions)
export const H6 = { home, shop, pane, stripes, tealTape, shieldM, pinM, W };
