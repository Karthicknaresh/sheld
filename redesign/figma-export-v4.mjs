// Figma export for V4 (same layer-naming contract as figma-export.mjs):
//   node figma-export-v4.mjs → figma-export-v4/<set>-<scene>.svg + manifest.json
// Sets: relief 440×260 (Worry → Relief moment panel), door 232×176 (Doorstep frames, close-up crop).
import fs from 'node:fs';
import { setScale } from './iso.js';
import { RELIEF, DOOR } from './scenes-v4.mjs';

const here = (f) => new URL(f, import.meta.url);
const SETS = {
  relief: { scenes: RELIEF, frame: [440, 260], fill: [0.8, 0.8], max: 2.4 },
  door: { scenes: DOOR, frame: [232, 176], fill: [1.25, 1.25], max: 3, crop: true }
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

fs.mkdirSync(here('./figma-export-v4/'), { recursive: true });
const manifest = [];
for (const [set, { scenes, frame, fill, max, scale, crop }] of Object.entries(SETS)) for (const [name, build] of Object.entries(scenes)) {
  setScale(1); const { zoom = 1 } = build();
  const k = (scale || fitScale(build, frame, fill, max)) * zoom; setScale(k);
  const { s, title, acts = {}, shift = 0, hero, focus = [0, 0] } = build();
  let svg = s.toSVG({ frame, padding: 14, inline: true, acts, idPrefix: name, width: frame[0], height: frame[1], shift: (shift * k) / 2, crop, focus: focus.map((v) => v * k) });
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
  const file = `${set}-${name}.svg`; fs.writeFileSync(here(`./figma-export-v4/${file}`), svg);
  manifest.push({ set, scene: name, file, title, hero: hero || null, kb: +(svg.length / 1024).toFixed(1) });
}
fs.writeFileSync(here('./figma-export-v4/manifest.json'), JSON.stringify(manifest, null, 1));
console.log(manifest.length, 'files,', manifest.reduce((a, m) => a + m.kb, 0).toFixed(0), 'KB');
