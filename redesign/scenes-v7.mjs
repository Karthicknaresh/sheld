// InsureShield nav V7 — art for the APPROVED Stage layout (360 × 268 panel), drawn from concepts/v7-*.json.
//   OVERVIEW_A  5 menu overviews for Option A · Light up the dream (the 19 option stories are DREAM in scenes-v6.mjs)
//   THREAD      24 stories for Option B · Thread of care: a teal thread (a dashed ground route) draws through the
//               scene; every object takes its colour as the thread reaches it (beats 0 → 1 → 2).
// acts: { name: { b, ab?, act?, from?, d?, slow? } } — see scenes-v6.mjs for the beat grammar.
import { box, cylinder, prism, faceRect, actG, routeDetail } from './iso.js';
import { H } from './scenes.mjs';
import { H6 } from './scenes-v6.mjs';
const { put, shadowOnly, medal, parcel, sheets } = H;
const { home, shop, stripes, tealTape, shieldM, pinM, W } = H6;

/** the thread: a teal ground route that draws dash by dash on beat b (d0 = where in the beat it starts) */
const thread = (s, points, b, d0 = 0) => s.route({ points, act: 'in', b, d0, width: 2.4, dash: 6, gap: 4 });
const CLOUD = [[0, 0], [40, 0], [40, 8], [34, 18], [24, 22], [12, 18], [4, 12], [0, 6]];
const doc = (s, [x, z], name, h = 28) => { const d = prism({ outline: [[0, 0], [22, 0], [22, h * 0.8], [16, h], [0, h]], origin: [x, 0, z], plane: 'x', thickness: 3, material: 'chalk', name });
  d.details = [0, 1, 2].map((i) => faceRect({ plane: 'x', at: x + 3, u: z - 18, v: h * (0.68 - i * 0.16), w: i ? 8 : 12, h: 1.4, tone: 'outline-variant' })); put(s, d); return d; };
function mailbox(s, { x, z, name, b = 0, flagBeat = 2, k = 1 }) {
  const Y = 26 * k; put(s, box({ at: [x - 2 * k, 0, z - 2 * k], size: [4 * k, Y, 4 * k], material: 'neutral', name: name + '-post' }));
  const f = z + 8 * k, down = [faceRect({ plane: 'z', at: f, u: x - 9 * k, v: Y + 7 * k, w: 18 * k, h: 3 * k, tone: 'surface-lowest' })], up = [faceRect({ plane: 'z', at: f, u: x + 6 * k, v: Y + 7 * k, w: 3 * k, h: 18 * k, tone: 'surface-lowest' }), faceRect({ plane: 'z', at: f, u: x + 9 * k, v: Y + 19 * k, w: 8 * k, h: 6 * k, tone: 'surface-lowest' })];
  put(s, box({ at: [x - 14 * k, Y, z - 8 * k], size: [28 * k, 16 * k, 16 * k], material: 'teal', name, details: [actG({ act: 'out', b: flagBeat }, ...down), actG({ act: 'in', b: flagBeat }, ...up)] }));
  return { [name + '-post']: { b }, [name]: { b } };
}
const laptop = (s, [x, z], name, b = 0) => { put(s, box({ at: [x, 0, z], size: [40, 4, 36], material: 'neutral', name: name + '-base', details: [faceRect({ plane: 'y', at: 4, u: x + 5, v: z + 5, w: 30, h: 24, tone: 'surface-lowest' })] }));
  put(s, box({ at: [x - 3, 0, z], size: [3, 30, 36], material: 'chalk', name: name + '-screen', details: [faceRect({ plane: 'x', at: x, u: z + 4, v: 5, w: 28, h: 20, tone: 'outline-variant' })] }));
  return { [name + '-base']: { b }, [name + '-screen']: { b } }; };

