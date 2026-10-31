// InsureShield nav V3 illustrations, drawn from concepts/v3-*.json with iso.js.
//   PANO    5 worlds; each world holds one station per menu option (objects named "s<k>:…").
//           The page spotlights a station (colour + its change) and pans the view to it.
//   ATELIER 24 exploded views: parts rest apart (outline), assemble on hover (slow · enter, 34 ms apart).
//   ICON    19 small row icons: outline at rest, colour + one small change on row hover.
//   FEATURE 5 feature cards (one per menu): a number made physical, built object by object.
// Each builder returns { s, title, hero?, acts?, shift? } (shift = extra headroom in world units for exploded parts).
import { scene, box, prism, cylinder, faceRect, faceRibbon, actG, routeDetail, project } from './iso.js';
import { H } from './scenes.mjs';
const { put, shadowOnly, disc, ring, shield, medal, parcel, home, pin, sheets, SHIELD } = H;

// ---------------------------------------------------------------- helpers
const f2 = (n) => Math.round(n * 100) / 100;
const pathOn = (pts3, tone) => ({ svg: (col) => `<path d="M${pts3.map((p) => project(p).map(f2).join(' ')).join('L')}Z" fill="${col(tone)}" stroke="${col(tone)}" stroke-width="0.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` });
const grid = (s, [x0, z0], [x1, z1], step = 16) => {                       // faint drafting grid (Atelier)
  const lines = [];
  for (let x = x0; x <= x1; x += step) lines.push([[x, 0, z0], [x, 0, z1]]);
  for (let z = z0; z <= z1; z += step) lines.push([[x0, 0, z], [x1, 0, z]]);
  s.add({ kind: 'ground', layer: 0, lines, tone: 'surface-high' });
};
const twin = (s, mk, name, a = 'neutral', b = 'teal') => {                 // rest material → active material (crossfade)
  shadowOnly(s, mk(a, name)); s.add(mk(a, name + '-rest')); s.add(mk(b, name));
  return { [name + '-rest']: 'out', [name]: 'in' };
};
const up = (k, gap, extra = {}) => ({ act: 'move', from: [0, gap * k, 0], d: k, slow: true, ...extra });   // exploded part k
const pad = (s, cx, cz, size0, name, size = Math.min(size0, 52)) => put(s, box({ at: [cx - size / 2, 0, cz - size / 2], size: [size, 2, size], material: 'chalk', name }));
function storefront(s, { x, z, y = 0, w = 34, h = 30, d = 38, name, awning = 'neutral', shadow = true }) {
  const o = box({ at: [x, y, z], size: [w, h, d], material: 'neutral', name, details: [
    faceRect({ plane: 'x', at: x + w, u: z + d * 0.1, v: h * 0.28, w: d * 0.42, h: h * 0.38, tone: 'blue-light' }),
    faceRect({ plane: 'x', at: x + w, u: z + d * 0.62, v: 0, w: d * 0.24, h: h * 0.6, tone: 'surface-lowest' })] });
  shadow ? put(s, o) : s.add(o);
  const aw = (m, n) => box({ at: [x + w, y + h * 0.74, z], size: [Math.max(5, w * 0.26), 3, d], material: m, name: n });
  if (awning === 'twin') return twin(s, aw, name + '-awning');
  s.add(aw(awning, name + '-awning')); return {};
}
function laptop(s, { x, z, y = 0, w = 30, d = 30, name }) {
  put(s, box({ at: [x, y, z], size: [w, 3, d], material: 'neutral', name: name + '-base', details: [faceRect({ plane: 'y', at: y + 3, u: x + w * 0.2, v: z + d * 0.15, w: w * 0.6, h: d * 0.7, tone: 'surface-lowest' })] }));
  put(s, box({ at: [x - 2, y, z], size: [2, w * 0.8, d], material: 'chalk', name: name + '-screen', details: [faceRect({ plane: 'x', at: x, u: z + d * 0.1, v: y + w * 0.12, w: d * 0.8, h: w * 0.56, tone: 'outline-variant' })] }));
}
function mailbox(s, { x, z, name, mat = 'teal', flag = 'act', k = 1, post = true }) {
  if (post) put(s, box({ at: [x - 2 * k, 0, z - 2 * k], size: [4 * k, 24 * k, 4 * k], material: 'neutral', name: name + '-post' }));
  const f = z + 7 * k, Y = 24 * k;
  const down = [faceRect({ plane: 'z', at: f, u: x - 8 * k, v: Y + 6 * k, w: 16 * k, h: 2 * k, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: x + 3 * k, v: Y + 3 * k, w: 5 * k, h: 6 * k, tone: 'surface-lowest' })];
  const upF = [faceRect({ plane: 'z', at: f, u: x + 6 * k, v: Y + 6 * k, w: 2 * k, h: 16 * k, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: x + 8 * k, v: Y + 16 * k, w: 7 * k, h: 6 * k, tone: 'surface-lowest' })];
  const det = [faceRect({ plane: 'x', at: x + 14 * k, u: z - 4 * k, v: Y + 3 * k, w: 8 * k, h: 8 * k, tone: `${mat === 'teal' ? 'teal-strong' : 'outline-default'}` })];
  if (flag === 'act') det.push(actG('out', ...down), actG({ act: 'in', d: 2 }, ...upF)); else det.push(...(flag === 'up' ? upF : down));
  const o = box({ at: [x - 14 * k, Y, z - 7 * k], size: [28 * k, 14 * k, 14 * k], material: mat, name, details: det });
  put(s, o); return o;
}
function door(s, { x, z, name, h = 40 }) {
  put(s, box({ at: [x, 0, z], size: [6, h, 28], material: 'neutral', name, details: [faceRect({ plane: 'x', at: x + 6, u: z + 6, v: 3, w: 16, h: h * 0.75, tone: 'surface-lowest' })] }));
  put(s, box({ at: [x + 6, 0, z - 2], size: [10, 3, 32], material: 'neutral', name: name + '-step' }));
}
const CLOUD = (W, Hh) => { const cs = [[W * 0.28, Hh * 0.42, Hh * 0.42], [W * 0.58, Hh * 0.5, Hh * 0.5], [W * 0.8, Hh * 0.3, Hh * 0.3]], top = [];
  for (let i = 0; i <= 28; i++) { const u = W * (1 - i / 28); let v = Hh * 0.2; for (const [cx, cy, r] of cs) if (Math.abs(u - cx) < r) v = Math.max(v, cy + Math.sqrt(r * r - (u - cx) ** 2)); top.push([u, v]); }
  return [[0, 0], [W, 0], ...top.slice(1, -1), [0, Hh * 0.2]]; };
