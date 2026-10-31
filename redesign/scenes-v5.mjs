// InsureShield nav V5 · Journey — drawn from concepts/v5-*.json with iso.js (momentum-iso-motion).
// One continuous strip per menu: a ground band and a dashed route run along the screen-horizontal
// axis u = (1, 0, -1); each tile owns one stop, centred on its tile. The merchant's parcel rides the
// route (the view never moves). Stop objects are named "s<k>:…" so the page can mark stops visited.
//   world(keys, pitch, S) → { s, acts, t0 }   (t0 = the parcel's start, in route units)
//   progress(keys, pitch, S) → scene with only the teal route (the page fills it dash by dash)
// Placement helper inside a stop: at(du, back) → [x, z]; du = along the route, back = away from the viewer.
import { scene, box, cylinder, prism, faceRect, faceRibbon, actG, routeDetail } from './iso.js';
import { H } from './scenes.mjs';
import { H3 } from './scenes-v3.mjs';
const { put, shadowOnly, disc, medal, parcel, home, sheets, SHIELD } = H;
const { storefront, laptop, mailbox, door, twin } = H3;

// ---------------------------------------------------------------- primitives used by the stops
const slab = (s, [x, z], w, d, name, material = 'neutral', h = 2, y = 0) => put(s, box({ at: [x - w / 2, y, z - d / 2], size: [w, h, d], material, name }));
const shieldM = ({ at: [x, y, z], w, h, t = 6, name, material = 'teal', check = true }) => {
  const sh = prism({ outline: SHIELD(w, h), origin: [x, y, z], plane: 'z', thickness: t, material, frontTone: material === 'teal' ? 'teal-strong' : undefined, name });
  if (check) { const cx = x + w / 2; sh.details = [faceRibbon({ plane: 'z', at: z + t, points: [[cx - w * 0.25, y + h * 0.62], [cx - w * 0.06, y + h * 0.5], [cx + w * 0.25, y + h * 0.74]], w: w * 0.11, tone: 'teal-tint' })]; }
  return sh;
};
const pinM = ({ tip: [x, y, z], name, s = 1 }) => prism({ outline: [[0, 26], [14, 26], [14, 16], [7, 4], [0, 16]].map(([u, v]) => [u * s, (v - 4) * s]), origin: [x - 2 * s, y, z + 7 * s], plane: 'x', thickness: 4 * s, material: 'teal', frontTone: 'teal-strong', name });
const stripes = ([x, , z], [W, Hh, D], tone) => { const v = Hh * 0.42, hh = Math.max(2, Hh * 0.16);
  return [faceRect({ plane: 'x', at: x + W, u: z, v, w: D, h: hh, tone }), faceRect({ plane: 'z', at: z + D, u: x, v, w: W, h: hh, tone })]; };
const lines = (at, u, v, w, n = 3, step = 5, tone = 'outline-variant') => Array.from({ length: n }, (_, i) => faceRect({ plane: 'y', at, u, v: v + i * step, w: i % 2 ? w * 0.6 : w, h: 1.6, tone }));
const standing = ({ at: [x, z], w, h, name }) => { const d = prism({ outline: [[0, 0], [w, 0], [w, h * 0.82], [w * 0.78, h], [0, h]], origin: [x, 0, z], plane: 'x', thickness: 3, material: 'chalk', name });
  d.details = [0, 1, 2].map((i) => faceRect({ plane: 'x', at: x + 3, u: z - w * 0.82, v: h * (0.7 - i * 0.15), w: w * (i ? 0.55 : 0.4), h: 1.4, tone: 'outline-variant' })); return d; };
const coins = (s, [x, z], n, name, y = 0, r = 7, h = 4, d0 = 1) => { const a = {};
  for (let i = 0; i < n; i++) { const o = cylinder({ center: [x, y + i * h, z], r, h, material: 'teal', name: `${name}${i}` }); i ? s.add(o) : put(s, o); a[`${name}${i}`] = { act: 'in move', from: [0, 10, 0], d: d0 + i, slow: true }; }
  return a; };

