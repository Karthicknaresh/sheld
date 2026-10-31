// InsureShield nav illustrations, v2: drawn from the concept cards in concepts/nav-concepts.json
// (momentum-concept skill), built with iso.js (momentum-iso-motion skill).
// One scene per card. Each builder returns { s, title, hero?, acts? }.
//   acts = the card's one state change: { objectName: 'in' | 'out' | { act, from, d, slow } }
//   'in' = appears on hover, 'out' = leaves on hover, from = where it rests before travelling home.
// Rest state = Outline (paper + hairline, set by the page CSS). Hover = Filled + the state change.
// Build AFTER setScale(): primitives project eagerly.
import { scene, box, prism, cylinder, faceRect, faceRibbon, circlePath, actG, routeDetail } from './iso.js';

// ---------------------------------------------------------------- helpers
const put = (s, o, shadow = true) => { s.add(o); if (shadow) s.shadowOf(o); return o; };
const shadowOnly = (s, o) => s.shadowOf({ ...o, name: o.name + '-shadow' });     // a shadow that never fades (twins share it)
const disc = (center, r, plane, tone) => ({ svg: (col) =>
  `<path d="${circlePath(center, r, plane)}" fill="${col(tone)}" stroke="${col(tone)}" stroke-width="0.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` });
const ring = (center, r, plane, tone) => ({ svg: (col) =>
  `<path d="${circlePath(center, r, plane)}" fill="none" stroke="${col(tone)}" stroke-width="1" vector-effect="non-scaling-stroke"/>` });

// Coverage shield outline: flat top (follows the axis), smooth lower curve sampled in short steps.
const SHIELD = (w, h) => {
  const k = w / 48, q = h / 84, N = 24;
  const cub = (p0, p1, p2, p3, t) => p0.map((_, i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);
  const right = Array.from({ length: N + 1 }, (_, i) => cub([48, 52], [48, 30], [34, 16], [24, 8], i / N));
  const left = right.slice(0, -1).reverse().map(([u, v]) => [48 - u, v]);
  return [[0, 84], [48, 84], ...right, ...left].map(([u, v]) => [u * k, v * q]);
};
/** Shield standing on the left-face plane. check: false | true | act spec (the check appears). */
function shield({ at: [x, y, z], w, h, t = 8, name = 'shield', check = true, material = 'teal' }) {
  const sh = prism({ outline: SHIELD(w, h), origin: [x, y, z], plane: 'z', thickness: t, material, frontTone: 'teal-strong', name });
  if (check) {
    const cx = x + w / 2, pts = [[cx - w * 0.25, y + h * 0.62], [cx - w * 0.06, y + h * 0.5], [cx + w * 0.25, y + h * 0.74]];
    const rib = faceRibbon({ plane: 'z', at: z + t, points: pts, w: w * 0.11, tone: 'teal-tint' });
    sh.details = [check === true ? rib : actG(check, rib)];
  }
  return sh;
}
/** Round medallion standing on the left-face plane: the check ring (teal) or the exception mark (coral). */
function medal({ c: [x, y, z], r, material = 'teal', name, mark = 'check', markAct, t = 4 }) {
  const N = 32, outline = Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return [r + r * Math.cos(a), r + r * Math.sin(a)]; });
  const m = prism({ outline, origin: [x - r, y - r, z], plane: 'z', thickness: t, material, frontTone: `${material}-strong`, name });
  const f = z + t, tint = material === 'coral' ? 'coral-light' : 'teal-tint';
  const sym = mark === 'check'
    ? faceRibbon({ plane: 'z', at: f, points: [[x - 0.42 * r, y + 0.02 * r], [x - 0.1 * r, y - 0.3 * r], [x + 0.45 * r, y + 0.38 * r]], w: 0.24 * r, tone: tint })
    : { svg: (col) => faceRibbon({ plane: 'z', at: f, points: [[x, y + 0.52 * r], [x, y - 0.1 * r]], w: 0.22 * r, tone: tint }).svg(col) + disc([x, y - 0.42 * r, f], 0.13 * r, 'z', tint).svg(col) };
  m.details = [markAct ? actG(markAct, sym) : sym];
  return m;
}
/** Parcel with tape across the top seam. */
function parcel({ at: [x, y, z], size: [w, h, d], material = 'kraft', name = 'parcel', details = [] }) {
  const tape = { kraft: 'kraft-light', teal: 'teal-tint', neutral: 'surface-lowest', coral: 'coral-light', chalk: 'chalk-shade' }[material] || 'kraft-light';
  return box({ at: [x, y, z], size: [w, h, d], material, name, details: [faceRect({ plane: 'y', at: y + h, u: x, v: z + d / 2 - d * 0.09, w, h: d * 0.18, tone: tape }), ...details] });
}
/** Home: walls + gable roof (two objects), door on the lit face. */
function home(s, { at: [x, z], w = 28, h = 22, d = 28, roof = 14, name = 'home', door = true }) {
  put(s, box({ at: [x, 0, z], size: [w, h, d], material: 'neutral', name, details: door ? [faceRect({ plane: 'x', at: x + w, u: z + d * 0.36, v: 0, w: d * 0.28, h: h * 0.62, tone: 'surface-lowest' })] : [] }));
  s.add(prism({ outline: [[0, h], [d, h], [d / 2, h + roof]], origin: [x, 0, z + d], plane: 'x', thickness: w, material: 'neutral', name: name + '-roof' }));
}
/** Pin standing on the right-face plane; tip at (x, y, z). */
const pin = ({ tip: [x, y, z], name, s = 1 }) => prism({ outline: [[0, 26], [14, 26], [14, 16], [7, 4], [0, 16]].map(([u, v]) => [u * s, (v - 4) * s]), origin: [x - 2 * s, y, z + 7 * s], plane: 'x', thickness: 4 * s, material: 'teal', frontTone: 'teal-strong', name });
/** Stack of flat sheets; returns the top y. */
function sheets(s, { at: [x, z], w, d, n = 3, t = 3, material = 'chalk', name = 'sheet', lines = true, offsets = [[0, 0], [2, -2], [4, 2]] }) {
  for (let i = 0; i < n; i++) {
    const [ox, oz] = offsets[i % offsets.length], top = (i + 1) * t;
    const det = lines && i === n - 1 ? [0, 1, 2, 3].map((k) => faceRect({ plane: 'y', at: top, u: x + ox + w * 0.14, v: z + oz + d * (0.18 + k * 0.17), w: w * (k % 2 ? 0.5 : 0.7), h: 3, tone: 'outline-variant' })) : [];
    const o = box({ at: [x + ox, i * t, z + oz], size: [w, t, d], material, name: `${name}${i}`, details: det });
    if (i === 0) put(s, o); else s.add(o);
  }
  return n * t;
}

