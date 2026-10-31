// InsureShield nav V4 illustrations, drawn from concepts/v4-*.json with iso.js.
//   RELIEF 24 "moment" scenes (Worry → Relief). The panel draws the scene, holds the worry for one beat
//          (colour on, coral or grey part showing, the subject layer lifted 4 units = unsettled), then plays
//          the relief: the worry part leaves, the teal outcome arrives, everything settles onto the ground.
//   DOOR   19 close-up storyboard frames (Doorstep moments), cropped by their frame. Pencil sketch at rest;
//          hover = colour + camera push-in + the one moment.
// Builders return { s, title, acts?, hero?, focus? } (focus = [dx, dy] px framing offset for the crop).
// Build AFTER setScale(): primitives project eagerly.
import { scene, box, prism, cylinder, faceRect, faceRibbon, actG, project } from './iso.js';
import { H } from './scenes.mjs';
import { H3 } from './scenes-v3.mjs';
const { put, shadowOnly, disc, medal, parcel, home, sheets, SHIELD } = H;
const { storefront, laptop, mailbox, door, cloud, twin, pathOn, STRIPES } = H3;

// ---------------------------------------------------------------- helpers (primitives only)
const plate = (s, [x0, z0], [x1, z1], name = 'plate', material = 'neutral', h = 3) => put(s, box({ at: [x0, 0, z0], size: [x1 - x0, h, z1 - z0], material, name }));
/** Shield in any material (H.shield always uses the teal front). */
const shieldM = ({ at: [x, y, z], w, h, t = 6, name, material = 'teal', check = material === 'teal' }) => {
  const sh = prism({ outline: SHIELD(w, h), origin: [x, y, z], plane: 'z', thickness: t, material, frontTone: material === 'teal' ? 'teal-strong' : undefined, name });
  if (check) { const cx = x + w / 2; sh.details = [faceRibbon({ plane: 'z', at: z + t, points: [[cx - w * 0.25, y + h * 0.62], [cx - w * 0.06, y + h * 0.5], [cx + w * 0.25, y + h * 0.74]], w: w * 0.11, tone: 'teal-tint' })]; }
  return sh;
};
/** Pin in any material, tip at (x, y, z) (H.pin is always teal). */
const pinM = ({ tip: [x, y, z], name, s = 1, material = 'teal' }) => prism({ outline: [[0, 26], [14, 26], [14, 16], [7, 4], [0, 16]].map(([u, v]) => [u * s, (v - 4) * s]), origin: [x - 2 * s, y, z + 7 * s], plane: 'x', thickness: 4 * s, material,
  frontTone: { teal: 'teal-strong', coral: 'coral-strong' }[material], name });
/** An empty ring (an open question): a standing disc with no mark. */
const ringM = ({ c: [x, y, z], r, name, material = 'ghost' }) => { const N = 32, o = Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return [r + r * Math.cos(a), r + r * Math.sin(a)]; });
  const m = prism({ outline: o, origin: [x - r, y - r, z], plane: 'z', thickness: 4, material, name }); m.details = [disc([x, y, z + 4], r * 0.55, 'z', 'surface-lowest')]; return m; };
const coins = (s, { x, z, n, y = 0, r = 11, h = 5, name = 'coin', material = 'teal', act, d0 = 0, from }) => { const acts = {};
  for (let i = 0; i < n; i++) { const o = cylinder({ center: [x, y + i * h, z], r, h, material, name: `${name}${i}` }); if (i === 0) put(s, o); else s.add(o); if (act) acts[`${name}${i}`] = { act, d: d0 + i, ...(from ? { from, slow: true } : {}) }; }
  return acts; };
const tapeTop = ([x, y, z], [w, h, d], d0) => actG({ act: 'in', d: d0 }, faceRect({ plane: 'y', at: y + h, u: x, v: z + d / 2 - d * 0.09, w, h: d * 0.18, tone: 'teal-strong' }));
const stripeDet = ([x, , z], [W, Hh, D], tone, gold) => { const v = Hh * 0.4, hh = Math.max(2, Hh * 0.18);
  const det = [faceRect({ plane: 'x', at: x + W, u: z, v, w: D, h: hh, tone }), faceRect({ plane: 'z', at: z + D, u: x, v, w: W, h: hh, tone })];
  if (gold) det.push(faceRect({ plane: 'x', at: x + W, u: z, v: v + hh, w: D, h: 1.2, tone: 'carrier-ups-gold' }), faceRect({ plane: 'z', at: z + D, u: x, v: v + hh, w: W, h: 1.2, tone: 'carrier-ups-gold' }));
  return det; };