// ================================================================ Option A — menu overviews (Light up the dream)
export const OVERVIEW_A = {
  oInsurance: W('Three homes light up and the parcel at each door turns teal', (s) => {
    const acts = {};
    [[-90, 10], [-30, -20], [30, -50]].forEach(([x, z], i) => { Object.assign(acts, home(s, { at: [x, z - 30], w: 30, h: 22, d: 30, roof: 14, name: `home${i}`, b: 0, lit: 0 }));
      for (const k of Object.keys(acts)) if (k.startsWith(`home${i}`)) acts[k] = { b: 0, d: i * 4 };
      const a = [x + 34, 0, z - 6], sz = [12, 11, 12]; s.add(parcel({ at: a, size: sz, name: `kraft${i}` })); put(s, parcel({ at: a, size: sz, material: 'teal', name: `teal${i}` }));
      acts[`kraft${i}`] = { act: 'in move', from: [0, 18, 0], b: 1, d: i * 4, slow: true }; acts[`teal${i}`] = { act: 'in', b: 2, d: i * 4 }; });
    return acts;
  }),
  oSolutions: W('A home on a plate lights up; a coral cloud fades and the plate turns teal', (s) => {
    s.add(box({ at: [-60, 0, -60], size: [120, 3, 110], material: 'neutral', name: 'plate-rest' })); put(s, box({ at: [-60, 0, -60], size: [120, 3, 110], material: 'teal', name: 'plate' }));
    const acts = home(s, { at: [-30, -40], w: 44, h: 32, d: 48, roof: 20, name: 'home' });
    for (const k of Object.keys(acts)) acts[k] = { b: 0 };
    s.add(prism({ outline: CLOUD.map(([u, v]) => [u * 1.3, v * 1.3]), origin: [-80, 70, 20], plane: 'z', thickness: 8, material: 'coral', name: 'cloud' }));
    return { ...acts, 'plate-rest': { act: 'out', b: 2 }, plate: { act: 'in', b: 2 }, cloud: { act: 'out', b: 0, ab: 2 } };
  }),
  oPartners: W('A shop and a laptop light up and a teal block seats between them', (s) => {
    const acts = { ...shop(s, { at: [-90, -40], w: 36, h: 30, d: 44, name: 'shop' }), ...laptop(s, [20, -10], 'lap') };
    put(s, box({ at: [-28, 0, -10], size: [40, 3, 26], material: 'neutral', name: 'dock-plate' }));
    put(s, box({ at: [-16, 3, -4], size: [16, 12, 16], material: 'teal', name: 'dock' }));
    return { ...acts, 'dock-plate': { b: 1 }, dock: { act: 'in move', from: [0, 30, 0], b: 1, slow: true } };
  }),
  oResources: W('A home with one lit window; a stack of guides arrives, the top one teal', (s) => {
    const acts = home(s, { at: [-80, -50], w: 44, h: 32, d: 48, roof: 20, name: 'home', windows: 1 });
    const t = sheets(s, { at: [-10, -6], w: 34, d: 28, n: 3, t: 4, name: 'g', lines: false });
    put(s, box({ at: [-9, t, -5], size: [32, 4, 26], material: 'teal', name: 'top', details: [0, 1, 2].map((i) => faceRect({ plane: 'y', at: t + 4, u: -4, v: 0 + i * 6, w: i ? 12 : 18, h: 1.6, tone: 'teal-tint' })) }));
    for (let i = 0; i < 3; i++) acts[`g${i}`] = { act: 'in move', from: [0, 24, 0], b: 1, d: i * 2, slow: true };
    return { ...acts, top: { act: 'in move', from: [0, 20, 0], b: 2, slow: true } };
  }),
  oAbout: W('A building lights up floor by floor; its awning turns teal beside a mailbox', (s) => {
    const det = []; for (let f = 0; f < 3; f++) for (let i = 0; i < 3; i++) det.push(...H6_panes(f, i));
    function H6_panes(f, i) { const x = -40, w = 50, d = 56, v = 10 + f * 22; return [actG({ act: 'out', b: 0, d: f * 6 + i }, faceRect({ plane: 'x', at: x + w, u: -40 + 6 + i * 17, v, w: 11, h: 12, tone: 'charcoal-strong' })), actG({ act: 'in', b: 0, d: f * 6 + i }, faceRect({ plane: 'x', at: x + w, u: -40 + 6 + i * 17, v, w: 11, h: 12, tone: 'chalk-light' }))]; }
    put(s, box({ at: [-40, 0, -40], size: [50, 72, 56], material: 'neutral', name: 'hq', details: det }));
    s.add(box({ at: [10, 60, -40], size: [8, 3, 56], material: 'neutral', name: 'awning-rest' })); s.add(box({ at: [10, 60, -40], size: [8, 3, 56], material: 'teal', name: 'awning' }));
    return { hq: { b: 0 }, ...mailbox(s, { x: 50, z: 20, name: 'mbox', b: 1, flagBeat: 2 }), 'awning-rest': { act: 'out', b: 2 }, awning: { act: 'in', b: 2 } };
  })
};