const cloud = ({ at: [x, y, z], w = 30, h = 18, name, material = 'chalk' }) => prism({ outline: CLOUD(w, h), origin: [x, y, z], plane: 'z', thickness: 8, material, frontTone: material === 'chalk' ? 'chalk-light' : undefined, name });
function dial(s, { cx, cz, y = 0, r = 22, name, act = true, h = 6 }) {
  const T = y + h, P = (a, rr) => [cx + rr * Math.cos(a), T, cz + rr * Math.sin(a)], deg = (d) => (d * Math.PI) / 180;
  const arc = (a0, a1, r0, r1) => { const o = [], N = 14; for (let i = 0; i <= N; i++) o.push(P(deg(a0 + (a1 - a0) * i / N), r1)); for (let i = N; i >= 0; i--) o.push(P(deg(a0 + (a1 - a0) * i / N), r0)); return o; };
  const needle = (a) => faceRibbon({ plane: 'y', at: T, points: [[cx, cz], [cx + r * 0.72 * Math.cos(deg(a)), cz + r * 0.72 * Math.sin(deg(a))]], w: r * 0.08, tone: 'charcoal-strong' });
  const det = [pathOn(arc(150, 300, r * 0.62, r * 0.86), 'chalk-strong'), pathOn(arc(250, 290, r * 0.62, r * 0.86), 'teal-strong'), disc([cx, T, cz], r * 0.1, 'y', 'charcoal-strong')];
  if (act) det.push(actG('out', needle(170)), actG('in', needle(272))); else det.push(needle(272));
  const o = cylinder({ center: [cx, y, cz], r, h, material: 'chalk', name, segments: 64 }); o.details = det; put(s, o); return o;
}
function clock({ c: [x, y, z], r = 14, name }) {           // standing disc: chalk face, short teal arc, two hands
  const N = 32, o = Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return [r + r * Math.cos(a), r + r * Math.sin(a)]; });
  const m = prism({ outline: o, origin: [x - r, y - r, z], plane: 'z', thickness: 4, material: 'chalk', frontTone: 'chalk-light', name }), f = z + 4;
  const sec = [[x, y, f]]; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 - (i / 10) * (Math.PI / 3); sec.push([x + r * 0.82 * Math.cos(a), y + r * 0.82 * Math.sin(a), f]); }
  m.details = [pathOn(sec, 'teal-strong'), faceRibbon({ plane: 'z', at: f, points: [[x, y], [x, y + r * 0.7]], w: r * 0.1, tone: 'charcoal-strong' }), faceRibbon({ plane: 'z', at: f, points: [[x, y], [x + r * 0.45, y + r * 0.3]], w: r * 0.1, tone: 'charcoal-strong' })];
  return m;
}
const openBox = (s, { x, z, w = 30, h = 22, name, band }) => {
  put(s, box({ at: [x, 0, z], size: [w, h, w], material: 'kraft', name, details: [faceRect({ plane: 'y', at: h, u: x + 3, v: z + 3, w: w - 6, h: w - 6, tone: 'kraft-shade' }), ...(band || [])] }));
  s.add(box({ at: [x, h, z - 2], size: [w, w * 0.4, 2], material: 'kraft', name: name + '-flapB' }));
  s.add(box({ at: [x - 2, h, z], size: [2, w * 0.4, w], material: 'kraft', name: name + '-flapL' }));
};
const stand = ({ at: [x, z], w = 26, h = 34, name, lines = true }) => {    // a document standing on the lit plane
  const d = prism({ outline: [[0, 0], [w, 0], [w, h * 0.8], [w * 0.75, h], [0, h]], origin: [x, 0, z], plane: 'x', thickness: 3, material: 'chalk', name });
  if (lines) d.details = [0, 1, 2].map((i) => faceRect({ plane: 'x', at: x + 3, u: z - w * 0.8, v: h * (0.72 - i * 0.14), w: w * (i ? 0.6 : 0.45), h: 1.6, tone: 'outline-variant' }));
  return d;
};
const STRIPES = ['carrier-ups', 'carrier-fedex', 'carrier-dhl', 'carrier-usps'];
const striped = (at, size, tone, name, gold) => { const [x, , z] = at, [W, , D] = size, v = size[1] * 0.4, hh = Math.max(2, size[1] * 0.18);
  const det = [faceRect({ plane: 'x', at: x + W, u: z, v, w: D, h: hh, tone }), faceRect({ plane: 'z', at: z + D, u: x, v, w: W, h: hh, tone })];
  if (gold) det.push(faceRect({ plane: 'x', at: x + W, u: z, v: v + hh, w: D, h: 1.2, tone: 'carrier-ups-gold' }), faceRect({ plane: 'z', at: z + D, u: x, v: v + hh, w: W, h: 1.2, tone: 'carrier-ups-gold' }));
  return parcel({ at, size, name, details: det }); };