const lines = (plane, at, u, v, w, n = 3, step = 7, tone = 'outline-variant') => Array.from({ length: n }, (_, i) => faceRect({ plane, at, u, v: v + i * step, w: i % 2 ? w * 0.6 : w, h: 2, tone }));
const standing = ({ at: [x, z], w = 30, h = 38, name, material = 'chalk', t = 3 }) => { const d = prism({ outline: [[0, 0], [w, 0], [w, h * 0.82], [w * 0.78, h], [0, h]], origin: [x, 0, z], plane: 'x', thickness: t, material, name });
  d.details = [0, 1, 2].map((i) => faceRect({ plane: 'x', at: x + t, u: z - w * 0.82, v: h * (0.7 - i * 0.15), w: w * (i ? 0.55 : 0.4), h: 1.6, tone: material === 'teal' ? 'teal-tint' : 'outline-variant' })); return d; };

const W = (title, build) => () => { const s = scene(); const acts = build(s) || {}; return { s, title, acts }; };

// ================================================================ W · Worry → Relief
export const RELIEF = {
  wInsurance: W('A kraft parcel under a coral mark turns teal and settles onto a policy plate', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    plate(s, [-42, -42], [42, 42]);
    const acts = twin(s, (m, n) => parcel({ at: [-20, 3, -20], size: [40, 36, 40], material: m, name: n }), 'parcel', 'kraft', 'teal');
    s.add(medal({ c: [0, 70, -8], r: 9, material: 'coral', mark: 'bar', name: 'risk' }));
    return { ...acts, risk: 'out' };
  }),
  wSolutions: W('Bars on a sheet; the tall coral bar is replaced by a short teal one', (s) => {
    s.groundPlate({ min: [-80, -60], max: [80, 60] });
    put(s, box({ at: [-66, 0, -40], size: [132, 3, 80], material: 'chalk', name: 'sheet', details: lines('y', 3, -56, 26, 40, 2, 8) }));
    [[-48, 30], [-20, 46], [36, 22]].forEach(([x, h], i) => put(s, box({ at: [x, 3, -8], size: [16, h, 16], material: 'kraft', name: `bar${i}` })));
    put(s, box({ at: [8, 3, -8], size: [16, 64, 16], material: 'coral', name: 'bar-risk' }));
    put(s, box({ at: [8, 3, -8], size: [16, 16, 16], material: 'teal', name: 'bar' }));
    return { 'bar-risk': 'out', bar: { act: 'in', d: 3, slow: true } };
  }),
  wPartners: W('A grey platform block with two empty sockets; two teal blocks seat into them', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    plate(s, [-56, -44], [56, 44]);
    put(s, box({ at: [-44, 3, -30], size: [88, 18, 60], material: 'neutral', name: 'platform', details: [
      faceRect({ plane: 'y', at: 21, u: -30, v: -14, w: 22, h: 22, tone: 'outline-default' }), faceRect({ plane: 'y', at: 21, u: 8, v: -14, w: 22, h: 22, tone: 'outline-default' })] }));
    put(s, box({ at: [-30, 21, -14], size: [22, 16, 22], material: 'teal', name: 'dockA' }));
    put(s, box({ at: [8, 21, -14], size: [22, 16, 22], material: 'teal', name: 'dockB' }));
    return { dockA: { act: 'move', from: [0, 26, 0], d: 0, slow: true }, dockB: { act: 'move', from: [0, 34, 0], d: 3, slow: true } };
  }),
  wResources: W('A teal pin lands at the start of a dashed route that leads to a stack of guides', (s) => {
    s.groundPlate({ min: [-90, -60], max: [80, 60] });
    s.route({ points: [[-62, 36], [-36, 14], [-6, 2], [20, -16], [40, -30]], act: 'in', d0: 2 });
    put(s, pinM({ tip: [-64, 0, 38], name: 'pin', s: 1.4 }));
    sheets(s, { at: [36, -64], w: 38, d: 46, n: 4 });
    return { pin: { act: 'in move', from: [0, 30, 0], slow: true } };
  }),
  wAbout: W('A large teal shield rises behind a row of small homes', (s) => {
    s.groundPlate({ min: [-90, -60], max: [90, 60] });
    [-64, -30, 4, 38].forEach((x, i) => home(s, { at: [x, 14], w: 22, h: 16, d: 22, roof: 10, name: `home${i}` }));
    put(s, shieldM({ at: [-34, 0, -40], w: 58, h: 96, t: 8, name: 'shield' }));
    return { shield: { act: 'in move', from: [0, -24, 0], d: 2, slow: true } };
  }),
  wSelect: W('Three grey shields around a parcel; two fade and the middle one turns teal', (s) => {
    s.groundPlate({ min: [-80, -60], max: [80, 60] });
    plate(s, [-62, -42], [62, 42]);
    put(s, shieldM({ at: [-58, 3, -30], w: 28, h: 46, name: 'optA', material: 'neutral' }));
    put(s, shieldM({ at: [30, 3, -30], w: 28, h: 46, name: 'optC', material: 'neutral' }));
    shadowOnly(s, shieldM({ at: [-14, 3, -30], w: 28, h: 46, name: 'fit', material: 'neutral' }));
    s.add(shieldM({ at: [-14, 3, -30], w: 28, h: 46, name: 'fit-rest', material: 'neutral' }));
    s.add(shieldM({ at: [-14, 3, -30], w: 28, h: 46, name: 'fit' }));
    put(s, parcel({ at: [-12, 3, 4], size: [24, 22, 24], name: 'parcel' }));
    return { optA: 'out', optC: 'out', 'fit-rest': 'out', fit: { act: 'in', d: 2 } };
  }),
  wQuote: W('Three parcels on a plate beside a ghost coin stack that fills teal coin by coin', (s) => {
    s.groundPlate({ min: [-80, -60], max: [80, 60] });
    plate(s, [-70, -30], [-6, 34]);
    [[-62, 4], [-40, -22], [-38, 6]].forEach(([x, z], i) => put(s, parcel({ at: [x, 3, z], size: [20, 18, 20], name: `p${i}` })));
    const ghost = coins(s, { x: 30, z: -6, n: 5, name: 'g', material: 'ghost', act: 'out' });
    const teal = coins(s, { x: 30, z: -6, n: 5, name: 'coin', act: 'in', d0: 1 });
    return { ...ghost, ...teal };
  }),
  wMulti: W('Four carrier-striped parcels move from four small plates onto one long teal plate', (s) => {
    s.groundPlate({ min: [-90, -50], max: [90, 50] });
    const xs = [-70, -32, 6, 44], acts = {};
    xs.forEach((x, i) => { put(s, box({ at: [x - 3, 0, -14], size: [26, 3, 26], material: 'neutral', name: `own${i}` })); acts[`own${i}`] = 'out'; });
    put(s, box({ at: [-76, 0, -16], size: [148, 3, 30], material: 'teal', name: 'plate' }));
    acts.plate = { act: 'in', d: 2, slow: true };
    xs.forEach((x, i) => put(s, parcel({ at: [x, 3, -11], size: [20, 18, 20], name: `c${i}`, details: stripeDet([x, 3, -11], [20, 18, 20], STRIPES[i], i === 0) })));
    return acts;
  }),
  wUps: W('A home with a coral mark at its door; the mark is replaced by a teal coin stack', (s) => {
    s.groundPlate({ min: [-80, -70], max: [80, 50] });
    home(s, { at: [-52, -56], w: 44, h: 34, d: 48, roof: 20, name: 'home' });
    put(s, box({ at: [-8, 0, -46], size: [30, 2, 28], material: 'neutral', name: 'step' }));
    s.add(medal({ c: [8, 44, -32], r: 10, material: 'coral', mark: 'bar', name: 'risk' }));
    return { risk: 'out', ...coins(s, { x: 8, z: -32, n: 4, y: 2, act: 'in move', from: [0, 10, 0], d0: 2 }) };
  }),
  wSpecial: W('A blue item balanced on a kraft parcel; a teal plate slides underneath as the coral mark fades', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    put(s, box({ at: [-40, 0, -40], size: [80, 3, 80], material: 'teal', name: 'plate' }));
    put(s, parcel({ at: [-18, 3, -18], size: [36, 28, 36], name: 'parcel' }));
    put(s, box({ at: [-8, 31, -8], size: [16, 16, 16], material: 'blue', name: 'item' }));
    s.add(medal({ c: [36, 46, -30], r: 9, material: 'coral', mark: 'bar', name: 'risk' }));
    return { risk: 'out', plate: { act: 'in move', from: [-30, 0, 30], d: 1, slow: true }, item: { act: 'move', from: [9, 5, -4], d: 4, slow: true } };
  }),
  wDefense: W('A parcel waits on the left while a coral pin over a home turns teal and lands', (s) => {
    s.groundPlate({ min: [-90, -70], max: [80, 60] });
    put(s, parcel({ at: [-76, 0, 18], size: [26, 24, 26], name: 'parcel' }));
    home(s, { at: [-6, -56], w: 40, h: 30, d: 40, roof: 18, name: 'home' });
    s.add(pinM({ tip: [12, 74, -36], name: 'pin-risk', s: 1.3, material: 'coral' }));
    put(s, pinM({ tip: [12, 50, -36], name: 'pin', s: 1.3 }));
    return { 'pin-risk': 'out', pin: { act: 'in move', from: [0, 24, 0], d: 2, slow: true } };
  }),
  wOrchestrate: W('A parcel slides from under a coral cloud onto a teal plate', (s) => {
    s.groundPlate({ min: [-90, -60], max: [80, 60] });
    const pl = twin(s, (m, n) => box({ at: [10, 0, -40], size: [56, 3, 56], material: m, name: n }), 'plate', 'neutral', 'teal');
    const cl = twin(s, (m, n) => cloud({ at: [-92, 66, 30], w: 56, h: 30, name: n, material: m }), 'cloud', 'coral', 'chalk');
    put(s, parcel({ at: [26, 3, -24], size: [26, 24, 26], name: 'parcel' }));
    return { ...pl, ...cl, parcel: { act: 'move', from: [-80, -3, 56], d: 1, slow: true } };
  }),
  wCommerce: W('A laptop with a coral mark above it; the mark becomes a teal check ring', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    laptop(s, { x: -24, z: -26, w: 56, d: 52, name: 'laptop' });
    s.add(medal({ c: [-6, 78, -6], r: 12, material: 'coral', mark: 'bar', name: 'risk' }));
    s.add(medal({ c: [-6, 78, -6], r: 14, name: 'ring' }));
    return { risk: 'out', ring: { act: 'in', d: 2 } };
  }),
  wInsureShield: W('A crushed coral parcel is replaced by a full teal parcel in front of a shield', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    put(s, shieldM({ at: [-30, 0, -50], w: 54, h: 88, name: 'shield', material: 'ghost', check: false }));
    shadowOnly(s, parcel({ at: [-16, 0, -6], size: [40, 38, 40], name: 'parcel' }));
    s.add(parcel({ at: [-16, 0, -6], size: [40, 14, 40], material: 'coral', name: 'crushed' }));
    s.add(parcel({ at: [-16, 0, -6], size: [40, 38, 40], material: 'teal', name: 'parcel' }));
    return { crushed: 'out', parcel: { act: 'in', d: 2, slow: true } };
  }),
  wConnect: W('Loose sheets beside a laptop fade as a teal block seats onto it', (s) => {
    s.groundPlate({ min: [-80, -60], max: [80, 60] });
    laptop(s, { x: 0, z: -34, w: 56, d: 52, name: 'laptop' });
    [[-70, 18, 0], [-62, 6, 6], [-74, -6, 12]].forEach(([x, z, y], i) => put(s, box({ at: [x, y, z], size: [30, 2, 22], material: 'chalk', name: `loose${i}` })));
    put(s, box({ at: [36, 3, 2], size: [14, 10, 14], material: 'teal', name: 'dock' }));
    return { loose0: 'out', loose1: { act: 'out', d: 1 }, loose2: { act: 'out', d: 2 }, dock: { act: 'in move', from: [0, 22, 0], d: 3, slow: true } };
  }),
  wBecome: W('A storefront with a row of parcels; each gets teal tape as a coral mark fades', (s) => {
    s.groundPlate({ min: [-90, -70], max: [90, 50] });
    storefront(s, { x: -70, z: -64, w: 44, h: 40, d: 50, name: 'store' });
    [[-10, 2], [14, -6], [38, -14], [62, -22]].forEach(([x, z], i) => { const at = [x, 0, z], size = [18, 16, 18]; put(s, parcel({ at, size, name: `p${i}`, details: [tapeTop(at, size, i + 1)] })); });
    s.add(medal({ c: [0, 34, 10], r: 8, material: 'coral', mark: 'bar', name: 'risk' }));
    return { risk: 'out' };
  }),
  wHelp: W('A document standing on a plate; the grey ring above it becomes a teal check ring', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    plate(s, [-44, -40], [44, 40]);
    put(s, standing({ at: [-10, 24], w: 46, h: 58, name: 'doc' }));
    s.add(ringM({ c: [-4, 84, -6], r: 14, name: 'ask' }));
    s.add(medal({ c: [-4, 84, -6], r: 14, name: 'ring' }));
    return { ask: 'out', ring: { act: 'in', d: 2 } };
  }),
  wStories: W('Three storefronts, each joined by a teal coin stack that rises in turn', (s) => {
    s.groundPlate({ min: [-100, -70], max: [100, 60] });
    const acts = {};
    [[-84, -10], [-26, -26], [32, -42]].forEach(([x, z], i) => { storefront(s, { x, z, w: 30, h: 28, d: 34, name: `store${i}` });
      Object.assign(acts, coins(s, { x: x + 44, z: z + 26, n: 3, r: 8, h: 5, name: `c${i}-`, act: 'in move', from: [0, 10, 0], d0: i * 3 })); });
    return acts;
  }),
  wInsights: W('A teal sheet lands under a coral cloud, which turns grey', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    const cl = twin(s, (m, n) => cloud({ at: [-34, 70, -10], w: 64, h: 34, name: n, material: m }), 'cloud', 'coral', 'chalk');
    put(s, box({ at: [-24, 0, -22], size: [52, 3, 44], material: 'teal', name: 'sheet', details: lines('y', 3, -16, -12, 30, 3, 9, 'teal-tint') }));
    return { ...cl, sheet: { act: 'in move', from: [0, 26, 0], d: 1, slow: true } };
  }),
  wGuides: W('Hovering sheets settle into a stepped stack with a teal sheet on top', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    plate(s, [-50, -46], [50, 46]);
    const acts = {};
    [[-36, 72, 'chalk'], [-28, 58, 'chalk'], [-20, 44, 'chalk']].forEach(([o, w, m], i) => { const y = 3 + i * 6, n = `s${i}`;
      (i ? s.add.bind(s) : (o2) => put(s, o2))(box({ at: [o, y, o], size: [w, 6, w], material: m, name: n })); acts[n] = { act: 'move', from: [0, 8 + i * 8, 0], d: i, slow: true }; });
    const top = twin(s, (m, n) => box({ at: [-12, 21, -12], size: [30, 4, 30], material: m, name: n, details: lines('y', 25, -6, -6, 18, 3, 6, m === 'teal' ? 'teal-tint' : 'outline-variant') }), 'top', 'chalk', 'teal');
    return { ...acts, ...top, 'top-rest': { act: 'out move', from: [0, 34, 0], slow: true, d: 3 }, top: { act: 'in move', from: [0, 34, 0], slow: true, d: 3 } };
  }),
  wAnnounce: W('A row of standing sheets on a plate; a teal sheet slides in at the front', (s) => {
    s.groundPlate({ min: [-80, -60], max: [80, 60] });
    plate(s, [-62, -40], [62, 40]);
    [-46, -26, -6].forEach((x, i) => put(s, standing({ at: [x, 20], w: 34, h: 46, name: `sheet${i}` })));
    put(s, standing({ at: [16, 20], w: 34, h: 46, name: 'new', material: 'teal' }));
    return { new: { act: 'in move', from: [28, 0, 0], d: 1, slow: true } };
  }),
  wNews: W('A stack of printed sheets with a teal shield rising behind it', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    put(s, shieldM({ at: [-20, 0, -52], w: 50, h: 82, name: 'shield' }));
    sheets(s, { at: [-34, -6], w: 52, d: 40, n: 5, t: 3 });
    return { shield: { act: 'in move', from: [0, -20, 0], d: 1, slow: true } };
  }),
  wAvail: W('A pin lands on a puck, which turns teal', (s) => {
    s.groundPlate({ min: [-70, -60], max: [70, 60] });
    plate(s, [-48, -40], [48, 40]);
    const pk = twin(s, (m, n) => cylinder({ center: [0, 3, 0], r: 24, h: 6, material: m, name: n }), 'puck', 'neutral', 'teal');
    s.add(pinM({ tip: [0, 34, 0], name: 'pin-rest', s: 1.4, material: 'ghost' }));
    put(s, pinM({ tip: [0, 9, 0], name: 'pin', s: 1.4 }));
    return { ...pk, 'pin-rest': 'out', pin: { act: 'in move', from: [0, 25, 0], d: 1, slow: true } };
  }),
  wContact: W('A grey mailbox beside a door turns teal and raises its flag', (s) => {
    s.groundPlate({ min: [-80, -70], max: [70, 50] });
    door(s, { x: -56, z: -52, name: 'door', h: 64 });
    mailbox(s, { x: 18, z: -4, name: 'mbox-rest', mat: 'neutral', flag: 'down', k: 1.5 });
    mailbox(s, { x: 18, z: -4, name: 'mbox', mat: 'teal', flag: 'act', k: 1.5, post: false });
    return { 'mbox-rest': 'out', mbox: 'in' };
  })
};

