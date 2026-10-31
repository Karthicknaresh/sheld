// Builds the Figma plugin folder: embeds the exported vector illustrations and the logo.
const fs = require('fs');
const path = require('path');
const here = __dirname;
const out = path.join(here, 'InsureShield V2 Builder');
fs.mkdirSync(out, { recursive: true });

const data = fs.readFileSync(path.join(here, 'export.json'), 'utf8');
const logo = fs.readFileSync(path.join(here, '..', 'nav02', 'logo.b64.txt'), 'utf8').trim();
let code = fs.readFileSync(path.join(here, 'plugin-src.js'), 'utf8');
if (!code.includes('/*__DATA__*/null') || !code.includes("/*__LOGO__*/''")) throw new Error('placeholders missing');
code = code.replace('/*__DATA__*/null', () => data).replace("/*__LOGO__*/''", () => JSON.stringify(logo));
fs.writeFileSync(path.join(out, 'code.js'), code);

fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({
  name: 'InsureShield V2 Builder',
  id: 'insureshield-v2-builder-local',
  api: '1.0.0',
  main: 'code.js',
  editorType: ['figma'],
  documentAccess: 'dynamic-page',
  networkAccess: { allowedDomains: ['none'] }
}, null, 2));
console.log('built', path.join(out, 'code.js'), (code.length / 1024).toFixed(0) + ' KB');