export const SCENES = {
  // ================================================================ menu overviews (Stage panel)

  // Shipping Insurance — the parcel travels the route past the shield and turns teal on its way home
  coveredJourney() {
    const s = scene();
    s.groundPlate({ min: [-72, -72], max: [78, 44] });
    s.route({ points: [[-44, 22], [-22, 8], [0, -10], [24, -26], [44, -42]], act: 'in' });
    put(s, parcel({ at: [-64, 0, 14], size: [28, 26, 28], name: 'parcel-start' }));
    put(s, shield({ at: [-28, 0, -8], w: 38, h: 64, check: true }));
    put(s, parcel({ at: [14, 0, -42], size: [26, 24, 26], material: 'teal', name: 'parcel-covered' }));
    home(s, { at: [46, -74], w: 32, h: 26, d: 32, roof: 16 });
    return { s, title: 'A parcel on a route that passes a coverage shield on its way to a home, turning teal',
      acts: { 'parcel-start': 'out', 'parcel-covered': { act: 'in move', from: [-78, 0, 56], d: 2, slow: true } } };
  },

  // Solutions — three check rings along the journey: before, during and after delivery
  threeChecks() {
    const s = scene();
    s.groundPlate({ min: [-70, -60], max: [70, 48] });
    s.route({ points: [[-46, 24], [-22, 10], [0, -2], [22, -16], [38, -28]], act: 'in' });
    put(s, parcel({ at: [-66, 0, 16], size: [26, 24, 26], name: 'parcel' }));
    [[-30, 24], [-2, 6], [26, -12]].forEach(([x, z], i) =>
      put(s, medal({ c: [x, 15, z - 14], r: 15, name: 'ring' + i, markAct: { act: 'in', d: 4 + i * 3 } })));
    home(s, { at: [36, -60], w: 30, h: 26, d: 30, roof: 16 });
    return { s, title: 'A route from a parcel to a home with three check rings along it' };
  },

  // Partners — a storefront and a laptop; routes draw into one plate that fills teal
  platformsJoin() {
    const s = scene();
    s.groundPlate({ min: [-78, -50], max: [64, 70] });
    put(s, box({ at: [-74, 0, -16], size: [34, 34, 38], material: 'neutral', name: 'store', details: [
      faceRect({ plane: 'x', at: -40, u: -10, v: 8, w: 14, h: 14, tone: 'blue-light' }),
      faceRect({ plane: 'x', at: -40, u: 9, v: 0, w: 10, h: 22, tone: 'surface-lowest' })] }));
    s.add(box({ at: [-40, 25, -16], size: [9, 4, 38], material: 'neutral', name: 'store-awning' }));
    put(s, box({ at: [-48, 0, 30], size: [36, 4, 36], material: 'neutral', name: 'laptop-base', details: [
      faceRect({ plane: 'y', at: 4, u: -38, v: 36, w: 22, h: 24, tone: 'surface-lowest' })] }));
    put(s, box({ at: [-50, 0, 30], size: [2, 30, 36], material: 'chalk', name: 'laptop-screen', details: [
      faceRect({ plane: 'x', at: -48, u: 33, v: 5, w: 30, h: 22, tone: 'outline-variant' })] }));
    s.route({ points: [[-28, 4], [-6, -6], [12, -12]], act: 'in' });
    s.route({ points: [[-6, 48], [8, 28], [20, 10]], act: 'in', d0: 1 });
    const plate = { at: [10, 0, -38], size: [50, 4, 50] };
    shadowOnly(s, box({ ...plate, name: 'plate' }));
    s.add(box({ ...plate, material: 'neutral', name: 'plate-rest' }));
    s.add(box({ ...plate, material: 'teal', name: 'plate' }));
    return { s, title: 'A storefront and a laptop linked by routes to one teal policy plate',
      acts: { 'plate-rest': { act: 'out', d: 6 }, plate: { act: 'in', d: 6 } } };
  },

  // Resources — a row of binders of rising height; the teal one slides forward
  binders() {
    const s = scene();
    s.groundPlate({ min: [-46, -34], max: [30, 50] });
    [36, 44, 52, 60].forEach((h, i) => {
      const x = -34 + i * 13, teal = i === 2, z = -20;
      const o = box({ at: [x, 0, z], size: [10, h, 40], material: teal ? 'teal' : 'chalk', name: 'binder' + i, details: [
        faceRect({ plane: 'z', at: z + 40, u: x + 2, v: h - 16, w: 6, h: 8, tone: teal ? 'teal-tint' : 'chalk-strong' })] });
      put(s, o);
    });
    return { s, title: 'A row of binders of rising height, the teal one pulled forward', hero: 'binder2',
      acts: { binder2: { act: 'move', from: [0, 0, -18], slow: true } } };
  },

  // About — the shield stands on the policy plate, which fills teal; news sheets and a mailbox beside it
  standsBehind() {
    const s = scene();
    s.groundPlate({ min: [-70, -60], max: [60, 64] });
    const plate = { at: [-30, 0, -30], size: [60, 4, 60] };
    shadowOnly(s, box({ ...plate, name: 'plate' }));
    s.add(box({ ...plate, material: 'neutral', name: 'plate-rest' }));
    s.add(box({ ...plate, material: 'teal', name: 'plate' }));
    put(s, shield({ at: [-20, 4, -8], w: 40, h: 64, check: { act: 'in', d: 4 } }));
    sheets(s, { at: [-66, 30], w: 26, d: 30, n: 3, t: 2, name: 'news' });
    put(s, box({ at: [42, 0, -50], size: [3, 18, 3], material: 'neutral', name: 'post' }));
    put(s, box({ at: [32, 18, -54], size: [22, 11, 11], material: 'neutral', name: 'mailbox' }));
    return { s, title: 'A teal shield on a policy plate, with news sheets and a mailbox beside it', hero: 'shield',
      acts: { 'plate-rest': 'out', plate: 'in' } };
  },

  // ================================================================ Shipping Insurance

  // Multi-Carrier — four carrier-striped parcels on one plate that fills teal
  carrierPlate() {
    const s = scene();
    s.groundPlate({ min: [-54, -54], max: [54, 54] });
    const plate = { at: [-42, 0, -42], size: [84, 4, 84] };
    shadowOnly(s, box({ ...plate, name: 'plate' }));
    s.add(box({ ...plate, material: 'neutral', name: 'plate-rest' }));
    s.add(box({ ...plate, material: 'teal', name: 'plate' }));
    const P = [[-34, -34, 'carrier-usps'], [4, -34, 'carrier-dhl'], [-34, 4, 'carrier-fedex'], [4, 4, 'carrier-ups']];
    for (const [x, z, c] of P) {
      const W = 30, H = 26, stripe = (tone, v, h) => [faceRect({ plane: 'x', at: x + W, u: z, v: 4 + v, w: W, h, tone }), faceRect({ plane: 'z', at: z + W, u: x, v: 4 + v, w: W, h, tone })];
      put(s, parcel({ at: [x, 4, z], size: [W, H, W], name: c, details: [...stripe(c, 9, 5), ...(c === 'carrier-ups' ? stripe('carrier-ups-gold', 14, 1.5) : [])] }));
    }
    return { s, title: 'Four parcels with different carrier stripes on one teal policy plate', acts: { 'plate-rest': 'out', plate: 'in' } };
  },

  // UPS Shipments — a UPS-banded parcel in front of a shield that gains its check
  upsParcel() {
    const s = scene();
    s.groundPlate({ min: [-48, -46], max: [36, 48] });
    put(s, shield({ at: [-26, 0, -34], w: 46, h: 76, check: 'in' }));
    const [x, y, z, W, H, D] = [-26, 0, -12, 40, 34, 40];
    const band = (tone, v, h) => [faceRect({ plane: 'x', at: x + W, u: z, v, w: D, h, tone }), faceRect({ plane: 'z', at: z + D, u: x, v, w: W, h, tone })];
    put(s, parcel({ at: [x, y, z], size: [W, H, D], name: 'ups-parcel', details: [...band('carrier-ups', 13, 9), ...band('carrier-ups-gold', 22, 2)] }));
    return { s, title: 'A parcel with a UPS brown and gold band in front of a teal shield with a check', hero: 'shield' };
  },

  // Special Commodities — a blue item rises out of the open box; the plate under it fills teal
  risingItem() {
    const s = scene();
    s.groundPlate({ min: [-48, -48], max: [48, 48] });
    const plate = { at: [-36, 0, -36], size: [72, 3, 72] };
    shadowOnly(s, box({ ...plate, name: 'plate' }));
    s.add(box({ ...plate, material: 'neutral', name: 'plate-rest' }));
    s.add(box({ ...plate, material: 'teal', name: 'plate' }));
    put(s, box({ at: [-20, 3, -20], size: [40, 28, 40], material: 'kraft', name: 'box', details: [
      faceRect({ plane: 'y', at: 31, u: -17, v: -17, w: 34, h: 34, tone: 'kraft-shade' })] }));
    s.add(box({ at: [-20, 31, -22], size: [40, 14, 2], material: 'kraft', name: 'flap-back' }));
    s.add(box({ at: [-22, 31, -20], size: [2, 14, 40], material: 'kraft', name: 'flap-left' }));
    put(s, box({ at: [-9, 42, -9], size: [18, 18, 18], material: 'blue', name: 'item' }));
    return { s, title: 'A blue item rising out of an open kraft box over a teal plate',
      acts: { 'plate-rest': 'out', plate: 'in', item: { act: 'in move', from: [0, -22, 0], slow: true } } };
  },

  // Select My Coverage — three plates of three sizes; the parcel settles onto the middle one, which turns teal
  steppedFit() {
    const s = scene();
    s.groundPlate({ min: [-74, -58], max: [66, 54] });
    put(s, box({ at: [-62, 0, 24], size: [22, 3, 22], material: 'neutral', name: 'plate-s' }));
    const mid = { at: [-17, 0, -17], size: [34, 4, 34] };
    shadowOnly(s, box({ ...mid, name: 'plate-m' }));
    s.add(box({ ...mid, material: 'neutral', name: 'plate-m-rest' }));
    s.add(box({ ...mid, material: 'teal', name: 'plate-m' }));
    put(s, box({ at: [26, 0, -56], size: [44, 5, 44], material: 'neutral', name: 'plate-l' }));
    put(s, parcel({ at: [-12, 4, -12], size: [24, 22, 24], name: 'parcel' }));
    return { s, title: 'A parcel settling onto the middle one of three plates, which turns teal',
      acts: { 'plate-m-rest': 'out', 'plate-m': 'in', parcel: { act: 'move', from: [0, 26, 0], slow: true } } };
  },

  // Get a Quote — one more parcel joins the group and the coin stack grows one coin
  volumeCoins() {
    const s = scene();
    s.groundPlate({ min: [-70, -40], max: [52, 48] });
    for (const [x, z, n] of [[-60, 8, 'p0'], [-34, 8, 'p1'], [-60, 34, 'p2']]) put(s, parcel({ at: [x, 0, z], size: [22, 20, 22], name: n }));
    s.add(parcel({ at: [-60, 20, 8], size: [22, 20, 22], name: 'p-new' }));
    const coins = [0, 1, 2, 3, 4].map((i) => cylinder({ center: [28, i * 6, -14], r: 13, h: 5, material: 'teal', name: 'coin' + i }));
    s.shadowOf({ ...coins[0], height: 30, name: 'coins' });
    coins.forEach((c) => s.add(c));
    return { s, title: 'A group of parcels beside a teal coin stack that grows with it',
      acts: { 'p-new': { act: 'in move', from: [0, 18, 0], slow: true }, coin4: { act: 'in move', from: [0, 16, 0], d: 3, slow: true } } };
  },

  // ================================================================ Solutions

  // CommerceShield — the coral risk ring above the order resolves into a teal check ring
  orderCheck() {
    const s = scene();
    s.groundPlate({ min: [-44, -40], max: [40, 44] });
    put(s, parcel({ at: [-18, 0, -18], size: [36, 30, 36], name: 'order' }));
    const at = { c: [0, 54, -4], r: 14 };
    shadowOnly(s, medal({ ...at, name: 'ring' }));
    s.add(medal({ ...at, material: 'coral', mark: 'bar', name: 'risk' }));
    s.add(medal({ ...at, name: 'ring' }));
    return { s, title: 'A parcel whose coral risk ring turns into a teal check ring', acts: { risk: 'out', ring: 'in' } };
  },

  // DeliveryDefense — a teal pin drops onto the puck at the home's door; a ring appears
  addressPin() {
    const s = scene();
    s.groundPlate({ min: [-58, -52], max: [42, 40] });
    home(s, { at: [-52, -44], w: 40, h: 30, d: 44, roof: 18 });
    const puck = cylinder({ center: [12, 0, -10], r: 12, h: 4, material: 'neutral', name: 'puck' });
    puck.details = [actG({ act: 'in', d: 6 }, ring([12, 4, -10], 21, 'y', 'teal-strong'))];
    put(s, puck);
    put(s, pin({ tip: [12, 4, -10], name: 'pin', s: 1.2 }));
    return { s, title: 'A teal pin landing on a puck at a home\'s door, a ring around it',
      acts: { pin: { act: 'in move', from: [0, 36, 0], slow: true } } };
  },

  // Delivery Orchestration — at the fork, the safer branch draws teal to the home; the other stays faint
  forkRoute() {
    const s = scene();
    s.groundPlate({ min: [-66, -60], max: [60, 42] });
    s.route({ points: [[-38, 18], [-22, 10]], act: 'in' });
    s.route({ points: [[-22, 10], [0, 8], [22, 14], [42, 10]], tone: 'outline-variant' });
    s.route({ points: [[-22, 10], [-4, -6], [14, -20], [26, -30]], act: 'in', d0: 2 });
    put(s, parcel({ at: [-64, 0, 10], size: [28, 26, 28], name: 'parcel' }));
    home(s, { at: [24, -66], w: 34, h: 28, d: 34, roof: 18 });
    return { s, title: 'A parcel at a fork; the safer branch to the home is drawn in teal' };
  },

  // InsureShield Shipping Insurance — the front parcel turns teal before the shield; grey parcels behind
  shieldContrast() {
    const s = scene();
    s.groundPlate({ min: [-84, -72], max: [50, 34] });
    put(s, box({ at: [-80, 0, -58], size: [22, 20, 22], material: 'neutral', name: 'other-a' }));
    put(s, box({ at: [-50, 0, -70], size: [20, 18, 20], material: 'neutral', name: 'other-b' }));
    put(s, shield({ at: [4, 0, -10], w: 42, h: 68 }));
    const p = { at: [-50, 0, -12], size: [34, 30, 34] };
    shadowOnly(s, box({ ...p, name: 'covered' }));
    s.add(parcel({ ...p, name: 'exposed' }));
    s.add(parcel({ ...p, material: 'teal', name: 'covered' }));
    return { s, title: 'A parcel turning teal in front of a coverage shield, grey parcels behind', hero: 'shield',
      acts: { exposed: 'out', covered: 'in' } };
  },

  // ================================================================ Partners

  // Connect with a Partner — the teal block slides down and seats into the slot of the grey block
  dockSeat() {
    const s = scene();
    s.groundPlate({ min: [-44, -32], max: [44, 32] });
    put(s, box({ at: [-32, 0, -20], size: [64, 12, 40], material: 'neutral', name: 'base' }));
    s.add(box({ at: [-32, 12, -20], size: [64, 10, 13], material: 'neutral', name: 'wall-back' }));
    s.add(box({ at: [-14, 12, -7], size: [28, 18, 14], material: 'teal', name: 'module' }));
    s.add(box({ at: [-32, 12, 7], size: [64, 10, 13], material: 'neutral', name: 'wall-front' }));
    return { s, title: 'A teal block seating into a slot in a grey platform block',
      acts: { module: { act: 'move', from: [0, 26, 0], slow: true } } };
  },

  // Become a Partner — the storefront's awning fills teal and a route draws out under the parcel
  storeShips() {
    const s = scene();
    s.groundPlate({ min: [-70, -40], max: [70, 36] });
    put(s, box({ at: [-62, 0, -32], size: [42, 34, 48], material: 'neutral', name: 'store', details: [
      faceRect({ plane: 'x', at: -20, u: -26, v: 8, w: 18, h: 16, tone: 'blue-light' }),
      faceRect({ plane: 'x', at: -20, u: -2, v: 0, w: 12, h: 22, tone: 'surface-lowest' })] }));
    const aw = { at: [-20, 24, -32], size: [13, 4, 48] };
    s.add(box({ ...aw, material: 'neutral', name: 'awning-rest' }));
    s.add(box({ ...aw, material: 'teal', name: 'awning' }));
    s.route({ points: [[-8, 10], [22, -4], [54, -22]], act: 'in', d0: 2 });
    put(s, parcel({ at: [-12, 0, -2], size: [22, 20, 22], name: 'parcel' }));
    return { s, title: 'A storefront with a teal awning; a parcel leaves its door on a teal route',
      acts: { 'awning-rest': 'out', awning: 'in' } };
  },

  // ================================================================ Resources

  // Insights — bars built from parcels on a sheet; each grows one parcel, the last in teal
  parcelBars() {
    const s = scene();
    s.groundPlate({ min: [-52, -38], max: [52, 38] });
    put(s, box({ at: [-46, 0, -30], size: [92, 2, 60], material: 'chalk', name: 'sheet' }));
    const U = 13, acts = {};
    [[-36, 2], [-14, 3], [8, 4]].forEach(([x, n], col) => {
      for (let i = 0; i < n; i++) {
        const last = i === n - 1, teal = last && col === 2, name = `b${col}-${i}`;
        s.add(box({ at: [x, 2 + i * U, -6], size: [U, U, U], material: teal ? 'teal' : 'kraft', name }));
        if (last) acts[name] = { act: 'in move', from: [0, 14, 0], d: col * 2, slow: true };
      }
    });
    s.shadowOf({ ...box({ at: [-36, 2, -6], size: [57, 52, U] }), name: 'bars' });
    return { s, title: 'Bars of stacked parcels on a sheet, the tallest topped in teal', acts };
  },

  // Whitepapers & Guides — a dashed teal route draws across the top sheet of a thick stack
  routeSheet() {
    const s = scene();
    s.groundPlate({ min: [-50, -56], max: [44, 52] });
    const t = 3, n = 4;
    for (let i = 0; i < n; i++) {
      const o = box({ at: [-34 + (i % 2) * 2, i * t, -44 + (i % 2) * -2], size: [64, t, 84], material: 'chalk', name: 'sheet' + i,
        details: i === n - 1 ? [
          routeDetail({ points: [[-24, -34], [-4, -14], [4, 8], [20, 28]], y: n * t, act: 'in', dash: 8, gap: 5, width: 3 }),
          actG({ act: 'in', d: 7 }, disc([21, n * t, 31], 6, 'y', 'teal-strong'))] : [] });
      if (i === 0) put(s, o); else s.add(o);
    }
    return { s, title: 'A stack of sheets with a teal route drawn across the top one' };
  },

  // Customer Stories — a teal route draws from the damaged (coral) parcel to a coin stack that rises
  lossToCoins() {
    const s = scene();
    s.groundPlate({ min: [-62, -46], max: [54, 38] });
    put(s, parcel({ at: [-58, 0, 4], size: [30, 28, 30], material: 'coral', name: 'loss' }));
    s.route({ points: [[-24, 12], [-4, 0], [14, -10]], act: 'in' });
    const coins = [0, 1, 2, 3].map((i) => cylinder({ center: [32, i * 7, -22], r: 16, h: 6, material: 'teal', name: 'coin' + i }));
    s.shadowOf({ ...coins[0], height: 28, name: 'coins' });
    coins.forEach((c) => s.add(c));
    return { s, title: 'A damaged coral parcel linked by a teal route to a coin stack',
      acts: { coin2: { act: 'in move', from: [0, 14, 0], d: 4, slow: true }, coin3: { act: 'in move', from: [0, 18, 0], d: 5, slow: true } } };
  },

  // Help & Support — the ring on a standing document gains its teal check
  answeredDoc() {
    const s = scene();
    s.groundPlate({ min: [-44, -48], max: [40, 40] });
    const ox = -4, oz = 22, f = ox + 4;                 // document on the right-face plane, front at x = f
    const doc = prism({ outline: [[0, 0], [44, 0], [44, 48], [34, 60], [0, 60]], origin: [ox, 0, oz], plane: 'x', thickness: 4, material: 'chalk', name: 'doc' });
    const cz = oz - 22, cy = 22, R = 10;
    doc.details = [
      ...[50, 44, 38].map((v, i) => faceRect({ plane: 'x', at: f, u: oz - 38, v, w: i === 0 ? 26 : 32, h: 2.5, tone: 'outline-variant' })),
      disc([f, cy, cz], R, 'x', 'teal-strong'), disc([f, cy, cz], R * 0.72, 'x', 'chalk-light'),
      actG('in', faceRibbon({ plane: 'x', at: f, points: [[-(cz + 0.42 * R), cy], [-(cz + 0.08 * R), cy - 0.32 * R], [-(cz - 0.48 * R), cy + 0.42 * R]], w: 2.6, tone: 'teal-strong' }))];
    put(s, doc);
    return { s, title: 'A document with a ring that gains a teal check', hero: 'doc' };
  },

  // ================================================================ About

  // Announcements — a new teal sheet slides down onto the top of the stack
  newSheet() {
    const s = scene();
    s.groundPlate({ min: [-50, -54], max: [42, 48] });
    const top = sheets(s, { at: [-36, -42], w: 60, d: 80, n: 3, t: 3 });
    s.add(box({ at: [-31, top, -40], size: [56, 3, 76], material: 'teal', name: 'new', details: [
      faceRect({ plane: 'y', at: top + 3, u: -24, v: -32, w: 22, h: 4, tone: 'teal-tint' }),
      ...[0, 1, 2].map((k) => faceRect({ plane: 'y', at: top + 3, u: -24, v: -20 + k * 12, w: k % 2 ? 26 : 36, h: 3, tone: 'teal-light' }))] }));
    return { s, title: 'A teal sheet landing on top of a stack of sheets', acts: { new: { act: 'in move', from: [-18, 22, -10], slow: true } } };
  },

  // In The News — a small shield stamps down onto a printed sheet with column rules
  pressStamp() {
    const s = scene();
    s.groundPlate({ min: [-50, -56], max: [44, 52] });
    const det = [faceRect({ plane: 'y', at: 2, u: -32, v: -40, w: 56, h: 8, tone: 'outline-default' })];
    for (const col of [0, 1, 2]) for (let r = 0; r < 6; r++)
      det.push(faceRect({ plane: 'y', at: 2, u: -32 + col * 20, v: -26 + r * 11, w: 16, h: 2.5, tone: 'outline-variant' }));
    put(s, box({ at: [-38, 0, -48], size: [68, 2, 96], material: 'chalk', name: 'paper', details: det }));
    put(s, shield({ at: [-2, 2, 6], w: 26, h: 40, t: 6 }));
    return { s, title: 'A printed sheet with column rules and a teal shield stamped on it',
      acts: { shield: { act: 'in move', from: [0, 22, 0] } } };
  },

  // Product Availability — teal pins drop onto three pucks one after another
  regionPins() {
    const s = scene();
    s.groundPlate({ min: [-60, -46], max: [60, 46] });
    const acts = {};
    [[-30, 20], [0, 0], [30, -20]].forEach(([x, z], i) => {
      put(s, cylinder({ center: [x, 0, z], r: 14, h: 4, material: 'neutral', name: 'puck' + i }));
      put(s, pin({ tip: [x, 4, z], name: 'pin' + i, s: 1.45 }));
      acts['pin' + i] = { act: 'in move', from: [0, 30, 0], d: i * 3, slow: true };
    });
    return { s, title: 'Teal pins landed on a row of three pucks', acts };
  },

  // Contact Us — the mailbox flag raises
  mailboxFlag() {
    const s = scene();
    s.groundPlate({ min: [-40, -36], max: [40, 36] });
    put(s, box({ at: [-2, 0, -2], size: [5, 30, 5], material: 'neutral', name: 'post' }));
    const f = 9;                                             // left-face plane of the box body
    put(s, box({ at: [-20, 30, -9], size: [40, 18, 18], material: 'teal', name: 'mailbox', details: [
      faceRect({ plane: 'x', at: 20, u: -6, v: 33, w: 12, h: 12, tone: 'teal-strong' }),
      actG('out', faceRect({ plane: 'z', at: f, u: -12, v: 38, w: 22, h: 2.5, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: 4, v: 34, w: 6, h: 8, tone: 'surface-lowest' })),
      actG('in', faceRect({ plane: 'z', at: f, u: 8, v: 38, w: 2.5, h: 24, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: 10.5, v: 54, w: 9, h: 8, tone: 'surface-lowest' }))] }));
    return { s, title: 'A teal mailbox on a post with its flag raised', hero: 'mailbox' };
  }
};

