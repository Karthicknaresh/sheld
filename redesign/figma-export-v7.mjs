// Figma export for V7 (Stage panel 360 × 268): node figma-export-v7.mjs → figma-export-v7/v7a-<scene>.svg, v7b-<scene>.svg + manifest.json
// Layer names carry the story beat:  obj:<name>|<act>|<ax>|<ay>|<b>|<ab> · act:<act>|<ax>|<ay>|<b>|<ab> · shadow|<act>|<for>|<b>|<ab>
//   b = beat the colour arrives on, ab = beat the change plays on (empty = inherit from the parent object).
import fs from 'node:fs';
import { setScale } from './iso.js';
import { DREAM } from './scenes-v6.mjs';
import { OVERVIEW_A, THREAD } from './scenes-v7.mjs';

const FRAME = [360, 268];
const SETS = { a: { scenes: { ...OVERVIEW_A, ...DREAM }, FILL: [0.82, 0.76], MAX: 2.6 }, b: { scenes: THREAD, FILL: [0.98, 0.9], MAX: 3 } };
let FILL, MAX;
const A = (-17.5 * Math.PI) / 180, U = [Math.cos(A), Math.sin(A)], N = [-Math.sin(A), Math.cos(A)];
function hatchLines(poly, lw) {
  const dot = (p, v) => p[0] * v[0] + p[1] * v[1], ns = poly.map((p) => dot(p, N)), out = [];
  for (let k = Math.floor(Math.min(...ns) / 3); k * 3 <= Math.max(...ns); k++) {
    const c = k * 3 + lw / 2, ts = [];
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], da = dot(a, N) - c, db = dot(b, N) - c;
      if ((da < 0) !== (db < 0)) { const t = da / (da - db); ts.push(dot([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], U)); } }
    ts.sort((x, y) => x - y);
    for (let i = 0; i + 1 < ts.length; i += 2) { const P = (t) => [U[0] * t + N[0] * c, U[1] * t + N[1] * c].map((v) => +v.toFixed(2)); if (ts[i + 1] - ts[i] > 0.5) out.push(`M${P(ts[i]).join(' ')}L${P(ts[i + 1]).join(' ')}`); }
  }
  return out.join('');
}
const sv = (st, k) => (st.match(new RegExp(`--${k}:(-?[\\d.]+)`)) || [])[1] ?? '';
const tail = (st) => `${sv(st, 'b')}|${sv(st, 'ab')}`;
const actName = (attr, st = '') => `${attr.replace(/\s+/g, '+')}|${(st.match(/--ax:(-?[\d.]+)px/) || [])[1] || 0}|${(st.match(/--ay:(-?[\d.]+)px/) || [])[1] || 0}|${tail(st)}`;
const fit = (build) => { setScale(1); const vb = build().s.toSVG({ padding: 0 }).match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); return Math.min(MAX, (FRAME[0] * FILL[0]) / vb[2], (FRAME[1] * FILL[1]) / vb[3]); };

fs.mkdirSync(new URL('./figma-export-v7/', import.meta.url), { recursive: true });
const manifest = [];
for (const [set, cfg] of Object.entries(SETS)) { FILL = cfg.FILL; MAX = cfg.MAX; for (const [name, build] of Object.entries(cfg.scenes)) {
  setScale(fit(build)); const { s, title, acts = {} } = build();
  let svg = s.toSVG({ frame: FRAME, padding: 14, inline: true, acts, idPrefix: name, width: FRAME[0], height: FRAME[1] });
  setScale(1);
  svg = svg.replace(/<path d="([^"]+)" fill="url\(#[^)]+\)" opacity="([\d.]+)" data-shadow="hatch" data-thin="([\d.]+)"([^>]*)\/>/g, (m, d, op, thin, rest) => {
    const pts = d.replace(/^M|Z$/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number)), lw = +(1 - thin).toFixed(2);
    const a = (rest.match(/data-act="([^"]+)"/) || [])[1] || '', f = (rest.match(/data-for="([^"]+)"/) || [])[1] || '', st = (rest.match(/style="([^"]*)"/) || [])[1] || '';
    return `<path id="shadow|${a}|${f}|${tail(st)}" d="${hatchLines(pts, lw)}" fill="none" stroke="#85858e" stroke-width="${lw}" opacity="${op}"/>`; });
  svg = svg.replace(/<defs>.*?<\/defs>/, '')
    .replace(/<g data-layer="(\d+)">/g, '<g id="layer-$1">')
    .replace(/<g data-object="([^"]+)" style="([^"]*)"([^>]*)>/g, (m, n, st, rest) => { const a = (rest.match(/data-act="([^"]+)"/) || [])[1]; return `<g id="obj:${n}|${a ? actName(a, st) : `||||${tail(st)}`}">`; })
    .replace(/<g data-act="([^"]+)"(?: style="([^"]*)")?>/g, (m, a, st = '') => `<g id="act:${actName(a, st)}">`)
    .replace(/<path ([^>]*?)data-act="in" style="([^"]*)"\/>/g, (m, rest, st) => `<path id="act:in|0|0|${tail(st)}" ${rest}/>`)
    .replace(/ data-face="(\w+)"/g, ' id="face-$1"')
    .replace(/<path d="([^"]+)" fill="none" stroke="([^"]+)" stroke-width="1" stroke-linecap="round"/g, '<path id="edge" d="$1" fill="none" stroke="$2" stroke-width="1" stroke-linecap="round"')
    .replace(/ vector-effect="non-scaling-stroke"/g, '').replace(/ data-[\w-]+="[^"]*"/g, '');
  const file = `v7${set}-${name}.svg`; fs.writeFileSync(new URL(`./figma-export-v7/${file}`, import.meta.url), svg);
  manifest.push({ set, scene: name, file, title, kb: +(svg.length / 1024).toFixed(1) });
} }
fs.writeFileSync(new URL('./figma-export-v7/manifest.json', import.meta.url), JSON.stringify(manifest, null, 1));
console.log(manifest.length, 'files,', manifest.reduce((a, m) => a + m.kb, 0).toFixed(0), 'KB');