// ---------------------------------------------------------------- the 19 stops (one per tile)
export const STOPS = {
  vSelect(s, at, P) {
    const acts = {};
    [[-20, 12, 2], [0, 16, 4], [20, 20, 6]].forEach(([du, w, h], i) => { const [x, z] = at(du, 26), n = `${P}plate${i}`;
      if (i === 1) Object.assign(acts, twin(s, (m, nm) => box({ at: [x - w / 2, 0, z - w / 2], size: [w, h, w], material: m, name: nm }), n, 'neutral', 'teal'));
      else put(s, box({ at: [x - w / 2, 0, z - w / 2], size: [w, h, w], material: 'neutral', name: n })); });
    return acts;
  },
  vQuote(s, at, P) {
    const [x, z] = at(4, 26);
    put(s, box({ at: [x - 18, 0, z - 14], size: [36, 2, 28], material: 'chalk', name: P + 'sheet', details: lines(2, x - 14, z - 10, 14, 3, 5) }));
    return coins(s, [x + 6, z + 2], 3, P + 'coin', 2);
  },
  vMulti(s, at, P) {
    const [px, pz] = at(0, 34);
    const tones = ['carrier-ups', 'carrier-dhl-yellow', 'blue-strong'];
    const spots = [[-22, 40], [0, 46], [22, 40]].map(([du, b]) => at(du, b));
    const pad = box({ at: [px - 34, 0, pz - 30], size: [68, 1, 60], material: 'neutral', name: P + 'pad' });
    pad.details = spots.map(([x, z], i) => routeDetail({ points: [[x + 2, z + 8], at(-6 + i * 6, 8)].map(([a, b]) => [a, b]), y: 1, act: 'in', d0: i * 2, dash: 4, gap: 3, width: 1.6 }));
    put(s, pad);
    spots.forEach(([x, z], i) => { const a = [x - 6, 1, z - 6], sz = [12, 11, 12]; put(s, parcel({ at: a, size: sz, name: `${P}c${i}`, details: stripes(a, sz, tones[i]) })); });
    return {};
  },
  vUps(s, at, P) {
    const [dx, dz] = at(-14, 46); door(s, { x: dx, z: dz - 14, name: P + 'door', h: 30 });
    const [x, z] = at(-2, 30), a = [x - 7, 0, z - 7], sz = [14, 13, 14];
    put(s, parcel({ at: a, size: sz, name: P + 'ups', details: stripes(a, sz, 'carrier-ups') }));
    const [sx, sz2] = at(18, 34); put(s, shieldM({ at: [sx - 10, 0, sz2], w: 20, h: 32, t: 4, name: P + 'shield' }));
    return { [P + 'shield']: { act: 'in move', from: [0, -14, 0], d: 1, slow: true } };
  },
  vSpecial(s, at, P) {
    const [x, z] = at(0, 30);
    const acts = twin(s, (m, n) => box({ at: [x - 18, 0, z - 18], size: [36, 3, 36], material: m, name: n }), P + 'plate', 'neutral', 'teal');
    put(s, box({ at: [x - 11, 3, z - 11], size: [22, 24, 22], material: 'blue', name: P + 'safe', details: [faceRect({ plane: 'x', at: x + 11, u: z - 8, v: 7, w: 16, h: 16, tone: 'blue-strong' }), disc([x + 11, 15, z], 2.4, 'x', 'blue-light')] }));
    return acts;
  },
  vDefense(s, at, P) {
    const [x, z] = at(-6, 46); home(s, { at: [x - 14, z - 14], w: 28, h: 20, d: 28, roof: 12, name: P + 'home' });
    const [px, pz] = at(18, 24); put(s, cylinder({ center: [px, 0, pz], r: 8, h: 2, material: 'neutral', name: P + 'puck' }));
    put(s, pinM({ tip: [px, 2, pz], name: P + 'pin', s: 1.1 }));
    return { [P + 'pin']: { act: 'in move', from: [0, 24, 0], d: 1, slow: true } };
  },
  vOrchestrate(s, at, P) {
    const [x, z] = at(0, 26);
    const pad = box({ at: [x - 30, 0, z - 24], size: [60, 1, 48], material: 'neutral', name: P + 'pad' });
    const fork = at(-16, 6), end = at(18, 40), grey = at(-14, 44);
    pad.details = [routeDetail({ points: [fork, at(-16, 26), grey], y: 1, tone: 'outline-default', dash: 4, gap: 3, width: 1.6 }),
      routeDetail({ points: [fork, at(2, 24), end], y: 1, act: 'in', d0: 0, dash: 4, gap: 3, width: 1.6 })];
    put(s, pad);
    s.add(medal({ c: [end[0], 18, end[1]], r: 7, name: P + 'ring' }));
    return { [P + 'ring']: { act: 'in move', from: [0, -8, 0], d: 3, slow: true } };
  },
  vCommerce(s, at, P) {
    const [x, z] = at(0, 34); laptop(s, { x: x - 14, z: z - 14, w: 28, d: 28, name: P + 'laptop' });
    s.add(medal({ c: [x - 6, 31, z], r: 7, material: 'coral', mark: 'bar', name: P + 'risk' }));
    s.add(medal({ c: [x - 6, 31, z], r: 8, name: P + 'ring' }));
    return { [P + 'risk']: 'out', [P + 'ring']: { act: 'in', d: 2 } };
  },
  vInsureShield(s, at, P) {
    const [x, z] = at(4, 40); put(s, shieldM({ at: [x - 14, 0, z - 4], w: 28, h: 40, t: 6, name: P + 'shield' }));
    slab(s, at(4, 40), 40, 30, P + 'pad');
    return { [P + 'shield']: { act: 'in move', from: [0, -18, 0], d: 1, slow: true } };
  },
  vConnect(s, at, P) {
    const [x, z] = at(0, 34); laptop(s, { x: x - 16, z: z - 16, w: 32, d: 30, name: P + 'laptop' });
    put(s, box({ at: [x + 6, 3, z + 4], size: [9, 7, 9], material: 'teal', name: P + 'dock' }));
    return { [P + 'dock']: { act: 'in move', from: [0, 18, 0], d: 1, slow: true } };
  },
  vBecome(s, at, P) {
    const [x, z] = at(-4, 50);
    const acts = storefront(s, { x: x - 14, z: z - 18, w: 26, h: 26, d: 32, name: P + 'store', awning: 'twin' });
    [[14, 28], [26, 22]].forEach(([du, b], i) => { const [px, pz] = at(du, b), a = [px - 6, 0, pz - 6], sz = [12, 10, 12];
      put(s, parcel({ at: a, size: sz, name: `${P}p${i}`, details: [actG({ act: 'in', d: 2 + i }, faceRect({ plane: 'y', at: 10, u: a[0], v: a[2] + 4.9, w: 12, h: 2.2, tone: 'teal-strong' }))] })); });
    return acts;
  },
  vHelp(s, at, P) {
    const [x, z] = at(0, 32); slab(s, [x, z], 40, 34, P + 'plate');
    put(s, standing({ at: [x - 4, z + 12], w: 24, h: 30, name: P + 'doc' }));
    s.add(medal({ c: [x - 2, 37, z - 4], r: 7, name: P + 'ring' }));
    return { [P + 'ring']: { act: 'in move', from: [0, -10, 0], d: 1, slow: true } };
  },
  vStories(s, at, P) {
    const [x, z] = at(-10, 32);
    const acts = twin(s, (m, n) => parcel({ at: [x - 8, 0, z - 8], size: [16, 9, 16], material: m, name: n }), P + 'loss', 'coral', 'neutral');
    const [cx, cz] = at(14, 30);
    return { ...acts, ...coins(s, [cx, cz], 4, P + 'coin', 0, 7, 4, 2) };
  },
  vInsights(s, at, P) {
    const [x, z] = at(0, 32);
    put(s, box({ at: [x - 24, 0, z - 18], size: [48, 2, 36], material: 'chalk', name: P + 'sheet' }));
    [[-14, 10], [-4, 16], [16, 13]].forEach(([du, h], i) => { const [bx, bz] = at(du, 32); put(s, box({ at: [bx - 4, 2, bz - 4], size: [8, h, 8], material: 'kraft', name: `${P}bar${i}` })); });
    const [tx, tz] = at(6, 32);
    return twin(s, (m, n) => box({ at: [tx - 4, 2, tz - 4], size: [8, 26, 8], material: m, name: n }), P + 'top', 'kraft', 'teal');
  },
  vGuides(s, at, P) {
    const [x, z] = at(0, 32);
    const top = sheets(s, { at: [x - 18, z - 16], w: 36, d: 32, n: 4, t: 3, name: P + 'sheet', lines: false });
    const last = s.items.filter((o) => o.kind === 'object').pop();
    last.details = [routeDetail({ points: [[x - 12, z + 10], [x - 2, z], [x + 6, z + 4], [x + 14, z - 8]], y: top, act: 'in', d0: 0, dash: 3, gap: 2, width: 1.6 })];
    return {};
  },
  vContact(s, at, P) {
    const [hx, hz] = at(-8, 56); home(s, { at: [hx - 14, hz - 14], w: 26, h: 18, d: 26, roof: 11, name: P + 'home' });
    const [x, z] = at(12, 24); mailbox(s, { x, z, name: P + 'mbox', mat: 'teal', flag: 'act', k: 0.9 });
    return {};
  },
  vAvail(s, at, P) {
    const acts = {};
    [[-26, 44], [-6, 38]].forEach(([du, b], i) => { const [x, z] = at(du, b); put(s, cylinder({ center: [x, 0, z], r: 7, h: 3, material: 'neutral', name: `${P}far${i}` })); });
    const [x, z] = at(16, 30);
    Object.assign(acts, twin(s, (m, n) => cylinder({ center: [x, 0, z], r: 10, h: 4, material: m, name: n }), P + 'puck', 'neutral', 'teal'));
    put(s, pinM({ tip: [x, 4, z], name: P + 'pin', s: 1.1 }));
    acts[P + 'pin'] = { act: 'in move', from: [0, 22, 0], d: 1, slow: true };
    return acts;
  },
  vAnnounce(s, at, P) {
    const [x, z] = at(0, 32); slab(s, [x, z], 44, 36, P + 'plate');
    const top = sheets(s, { at: [x - 14, z - 12], w: 28, d: 24, n: 3, t: 3, name: P + 'sheet', lines: false });
    s.add(box({ at: [x - 13, 2 + top, z - 11], size: [28, 3, 24], material: 'teal', name: P + 'new', details: lines(5 + top, x - 9, z - 7, 14, 3, 5, 'teal-tint') }));
    return { [P + 'new']: { act: 'in move', from: [0, 16, 0], d: 1, slow: true } };
  },
  vNews(s, at, P) {
    const [x, z] = at(-4, 32); slab(s, [x, z], 44, 36, P + 'plate');
    const top = sheets(s, { at: [x - 16, z - 12], w: 30, d: 24, n: 3, t: 3, name: P + 'sheet' });
    s.add(shieldM({ at: [x - 1, 2 + top, z - 6], w: 14, h: 22, t: 3, name: P + 'shield' }));
    return { [P + 'shield']: { act: 'in move', from: [0, -8, 0], d: 1, slow: true } };
  }
};