// ================================================================ A · PANORAMA stations (cx, cz = station centre, P = name prefix)
const D = 70;   // station spacing along the screen-horizontal diagonal
const ST = {
  pMultiCarrier(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    const pts = [[-20, 12], [-12, 22], [-26, 2]].map(([u, w]) => [cx + u, cz + w]);
    pts.forEach(([x, z], i) => put(s, striped([x - 6, 2, z - 6], [13, 12, 13], STRIPES[i], `${P}c${i}`)));
    const pad2 = s.items.find((o) => o.name === P + 'pad');
    pad2.details = [...pts.map(([x, z], i) => routeDetail({ points: [[x + 6, z - 2], [cx - 2, cz + 2]], y: 2, tone: STRIPES[i], act: 'in', d0: i, dash: 4, gap: 3, width: 1.6 })),
      routeDetail({ points: [[cx - 2, cz + 2], [cx + 22, cz - 18]], y: 2, act: 'in', d0: 3, dash: 5, gap: 3, width: 2.2 })];
    return {};
  },
  pUps(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    door(s, { x: cx - 24, z: cz - 14, name: P + 'door', h: 34 });
    put(s, striped([cx - 6, 2, cz + 2], [16, 14, 16], 'carrier-ups', P + 'ups', true));
    put(s, shield({ at: [cx + 8, 2, cz - 24], w: 18, h: 28, t: 4, name: P + 'shield', check: 'in' }));
    return {};
  },
  pSpecial(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    const acts = twin(s, (m, n) => box({ at: [cx - 22, 2, cz - 22], size: [44, 3, 44], material: m, name: n }), P + 'plate');
    put(s, box({ at: [cx - 18, 5, cz + 2], size: [14, 12, 14], material: 'chalk', name: P + 'cold', details: [faceRect({ plane: 'y', at: 17, u: cx - 18, v: cz + 7, w: 14, h: 3, tone: 'blue-light' })] }));
    put(s, parcel({ at: [cx + 4, 5, cz - 18], size: [14, 12, 14], name: P + 'kraft' }));
    put(s, box({ at: [cx - 4, 11, cz - 6], size: [12, 12, 12], material: 'blue', name: P + 'item' }));
    return { ...acts, [P + 'item']: { act: 'move', from: [0, -6, 0] } };
  },
  pSelect(s, cx, cz, P) { pad(s, cx, cz, 60, P + 'pad'); dial(s, { cx, cz, y: 2, r: 24, h: 10, name: P + 'dial' }); return {}; },
  pQuote(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    put(s, box({ at: [cx - 16, 2, cz - 20], size: [30, 2, 40], material: 'chalk', name: P + 'sheet', details: [0, 1, 2].map((i) => faceRect({ plane: 'y', at: 4, u: cx - 12, v: cz - 14 + i * 7, w: i % 2 ? 12 : 18, h: 2, tone: 'outline-variant' })) }));
    put(s, cylinder({ center: [cx, 4, cz], r: 10, h: 4, material: 'teal', name: P + 'coin' }));
    return { [P + 'coin']: { act: 'in move', from: [0, 16, 0], slow: true } };
  },
  pCommerce(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    put(s, parcel({ at: [cx - 22, 2, cz - 4], size: [16, 14, 16], name: P + 'risky' }));
    s.add(medal({ c: [cx - 14, 26, cz + 2], r: 6, material: 'coral', mark: 'bar', name: P + 'risk' }));
    put(s, parcel({ at: [cx + 2, 2, cz - 16], size: [16, 14, 16], name: P + 'good' }));
    s.add(medal({ c: [cx + 10, 26, cz - 10], r: 7, name: P + 'ok' }));
    return { [P + 'risky']: { act: 'move', from: [8, 0, 8] }, [P + 'risk']: { act: 'move', from: [8, 0, 8] }, [P + 'ok']: { act: 'in', d: 3 } };
  },
  pDefense(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    home(s, { at: [cx - 26, cz + 2], w: 18, h: 14, d: 18, roof: 9, name: P + 'homeA' });
    home(s, { at: [cx + 2, cz - 24], w: 18, h: 14, d: 18, roof: 9, name: P + 'homeB' });
    put(s, pin({ tip: [cx + 26, 2, cz - 14], name: P + 'pin', s: 0.9 }));
    return { [P + 'pin']: { act: 'in move', from: [0, 24, 0], slow: true } };
  },
  pOrchestrate(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    [[-24, 14, 'neutral'], [-6, -4, 'neutral'], [12, -22, 'teal']].forEach(([u, w, m], i) => put(s, box({ at: [cx + u - 8, 2, cz + w - 8], size: [16, 2, 16], material: m, name: `${P}opt${i}` })));
    put(s, parcel({ at: [cx + 7, 4, cz - 27], size: [10, 9, 10], name: P + 'parcel' }));
    return { [P + 'parcel']: { act: 'move', from: [-36, 0, 36], slow: true } };
  },
  pInsureShield(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    put(s, shield({ at: [cx - 14, 2, cz - 22], w: 26, h: 40, t: 5, name: P + 'shield' }));
    for (const [u, w, y] of [[-12, -4, 0], [0, -4, 0], [-12, 8, 0], [0, 8, 0], [-6, 2, 11]]) s.add(parcel({ at: [cx + u, 2 + y, cz + w], size: [11, 11, 11], name: `${P}b${u}${w}${y}` }));
    s.shadowOf({ ...box({ at: [cx - 12, 2, cz - 4], size: [23, 22, 23] }), name: P + 'stack' });
    return { [P + 'shield']: { act: 'in move', from: [0, -18, 0], slow: true } };
  },
  pConnect(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    laptop(s, { x: cx - 22, z: cz - 2, w: 20, d: 22, name: P + 'laptop' });
    put(s, box({ at: [cx + 6, 2, cz - 22], size: [14, 10, 14], material: 'teal', name: P + 'block' }));
    s.items.find((o) => o.name === P + 'pad').details = [routeDetail({ points: [[cx - 2, cz + 8], [cx + 6, cz - 4], [cx + 12, cz - 10]], y: 2, act: 'in', dash: 4, gap: 3, width: 2 })];
    return {};
  },
  pBecome(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    storefront(s, { x: cx - 24, z: cz - 22, w: 22, h: 20, d: 26, name: P + 'store', awning: 'neutral' });
    const acts = {};
    [[6, 10], [14, -2], [0, 22], [18, 14]].forEach(([u, w], i) => { const n = `${P}p${i}`; put(s, parcel({ at: [cx + u - 3, 2, cz + w - 3], size: [7, 6, 7], material: 'teal', name: n })); acts[n] = { act: 'in move', from: [0, 8, 0], d: i }; });
    return acts;
  },
  pInsights(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    put(s, box({ at: [cx - 20, 2, cz - 22], size: [36, 2, 44], material: 'chalk', name: P + 'sheet' }));
    put(s, cloud({ at: [cx - 18, 4, cz - 8], w: 26, h: 16, name: P + 'cloud' }));
    s.add(medal({ c: [cx + 8, 12, cz - 12], r: 7, name: P + 'ring' }));
    return { [P + 'ring']: 'in' };
  },
  pGuides(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    const lines = (x, z) => [0, 1, 2, 3].map((i) => faceRect({ plane: 'y', at: 4, u: x + 3, v: z + 4 + i * 6, w: i % 2 ? 10 : 15, h: 1.6, tone: 'outline-variant' }));
    put(s, box({ at: [cx - 22, 2, cz - 6], size: [20, 2, 30], material: 'chalk', name: P + 'left', details: lines(cx - 22, cz - 6) }));
    put(s, box({ at: [cx, 2, cz - 22], size: [20, 2, 30], material: 'chalk', name: P + 'right' }));
    put(s, shield({ at: [cx + 4, 4, cz - 10], w: 12, h: 18, t: 3, name: P + 'shield' }));
    return { [P + 'shield']: { act: 'in move', from: [0, 10, 0] } };
  },
  pStories(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    storefront(s, { x: cx - 20, z: cz - 16, w: 22, h: 20, d: 28, name: P + 'store' });
    const at = { c: [cx - 9, 34, cz - 2], r: 7 };
    shadowOnly(s, medal({ ...at, name: P + 'ok' }));
    s.add(medal({ ...at, material: 'coral', mark: 'bar', name: P + 'risk' })); s.add(medal({ ...at, name: P + 'ok' }));
    return { [P + 'risk']: 'out', [P + 'ok']: 'in' };
  },
  pHelp(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    s.items.find((o) => o.name === P + 'pad').details = [routeDetail({ points: [[cx - 16, cz + 14], [cx, cz], [cx + 14, cz - 14]], y: 2, act: 'in', dash: 4, gap: 3, width: 2 })];
    put(s, stand({ at: [cx + 4, cz - 6], w: 14, h: 18, name: P + 'doc', lines: false }));
    s.add(medal({ c: [cx + 18, 10, cz - 24], r: 8, name: P + 'ring' }));
    return { [P + 'doc']: { act: 'move', from: [-22, 0, 22], slow: true }, [P + 'ring']: { act: 'in', d: 6 } };
  },
  pNews(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    openBox(s, { x: cx - 14, z: cz - 14, w: 26, h: 18, name: P + 'box' });
    put(s, box({ at: [cx - 6, 26, cz - 6], size: [10, 10, 10], material: 'teal', name: P + 'item' }));
    return { [P + 'item']: { act: 'in move', from: [0, -14, 0], slow: true } };
  },
  pPress(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    sheets(s, { at: [cx - 22, cz - 18], w: 26, d: 36, n: 3, t: 2, name: P + 'press' });
    s.add(box({ at: [cx - 6, 6, cz - 16], size: [26, 2, 36], material: 'teal', name: P + 'feature', details: [faceRect({ plane: 'y', at: 8, u: cx - 2, v: cz - 12, w: 10, h: 3, tone: 'teal-tint' })] }));
    return { [P + 'feature']: { act: 'move', from: [-14, 0, 0] } };
  },
  pAvailability(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad'); let acts = {}; let i = 0;
    for (const [u, w] of [[-22, -22], [1, -22], [-22, 1], [1, 1]]) { const k = i++; Object.assign(acts, twin(s, (m, n) => box({ at: [cx + u, 2, cz + w], size: [21, 3, 21], material: m, name: n }), `${P}t${k}`));
      acts[`${P}t${k}`] = { act: 'in', d: k * 2 }; }
    return acts;
  },
  pContact(s, cx, cz, P) {
    pad(s, cx, cz, 60, P + 'pad');
    s.items.find((o) => o.name === P + 'pad').details = [routeDetail({ points: [[cx - 22, cz + 18], [cx - 6, cz + 4], [cx + 4, cz - 6]], y: 2, act: 'in', dash: 4, gap: 3, width: 2 })];
    put(s, stand({ at: [cx - 4, cz + 6], w: 12, h: 16, name: P + 'doc', lines: false }));
    mailbox(s, { x: cx + 12, z: cz - 14, name: P + 'mailbox', k: 0.8 });
    return { [P + 'doc']: { act: 'move', from: [-16, 0, 16], slow: true } };
  }
};
// a world = stations in a row on one ground, joined by a faint route (+ a teal route drawn in the overview)
function world(stations, extra) {
  const s = scene(), n = stations.length, acts = {}, ctr = [];
  stations.forEach((name, k) => { const o = (k - (n - 1) / 2) * D; ctr.push([o, -o]); Object.assign(acts, ST[name](s, o, -o, `s${k}:`)); });
  const [a, b] = [ctr[0], ctr[n - 1]];
  const pts = ctr.map(([x, z]) => [x + 36, z + 36]);
  s.route({ points: pts, tone: 'outline-variant', dash: 6, gap: 6 });
  s.route({ points: pts, act: 'in', dash: 6, gap: 6, width: 2 });
  if (extra) Object.assign(acts, extra(s, ctr) || {});
  return { s, acts, stations };
}
export const PANO = {
  worldInsurance: () => ({ ...world(['pMultiCarrier', 'pUps', 'pSpecial', 'pSelect', 'pQuote']), title: 'A coverage route linking five stations' }),
  worldSolutions: () => ({ ...world(['pCommerce', 'pDefense', 'pOrchestrate', 'pInsureShield'], (s, c) => { const [x, z] = c[c.length - 1]; home(s, { at: [x + D - 11, z - D - 11], w: 22, h: 18, d: 22, roof: 12, name: 'w:home' }); }), title: 'A delivery route from order to home with four product stations' }),
  worldPartners: () => ({ ...world(['pConnect', 'pBecome']), title: 'Two partner stations on one connected ground' }),
  worldResources: () => ({ ...world(['pInsights', 'pGuides', 'pStories', 'pHelp']), title: 'A route through four reading stations' }),
  worldAbout: () => ({ ...world(['pNews', 'pPress', 'pAvailability', 'pContact']), title: 'News, availability and a mailbox along one route' })
};
export const PANO_STATIONS = Object.fromEntries(Object.entries({ worldInsurance: ['pMultiCarrier', 'pUps', 'pSpecial', 'pSelect', 'pQuote'], worldSolutions: ['pCommerce', 'pDefense', 'pOrchestrate', 'pInsureShield'], worldPartners: ['pConnect', 'pBecome'], worldResources: ['pInsights', 'pGuides', 'pStories', 'pHelp'], worldAbout: ['pNews', 'pPress', 'pAvailability', 'pContact'] }));

