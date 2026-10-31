// Build: node build.mjs
// V2  → art/stage, art/card            (Stage + Diorama pages)
// V3  → art/pano, art/atelier, art/icon, art/feature   (Panorama, Atelier, Icon rail pages)
//     → art/figma/<scene>.figma.svg (hex inlined, for Figma import)
//     → insureshield-nav-<concept>.html (each page inlines only the art it uses, in <template>s)
import fs from 'node:fs';
import { setScale } from './iso.js';
import { SCENES } from './scenes.mjs';
import { PANO, PANO_STATIONS, ATELIER, ICON, FEATURE } from './scenes-v3.mjs';
import { RELIEF, DOOR } from './scenes-v4.mjs';
import { DREAM } from './scenes-v6.mjs';
import { OVERVIEW_A, THREAD } from './scenes-v7.mjs';

const here = (f) => new URL(f, import.meta.url);
// fill = share of the slot the art may use; max = largest screen scale (keeps small scenes from bloating)
// scale = fixed scale instead of fitting (the panorama is wider than its window and pans)
const SETS = {
  stage: { scenes: SCENES, frame: [360, 268], fill: [0.8, 0.74], max: 2.1 },
  card: { scenes: SCENES, frame: [216, 150], fill: [0.86, 0.8], max: 1.3 },
  pano: { scenes: PANO, scale: 1.75 },
  atelier: { scenes: ATELIER, frame: [320, 400], fill: [0.92, 0.56], max: 3 },
  icon: { scenes: ICON, frame: [44, 44], fill: [0.94, 0.94], max: 1 },
  feature: { scenes: FEATURE, frame: [300, 200], fill: [0.86, 0.78], max: 1.6 },
  // V4: Worry → Relief moment panel; Doorstep storyboard frames (close-up: art bigger than the frame, cropped)
  relief: { scenes: RELIEF, frame: [440, 260], fill: [0.8, 0.8], max: 2.4 },
  door: { scenes: DOOR, frame: [232, 176], fill: [1.25, 1.25], max: 3, crop: true },
  // V6: Light up the dream (Diorama card art, same slot as V2 cards: 216 × 150)
  dream: { scenes: DREAM, frame: [216, 150], fill: [0.9, 0.88], max: 2.4 },
  // V7 (approved Stage layout, 360 × 268 panel): A = Light up the dream, B = Thread of care
  s7a: { scenes: { ...OVERVIEW_A, ...DREAM }, frame: [360, 268], fill: [0.82, 0.76], max: 2.6 },
  s7b: { scenes: THREAD, frame: [360, 268], fill: [0.98, 0.9], max: 3 }
};
// Fit each scene to its slot by changing the projection scale. Strokes stay 1 / 0.6 px and the
// hatch stays 1 px every 3 px, because both are in screen units.
function fitScale(build, frame, fill, max, shiftFrac = 0) {
  setScale(1);
  const vb = build().s.toSVG({ padding: 0 }).match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  return Math.min(max, (frame[0] * fill[0]) / vb[2], (frame[1] * fill[1]) / vb[3]);
}

for (const d of [...Object.keys(SETS), 'figma']) { fs.mkdirSync(here(`./art/${d}/`), { recursive: true }); for (const f of fs.readdirSync(here(`./art/${d}/`))) if (f.endsWith('.svg')) fs.unlinkSync(here(`./art/${d}/${f}`)); }
const out = {};
for (const [ctx, { scenes, frame, fill, max, scale, crop }] of Object.entries(SETS)) {
  out[ctx] = {};
  for (const [name, build] of Object.entries(scenes)) {
    setScale(1); const { zoom = 1 } = build();                                            // V4 frames: per-scene zoom + framing offset
    const k = (scale || fitScale(build, frame, fill, max)) * zoom;
    setScale(k);
    const { s, title, hero, drop = [], acts = {}, shift = 0, focus = [0, 0] } = build();
    const base = frame ? { frame, hero, drop, acts, padding: 14, shift: (shift * k) / 2, crop, focus: focus.map((v) => v * k) } : { hero, drop, acts, padding: 16 };
    let svg = s.toSVG({ ...base, idPrefix: `${ctx}-${name}` });
    if (!frame) { const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); svg = svg.replace('<svg ', `<svg width="${Math.round(vb[2])}" height="${Math.round(vb[3])}" `); }
    out[ctx][name] = svg;                                                                   // page: decorative (label carries meaning)
    fs.writeFileSync(here(`./art/${ctx}/${name}.svg`), s.toSVG({ ...base, title, idPrefix: name }));
    if (ctx !== 'card') fs.writeFileSync(here(`./art/figma/${name}.figma.svg`), s.toSVG({ ...base, title, inline: true, idPrefix: name, ...(frame ? { width: frame[0], height: frame[1] } : {}) }));
  }
}
setScale(1);
const artFor = (sets) => sets.map((ctx) => `<template data-art="${ctx}">\n${Object.entries(out[ctx]).map(([n, svg]) => `<div data-n="${n}">${svg}</div>`).join('\n')}\n</template>`).join('\n');

