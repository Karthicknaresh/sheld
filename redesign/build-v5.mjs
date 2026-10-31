// Build V5 · Journey:  node build-v5.mjs
//   art/v5/<menu>.svg          one strip per menu (token colours, for code)
//   art/v5/<menu>.figma.svg    the same with hex colours (Figma import)
//   insureshield-nav-v5.html   the page (momentum-sections page tokens + momentum-iso-motion art)
// Strip geometry: 1248 × 144 (the Library Tile media slot across the tile matrix). Stop k is centred on
// tile k; the parcel starts 30 px in and parks 56 px left of the stop it travels to.
import fs from 'node:fs';
import { setScale, project } from './iso.js';
import { world, progress, MENU_STOPS } from './scenes-v5.mjs';

const here = (f) => new URL(f, import.meta.url);
const S = 2.4, W = 1248, HGT = 144, ROUTE_Y = 116;
const SKILL = 'H:/VS Code/Updated Skill/unpacked/';
const slug = (m) => m.toLowerCase().replace(/[^a-z]+/g, '-');

/** pull one balanced <g …>…</g> starting at index i */
function takeG(svg, i) { let depth = 0, j = i; const re = /<g\b|<\/g>/g; re.lastIndex = i;
  for (let m; (m = re.exec(svg));) { depth += m[0] === '</g>' ? -1 : 1; if (!depth) { j = m.index + 4; break; } } return [svg.slice(i, j), j]; }
const xsOf = (d) => [...d.matchAll(/(-?\d+\.?\d*)[ ,](-?\d+\.?\d*)/g)].map((m) => +m[1]);

export function strip(menu, { inline = false, title } = {}) {
  const keys = MENU_STOPS[menu], n = keys.length, pitch = W / n;
  setScale(S);
  const w = world(keys, pitch, S), [ox, oy] = project([0, 0, 0]);
  const minX = ox - pitch / 2, minY = oy - ROUTE_Y;
  let svg = w.s.toSVG({ acts: w.acts, idPrefix: 'v5-' + slug(menu), padding: 0, inline, title });
  const prog = progress(keys, pitch, S).toSVG({ padding: 0, inline });
  setScale(1);
  svg = svg.replace(/viewBox="[^"]+"/, `viewBox="${minX.toFixed(2)} ${minY.toFixed(2)} ${W} ${HGT}" preserveAspectRatio="xMidYMin meet" data-pitch="${pitch.toFixed(2)}" data-n="${n}"`);
  // the teal route: one path per dash, each tagged with its x (px from the strip's left edge)
  const dashes = [...prog.matchAll(/<path d="([^"]+)"[^>]*\/>/g)].map((m) => { const xs = xsOf(m[1]); const cx = (Math.min(...xs) + Math.max(...xs)) / 2 - minX; return m[0].replace('<path ', `<path data-x="${cx.toFixed(1)}" `); });
  svg = svg.replace('</g><g data-layer="10">', `<g data-progress="">${dashes.join('')}</g></g><g data-layer="10">`);
  // the parcel always paints on top of the stops (it rides in front of them): move it to the overlay layer
  const pi = svg.indexOf('<g data-object="parcel"'); const [pg, end] = takeG(svg, pi);
  svg = svg.slice(0, pi) + svg.slice(end);
  svg = svg.replace('<g data-layer="30">', `<g data-layer="30">${pg}`);
  // its hatch shadow goes last in the shadow layer so it never sits under a stop's plate
  const sm = svg.match(/<path [^>]*data-for="parcel"[^>]*\/>/);
  if (sm) svg = svg.replace(sm[0], '').replace('</g><g data-layer="20">', `${sm[0]}</g><g data-layer="20">`);
  return { svg, n, pitch };
}

// ---------------------------------------------------------------- art files
fs.mkdirSync(here('./art/v5/'), { recursive: true });
const ART = {};
for (const m of Object.keys(MENU_STOPS)) {
  ART[m] = strip(m).svg;
  fs.writeFileSync(here(`./art/v5/${slug(m)}.svg`), strip(m, { title: `${m}: a parcel's journey past ${MENU_STOPS[m].length} stops` }).svg);
  fs.writeFileSync(here(`./art/v5/${slug(m)}.figma.svg`), strip(m, { inline: true }).svg.replace('<svg ', `<svg width="${W}" height="${HGT}" `));
}

// ---------------------------------------------------------------- page
const cards = JSON.parse(fs.readFileSync(here('./concepts/v5-stops.json'), 'utf8')).cards;
const STATUS = Object.fromEntries(cards.map((c) => [c.copy.title, c.copy.status]));
const momentum = fs.readFileSync(SKILL + 'momentum-sections/momentum-sections/assets/momentum.css', 'utf8');
const graphic = fs.readFileSync(SKILL + 'momentum-iso-motion/momentum-iso-motion/assets/tokens.css', 'utf8').split('\n').filter((l) => /--m-graphic-/.test(l)).join('\n');
const motion = fs.readFileSync(here('./motion.css'), 'utf8');
const old = fs.readFileSync(here('../design-files/nav03/insureshield-lattice-header.html'), 'utf8');
const logo = old.match(/<a class="logo"[\s\S]*?<\/a>/)[0];
const art = `<template data-art="v5">\n${Object.entries(ART).map(([m, s]) => `<div data-n="${m}">${s}</div>`).join('\n')}\n</template>`;
const page = fs.readFileSync(here('./page-v5.template.html'), 'utf8')
  .replace('/*@@MOMENTUM@@*/', momentum).replace('/*@@GRAPHIC@@*/', `:root{\n${graphic}\n}`).replace('/*@@MOTION@@*/', motion)
  .replace('<!--@@LOGO@@-->', logo).replace('/*@@STATUS@@*/{}', JSON.stringify(STATUS)).replace('<!--@@ART@@-->', art);
fs.writeFileSync(here('./insureshield-nav-v5.html'), page);
console.log(`V5: ${Object.keys(ART).length} strips · page ${(page.length / 1024).toFixed(0)} KB`);