// ================================================================ B · ATELIER (exploded → assembled)
const A = (title, build) => () => { const s = scene(); grid(s, [-48, -48], [48, 48]); s.groundPlate({ min: [-44, -44], max: [44, 44] }); const r = build(s) || {}; return { s, title, shift: r.shift ?? 70, acts: r.acts || r, hero: r.hero }; };
export const ATELIER = {
  xInsurance: A('Plate, parcel and shield assembling into one', (s) => {
    put(s, box({ at: [-30, 0, -30], size: [60, 4, 60], material: 'teal', name: 'plate' }));
    put(s, shield({ at: [-20, 4, -26], w: 40, h: 62, t: 6, name: 'shield' }));
    put(s, parcel({ at: [-16, 4, -10], size: [32, 28, 32], name: 'parcel' }));
    return { parcel: up(1, 26), shield: up(2, 30, { d: 3 }) };
  }),
  xSolutions: A('Three plates stacking under a parcel', (s) => {
    const acts = {};
    ['neutral', 'neutral', 'teal'].forEach((m, i) => { const n = 'plate' + i; (i ? s.add.bind(s) : (o) => put(s, o))(box({ at: [-28, i * 7, -28], size: [56, 6, 56], material: m, name: n })); if (i) acts[n] = up(i, 18); });
    put(s, parcel({ at: [-14, 21, -14], size: [28, 24, 28], name: 'parcel' })); acts.parcel = up(3, 18);
    return acts;
  }),
  xPartners: A('A storefront and a laptop settling onto one teal plate', (s) => {
    put(s, box({ at: [-44, 0, -36], size: [88, 4, 72], material: 'teal', name: 'plate' }));
    storefront(s, { x: -40, z: -30, y: 4, w: 30, h: 30, d: 34, name: 'store' });
    laptop(s, { x: 8, z: -10, y: 4, w: 28, d: 30, name: 'laptop' });
    return { plate: { act: 'move', from: [0, 0, 60], slow: true }, store: up(1, 24), 'store-awning': up(1, 24), 'laptop-base': up(2, 24), 'laptop-screen': up(2, 24) };
  }),
  xResources: A('Loose sheets settling into a neat stack, the top one teal', (s) => {
    const acts = {};
    for (let i = 0; i < 5; i++) { const n = 'sheet' + i, o = box({ at: [-28, i * 3, -38], size: [56, 3, 76], material: i === 4 ? 'teal' : 'chalk', name: n });
      i ? s.add(o) : put(s, o); if (i) acts[n] = { act: 'move', from: [i % 2 ? 10 : -8, 16 * i, i % 2 ? -6 : 8], d: i, slow: true }; }
    return acts;
  }),
  xAbout: A('A shield assembling from its back, face and check on a plate', (s) => {
    put(s, box({ at: [-30, 0, -30], size: [60, 4, 60], material: 'neutral', name: 'plate' }));
    s.add(prism({ outline: SHIELD(44, 68), origin: [-22, 4, -14], plane: 'z', thickness: 3, material: 'chalk', name: 'back' }));
    put(s, shield({ at: [-22, 4, -11], w: 44, h: 68, t: 5, name: 'face', check: { act: 'in', d: 3 } }));
    return { back: up(1, 26), face: up(2, 26) };
  }),
  xMultiCarrier: A('Four carrier-coloured slabs stacking onto one teal plate', (s) => {
    put(s, box({ at: [-30, 0, -30], size: [60, 4, 60], material: 'teal', name: 'plate' })); const acts = {};
    STRIPES.forEach((c, i) => { const n = 'slab' + i; s.add(box({ at: [-26, 4 + i * 6, -26], size: [52, 6, 52], material: 'kraft', name: n, details: [faceRect({ plane: 'x', at: 26, u: -26, v: 5 + i * 6, w: 52, h: 3, tone: c }), faceRect({ plane: 'z', at: 26, u: -26, v: 5 + i * 6, w: 52, h: 3, tone: c })] })); acts[n] = up(i + 1, 14); });
    return acts;
  }),
  xUps: A('A small shield dropping into a UPS box before the lid closes', (s) => {
    const band = [faceRect({ plane: 'x', at: 18, u: -18, v: 10, w: 36, h: 8, tone: 'carrier-ups' }), faceRect({ plane: 'z', at: 18, u: -18, v: 10, w: 36, h: 8, tone: 'carrier-ups' }), faceRect({ plane: 'x', at: 18, u: -18, v: 18, w: 36, h: 1.6, tone: 'carrier-ups-gold' }), faceRect({ plane: 'z', at: 18, u: -18, v: 18, w: 36, h: 1.6, tone: 'carrier-ups-gold' })];
    put(s, box({ at: [-18, 0, -18], size: [36, 28, 36], material: 'kraft', name: 'box', details: [faceRect({ plane: 'y', at: 28, u: -15, v: -15, w: 30, h: 30, tone: 'kraft-shade' }), ...band] }));
    s.add(shield({ at: [-9, 30, -4], w: 18, h: 28, t: 4, name: 'shield', check: true }));
    s.add(box({ at: [-19, 28, -19], size: [38, 3, 38], material: 'kraft', name: 'lid', details: [actG({ act: 'in', d: 5 }, disc([0, 31, 0], 5, 'y', 'teal-strong'))] }));
    return { shield: { act: 'out move', from: [0, 26, 0], d: 1, slow: true }, lid: up(3, 24) };
  }),
  xSpecial: A('Box walls rising to fit around a blue block on a teal plate', (s) => {
    put(s, box({ at: [-30, 0, -30], size: [60, 4, 60], material: 'teal', name: 'plate' }));
    put(s, box({ at: [-10, 4, -10], size: [20, 22, 20], material: 'blue', name: 'item' }));
    const acts = {}; [['wB', [-16, 4, -16], [32, 14, 3]], ['wL', [-16, 4, -13], [3, 14, 29]], ['wR', [13, 4, -13], [3, 14, 29]], ['wF', [-13, 4, 13], [26, 14, 3]]].forEach(([n, at, size], i) => { s.add(box({ at, size, material: 'kraft', name: n })); acts[n] = { act: 'in move', from: [0, 30, 0], d: i, slow: true }; });
    return acts;
  }),
  xSelect: A('A dial assembling with its needle in the teal band', (s) => {
    put(s, cylinder({ center: [0, 0, 0], r: 36, h: 6, material: 'neutral', name: 'base', segments: 64 }));
    dial(s, { cx: 0, cz: 0, y: 6, r: 32, name: 'face', h: 4 });
    return { face: up(1, 24) };
  }),
  xQuote: A('A balance with parcels on one pan and teal coins on the other', (s) => {
    put(s, box({ at: [-3, 0, -3], size: [6, 30, 6], material: 'neutral', name: 'post' }));
    s.add(box({ at: [-40, 30, -3], size: [80, 3, 6], material: 'neutral', name: 'beam' }));
    s.add(cylinder({ center: [-34, 33, 0], r: 13, h: 2, material: 'chalk', name: 'panL' })); s.add(cylinder({ center: [34, 33, 0], r: 13, h: 2, material: 'chalk', name: 'panR' }));
    s.add(parcel({ at: [-42, 35, -8], size: [10, 9, 10], name: 'pa' })); s.add(parcel({ at: [-32, 35, -4], size: [10, 9, 10], name: 'pb' }));
    const acts = { beam: up(1, 14), panL: up(1, 14), panR: up(1, 14), pa: up(2, 14), pb: up(3, 14) };
    for (let i = 0; i < 3; i++) { s.add(cylinder({ center: [34, 35 + i * 3, 0], r: 7, h: 3, material: 'teal', name: 'coin' + i })); acts['coin' + i] = up(4 + i, 10); }
    return acts;
  }),
  xCommerce: A('A teal check-ring gate lowering onto a route in front of a parcel', (s) => {
    s.route({ points: [[-34, 34], [0, 0], [34, -34]] });
    put(s, parcel({ at: [-50, 0, 14], size: [24, 22, 24], name: 'parcel' }));
    put(s, medal({ c: [6, 18, -14], r: 18, name: 'gate' }));
    return { gate: up(2, 30) };
  }),
  xDefense: A('A home assembling, then a teal pin landing on its roof', (s) => {
    home(s, { at: [-24, -24], w: 48, h: 30, d: 48, roof: 20, name: 'home' });
    put(s, pin({ tip: [0, 50, 0], name: 'pin', s: 1.3 }));
    return { 'home-roof': up(1, 22), pin: up(2, 30, { act: 'in move' }) };
  }),
  xOrchestrate: A('Three teal stepping stones dropping into a path from a parcel to a home', (s) => {
    put(s, parcel({ at: [-56, 0, 20], size: [22, 20, 22], name: 'parcel' }));
    home(s, { at: [26, -54], w: 28, h: 22, d: 28, roof: 14, name: 'home' });
    const acts = {}; [[-24, 14], [-4, -6], [16, -26]].forEach(([x, z], i) => { const n = 'stone' + i; put(s, box({ at: [x - 9, 0, z - 9], size: [18, 3, 18], material: 'teal', name: n })); acts[n] = up(i + 1, 16, { act: 'in move' }); });
    return acts;
  }),
  xInsureShield: A('Three shield layers assembling in front of a parcel', (s) => {
    put(s, parcel({ at: [-40, 0, 6], size: [26, 24, 26], name: 'parcel' }));
    s.add(prism({ outline: SHIELD(40, 62), origin: [-6, 0, -20], plane: 'z', thickness: 3, material: 'chalk', name: 'l1' }));
    s.add(prism({ outline: SHIELD(40, 62), origin: [-6, 0, -17], plane: 'z', thickness: 3, material: 'blue', frontTone: 'blue-light', name: 'l2' }));
    put(s, shield({ at: [-6, 0, -14], w: 40, h: 62, t: 4, name: 'l3', check: { act: 'in', d: 4 } }));
    return { l1: up(1, 22), l2: up(2, 22), l3: up(3, 22) };
  }),
  xConnect: A('A teal module seating onto a laptop', (s) => {
    laptop(s, { x: -24, z: -26, w: 48, d: 52, name: 'laptop' });
    put(s, box({ at: [-4, 3, -10], size: [20, 7, 18], material: 'teal', name: 'module', details: [faceRect({ plane: 'y', at: 10, u: 0, v: -6, w: 12, h: 2, tone: 'teal-tint' })] }));
    return { module: up(1, 34) };
  }),
  xBecome: A('A storefront assembling, its teal awning settling on top', (s) => {
    const r = storefront(s, { x: -26, z: -28, w: 40, h: 36, d: 52, name: 'store', awning: 'teal' });
    return { 'store-awning': up(1, 26), ...r };
  }),
  xInsights: A('Small boxes assembling into one cube', (s) => {
    const acts = {}; const U = 12;
    for (let y = 0; y < 3; y++) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const n = `b${y}${i}${j}`; const o = box({ at: [-18 + i * U, y * U, -18 + j * U], size: [U, U, U], material: y === 2 ? 'teal' : 'kraft', name: n }); (y || i || j) ? s.add(o) : s.add(o); if (y) acts[n] = up(y, 16, { d: y * 3 + i }); }
    s.shadowOf({ ...box({ at: [-18, 0, -18], size: [36, 36, 36] }), name: 'cube' });
    return acts;
  }),
  xGuides: A('Sheets falling into a neat stack with a teal tab', (s) => {
    const acts = {};
    for (let i = 0; i < 5; i++) { const n = 'p' + i, o = box({ at: [-26, i * 3, -36], size: [52, 3, 72], material: 'chalk', name: n }); i ? s.add(o) : put(s, o); if (i) acts[n] = up(i, 12); }
    s.add(box({ at: [20, 9, -30], size: [12, 2, 10], material: 'teal', name: 'tab' })); acts.tab = up(6, 12, { act: 'in move' });
    return acts;
  }),
  xStories: A('Coins dropping into a stack beside a damaged coral parcel', (s) => {
    put(s, parcel({ at: [-46, 0, 0], size: [30, 26, 30], material: 'coral', name: 'loss' }));
    const acts = {}; for (let i = 0; i < 5; i++) { const n = 'coin' + i; s.add(cylinder({ center: [22, i * 6, -20], r: 14, h: 5, material: 'teal', name: n })); acts[n] = up(i + 1, 12, { act: 'in move' }); }
    s.shadowOf({ ...cylinder({ center: [22, 0, -20], r: 14, h: 30 }), name: 'coins' });
    return acts;
  }),
  xHelp: A('A document with a clock showing a short teal arc beside it', (s) => {
    put(s, stand({ at: [-30, 12], w: 34, h: 46, name: 'doc' }));
    put(s, clock({ c: [16, 18, -18], r: 18, name: 'clock' }));
    return { clock: up(1, 30) };
  }),
  xNews: A('A teal sheet landing beside a stack of chalk sheets', (s) => {
    sheets(s, { at: [-52, -20], w: 40, d: 56, n: 4, t: 3, name: 'arch' });
    put(s, box({ at: [4, 0, -40], size: [40, 3, 56], material: 'teal', name: 'new', details: [faceRect({ plane: 'y', at: 3, u: 10, v: -34, w: 16, h: 4, tone: 'teal-tint' }), ...[0, 1, 2].map((k) => faceRect({ plane: 'y', at: 3, u: 10, v: -24 + k * 10, w: k % 2 ? 18 : 26, h: 3, tone: 'teal-light' }))] }));
    return { new: up(2, 26) };
  }),
  xPress: A('A teal pin landing on a printed sheet with column rules', (s) => {
    const det = [faceRect({ plane: 'y', at: 2, u: -30, v: -40, w: 52, h: 7, tone: 'outline-default' })];
    for (const c of [0, 1, 2]) for (let r = 0; r < 6; r++) det.push(faceRect({ plane: 'y', at: 2, u: -30 + c * 18, v: -26 + r * 10, w: 14, h: 2.2, tone: 'outline-variant' }));
    put(s, box({ at: [-36, 0, -46], size: [64, 2, 92], material: 'chalk', name: 'paper', details: det }));
    put(s, pin({ tip: [6, 2, 6], name: 'pin', s: 1.6 }));
    return { pin: up(2, 30, { act: 'in move' }) };
  }),
  xAvailability: A('Four region tiles dropping together into one teal plate', (s) => {
    put(s, cylinder({ center: [0, 0, 0], r: 44, h: 3, material: 'neutral', name: 'base', segments: 64 }));
    const acts = {}; [[-28, -28], [1, -28], [-28, 1], [1, 1]].forEach(([x, z], i) => { const n = 't' + i; s.add(box({ at: [x, 3, z], size: [27, 4, 27], material: 'teal', name: n })); acts[n] = { act: 'move', from: [x < 0 ? -10 : 10, 18 + i * 8, z < 0 ? -10 : 10], d: i, slow: true }; });
    return acts;
  }),
  xContact: A('A teal mailbox assembling from its post, box and raised flag', (s) => {
    mailbox(s, { x: 0, z: 0, name: 'mailbox', k: 1.6 });
    return { mailbox: up(1, 26) };
  })
};

