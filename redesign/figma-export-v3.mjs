// Figma export for V3 (same layer-naming contract as figma-export.mjs):
//   node figma-export-v3.mjs → figma-export-v3/<set>-<scene>.svg + manifest.json
// Sets: pano (natural size, stations named obj:s<k>:…), atelier 320×400, icon 44×44, feature 300×200.
import fs from 'node:fs';
import { setScale } from './iso.js';
import { PANO, PANO_STATIONS, ATELIER, ICON, FEATURE } from './scenes-v3.mjs';

const here = (f) => new URL(f, import.meta.url);
const SETS = {
  pano: { scenes: PANO, scale: 1.75 },
  atelier: { scenes: ATELIER, frame: [320, 400], fill: [0.92, 0.56], max: 3 },
  icon: { scenes: ICON, frame: [44, 44], fill: [0.94, 0.94], max: 1 },
  feature: { scenes: FEATURE, frame: [300, 200], fill: [0.86, 0.78], max: 1.6 }
};
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
const fitScale = (build, frame, fill, max) => { setScale(1); const vb = build().s.toSVG({ padding: 0 }).match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); return Math.min(max, (frame[0] * fill[0]) / vb[2], (frame[1] * fill[1]) / vb[3]); };

fs.mkdirSync(here('./figma-export-v3/'), { recursive: true });
const manifest = [];
for (const [set, { scenes, frame, fill, max, scale }] of Object.entries(SETS)) for (const [name, build] of Object.entries(scenes)) {
  const k = scale || fitScale(build, frame, fill, max); setScale(k);
  const { s, title, acts = {}, shift = 0, hero } = build();
  let svg = s.toSVG(frame ? { frame, padding: 14, inline: true, acts, idPrefix: name, width: frame[0], height: frame[1], shift: (shift * k) / 2 } : { padding: 16, inline: true, acts, idPrefix: name });
  if (!frame) { const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number); svg = svg.replace('<svg ', `<svg width="${Math.round(vb[2])}" height="${Math.round(vb[3])}" `); }
  setScale(1);
  svg = svg.replace(/<path d="([^"]+)" fill="url\(#[^)]+\)" opacity="([\d.]+)" data-shadow="hatch" data-thin="([\d.]+)"([^>]*)\/>/g, (m, d, op, thin, rest) => {
    const pts = d.replace(/^M|Z$/g, '').split('L').map((p) => p.trim().split(/\s+/).map(Number)), lw = +(1 - thin).toFixed(2);
    const a = (rest.match(/data-act="([^"]+)"/) || [])[1], f = (rest.match(/data-for="([^"]+)"/) || [])[1] || '';
    return `<path id="shadow|${a || ''}|${f}" d="${hatchLines(pts, lw)}" fill="none" stroke="#85858e" stroke-width="${lw}" opacity="${op}"/>`; });
  svg = svg.replace(/<defs>.*?<\/defs>/, '')
    .replace(/<g data-layer="(\d+)">/g, '<g id="layer-$1">')
    .replace(/<g data-object="([^"]+)" style="([^"]*)"([^>]*)>/g, (m, n, st, rest) => { const a = (rest.match(/data-act="([^"]+)"/) || [])[1]; return `<g id="obj:${n}|${a ? actName(a, st) : '||'}${/data-hero/.test(rest) ? '|hero' : ''}">`; })
    .replace(/<g data-act="([^"]+)"(?: style="([^"]*)")?>/g, (m, a, st = '') => `<g id="act:${actName(a, st)}">`)
    .replace(/<path ([^>]*?)data-act="in" style="--d:[\d.]+"\/>/g, '<path id="act:in|0|0" $1/>')
    .replace(/ data-face="(\w+)"/g, ' id="face-$1"')
    .replace(/<path d="([^"]+)" fill="none" stroke="([^"]+)" stroke-width="1" stroke-linecap="round"/g, '<path id="edge" d="$1" fill="none" stroke="$2" stroke-width="1" stroke-linecap="round"')
    .replace(/ vector-effect="non-scaling-stroke"/g, '').replace(/ data-[\w-]+="[^"]*"/g, '');
  const file = `${set}-${name}.svg`; fs.writeFileSync(here(`./figma-export-v3/${file}`), svg);
  manifest.push({ set, scene: name, file, title, hero: hero || null, stations: set === 'pano' ? PANO_STATIONS[name].length : undefined, kb: +(svg.length / 1024).toFixed(1) });
}
fs.writeFileSync(here('./figma-export-v3/manifest.json'), JSON.stringify(manifest, null, 1));
console.log(manifest.length, 'files,', manifest.reduce((a, m) => a + m.kb, 0).toFixed(0), 'KB');