// ---------------------------------------------------------------- the journey strip
const PT = (t, b = 0) => [t - b, -t - b];                     // route coordinate → world [x, z]
const ROUTE = { dash: 9, gap: 6, width: 2 };
/** keys = stop builder names in tile order; pitch = tile width in px at 1248; S = projection scale. */
export function world(keys, pitch, S) {
  const s = scene(), dt = pitch / (Math.SQRT2 * S), n = keys.length;
  const tL = -dt / 2 - 4, tR = tL + n * dt + 8;
  const G = (t, b) => { const [x, z] = PT(t, b); return [x, 0, z]; };      // ground band: a front and a back edge
  s.add({ kind: 'ground', layer: 0, tone: 'outline-variant', lines: [[G(tL, -24), G(tR, -24)]] });   // the front edge only: the band reads as a kerb, the stops sit on open ground
  s.route({ points: [PT(tL), PT(tR)], tone: 'outline-variant', ...ROUTE });
  const acts = {};
  keys.forEach((key, k) => { const tk = k * dt; Object.assign(acts, STOPS[key](s, (du, b) => PT(tk + du, b * 0.5), `s${k}:`) || {}); });   // stops sit close behind the route (the strip is 144 tall)
  // the merchant's parcel: kraft, tape turns teal once the journey starts (the page sets data-covered)
  const t0 = -dt / 2 + 30 / (Math.SQRT2 * S), [x, z] = PT(t0), sz = 16;
  const a = [x - sz / 2, 0, z - sz / 2];
  put(s, box({ at: a, size: [sz, 14, sz], material: 'kraft', name: 'parcel', details: [
    faceRect({ plane: 'y', at: 14, u: a[0], v: a[2] + sz / 2 - 1.5, w: sz, h: 3, tone: 'kraft-light' }),
    actG({ act: 'in' }, faceRect({ plane: 'y', at: 14, u: a[0], v: a[2] + sz / 2 - 1.5, w: sz, h: 3, tone: 'teal-strong' }))] }));
  return { s, acts, t0, dt, n };
}
/** Only the teal route, same geometry: the page lights its dashes up to the parcel. */
export function progress(keys, pitch, S) {
  const s = scene(), dt = pitch / (Math.SQRT2 * S), n = keys.length, tL = -dt / 2 - 4, tR = tL + n * dt + 8;
  s.route({ points: [PT(tL), PT(tR)], tone: 'teal-strong', ...ROUTE });
  return s;
}
export const MENU_STOPS = {
  'Shipping Insurance': ['vSelect', 'vQuote', 'vMulti', 'vUps', 'vSpecial'],
  Solutions: ['vDefense', 'vOrchestrate', 'vCommerce', 'vInsureShield'],
  Partners: ['vConnect', 'vBecome'],
  Resources: ['vHelp', 'vStories', 'vInsights', 'vGuides'],
  About: ['vContact', 'vAvail', 'vAnnounce', 'vNews']
};