// ================================================================ C · ICON RAIL (small, 1–2 objects)
const I = (title, build, hero) => () => { const s = scene(); const acts = build(s) || {}; return { s, title, acts, hero }; };
export const ICON = {
  iMultiCarrier: I('Three striped parcels on a plate', (s) => { const a = twin(s, (m, n) => box({ at: [-26, 0, -26], size: [52, 3, 52], material: m, name: n }), 'plate'); [[-22, 6], [-6, -10], [10, -26]].forEach(([x, z], i) => s.add(striped([x, 3, z], [14, 13, 14], STRIPES[i], 'c' + i))); return a; }),
  iUps: I('A parcel with a UPS band', (s) => { put(s, striped([-16, 0, -16], [32, 28, 32], 'carrier-ups', 'ups', true)); s.add(medal({ c: [0, 40, 0], r: 7, name: 'ok' })); return { ok: 'in' }; }, 'ups'),
  iSpecial: I('A blue block on a puck', (s) => { put(s, cylinder({ center: [0, 0, 0], r: 22, h: 4, material: 'teal', name: 'puck' })); put(s, box({ at: [-11, 4, -11], size: [22, 22, 22], material: 'blue', name: 'item' })); }, 'item'),
  iSelect: I('Three stepped plates', (s) => { put(s, box({ at: [-22, 0, -22], size: [44, 4, 44], material: 'neutral', name: 'p0' })); const a = twin(s, (m, n) => box({ at: [-16, 4, -16], size: [32, 5, 32], material: m, name: n }), 'p1'); s.add(box({ at: [-10, 9, -10], size: [20, 6, 20], material: 'neutral', name: 'p2' })); return a; }),
  iQuote: I('A short teal coin stack', (s) => { const c = [0, 1, 2, 3].map((i) => cylinder({ center: [0, i * 6, 0], r: 16, h: 5, material: 'teal', name: 'c' + i })); s.shadowOf({ ...c[0], height: 24, name: 'st' }); c.forEach((o) => s.add(o)); return { c3: { act: 'in move', from: [0, 12, 0] } }; }),
  iCommerce: I('A parcel with a teal check ring above it', (s) => { put(s, parcel({ at: [-15, 0, -15], size: [30, 26, 30], name: 'order' })); s.add(medal({ c: [0, 42, 0], r: 10, name: 'ok' })); return { ok: 'in' }; }),
  iDefense: I('A teal pin on a puck', (s) => { put(s, cylinder({ center: [0, 0, 0], r: 18, h: 4, material: 'neutral', name: 'puck' })); put(s, pin({ tip: [0, 4, 0], name: 'pin', s: 1.6 })); return { pin: { act: 'move', from: [0, 12, 0] } }; }),
  iOrchestrate: I('A short teal route to a small home', (s) => { s.route({ points: [[-22, 22], [-2, 2]], act: 'in', dash: 5, gap: 3, width: 3 }); home(s, { at: [-6, -26], w: 26, h: 22, d: 26, roof: 14 }); }),
  iInsureShield: I('A teal shield', (s) => { put(s, shield({ at: [-18, 0, -4], w: 36, h: 56, t: 6, check: 'in' })); }, 'shield'),
  iConnect: I('A teal block on a grey block', (s) => { put(s, box({ at: [-20, 0, -20], size: [40, 14, 40], material: 'neutral', name: 'base' })); s.add(box({ at: [-10, 14, -10], size: [20, 12, 20], material: 'teal', name: 'mod' })); return { mod: { act: 'move', from: [0, 10, 0] } }; }),
  iBecome: I('A small storefront with a teal awning', (s) => storefront(s, { x: -20, z: -24, w: 30, h: 30, d: 44, name: 'store', awning: 'twin' })),
  iInsights: I('Three box bars, the tallest teal', (s) => { const a = {}; [[-30, 1], [-12, 2], [6, 3]].forEach(([x, n], c) => { for (let i = 0; i < n; i++) { const nm = `b${c}${i}`; s.add(box({ at: [x, i * 14, -7], size: [14, 14, 14], material: c === 2 && i === 2 ? 'teal' : 'kraft', name: nm })); if (c === 2 && i === 2) a[nm] = { act: 'in move', from: [0, 12, 0] }; } }); s.shadowOf({ ...box({ at: [-30, 0, -7], size: [50, 42, 14] }), name: 'bars' }); return a; }),
  iGuides: I('A stack of sheets with a teal tab', (s) => { sheets(s, { at: [-22, -30], w: 44, d: 60, n: 4, t: 4, lines: false }); s.add(box({ at: [16, 12, -24], size: [12, 3, 10], material: 'teal', name: 'tab' })); return { tab: { act: 'in move', from: [-8, 0, 0] } }; }),
  iStories: I('A parcel with a teal coin stack beside it', (s) => { put(s, parcel({ at: [-28, 0, 2], size: [24, 22, 24], name: 'p' })); const c = [0, 1, 2].map((i) => cylinder({ center: [10, i * 6, -12], r: 13, h: 5, material: 'teal', name: 'c' + i })); s.shadowOf({ ...c[0], height: 18, name: 'st' }); c.forEach((o) => s.add(o)); return { c2: { act: 'in move', from: [0, 12, 0] } }; }),
  iHelp: I('A document with a teal check', (s) => { const d = stand({ at: [-6, 18], w: 34, h: 44, name: 'doc' }); const f = -3, cz = -2, cy = 14, R = 8;
    d.details = [...(d.details || []), disc([f, cy, cz], R, 'x', 'teal-strong'), actG('in', faceRibbon({ plane: 'x', at: f, points: [[-(cz + 0.42 * R), cy], [-(cz + 0.08 * R), cy - 0.32 * R], [-(cz - 0.48 * R), cy + 0.42 * R]], w: 2.4, tone: 'teal-tint' }))]; put(s, d); }, 'doc'),
  iNews: I('An open box with a teal block', (s) => { openBox(s, { x: -18, z: -18, w: 36, h: 26, name: 'box' }); put(s, box({ at: [-8, 30, -8], size: [16, 16, 16], material: 'teal', name: 'item' })); return { item: { act: 'in move', from: [0, -14, 0] } }; }),
  iPress: I('A printed sheet with a small teal shield', (s) => { const det = [faceRect({ plane: 'y', at: 2, u: -22, v: -30, w: 40, h: 6, tone: 'outline-default' })]; for (const c of [0, 1]) for (let r = 0; r < 4; r++) det.push(faceRect({ plane: 'y', at: 2, u: -22 + c * 20, v: -18 + r * 9, w: 16, h: 2, tone: 'outline-variant' }));
    put(s, box({ at: [-28, 0, -36], size: [52, 2, 72], material: 'chalk', name: 'paper', details: det })); put(s, shield({ at: [2, 2, 8], w: 20, h: 30, t: 4, name: 'shield' })); return { shield: { act: 'in move', from: [0, 12, 0] } }; }),
  iAvailability: I('Two teal pins on pucks', (s) => { const a = {}; put(s, box({ at: [-26, 0, -26], size: [52, 3, 52], material: 'chalk', name: 'map' })); [[-12, 8], [12, -8]].forEach(([x, z], i) => { s.add(cylinder({ center: [x, 3, z], r: 10, h: 4, material: 'neutral', name: 'pk' + i })); put(s, pin({ tip: [x, 7, z], name: 'pin' + i, s: 1.4 })); a['pin' + i] = { act: 'in move', from: [0, 14, 0], d: i * 2 }; }); return a; }),
  iContact: I('A small teal mailbox', (s) => { mailbox(s, { x: 0, z: 0, name: 'mailbox', k: 1.4 }); }, 'mailbox')
};

