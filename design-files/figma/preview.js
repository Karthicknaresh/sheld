const fs = require('fs');
const [, , src, dst, from = '0', to = '10'] = process.argv;
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
let h = '<body style="margin:0;font:11px sans-serif"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">';
for (const k of Object.keys(j.scenes).slice(+from, +to)) {
  for (const st of ['Outline', 'Drawn', 'Filled']) {
    h += `<div style="border:1px solid #eee"><div>${k} ${st}</div><img style="width:100%;display:block" src="data:image/svg+xml,${encodeURIComponent(j.scenes[k][st])}"></div>`;
  }
}
h += '</div>';
fs.writeFileSync(dst, h);