// Which builder draws each nav link (by link title). The page uses these names as data-scene.
export const SCENE_FOR = {
  'Shipping Insurance': 'coveredJourney', Solutions: 'threeChecks', Partners: 'platformsJoin', Resources: 'binders', About: 'standsBehind',
  'Multi-Carrier Shipments': 'carrierPlate', 'UPS Shipments': 'upsParcel', 'Special Commodities': 'risingItem', 'Select My Coverage': 'steppedFit', 'Get a Quote': 'volumeCoins',
  CommerceShield: 'orderCheck', DeliveryDefense: 'addressPin', 'Delivery Orchestration': 'forkRoute', 'InsureShield® Shipping Insurance': 'shieldContrast',
  'Connect with a Partner': 'dockSeat', 'Become a Partner': 'storeShips',
  Insights: 'parcelBars', 'Whitepapers & Guides': 'routeSheet', 'Customer Stories': 'lossToCoins', 'Help & Support': 'answeredDoc',
  Announcements: 'newSheet', 'In The News': 'pressStamp', 'Product Availability': 'regionPins', 'Contact Us': 'mailboxFlag'
};

// shared drawing helpers (used by scenes-v3.mjs)
export const H = { put, shadowOnly, disc, ring, shield, medal, parcel, home, pin, sheets, SHIELD };

