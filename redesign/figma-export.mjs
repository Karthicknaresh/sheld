// Figma export: one SVG per scene at Stage size (360 × 268), hex colours, every layer named so the
// Figma build script can make Rest / Play / Active variants and Smart Animate between them.
//   node figma-export.mjs   → figma-export/<scene>.svg + figma-export/manifest.json
// Layer names (read by the Figma build script):
//   layer-0 / layer-10 / layer-20      ground · shadows · objects
//   obj:<name>|<acts>|<ax>|<ay>        an object (acts = in / out / move, ax/ay = rest offset in px)
//   act:<acts>|<ax>|<ay>               a detail or route dash that changes on hover
//   face-top / face-right / face-left  object faces       edge   outlines      shadow|<acts>   hatch lines
import fs from 'node:fs';
import { setScale } from './iso.js';
import { SCENES, SCENE_FOR } from './scenes.mjs';

const here = (f) => new URL(f, import.meta.url);
const FRAME = [360, 268], FILL = [0.8, 0.74], MAX = 2.1;
fs.mkdirSync(here('./figma-export/'), { recursive: true });

// Hatch: 1 px lines every 3 px at -17.5°, clipped to the shadow polygon (Figma can't import <pattern>).
const A = (-17.5 * Math.PI) / 180, U = [Math.cos(A), Math.sin(A)], N = [-Math.sin(A), Math.cos(A)];
function hatchLines(poly, lw) {
  const dot = (p, v) => p[0] * v[0] + p[1] * v[1];
  const ns = poly.map((p) => dot(p, N));
  const out = [];
  for (let k = Math.floor(Math.min(...ns) / 3); k * 3 <= Math.max(...ns); k++) {
    const c = k * 3 + lw / 2, ts = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], da = dot(a, N) - c, db = dot(b, N) - c;
      if ((da < 0) !== (db < 0)) { const t = da / (da - db); ts.push(dot([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], U)); }
    }
    ts.sort((x, y) => x - y);
    for (let i = 0; i + 1 < ts.length; i += 2) {
      const P = (t) => [U[0] * t + N[0] * c, U[1] * t + N[1] * c].map((v) => +v.toFixed(2));
      if (ts[i + 1] - ts[i] > 0.5) out.push(`M${P(ts[i]).join(' ')}L${P(ts[i + 1]).join(' ')}`);
    }
  }
  return out.join('');
}
const actName = (attr, style = '') => {
  const ax = (style.match(/--ax:(-?[\d.]+)px/) || [])[1] || 0, ay = (style.match(/--ay:(-?[\d.]+)px/) || [])[1] || 0;
  return `${attr.replace(/\s+/g, '+')}|${ax}|${ay}`;
};

const manifest = [];
for (const [title, name] of Object.entries(SCENE_FOR)) {
  setScale(1);
  const vb0 = SCENES[name]().s.toSVG({ padding: 0 }).match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  setScale(Math.min(MAX, (FRAME[0] * FILL[0]) / vb0[2], (FRAME[1] * FILL[1]) / vb0[3]));
  const { s, title: alt, acts = {} } = SCENES[name]();
  let svg = s.toSVG({ frame: FRAME, padding: 14, inline: true, acts, idPrefix: name, width: FRAME[0], height: FRAME[1] });
  setScale(1);

  // hatch <pattern> → clipped line paths
  svg = svg.replace(/<path d="([^"]+)" fill="url\(#[^)]+\)" opacity="([\d.]+)" data-shadow="hatch" data-thin="([\d.]+)"([^>]*)\/>/g, (m, d, op, thin, rest) => {
    const pts = d.replace(/^M|Z$/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number));
    const lw = +(1 - thin).toFixed(2), a = (rest.match(/data-act="([^"]+)"/) || [])[1];
    return `<path id="shadow|${a || ''}" d="${hatchLines(pts, lw)}" fill="none" stroke="#85858e" stroke-width="${lw}" opacity="${op}"/>`;
  });
  svg = svg.replace(/<defs>.*?<\/defs>/, '')
    .replace(/<g data-layer="(\d+)">/g, '<g id="layer-$1">')
    .replace(/<g data-object="([^"]+)" style="([^"]*)"([^>]*)>/g, (m, n, st, rest) => {
      const a = (rest.match(/data-act="([^"]+)"/) || [])[1];
      return `<g id="obj:${n}|${a ? actName(a, st) : '||'}">`;
    })
    .replace(/<g data-act="([^"]+)"(?: style="([^"]*)")?>/g, (m, a, st = '') => `<g id="act:${actName(a, st)}">`)
    .replace(/<path ([^>]*?)data-act="in" style="--d:[\d.]+"\/>/g, '<path id="act:in|0|0" $1/>')
    .replace(/ data-face="(\w+)"/g, ' id="face-$1"')
    .replace(/<path d="([^"]+)" fill="none" stroke="([^"]+)" stroke-width="1" stroke-linecap="round"/g, '<path id="edge" d="$1" fill="none" stroke="$2" stroke-width="1" stroke-linecap="round"')
    .replace(/ vector-effect="non-scaling-stroke"/g, '')
    .replace(/ data-[\w-]+="[^"]*"/g, '');
  fs.writeFileSync(here(`./figma-export/${name}.svg`), svg);
  manifest.push({ title, scene: name, alt, bytes: svg.length });
}
const cards = JSON.parse(fs.readFileSync(here('./concepts/nav-concepts.json'), 'utf8')).cards;
for (const m of manifest) { const c = cards.find((k) => k.scene === m.scene); Object.assign(m, { message: c.message, active: c.states.active, meaning: c.states.meaning, alt: c.alt, layout: c.layout }); }
fs.writeFileSync(here('./figma-export/manifest.json'), JSON.stringify(manifest, null, 1));
console.log(manifest.map((m) => `${m.scene} ${(m.bytes / 1024).toFixed(1)}KB`).join('\n'));
