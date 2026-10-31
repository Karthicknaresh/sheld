// InsureShield nav illustrations, rebuilt with iso.js (momentum-iso-motion skill).
// One scene per nav link. Every scene: ground plate, objects on y = 0 (or lifted on purpose),
// hatch shadows, one teal hero at most, and one named movement (hero lift or a drop-in stack).
// Each builder returns { s, title, hero?, drop? }. Build AFTER setScale(): some primitives
// project eagerly.
import { scene, box, prism, cylinder, wheel, faceRect, faceLine, faceRibbon, circlePath } from './iso.js';

const put = (s, o, shadow = true) => { s.add(o); if (shadow) s.shadowOf(o); return o; };
// A disc painted on a face plane (dial, dots): a projected ellipse, never a screen circle.
const disc = (center, r, plane, tone) => ({ svg: (col) =>
  `<path d="${circlePath(center, r, plane)}" fill="${col(tone)}" stroke="${col(tone)}" stroke-width="0.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` });

// Coverage shield outline, flat top edge (follows the axis), tip lifted off the ground.
// The lower edge is a smooth curve sampled in short steps (like the live art), not long chords.
const SHIELD = (w, h) => {
  const k = w / 48, q = h / 84, N = 24;
  const cub = (p0, p1, p2, p3, t) => p0.map((_, i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);
  const right = Array.from({ length: N + 1 }, (_, i) => cub([48, 52], [48, 30], [34, 16], [24, 8], i / N));
  const left = right.slice(0, -1).reverse().map(([u, v]) => [48 - u, v]);
  return [[0, 84], [48, 84], ...right, ...left].map(([u, v]) => [u * k, v * q]);
};
const check = (cx, y0, w, h) => [[cx - w * 0.25, y0 + h * 0.62], [cx - w * 0.06, y0 + h * 0.5], [cx + w * 0.25, y0 + h * 0.74]];

export const SCENES = {
  // Shipping Insurance (menu) â€” a parcel under the coverage shield
  shieldParcel() {
    const s = scene();
    s.groundPlate({ min: [-64, -44], max: [64, 44] });
    put(s, box({ at: [-52, 0, -14], size: [36, 32, 36], material: 'kraft', name: 'parcel', details: [
      faceRect({ plane: 'y', at: 32, u: -52, v: 1, w: 36, h: 6, tone: 'kraft-light' }),
      faceRect({ plane: 'x', at: -16, u: 4, v: 9, w: 14, h: 10, tone: 'surface-lowest' })
    ] }));
    const sh = prism({ outline: SHIELD(40, 64), origin: [4, 0, -8], plane: 'z', thickness: 10, material: 'teal', frontTone: 'teal-strong', name: 'shield' });
    sh.details = [faceRibbon({ plane: 'z', at: 2, points: check(24, 0, 40, 64), w: 5, tone: 'teal-tint' })];
    put(s, sh);
    return { s, title: 'A parcel protected by the coverage shield', hero: 'shield' };
  },

  // Multi-Carrier Shipments â€” three parcels on one route; carrier stripes, the insured one in teal
  globeRoutes() {
    const s = scene();
    s.groundPlate({ min: [-86, -56], max: [62, 50] });
    s.route({ points: [[-46, 26], [-24, 22], [22, -12], [32, -26]] });
    put(s, box({ at: [-74, 0, 16], size: [26, 22, 26], material: 'kraft', name: 'parcel-a', details: [
      faceRect({ plane: 'x', at: -48, u: 16, v: 8, w: 26, h: 4, tone: 'blue-strong' })] }));
    put(s, box({ at: [30, 0, -46], size: [24, 20, 24], material: 'kraft', name: 'parcel-c', details: [
      faceRect({ plane: 'x', at: 54, u: -46, v: 7, w: 24, h: 4, tone: 'kraft-shade' })] }));
    put(s, box({ at: [-14, 0, 6], size: [32, 28, 32], material: 'teal', name: 'insured', details: [
      faceRect({ plane: 'y', at: 28, u: -14, v: 19, w: 32, h: 5, tone: 'teal-tint' })] }));
    return { s, title: 'Parcels from several carriers on one protected route', hero: 'insured' };
  },

  // UPS Shipments â€” the delivery truck (skill example, rebuilt correctly), cab = teal
  truck() {
    const s = scene();
    s.groundPlate({ min: [-70, -40], max: [90, 40] });
    const chassis = box({ at: [-56, 8, -20], size: [128, 6, 40], material: 'chalk', name: 'chassis' });
    const cargo = box({ at: [-56, 14, -22], size: [88, 52, 44], material: 'chalk', name: 'cargo',
      details: [faceRect({ plane: 'z', at: 22, u: -52, v: 22, w: 80, h: 3, tone: 'teal-strong' })] });
    const cab = box({ at: [36, 14, -20], size: [34, 40, 40], material: 'teal', name: 'cab',
      details: [faceRect({ plane: 'x', at: 70, u: -16, v: 30, w: 32, h: 16, tone: 'blue-light' }),
        faceRect({ plane: 'z', at: 20, u: 42, v: 30, w: 18, h: 16, tone: 'blue-light' })] });
    for (const it of [chassis, cargo, cab]) put(s, it);
    for (const x of [-34, 52]) s.add(wheel({ at: [x, 20], r: 12, axis: 'z', outer: 24, name: 'wheel' + x }));
    return { s, title: 'Delivery truck', hero: 'cab' };
  },

  // Special Commodities â€” a high-value safe (blue voice), a parcel and a small coverage badge
  gemCase() {
    const s = scene();
    s.groundPlate({ min: [-56, -44], max: [60, 44] });
    put(s, box({ at: [-44, 0, -30], size: [52, 52, 52], material: 'blue', name: 'safe', details: [
      faceLine({ plane: 'x', at: 8, from: [-24, 6], to: [16, 6], tone: 'blue-shade' }),
      faceLine({ plane: 'x', at: 8, from: [16, 6], to: [16, 46], tone: 'blue-shade' }),
      faceLine({ plane: 'x', at: 8, from: [16, 46], to: [-24, 46], tone: 'blue-shade' }),
      faceLine({ plane: 'x', at: 8, from: [-24, 46], to: [-24, 6], tone: 'blue-shade' }),
      disc([8, 28, -4], 8, 'x', 'blue-strong'), disc([8, 28, -4], 3, 'x', 'blue-light'),
      faceLine({ plane: 'x', at: 8, from: [10, 20], to: [10, 36], tone: 'blue-strong' })
    ] }));
    const badge = prism({ outline: SHIELD(24, 42), origin: [20, 0, -28], plane: 'z', thickness: 6, material: 'teal', frontTone: 'teal-strong', name: 'badge' });
    badge.details = [faceRibbon({ plane: 'z', at: -22, points: check(32, 0, 24, 42), w: 3.5, tone: 'teal-tint' })];
    put(s, badge);
    put(s, box({ at: [24, 0, 8], size: [22, 18, 22], material: 'kraft', name: 'parcel', details: [
      faceRect({ plane: 'y', at: 18, u: 24, v: 16, w: 22, h: 4, tone: 'kraft-light' })] }));
    return { s, title: 'A high-value safe with its coverage badge', hero: 'badge' };
  },

  // Select My Coverage â€” a coverage slider: chalk track, teal filled range, teal knob, tier blocks
  gauge() {
    const s = scene();
    s.groundPlate({ min: [-72, -50], max: [72, 28] });
    [[-52, 10], [-12, 18], [28, 26]].forEach(([x, h], i) => put(s, box({ at: [x, 0, -44], size: [16, h, 16], material: i === 2 ? 'chalk' : 'neutral', name: 'tier' + i })));
    put(s, box({ at: [-60, 0, -8], size: [120, 6, 16], material: 'chalk', name: 'track', details: [
      ...[-50, -30, -10, 10, 30, 50].map((x) => faceLine({ plane: 'y', at: 6, from: [x, -5], to: [x, 5], tone: 'outline-variant' })),
      faceRect({ plane: 'y', at: 6, u: -60, v: -3, w: 70, h: 6, tone: 'teal-strong' })
    ] }));
    s.add(box({ at: [6, 6, -12], size: [16, 16, 24], material: 'teal', name: 'knob', details: [
      faceLine({ plane: 'y', at: 22, from: [10, -6], to: [10, 6], tone: 'teal-tint' }),
      faceLine({ plane: 'y', at: 22, from: [14, -6], to: [14, 6], tone: 'teal-tint' }),
      faceLine({ plane: 'y', at: 22, from: [18, -6], to: [18, 6], tone: 'teal-tint' })] }));
    return { s, title: 'A coverage slider set to the right level', hero: 'knob' };
  },

  // Get a Quote â€” a quote sheet and a stack of teal coins settling (34 ms stagger)
  coins() {
    const s = scene();
    s.groundPlate({ min: [-60, -40], max: [52, 40] });
    put(s, box({ at: [-52, 0, -28], size: [40, 2, 54], material: 'chalk', name: 'quote', details: [
      faceRect({ plane: 'y', at: 2, u: -46, v: -22, w: 14, h: 3, tone: 'teal-strong' }),
      ...[0, 1, 2].map((i) => faceRect({ plane: 'y', at: 2, u: -46, v: -10 + i * 10, w: 26, h: 3, tone: 'outline-variant' })),
      faceRect({ plane: 'y', at: 2, u: -30, v: 18, w: 12, h: 4, tone: 'teal-strong' })] }));
    const coins = [0, 1, 2, 3].map((i) => cylinder({ center: [22, i * 6, 0], r: 14, h: 5, material: 'teal', name: 'coin' + i }));
    s.shadowOf({ ...coins[0], height: 24 });
    coins.forEach((c) => s.add(c));
    return { s, title: 'A quote sheet and a stack of coins', drop: ['coin1', 'coin2', 'coin3'] };
  },

  // Solutions (menu) â€” stacked product layers, teal on top, settling into place
  layers() {
    const s = scene();
    s.groundPlate({ min: [-58, -58], max: [58, 58] });
    put(s, box({ at: [-44, 0, -44], size: [88, 12, 88], material: 'neutral', name: 'l0' }));
    s.add(box({ at: [-34, 12, -34], size: [68, 12, 68], material: 'chalk', name: 'l1' }));
    s.add(box({ at: [-24, 24, -24], size: [48, 12, 48], material: 'blue', name: 'l2' }));
    s.add(box({ at: [-14, 36, -14], size: [28, 20, 28], material: 'teal', name: 'l3' }));
    return { s, title: 'Stacked layers of protection', drop: ['l1', 'l2', 'l3'] };
  },

  // CommerceShield â€” an order grid; one flagged signal rises in teal
  scanTile() {
    const s = scene();
    s.groundPlate({ min: [-60, -60], max: [60, 60] });
    put(s, box({ at: [-48, 0, -48], size: [96, 6, 96], material: 'chalk', name: 'slab' }));
    const H = [[6, 4, 8, 4], [4, 10, 4, 6], [8, 4, 0, 4], [4, 6, 4, 8]];
    [-40, -18, 4, 26].forEach((x, i) => [-40, -18, 4, 26].forEach((z, j) => {
      if (i === 2 && j === 2) return;
      s.add(box({ at: [x, 6, z], size: [14, H[i][j], 14], material: 'neutral', name: `cell${i}${j}` }));
    }));
    s.add(box({ at: [4, 6, 4], size: [14, 22, 14], material: 'teal', name: 'signal' }));
    return { s, title: 'Order risk signals with one flagged order', hero: 'signal' };
  },

  // DeliveryDefense â€” a home, a parcel at the door and a teal address-confidence tag
  house() {
    const s = scene();
    s.groundPlate({ min: [-54, -46], max: [56, 50] });
    put(s, box({ at: [-34, 0, -30], size: [48, 34, 48], material: 'neutral', name: 'house', details: [
      faceRect({ plane: 'x', at: 14, u: -8, v: 0, w: 12, h: 20, tone: 'surface-lowest' }),
      faceRect({ plane: 'z', at: 18, u: -26, v: 14, w: 14, h: 12, tone: 'blue-light' })] }));
    s.prism({ outline: [[0, 34], [48, 34], [24, 58]], origin: [-34, 0, 18], plane: 'x', thickness: 48, material: 'neutral', name: 'roof' });
    put(s, box({ at: [22, 0, -6], size: [16, 14, 16], material: 'kraft', name: 'parcel' }));
    put(s, prism({ outline: [[0, 40], [20, 40], [20, 24], [10, 10], [0, 24]], origin: [32, 0, 40], plane: 'x', thickness: 6, material: 'teal', frontTone: 'teal-strong', name: 'tag' }));
    return { s, title: 'A home with a parcel and an address confidence tag', hero: 'tag' };
  },

  // Delivery Orchestration â€” depot to home along a ground route; the protected parcel on its way
  route() {
    const s = scene();
    s.groundPlate({ min: [-76, -54], max: [70, 30] });
    s.route({ points: [[-38, 0], [-14, 8], [14, -12], [38, -32]] });
    put(s, box({ at: [-70, 0, -22], size: [30, 26, 30], material: 'neutral', name: 'depot', details: [
      faceRect({ plane: 'x', at: -40, u: -16, v: 0, w: 18, h: 14, tone: 'surface-lowest' })] }));
    put(s, box({ at: [40, 0, -50], size: [24, 20, 24], material: 'neutral', name: 'home' }));
    s.prism({ outline: [[0, 20], [24, 20], [12, 32]], origin: [40, 0, -26], plane: 'x', thickness: 24, material: 'neutral', name: 'home-roof' });
    put(s, box({ at: [-8, 0, -6], size: [18, 16, 18], material: 'teal', name: 'parcel' }));
    return { s, title: 'A protected parcel routed from depot to home', hero: 'parcel' };
  },

  // InsureShield Shipping Insurance â€” the coverage shield on a plinth
  bigShield() {
    const s = scene();
    s.groundPlate({ min: [-54, -54], max: [54, 54] });
    put(s, cylinder({ center: [0, 0, 0], r: 40, h: 8, material: 'chalk', name: 'plinth', segments: 96 }));
    const sh = prism({ outline: SHIELD(48, 84), origin: [-24, 8, -4], plane: 'z', thickness: 12, material: 'teal', frontTone: 'teal-strong', name: 'shield' });
    sh.details = [faceRibbon({ plane: 'z', at: 8, points: [[-12, 60], [-3, 50], [12, 70]], w: 6, tone: 'teal-tint' })];
    put(s, sh);
    return { s, title: 'The InsureShield coverage shield', hero: 'shield' };
  },

  // Connect with a Partner â€” two platforms; the connector settles into place between them
  linkBlocks() {
    const s = scene();
    s.groundPlate({ min: [-70, -34], max: [66, 34] });
    put(s, box({ at: [-58, 0, -14], size: [30, 30, 30], material: 'neutral', name: 'platform' }));
    s.add(box({ at: [-28, 10, -4], size: [52, 8, 8], material: 'chalk', name: 'link', details: [
      faceLine({ plane: 'z', at: 4, from: [-20, 14], to: [16, 14], tone: 'teal-strong' })] }));
    put(s, box({ at: [24, 0, -14], size: [30, 30, 30], material: 'teal', name: 'insureshield' }));
    return { s, title: 'Two platforms connected', drop: ['link'] };
  },

  // Become a Partner â€” an office tower, an annex and a teal partner sign
  building() {
    const s = scene();
    s.groundPlate({ min: [-54, -44], max: [56, 44] });
    const rows = [12, 26, 40, 54];
    put(s, box({ at: [-42, 0, -30], size: [36, 72, 36], material: 'neutral', name: 'tower', details: [
      ...rows.map((v) => faceRect({ plane: 'x', at: -6, u: -26, v, w: 28, h: 7, tone: 'blue-light' })),
      ...rows.map((v) => faceRect({ plane: 'z', at: 6, u: -38, v, w: 28, h: 7, tone: 'blue-light' }))] }));
    put(s, box({ at: [4, 0, -20], size: [40, 28, 40], material: 'chalk', name: 'annex', details: [
      faceRect({ plane: 'x', at: 44, u: -4, v: 0, w: 12, h: 18, tone: 'outline-variant' })] }));
    s.add(box({ at: [14, 28, -10], size: [20, 12, 20], material: 'teal', name: 'sign' }));
    return { s, title: 'A partner office', hero: 'sign' };
  },

  // Resources (menu) + Announcements â€” sheets settling into a stack with a teal "new" tag
  docStack() {
    const s = scene();
    s.groundPlate({ min: [-52, -58], max: [44, 52] });
    put(s, box({ at: [-36, 0, -44], size: [60, 3, 80], material: 'chalk', name: 'sheet0' }));
    s.add(box({ at: [-34, 3, -46], size: [60, 3, 80], material: 'chalk', name: 'sheet1' }));
    s.add(box({ at: [-32, 6, -42], size: [60, 3, 80], material: 'chalk', name: 'sheet2', details: [
      faceRect({ plane: 'y', at: 9, u: -26, v: -34, w: 24, h: 4, tone: 'teal-strong' }),
      ...[0, 1, 2, 3].map((i) => faceRect({ plane: 'y', at: 9, u: -26, v: -22 + i * 12, w: i % 2 ? 30 : 42, h: 3, tone: 'outline-variant' }))] }));
    s.add(box({ at: [10, 9, 16], size: [14, 6, 14], material: 'teal', name: 'tag' }));
    return { s, title: 'A stack of announcements', drop: ['sheet1', 'sheet2', 'tag'] };
  },

  // Insights â€” bars on a base, the tallest in teal
  chart() {
    const s = scene();
    s.groundPlate({ min: [-60, -44], max: [60, 44] });
    put(s, box({ at: [-48, 0, -32], size: [96, 4, 64], material: 'chalk', name: 'base' }));
    [[-40, 20], [-18, 32], [4, 26]].forEach(([x, h], i) => s.add(box({ at: [x, 4, -8], size: [14, h, 14], material: 'neutral', name: 'bar' + i })));
    s.add(box({ at: [26, 4, -8], size: [14, 48, 14], material: 'teal', name: 'bar3' }));
    return { s, title: 'A rising insights chart', hero: 'bar3' };
  },

  // Whitepapers & Guides / In The News â€” a stack of guides, the top one teal
  document() {
    const s = scene();
    s.groundPlate({ min: [-54, -44], max: [40, 50] });
    put(s, box({ at: [-40, 0, -30], size: [48, 10, 60], material: 'chalk', name: 'guide0', details: [
      faceLine({ plane: 'x', at: 8, from: [-28, 5], to: [28, 5], tone: 'outline-variant' })] }));
    s.add(box({ at: [-36, 10, -28], size: [44, 8, 56], material: 'blue', name: 'guide1' }));
    s.add(box({ at: [-34, 18, -26], size: [40, 8, 52], material: 'teal', name: 'guide2', details: [
      faceRect({ plane: 'y', at: 26, u: -28, v: -20, w: 22, h: 4, tone: 'teal-tint' }),
      faceRect({ plane: 'y', at: 26, u: -28, v: -10, w: 14, h: 3, tone: 'teal-tint' })] }));
    return { s, title: 'A stack of guides', hero: 'guide2' };
  },

  // Partners (menu) + Customer Stories â€” a storefront; a parcel drops in for delivery
  storefront() {
    const s = scene();
    s.groundPlate({ min: [-58, -44], max: [58, 44] });
    put(s, box({ at: [-44, 0, -30], size: [56, 40, 48], material: 'neutral', name: 'store', details: [
      faceRect({ plane: 'x', at: 12, u: -24, v: 6, w: 18, h: 20, tone: 'blue-light' }),
      faceRect({ plane: 'x', at: 12, u: 2, v: 0, w: 12, h: 24, tone: 'surface-lowest' }),
      faceRect({ plane: 'z', at: 18, u: -38, v: 30, w: 36, h: 5, tone: 'teal-strong' })] }));
    s.add(box({ at: [12, 30, -30], size: [10, 4, 48], material: 'teal', name: 'awning' }));
    put(s, box({ at: [30, 0, 4], size: [18, 16, 18], material: 'kraft', name: 'parcel', details: [
      faceRect({ plane: 'y', at: 16, u: 30, v: 11, w: 18, h: 4, tone: 'kraft-light' })] }));
    return { s, title: 'A partner storefront receiving a parcel', drop: ['parcel'] };
  },

  // Help & Support / Contact Us â€” a floating speech bubble (lifted hatch)
  bubble() {
    const s = scene();
    s.groundPlate({ min: [-48, -48], max: [48, 48] });
    const b = prism({ outline: [[0, 52], [60, 52], [60, 20], [26, 20], [12, 6], [14, 20], [0, 20]], origin: [-6, 14, 30], plane: 'x', thickness: 10, material: 'teal', frontTone: 'teal-strong', name: 'bubble' });
    b.details = [16, 30, 44].map((u) => disc([4, 50, 30 - u], 4, 'x', 'teal-tint'));
    put(s, b);
    return { s, title: 'A speech bubble for support', hero: 'bubble' };
  },

  // Product Availability â€” a map with pins; the available region in teal
  mapPins() {
    const s = scene();
    s.groundPlate({ min: [-66, -50], max: [66, 50] });
    put(s, box({ at: [-56, 0, -40], size: [112, 4, 80], material: 'chalk', name: 'map', details: [
      faceRect({ plane: 'y', at: 4, u: -48, v: -32, w: 40, h: 28, tone: 'outline-variant' }),
      faceRect({ plane: 'y', at: 4, u: 4, v: -20, w: 44, h: 22, tone: 'teal-light' }),
      faceRect({ plane: 'y', at: 4, u: -30, v: 10, w: 32, h: 22, tone: 'outline-variant' })] }));
    const pin = (x, z, material, name) => s.add(prism({ outline: [[0, 26], [14, 26], [14, 16], [7, 4], [0, 16]], origin: [x, 0, z], plane: 'x', thickness: 4, material, frontTone: material === 'teal' ? 'teal-strong' : undefined, name }));
    pin(-30, -10, 'neutral', 'pin0'); pin(-12, 26, 'neutral', 'pin1'); pin(24, -2, 'teal', 'pin2');
    return { s, title: 'A map of where coverage is available', hero: 'pin2' };
  },

  // About (menu) â€” the InsureShield hub on a plinth, linked to the world by routes
  globePlinth() {
    const s = scene();
    s.groundPlate({ min: [-66, -60], max: [66, 60] });
    s.route({ points: [[-36, 22], [-58, 40]] });
    s.route({ points: [[30, -24], [44, -46]] });
    put(s, box({ at: [-64, 0, 32], size: [16, 14, 16], material: 'kraft', name: 'node-a' }));
    put(s, box({ at: [40, 0, -60], size: [16, 14, 16], material: 'neutral', name: 'node-b' }));
    put(s, cylinder({ center: [0, 0, 0], r: 34, h: 8, material: 'chalk', name: 'plinth', segments: 96 }));
    s.add(cylinder({ center: [0, 8, 0], r: 14, h: 26, material: 'teal', name: 'hub', segments: 96 }));
    return { s, title: 'The InsureShield hub', hero: 'hub' };
  }
};
