// Figma export for V5 · Journey (same layer-naming contract as figma-export-v3/v4):
//   node figma-export-v5.mjs → figma-export-v5/strip-<menu>.svg + manifest.json
// Layer names: obj:<name>|<act>|<ax>|<ay> · act:<act>|<ax>|<ay> · shadow|<act>|<for> · face-<side> · edge
// plus  progress (group) › dash|<x>  = the teal route, x = px from the strip's left edge.
import fs from 'node:fs';
import { strip } from './build-v5.mjs';
import { MENU_STOPS } from './scenes-v5.mjs';

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
const actName = (attr, style = '') => { const ax = (style.match(/--ax:(-?[\d.]+)px/) || [])[1] || 0, ay = (style.match(/--ay:(-?[\d.]+)px/) || [])[1] || 0; return `${attr.replace(/\s+/g, '+')}|${ax}|${ay}`; };
const slug = (m) => m.toLowerCase().replace(/[^a-z]+/g, '-');

fs.mkdirSync(new URL('./figma-export-v5/', import.meta.url), { recursive: true });
const manifest = [];
for (const menu of Object.keys(MENU_STOPS)) {
  let { svg, n, pitch } = strip(menu, { inline: true });
  svg = svg.replace('<svg ', '<svg width="1248" height="144" ');
  svg = svg.replace(/<path d="([^"]+)" fill="url\(#[^)]+\)" opacity="([\d.]+)" data-shadow="hatch" data-thin="([\d.]+)"([^>]*)\/>/g, (m, d, op, thin, rest) => {
    const pts = d.replace(/^M|Z$/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number)), lw = +(1 - thin).toFixed(2);
    const a = (rest.match(/data-act="([^"]+)"/) || [])[1], f = (rest.match(/data-for="([^"]+)"/) || [])[1] || '';
    return `<path id="shadow|${a || ''}|${f}" d="${hatchLines(pts, lw)}" fill="none" stroke="#85858e" stroke-width="${lw}" opacity="${op}"/>`; });
  svg = svg.replace(/<defs>.*?<\/defs>/, '')
    .replace('<g data-progress="">', '<g id="progress">')
    .replace(/<path data-x="([\d.]+)" /g, '<path id="dash|$1" ')
    .replace(/<g data-layer="(\d+)">/g, '<g id="layer-$1">')
    .replace(/<g data-object="([^"]+)" style="([^"]*)"([^>]*)>/g, (m, nm, st, rest) => { const a = (rest.match(/data-act="([^"]+)"/) || [])[1]; return `<g id="obj:${nm}|${a ? actName(a, st) : '||'}">`; })
    .replace(/<g data-act="([^"]+)"(?: style="([^"]*)")?>/g, (m, a, st = '') => `<g id="act:${actName(a, st)}">`)
    .replace(/<path ([^>]*?)data-act="in" style="--d:[\d.]+"\/>/g, '<path id="act:in|0|0" $1/>')
    .replace(/ data-face="(\w+)"/g, ' id="face-$1"')
    .replace(/<path d="([^"]+)" fill="none" stroke="([^"]+)" stroke-width="1" stroke-linecap="round"/g, '<path id="edge" d="$1" fill="none" stroke="$2" stroke-width="1" stroke-linecap="round"')
    .replace(/ vector-effect="non-scaling-stroke"/g, '').replace(/ preserveAspectRatio="[^"]*"/, '').replace(/ data-[\w-]+="[^"]*"/g, '');
  const file = `strip-${slug(menu)}.svg`;
  fs.writeFileSync(new URL(`./figma-export-v5/${file}`, import.meta.url), svg);
  manifest.push({ menu, file, stops: MENU_STOPS[menu], n, pitch: +pitch.toFixed(2), parcelStart: 30, park: 56, kb: +(svg.length / 1024).toFixed(1) });
}
fs.writeFileSync(new URL('./figma-export-v5/manifest.json', import.meta.url), JSON.stringify(manifest, null, 1));
console.log(manifest.map((m) => `${m.file} ${m.kb} KB`).join(' · '));