// ================================================================ Option B — Thread of care
export const THREAD = {
  tInsurance: W('A teal thread runs from a shop to a home; a shield rises over the home', (s) => {
    const acts = { ...shop(s, { at: [-120, -10], w: 30, h: 26, d: 36, name: 'shop' }), ...home(s, { at: [40, -80], w: 34, h: 24, d: 36, roof: 16, name: 'home', b: 2 }) };
    thread(s, [[-84, 10], [-40, 0], [0, -14], [40, -30]], 0); thread(s, [[40, -30], [60, -36]], 1, 6);
    put(s, parcel({ at: [-30, 0, -6], size: [14, 12, 14], name: 'parcel' }));
    put(s, shieldM({ at: [44, 0, -100], w: 34, h: 54, name: 'shield' }));
    return { ...acts, parcel: { b: 1 }, shield: { act: 'in move', from: [0, -16, 0], b: 2, slow: true } };
  }),
  tSolutions: W('A teal thread passes three check rings that light in turn on its way to a home', (s) => {
    const acts = home(s, { at: [70, -90], w: 30, h: 22, d: 32, roof: 14, name: 'home', b: 2 });
    thread(s, [[-110, 30], [-60, 10], [-10, -10], [40, -40], [80, -58]], 0);
    [[-60, 10], [-10, -10], [40, -40]].forEach(([x, z], i) => { s.add(medal({ c: [x, 22, z - 2], r: 8, name: `ring${i}` })); acts[`ring${i}`] = { act: 'in move', from: [0, -8, 0], b: i < 2 ? 1 : 2, d: i * 5, slow: true }; });
    return acts;
  }),
  tPartners: W('A teal thread from a laptop through a shop, whose awning turns teal, to a home', (s) => {
    const acts = { ...laptop(s, [-130, -10], 'lap'), ...shop(s, { at: [-40, -40], w: 32, h: 28, d: 38, name: 'shop', b: 1, awning: 2 }), ...home(s, { at: [60, -90], w: 30, h: 22, d: 30, roof: 14, name: 'home', b: 2 }) };
    thread(s, [[-86, 10], [-50, 6], [-20, 0]], 0); thread(s, [[10, -16], [40, -40], [70, -56]], 1);
    return acts;
  }),
  tResources: W('A teal thread from a home past a guide to a stack of guides that turns teal', (s) => {
    const acts = home(s, { at: [-130, -30], w: 34, h: 26, d: 36, roof: 16, name: 'home', windows: 1 });
    thread(s, [[-90, 0], [-50, -6], [-10, -20]], 0); thread(s, [[-10, -20], [30, -40], [56, -56]], 1);
    doc(s, [-34, 6], 'guide');
    const t = sheets(s, { at: [50, -86], w: 34, d: 30, n: 3, t: 4, name: 'g', lines: false });
    put(s, box({ at: [51, t, -85], size: [32, 4, 28], material: 'teal', name: 'top' }));
    return { ...acts, guide: { b: 1 }, g0: { b: 2 }, g1: { b: 2 }, g2: { b: 2 }, top: { act: 'in move', from: [0, 16, 0], b: 2, slow: true } };
  }),
  tAbout: W('A teal thread from a home to a company building and a mailbox that raises its flag', (s) => {
    const acts = { ...home(s, { at: [-130, -20], w: 32, h: 24, d: 34, roof: 15, name: 'home' }), ...shop(s, { at: [10, -110], w: 40, h: 50, d: 46, name: 'hq', b: 1 }) };
    thread(s, [[-92, 4], [-50, -6], [-10, -20]], 0); thread(s, [[-10, -20], [20, -40]], 1);
    return { ...acts, ...mailbox(s, { x: 0, z: 0, name: 'mbox', b: 2, flagBeat: 2 }) };
  }),
  tMulti: W('Three carrier-striped parcels with threads that meet on one teal plate', (s) => {
    const tones = ['carrier-ups', 'carrier-dhl-yellow', 'blue-strong'], acts = {};
    [[-120, 40], [-120, -10], [-80, -60]].forEach(([x, z], i) => { const a = [x, 0, z], sz = [18, 16, 18], n = `c${i}`; put(s, parcel({ at: a, size: sz, name: n, details: stripes(a, sz, tones[i]) })); acts[n] = { b: 0, d: i * 3 };
      thread(s, [[x + 22, z + 8], [-30, -8]], i < 2 ? 0 : 1, i * 2); });
    s.add(box({ at: [-30, 0, -40], size: [80, 3, 70], material: 'neutral', name: 'plate-rest' })); put(s, box({ at: [-30, 0, -40], size: [80, 3, 70], material: 'teal', name: 'plate' }));
    return { ...acts, 'plate-rest': { act: 'out', b: 2 }, plate: { act: 'in', b: 2 } };
  }),
  tUps: W('A teal thread from a UPS parcel to a door; the mat glows teal', (s) => {
    const a = [-120, 0, 10], sz = [22, 20, 22];
    put(s, parcel({ at: a, size: sz, name: 'ups', details: stripes(a, sz, 'carrier-ups') }));
    thread(s, [[-94, 20], [-50, 6], [-10, -10], [20, -20]], 0);
    put(s, box({ at: [26, 0, -70], size: [8, 60, 56], material: 'neutral', name: 'door', details: [faceRect({ plane: 'x', at: 34, u: -56, v: 0, w: 24, h: 46, tone: 'surface-lowest' })] }));
    s.add(box({ at: [36, 0, -60], size: [40, 2, 40], material: 'neutral', name: 'mat-rest' })); put(s, box({ at: [36, 0, -60], size: [40, 2, 40], material: 'teal', name: 'mat' }));
    return { ups: { b: 0 }, door: { b: 1 }, 'mat-rest': { act: 'out', b: 2 }, mat: { act: 'in', b: 2 } };
  }),
  tSpecial: W('A teal thread wraps an open box; a blue item rises and a check ring lights above it', (s) => {
    const x = -24, z = -24, w = 48, h = 34;
    put(s, box({ at: [x, 0, z], size: [w, h, w], material: 'kraft', name: 'box', details: [faceRect({ plane: 'y', at: h, u: x + 4, v: z + 4, w: w - 8, h: w - 8, tone: 'kraft-shade' })] }));
    s.add(box({ at: [x, h, z - 3], size: [w, 18, 3], material: 'kraft', name: 'flapB' })); s.add(box({ at: [x - 3, h, z], size: [3, 18, w], material: 'kraft', name: 'flapL' }));
    thread(s, [[-80, 40], [-44, 34], [36, 34], [36, -40], [70, -60]], 0);
    s.add(box({ at: [-10, h - 12, -10], size: [20, 20, 20], material: 'blue', name: 'item' }));
    s.add(medal({ c: [0, 98, -4], r: 11, name: 'ring' }));
    return { box: { b: 0 }, flapB: { b: 0 }, flapL: { b: 0 }, item: { act: 'move', from: [0, -16, 0], b: 1, slow: true }, ring: { act: 'in', b: 2 } };
  }),
  tSelect: W('A teal thread from a parcel visits three plates and stops at the middle one, which turns teal', (s) => {
    put(s, parcel({ at: [-120, 0, 10], size: [24, 22, 24], name: 'parcel' }));
    const acts = { parcel: { b: 0 } };
    [[-56, 22, 4], [0, 32, 6], [62, 42, 8]].forEach(([u, w, h], i) => { const x = u - w / 2, z = -u * 0.6 - w / 2, n = `plate${i}`;
      if (i === 1) { s.add(box({ at: [x, 0, z], size: [w, h, w], material: 'neutral', name: n + '-rest' })); put(s, box({ at: [x, 0, z], size: [w, h, w], material: 'teal', name: n })); acts[n + '-rest'] = { act: 'out', b: 2 }; acts[n] = { act: 'in', b: 2 }; }
      else { put(s, box({ at: [x, 0, z], size: [w, h, w], material: 'neutral', name: n })); acts[n] = { b: 1, d: i * 4 }; } });
    thread(s, [[-106, 20], [-60, 30], [-20, 10], [0, 4]], 0); thread(s, [[0, 4], [30, -10], [60, -30]], 1, 4);
    return acts;
  }),
  tQuote: W('A teal thread from a group of parcels past a quote sheet to a coin stack that turns teal', (s) => {
    const acts = {};
    [[-140, 0, 10, 22], [-136, 22, 14, 16], [-112, 0, 30, 18]].forEach(([x, y, z, k], i) => { const o = parcel({ at: [x, y, z], size: [k, k * 0.9, k], name: `p${i}` }); y ? s.add(o) : put(s, o); acts[`p${i}`] = { b: 0 }; });
    thread(s, [[-90, 30], [-40, 10]], 0); thread(s, [[0, -10], [40, -30]], 1, 3);
    put(s, box({ at: [-40, 0, -20], size: [40, 2, 32], material: 'chalk', name: 'sheet', details: [0, 1, 2].map((i) => faceRect({ plane: 'y', at: 2, u: -34, v: -14 + i * 7, w: i % 2 ? 14 : 24, h: 2, tone: 'outline-variant' })) }));
    acts.sheet = { b: 1 };
    for (let i = 0; i < 5; i++) { const o = cylinder({ center: [64, i * 6, -46], r: 14, h: 6, material: 'teal', name: `c${i}` }); i ? s.add(o) : put(s, o); acts[`c${i}`] = { act: 'in move', from: [0, 12, 0], b: 2, d: i * 3, slow: true }; }
    return acts;
  }),
  tCommerce: W('A teal thread from a laptop meets a coral mark that becomes a teal check ring', (s) => {
    const acts = laptop(s, [-130, -20], 'lap');
    thread(s, [[-86, 6], [-40, -4], [0, -14]], 0); thread(s, [[0, -14], [40, -30], [70, -44]], 1, 4);
    s.add(medal({ c: [-10, 40, -14], r: 10, material: 'coral', mark: 'bar', name: 'risk' }));
    s.add(medal({ c: [-10, 40, -13], r: 12, name: 'ring' }));
    put(s, parcel({ at: [70, 0, -60], size: [20, 18, 20], name: 'ready' }));
    return { ...acts, risk: { act: 'in', b: 1 }, ring: { act: 'in', b: 2 }, ready: { b: 2 } };
  }),
  tDefense: W('A teal thread from a parcel passes one home and ends in a pin at the next', (s) => {
    put(s, parcel({ at: [-140, 0, 20], size: [20, 18, 20], name: 'parcel' }));
    const acts = { parcel: { b: 0 }, ...home(s, { at: [-60, -60], w: 30, h: 22, d: 30, roof: 14, name: 'homeA', b: 1 }), ...home(s, { at: [40, -110], w: 30, h: 22, d: 30, roof: 14, name: 'homeB', b: 2 }) };
    thread(s, [[-114, 30], [-70, 10], [-20, -6]], 0); thread(s, [[-20, -6], [30, -30], [80, -50]], 1, 2);
    put(s, cylinder({ center: [84, 0, -52], r: 9, h: 2, material: 'neutral', name: 'puck' })); put(s, pinM({ tip: [84, 2, -52], name: 'pin', s: 1.2 }));
    return { ...acts, puck: { b: 2 }, pin: { act: 'in move', from: [0, 34, 0], b: 2, slow: true } };
  }),
  tOrchestrate: W('A teal thread bends round a coral cloud on its way to a home', (s) => {
    put(s, parcel({ at: [-140, 0, 20], size: [20, 18, 20], name: 'parcel' }));
    const acts = { parcel: { b: 0 }, ...home(s, { at: [60, -90], w: 32, h: 24, d: 32, roof: 15, name: 'home', b: 2 }) };
    s.route({ points: [[-114, 30], [-30, -10], [70, -56]], tone: 'outline-variant', width: 2 });
    s.add(prism({ outline: CLOUD.map(([u, v]) => [u * 1.2, v * 1.2]), origin: [-50, 60, -10], plane: 'z', thickness: 8, material: 'coral', name: 'cloud' }));
    thread(s, [[-114, 30], [-70, 40], [-20, 50]], 0); thread(s, [[-20, 50], [30, 20], [70, -56]], 1, 2);
    return { ...acts, cloud: { act: 'in', b: 1 } };
  }),
  tInsure: W('A teal thread from a coral parcel past a claim sheet to a teal coin stack', (s) => {
    put(s, parcel({ at: [-140, 0, 10], size: [28, 18, 28], material: 'coral', name: 'loss' }));
    thread(s, [[-106, 20], [-60, 6], [-20, -10]], 0); thread(s, [[-20, -10], [30, -30], [60, -44]], 1, 4);
    put(s, box({ at: [-34, 0, -26], size: [34, 2, 28], material: 'chalk', name: 'claim', details: [0, 1, 2].map((i) => faceRect({ plane: 'y', at: 2, u: -28, v: -20 + i * 6, w: i % 2 ? 12 : 20, h: 2, tone: 'outline-variant' })) }));
    const acts = { loss: { b: 0 }, claim: { b: 1 } };
    for (let i = 0; i < 5; i++) { const o = cylinder({ center: [70, i * 6, -54], r: 14, h: 6, material: 'teal', name: `c${i}` }); i ? s.add(o) : put(s, o); acts[`c${i}`] = { act: 'in move', from: [0, 12, 0], b: 2, d: i * 3, slow: true }; }
    return acts;
  }),
  tConnect: W('A teal thread from a laptop to a block that seats into place', (s) => {
    const acts = laptop(s, [-120, -20], 'lap');
    thread(s, [[-76, 4], [-30, -10], [10, -24]], 0); thread(s, [[10, -24], [40, -36]], 1, 4);
    put(s, box({ at: [30, 0, -70], size: [56, 14, 50], material: 'neutral', name: 'platform', details: [faceRect({ plane: 'y', at: 14, u: 44, v: -60, w: 24, h: 24, tone: 'outline-default' })] }));
    put(s, box({ at: [44, 14, -60], size: [24, 16, 24], material: 'teal', name: 'dock' }));
    return { ...acts, platform: { b: 1 }, dock: { act: 'in move', from: [0, 30, 0], b: 2, slow: true } };
  }),
  tBecome: W('A teal thread from a shop seals two parcels in teal on its way to a home', (s) => {
    const acts = { ...shop(s, { at: [-150, -30], w: 34, h: 30, d: 40, name: 'shop' }), ...home(s, { at: [60, -100], w: 30, h: 22, d: 30, roof: 14, name: 'home', b: 2 }) };
    thread(s, [[-110, 0], [-60, -6], [-10, -20]], 0); thread(s, [[-10, -20], [40, -44], [70, -60]], 1, 6);
    [[-60, -20], [-14, -36]].forEach(([x, z], i) => { const a = [x, 0, z], sz = [18, 16, 18]; put(s, parcel({ at: a, size: sz, name: `p${i}`, details: [tealTape(a, sz, 1, i * 6)] })); acts[`p${i}`] = { b: 1, d: i * 6 }; });
    return acts;
  }),
  tHelp: W('A teal thread from a home to a standing document that gains a teal check', (s) => {
    const acts = home(s, { at: [-140, -30], w: 36, h: 26, d: 38, roof: 16, name: 'home', windows: 1 });
    thread(s, [[-98, 0], [-50, -6], [0, -20], [20, -24]], 0);
    put(s, box({ at: [10, 0, -60], size: [50, 3, 50], material: 'neutral', name: 'plate' }));
    doc(s, [28, -14], 'doc', 40);
    s.add(medal({ c: [36, 66, -30], r: 11, name: 'ring' }));
    return { ...acts, plate: { b: 1 }, doc: { b: 1 }, ring: { act: 'in move', from: [0, -10, 0], b: 2, slow: true } };
  }),
  tStories: W('A teal thread links three shops; a coin stack rises beside each', (s) => {
    const acts = {};
    [[-150, 10], [-60, -30], [30, -70]].forEach(([x, z], i) => { Object.assign(acts, Object.fromEntries(Object.entries(shop(s, { at: [x, z - 30], w: 28, h: 26, d: 32, name: `shop${i}`, b: i })).map(([k, v]) => [k, { ...v, b: Math.min(2, i) }])));
      for (let j = 0; j < 3; j++) { const o = cylinder({ center: [x + 40, j * 5, z + 6], r: 9, h: 5, material: 'teal', name: `c${i}${j}` }); j ? s.add(o) : put(s, o); acts[`c${i}${j}`] = { act: 'in move', from: [0, 10, 0], b: Math.min(2, i), d: 4 + j * 2, slow: true }; } });
    thread(s, [[-110, 20], [-60, 0]], 0); thread(s, [[-20, -20], [30, -40]], 1, 2);
    return acts;
  }),
  tInsights: W('A teal thread links the tops of bars on a sheet; the tallest turns teal', (s) => {
    put(s, box({ at: [-110, 0, -60], size: [190, 2, 110], material: 'chalk', name: 'sheet' }));
    const acts = { sheet: { b: 0 } }, bars = [[-90, 14], [-50, 24], [-10, 20], [30, 40]];
    bars.forEach(([u, h], i) => { const x = u, z = -u * 0.4 - 10, n = `bar${i}`;
      if (i === 3) { s.add(box({ at: [x, 2, z], size: [16, h, 16], material: 'kraft', name: n + '-rest' })); put(s, box({ at: [x, 2, z], size: [16, h, 16], material: 'teal', name: n })); acts[n + '-rest'] = { b: 1 }; acts[n] = { act: 'in', b: 2 }; }
      else { put(s, box({ at: [x, 2, z], size: [16, h, 16], material: 'kraft', name: n })); acts[n] = { b: i ? 1 : 0, d: i * 4 }; } });
    const sheetTop = s.items.find((o) => o.name === 'sheet');
    sheetTop.details = [routeDetail({ points: bars.map(([u]) => [u + 8, -u * 0.4 + 10]), y: 2, act: 'in', b: 1, dash: 5, gap: 3, width: 2 })];
    return acts;
  }),
  tGuides: W('A teal thread runs through three stacks of sheets, the last topped teal', (s) => {
    const acts = {};
    [[-120, 10], [-40, -30], [40, -70]].forEach(([x, z], i) => { const t = sheets(s, { at: [x, z], w: 40, d: 34, n: 3 + i, t: 4, name: `s${i}-`, lines: false });
      for (let j = 0; j < 3 + i; j++) acts[`s${i}-${j}`] = { b: i }; if (i === 2) { put(s, box({ at: [x + 1, t, z + 1], size: [38, 4, 32], material: 'teal', name: 'top' })); acts.top = { act: 'in move', from: [0, 16, 0], b: 2, slow: true }; } });
    thread(s, [[-80, 40], [-40, 10]], 0); thread(s, [[0, -10], [40, -40]], 1, 2);
    return acts;
  }),
  tContact: W('A teal thread from a home to a teal mailbox that raises its flag', (s) => {
    const acts = home(s, { at: [-140, -40], w: 40, h: 30, d: 44, roof: 18, name: 'home' });
    thread(s, [[-94, 0], [-50, -8], [0, -20], [30, -30]], 0, 0);
    return { ...acts, ...mailbox(s, { x: 50, z: -30, name: 'mbox', b: 1, flagBeat: 2, k: 1.2 }) };
  }),
  tAvail: W('A teal thread hops across pucks and a pin lands on the last, which turns teal', (s) => {
    const acts = {}, P = [[-90, 20], [-40, 2], [10, -16], [60, -34]];
    P.forEach(([x, z], i) => { if (i === 3) { s.add(cylinder({ center: [x, 0, z], r: 18, h: 6, material: 'neutral', name: 'mine-rest' })); put(s, cylinder({ center: [x, 0, z], r: 18, h: 6, material: 'teal', name: 'mine' })); acts['mine-rest'] = { b: 1 }; acts.mine = { act: 'in', b: 2 }; }
      else { put(s, cylinder({ center: [x, 0, z], r: 15, h: 5, material: 'neutral', name: `pk${i}` })); acts[`pk${i}`] = { b: i ? 1 : 0, d: i * 4 }; } });
    thread(s, [P[0], P[1], P[2]], 0); thread(s, [P[2], P[3]], 1, 4);
    put(s, pinM({ tip: [60, 6, -34], name: 'pin', s: 2 }));
    return { ...acts, pin: { act: 'in move', from: [0, 34, 0], b: 2, slow: true } };
  }),
  tAnnounce: W('A teal thread from a stack of news to a home; a teal sheet lands on the mat', (s) => {
    const t = sheets(s, { at: [-150, 0], w: 34, d: 30, n: 4, t: 4, name: 'n', lines: false });
    const acts = { ...home(s, { at: [30, -100], w: 40, h: 30, d: 44, roof: 18, name: 'home', b: 1 }) };
    for (let i = 0; i < 4; i++) acts[`n${i}`] = { b: 0 };
    thread(s, [[-110, 20], [-60, 0], [-10, -20], [40, -40]], 0);
    put(s, box({ at: [74, 0, -76], size: [30, 2, 34], material: 'neutral', name: 'mat' }));
    put(s, box({ at: [80, 2, -70], size: [18, 2, 22], material: 'teal', name: 'news' }));
    return { ...acts, mat: { b: 1 }, news: { act: 'in move', from: [0, 26, 0], b: 2, slow: true } };
  }),
  tNews: W('A teal thread across printed sheets ends in a teal shield standing up', (s) => {
    const t = sheets(s, { at: [-90, -40], w: 110, d: 80, n: 4, t: 4, name: 'n', lines: false });
    const top = s.items.filter((o) => o.kind === 'object').pop();
    top.details = [actG({ act: 'in', b: 1 }, ...[0, 1, 2, 3].map((i) => faceRect({ plane: 'y', at: t, u: -80, v: -30 + i * 14, w: i ? 70 : 90, h: i ? 2 : 5, tone: i ? 'outline-variant' : 'charcoal-strong' }))),
      routeDetail({ points: [[-80, 36], [-30, 30], [10, 10]], y: t, act: 'in', b: 0, dash: 5, gap: 3, width: 2.2 })];
    put(s, shieldM({ at: [0, t, -20], w: 30, h: 46, t: 5, name: 'shield' }));
    const acts = { shield: { act: 'in move', from: [0, -12, 0], b: 2, slow: true } };
    for (let i = 0; i < 4; i++) acts[`n${i}`] = { b: 0 };
    return acts;
  })
};
