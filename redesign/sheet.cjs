// contact sheet: node sheet.cjs <dir> <prefix> <out.png> — rows = options, cols = moments 1-3 (rendered via an HTML page)
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright-core');
(async () => {
  const [dir, prefix, out] = process.argv.slice(2);
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(prefix + '-')).sort();
  const keys = [...new Set(files.map((f) => f.replace(/-\d\.png$/, '')))];
  const html = `<body style="margin:0;background:#fff;font:11px sans-serif"><div style="display:grid;grid-template-columns:repeat(6,auto);gap:4px">${keys.map((k) => [1, 2, 3].map((i) => `<img src="file:///${path.join(dir, `${k}-${i}.png`).replace(/\\/g, '/')}" style="width:200px">`).join('')).join('')}</div></body>`;
  const tmp = path.join(dir, '_sheet.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1240, height: 800 } });
  await p.goto('file:///' + tmp.replace(/\\/g, '/')); await p.waitForTimeout(500); await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