// ================================================================ C · FEATURE cards (number made physical, built one by one)
const F = (title, build) => () => { const s = scene(); s.groundPlate({ min: [-70, -60], max: [70, 60] }); const acts = build(s) || {}; return { s, title, acts }; };
export const FEATURE = {
  fInsurance: F('One kraft box splitting into a block of small teal-taped boxes', (s) => {
    const acts = { big: 'out' }; s.add(parcel({ at: [-24, 0, -24], size: [48, 44, 48], name: 'big' }));
    let k = 0; for (let y = 0; y < 3; y++) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const n = `b${y}${i}${j}`;
      s.add(box({ at: [-24 + i * 12, y * 14, -24 + j * 12], size: [12, 14, 12], material: 'kraft', name: n, details: [faceRect({ plane: 'y', at: y * 14 + 14, u: -24 + i * 12, v: -24 + j * 12 + 5, w: 12, h: 2, tone: 'teal-strong' })] }));
      acts[n] = { act: 'in move', from: [0, 18, 0], d: Math.floor(k++ / 3) }; }
    s.shadowOf({ ...box({ at: [-24, 0, -24], size: [48, 42, 48] }), name: 'block' }); return acts;
  }),
  fSolutions: F('Four plates stacking with a shield landing on top', (s) => {
    const acts = {}; ['neutral', 'neutral', 'neutral', 'teal'].forEach((m, i) => { const n = 'pl' + i, o = box({ at: [-34, i * 6, -34], size: [68, 6, 68], material: m, name: n }); i ? s.add(o) : put(s, o); if (i) acts[n] = { act: 'in move', from: [0, 20, 0], d: i * 2, slow: true }; });
    s.add(shield({ at: [-20, 24, -8], w: 40, h: 62, t: 6, name: 'shield' })); acts.shield = { act: 'in move', from: [0, 26, 0], d: 9, slow: true }; return acts;
  }),
  fPartners: F('A row of small storefronts with teal awnings appearing one by one', (s) => {
    put(s, box({ at: [-66, 0, -26], size: [132, 3, 52], material: 'neutral', name: 'plate' })); const acts = {};
    [-60, -34, -8, 18, 44].forEach((x, i) => { storefront(s, { x, z: -18, y: 3, w: 18, h: 22, d: 26, name: 's' + i, awning: 'teal' });
      acts['s' + i] = { act: 'in move', from: [0, 16, 0], d: i * 2 }; acts[`s${i}-awning`] = { act: 'in move', from: [0, 16, 0], d: i * 2 }; });
    return acts;
  }),
  fResources: F('Three stacks of sheets growing, the tallest topped in teal', (s) => {
    const acts = {}; [[-60, 20, 3], [-20, -6, 5], [20, -32, 7]].forEach(([x, z, n], c) => { for (let i = 0; i < n; i++) { const nm = `s${c}${i}`, o = box({ at: [x, i * 3, z], size: [34, 3, 44], material: c === 2 && i === n - 1 ? 'teal' : 'chalk', name: nm }); i ? s.add(o) : put(s, o); if (i) acts[nm] = { act: 'in move', from: [0, 14, 0], d: c * 2 + i }; } });
    return acts;
  }),
  fAbout: F('Teal pins dropping onto a grid of pucks', (s) => {
    put(s, box({ at: [-62, 0, -50], size: [124, 3, 100], material: 'chalk', name: 'map' }));
    const acts = {}; let k = 0; for (const i of [-1, 0, 1]) for (const j of [-1, 1]) { const x = i * 40 + j * 10, z = j * 26 - i * 10, n = `pin${k}`; s.add(cylinder({ center: [x, 3, z], r: 12, h: 4, material: 'neutral', name: 'pk' + k })); put(s, pin({ tip: [x, 7, z], name: n, s: 1.1 })); acts[n] = { act: 'in move', from: [0, 26, 0], d: k * 2, slow: true }; k++; }
    return acts;
  })
};

// helpers shared with V4 (primitives only, no compositions)
export const H3 = { storefront, laptop, mailbox, door, cloud, stand, striped, twin, pad, pathOn, STRIPES };
