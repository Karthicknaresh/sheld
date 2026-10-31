// Build the three V7-B (Thread of care) phone menus as HTML:  node build-mobile.mjs
//   insureshield-nav-m1.html (Story drawer) · -m2.html (Story cards) · -m3.html (Thread list)
// Uses the Option B story art (art/s7b, from build.mjs) and the momentum-sections page tokens.
import fs from 'node:fs';
const here = (f) => new URL(f, import.meta.url);
const SKILL = 'H:/VS Code/Updated Skill/unpacked/';
const cards = JSON.parse(fs.readFileSync(here('./concepts/v7-b.json'), 'utf8')).cards;
const SCENES = Object.fromEntries(cards.map((c) => [c.copy.title, c.scene]));
// page art: decorative (the row text carries the meaning) → strip the title, mark hidden, unique ids per scene
const art = cards.map((c) => { let s = fs.readFileSync(here(`./art/s7b/${c.scene}.svg`), 'utf8');
  s = s.replace(/<title>.*?<\/title>/, '').replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true" focusable="false"');
  return `<div data-n="${c.scene}">${s}</div>`; }).join('\n');
const momentum = fs.readFileSync(SKILL + 'momentum-sections/momentum-sections/assets/momentum.css', 'utf8');
const graphic = `:root{\n${fs.readFileSync(SKILL + 'momentum-iso-motion/momentum-iso-motion/assets/tokens.css', 'utf8').split('\n').filter((l) => /--m-graphic-/.test(l)).join('\n')}\n}`;
const old = fs.readFileSync(here('../design-files/nav03/insureshield-lattice-header.html'), 'utf8');
const logo = old.match(/<a class="logo"[\s\S]*?<\/a>/)[0];
const tpl = fs.readFileSync(here('./page-mobile.template.html'), 'utf8');
for (const [opt, name] of [['o1', 'Option 1 · Story drawer'], ['o2', 'Option 2 · Story cards'], ['o3', 'Option 3 · Thread list']]) {
  const html = tpl.replaceAll('@@OPT@@', opt).replace('@@TITLE@@', name).replace('/*@@MOMENTUM@@*/', momentum).replace('/*@@GRAPHIC@@*/', graphic)
    .replace('<!--@@LOGO@@-->', logo).replace('/*@@SCENES@@*/{}', JSON.stringify(SCENES)).replace('<!--@@ART@@-->', `<template data-art="s7b">\n${art}\n</template>`);
  fs.writeFileSync(here(`./insureshield-nav-m${opt[1]}.html`), html);
  console.log(`insureshield-nav-m${opt[1]}.html ${(html.length / 1024).toFixed(0)} KB`);
}