// ================================================================ D · Doorstep moments (close-up, cropped)
// The ground plate is fitted to the objects (+ a margin), so the frame's fit follows the subject and the
// plate's edges fall outside the crop: the floor reads as continuing past the frame.
const F = (title, build, focus = [0, 0], zoom = 1) => () => { const s = scene(); const acts = build(s) || {};
  const ob = s.items.filter((o) => o.kind === 'object' && o.bounds), x0 = Math.min(...ob.map((o) => o.bounds.min[0])), x1 = Math.max(...ob.map((o) => o.bounds.max[0])),
    z0 = Math.min(...ob.map((o) => o.bounds.min[2])), z1 = Math.max(...ob.map((o) => o.bounds.max[2]));
  s.items.unshift(s.groundPlate({ min: [x0 - 24, z0 - 24], max: [x1 + 24, z1 + 24] }).items.pop());
  return { s, title, acts, focus, zoom }; };
/** Back wall with a door on its lit face (doorstep frames). */
const wall = (s, { x, z, d = 110, h = 120, name = 'wall' }) => put(s, box({ at: [x, 0, z], size: [10, h, d], material: 'neutral', name, details: [
  faceRect({ plane: 'x', at: x + 10, u: z + d * 0.3, v: 0, w: d * 0.4, h: h * 0.78, tone: 'surface-lowest' }), faceRect({ plane: 'x', at: x + 10, u: z + d * 0.62, v: h * 0.38, w: 3, h: 3, tone: 'outline-default' })] }));