// V3 scene map: which scene each menu / option uses in each V3 concept (from the concept cards)
const cards = (f) => JSON.parse(fs.readFileSync(here(`./concepts/${f}.json`), 'utf8')).cards;
const V3 = { pano: { world: {}, station: {} }, atelier: {}, icon: {}, feature: {} };
for (const c of cards('v3-panorama')) if (c.slot === 'media') V3.pano.world[c.copy.title] = c.scene;
for (const [w, list] of Object.entries(PANO_STATIONS)) list.forEach((st, k) => { const c = cards('v3-panorama').find((x) => x.scene === st); V3.pano.station[c.copy.title] = { world: w, k }; });
for (const c of cards('v3-atelier')) V3.atelier[c.copy.title] = c.scene;
for (const c of cards('v3-rail')) (c.slot === 'stat' ? V3.feature : V3.icon)[c.copy.title] = c.scene;
// V4: scene per option + the worry / relief lines written on the Worry → Relief cards
V3.relief = {}; V3.worry = {}; V3.door = {};
for (const c of cards('v4-relief')) { V3.relief[c.copy.title] = c.scene; V3.worry[c.copy.title] = [c.copy.worry, c.copy.relief]; }
for (const c of cards('v4-doorstep')) V3.door[c.copy.title] = c.scene;
V3.dream = {}; for (const c of cards('v6-dream')) V3.dream[c.copy.title] = c.scene;
V3.v7a = {}; for (const c of cards('v7-a')) V3.v7a[c.copy.title] = c.scene;
V3.v7b = {}; for (const c of cards('v7-b')) V3.v7b[c.copy.title] = c.scene;

// logo from the previous concept file (unchanged brand asset)
const old = fs.readFileSync(here('../design-files/nav03/insureshield-lattice-header.html'), 'utf8');
const logo = old.match(/<a class="logo"[\s\S]*?<\/a>/)[0];
const page = fs.readFileSync(here('./page.template.html'), 'utf8')
  .replace('/*@@TOKENS@@*/', fs.readFileSync(here('./tokens.css'), 'utf8'))
  .replace('/*@@MOTION@@*/', fs.readFileSync(here('./motion.css'), 'utf8'))
  .replace('<!--@@LOGO@@-->', logo)
  .replace('/*@@V3@@*/{}', JSON.stringify(V3));
const PAGES = { stage: ['stage', 'card'], diorama: ['stage', 'card'], panorama: ['pano'], atelier: ['atelier'], rail: ['icon', 'feature'], relief: ['relief'], doorstep: ['door'], askfirst: [], v6: ['dream'], v7a: ['s7a'], v7b: ['s7b'] };
const sizes = [];
for (const [c, sets] of Object.entries(PAGES)) { const html = page.replace('@@DEFAULT@@', c).replace('<!--@@ART@@-->', artFor(sets)); fs.writeFileSync(here(`./insureshield-nav-${c}.html`), html); sizes.push(`${c} ${(html.length / 1024).toFixed(0)} KB`); }
console.log(`built ${Object.values(SETS).reduce((n, s) => n + Object.keys(s.scenes).length, 0)} scene renders; pages: ${sizes.join(', ')}`);