export const DOOR = {
  dSelect: F('Close-up of a question sheet whose three rings tick, the last in teal', (s) => {
    const det = [], acts = {};
    [0, 1, 2].forEach((i) => { const z = -40 + i * 30; det.push(...lines('y', 3, -6, z - 3, 40, 1)); });
    put(s, box({ at: [-60, 0, -60], size: [110, 3, 110], material: 'chalk', name: 'sheet', details: det }));
    [0, 1, 2].forEach((i) => { const z = -38 + i * 30, n = `ring${i}`, last = i === 2;
      const r = cylinder({ center: [-30, 3, z], r: 9, h: 2, material: last ? 'teal' : 'neutral', name: n });
      r.details = [actG({ act: 'in', d: i * 2 }, faceRibbon({ plane: 'y', at: 5, points: [[-35, z], [-31, z + 4], [-24, z - 4]], w: 2.4, tone: last ? 'teal-tint' : 'surface-lowest' }))];
      s.add(r); });
    return acts;
  }, [10, 0], 1.7),
  dQuote: F('Close-up of a parcel corner with a teal coin landing on a short stack', (s) => {
    put(s, parcel({ at: [-110, 0, -40], size: [80, 70, 80], name: 'parcel' }));
    return coins(s, { x: 22, z: 26, n: 4, r: 18, h: 7, name: 'coin', act: 'in move', from: [0, 30, 0], d0: 3 });
  }, [20, 10]),
  dMulti: F('A pile of carrier-striped parcels on a doorstep, each sealed with teal tape', (s) => {
    wall(s, { x: -84, z: -84, h: 110 });
    const P = [[-40, 0, -20, 34], [-2, 0, -30, 30], [-30, 0, 18, 30], [-30, 34, -18, 26]];
    P.forEach(([x, y, z, k], i) => { const at = [x, y, z], size = [k, k * 0.9, k]; const o = parcel({ at, size, name: `p${i}`, details: [...stripeDet(at, size, STRIPES[i], i === 0), tapeTop(at, size, i * 2)] }); y ? s.add(o) : put(s, o); });
    return {};
  }, [16, 8]),
  dUps: F('Close-up of a UPS-banded parcel on a doormat that turns teal', (s) => {
    wall(s, { x: -90, z: -76, h: 120 });
    put(s, box({ at: [-60, 0, -50], size: [70, 2, 96], material: 'neutral', name: 'mat' }));
    const at = [-38, 2, -24], size = [46, 40, 46];
    shadowOnly(s, parcel({ at, size, name: 'ups' }));
    s.add(parcel({ at, size, name: 'ups-rest', details: stripeDet(at, size, 'carrier-ups', true) }));
    s.add(parcel({ at, size, material: 'teal', name: 'ups', details: stripeDet(at, size, 'carrier-ups', true) }));
    return { 'ups-rest': 'out', ups: 'in' };
  }, [10, 0]),
  dSpecial: F('Close-up of a blue safe whose door slides open as the plate beneath turns teal', (s) => {
    const pl = twin(s, (m, n) => box({ at: [-60, 0, -60], size: [120, 4, 120], material: m, name: n }), 'plate', 'neutral', 'teal');
    put(s, box({ at: [-36, 4, -36], size: [70, 70, 70], material: 'blue', name: 'safe', details: [faceRect({ plane: 'x', at: 34, u: -28, v: 14, w: 54, h: 52, tone: 'teal-light' })] }));
    s.add(box({ at: [34, 12, -30], size: [4, 56, 58], material: 'blue', name: 'safe-door', details: [disc([38, 40, -6], 6, 'x', 'blue-strong')] }));
    return { ...pl, 'safe-door': { act: 'move', from: [0, 0, 30], d: 1, slow: true } };
  }, [10, 4]),
  dDefense: F('Close-up of a parcel label with a teal pin landing on it', (s) => {
    const label = box({ at: [-20, 50, -30], size: [44, 1.5, 56], material: 'chalk', name: 'label', details: lines('y', 51.5, -12, -20, 26, 3, 9) });
    put(s, parcel({ at: [-60, 0, -60], size: [110, 50, 110], name: 'parcel' })); s.add(label);
    put(s, pinM({ tip: [6, 51.5, 10], name: 'pin', s: 2 }));
    return { pin: { act: 'in move', from: [0, 34, 0], d: 1, slow: true } };
  }, [6, 0]),
  dOrchestrate: F('Close-up of a route forking from a parcel, the teal branch reaching a mailbox', (s) => {
    put(s, parcel({ at: [-96, 0, 30], size: [36, 32, 36], name: 'parcel' }));
    s.route({ points: [[-52, 30], [-10, 10], [40, 40], [90, 70]], tone: 'outline-variant', width: 2.4 });
    s.route({ points: [[-52, 30], [-14, 6], [20, -24], [44, -46]], act: 'in', width: 2.4 });
    mailbox(s, { x: 56, z: -60, name: 'mbox', mat: 'neutral', flag: 'down', k: 1.6 });
    return {};
  }, [0, 0]),
  dCommerce: F('Close-up of a laptop with a teal check ring rising from the screen', (s) => {
    laptop(s, { x: -30, z: -50, w: 90, d: 90, name: 'laptop' });
    s.add(medal({ c: [-14, 116, -6], r: 18, name: 'ring' }));
    return { ring: { act: 'in move', from: [0, -18, 0], d: 1, slow: true } };
  }, [0, 0]),
  dInsureShield: F('Close-up of a parcel with a large teal shield rising behind it', (s) => {
    put(s, shieldM({ at: [-50, 0, -70], w: 90, h: 140, t: 10, name: 'shield' }));
    put(s, parcel({ at: [-20, 0, -14], size: [66, 58, 66], name: 'parcel' }));
    return { shield: { act: 'in move', from: [0, -30, 0], d: 1, slow: true } };
  }, [0, 0]),
  dConnect: F('Close-up of a laptop edge with a teal block seating against it', (s) => {
    laptop(s, { x: -60, z: -60, w: 100, d: 100, name: 'laptop' });
    put(s, box({ at: [40, 0, -14], size: [26, 16, 30], material: 'teal', name: 'dock' }));
    return { dock: { act: 'move', from: [24, 0, 0], d: 1, slow: true } };
  }, [-30, 20]),
  dBecome: F('Close-up of a storefront whose window shows a teal shield', (s) => {
    const x = -60, z = -70, w = 70, h = 84, d = 110;
    const acts = storefront(s, { x, z, w, h, d, name: 'store', awning: 'twin' });
    const store = s.items.find((o) => o.name === 'store'), u0 = z + d * 0.1 + d * 0.21, v0 = h * 0.28 + h * 0.05, k = 0.36;
    store.details.push(actG({ act: 'in', d: 2 }, pathOn(SHIELD(28 * k * 2, 46 * k * 2).map(([u, v]) => [x + w, v0 + v, u0 + 14 * k * 2 - u]), 'teal-strong')));
    put(s, parcel({ at: [22, 0, 20], size: [30, 26, 30], name: 'parcel' }));
    return acts;
  }, [10, 10]),
  dHelp: F('Close-up of a stack of sheets with a teal sheet sliding out', (s) => {
    const t = sheets(s, { at: [-60, -60], w: 100, d: 110, n: 4, t: 5, lines: false });
    s.add(box({ at: [-50, t, -50], size: [90, 4, 96], material: 'teal', name: 'answer', details: lines('y', t + 4, -36, -30, 50, 3, 12, 'teal-tint') }));
    return { answer: { act: 'move', from: [-34, 0, -10], d: 1, slow: true } };
  }, [6, 10], 1.2),
  dStories: F('Close-up of a storefront step with a teal coin stack rising beside it', (s) => {
    storefront(s, { x: -90, z: -70, w: 60, h: 90, d: 100, name: 'store' });
    put(s, box({ at: [-30, 0, -54], size: [18, 6, 60], material: 'neutral', name: 'step' }));
    return coins(s, { x: 26, z: 18, n: 4, r: 18, h: 7, act: 'in move', from: [0, -8, 0] });
  }, [10, 10]),
  dInsights: F('Close-up of a sheet with bars, the tallest turning teal', (s) => {
    put(s, box({ at: [-80, 0, -60], size: [150, 3, 120], material: 'chalk', name: 'sheet' }));
    [[-60, 30], [-30, 46], [30, 38]].forEach(([x, h], i) => put(s, box({ at: [x, 3, -10], size: [22, h, 22], material: 'kraft', name: `bar${i}` })));
    return twin(s, (m, n) => box({ at: [0, 3, -10], size: [22, 72, 22], material: m, name: n }), 'tall', 'kraft', 'teal');
  }, [0, 14]),
  dGuides: F('Close-up of two open sheets with a teal tab sliding out between them', (s) => {
    plate(s, [-100, -90], [100, 90], 'desk', 'neutral', 2);
    put(s, box({ at: [-70, 2, -60], size: [66, 4, 110], material: 'chalk', name: 'left', details: lines('y', 6, -60, -40, 44, 5, 12) }));
    put(s, box({ at: [-2, 2, -60], size: [66, 4, 110], material: 'chalk', name: 'right', details: lines('y', 6, 8, -40, 44, 5, 12) }));
    s.add(box({ at: [-10, 6, -76], size: [12, 2, 30], material: 'teal', name: 'tab' }));
    return { tab: { act: 'in move', from: [0, 0, 18], d: 1, slow: true } };
  }, [0, 0], 1.5),
  dAnnounce: F('Close-up of a doorstep where a teal sheet lands on the mat', (s) => {
    wall(s, { x: -90, z: -76, h: 120 });
    put(s, box({ at: [-60, 0, -50], size: [74, 2, 100], material: 'neutral', name: 'mat' }));
    put(s, box({ at: [-36, 2, -20], size: [40, 3, 52], material: 'teal', name: 'news', details: lines('y', 5, -30, -12, 26, 3, 10, 'teal-tint') }));
    return { news: { act: 'in move', from: [0, 40, 0], d: 1, slow: true } };
  }, [10, 6]),
  dNews: F('Close-up of printed sheets with a teal shield stamped on the top one', (s) => {
    const t = sheets(s, { at: [-60, -60], w: 110, d: 110, n: 5, t: 4, lines: false });
    const top = s.items.filter((o) => o.kind === 'object').pop(), sx = 0.9;
    top.details = [...lines('y', t, -50, -50, 40, 6, 12), actG({ act: 'in', d: 2 }, pathOn(SHIELD(36 * sx, 50 * sx).map(([u, v]) => [10 + u, t, -46 + (50 * sx - v)]), 'teal-strong'))];
    return {};
  }, [6, 10], 1.45),
  dAvail: F('Close-up of a row of pucks; a pin lands on the nearest, which turns teal', (s) => {
    [[-100, -60], [-58, -34]].forEach(([x, z], i) => put(s, cylinder({ center: [x, 0, z], r: 20, h: 6, material: 'neutral', name: `far${i}` })));
    const pk = twin(s, (m, n) => cylinder({ center: [0, 0, 6], r: 34, h: 8, material: m, name: n }), 'puck', 'neutral', 'teal');
    put(s, pinM({ tip: [0, 8, 6], name: 'pin', s: 2.2 }));
    return { ...pk, pin: { act: 'in move', from: [0, 36, 0], d: 1, slow: true } };
  }, [20, 6]),
  dContact: F('Close-up of a teal mailbox at the curb in front of a home, flag rising', (s) => {
    home(s, { at: [-110, -100], w: 70, h: 56, d: 80, roof: 30, name: 'home' });
    mailbox(s, { x: 20, z: 10, name: 'mbox', mat: 'teal', flag: 'act', k: 2.6 });
    return {};
  }, [20, 30])
};
