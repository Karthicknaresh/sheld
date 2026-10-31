// V7 real-mouse test: open each menu, rest on each option, capture the left story panel (caption + stage) at 3 moments.
const { chromium } = require('playwright-core');
(async () => {
  const [page, out] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-${page}.html`); await p.waitForTimeout(300);
  let n = 0, ok = 0;
  for (const id of ['insurance', 'solutions', 'partners', 'resources', 'about']) {
    const t = await (await p.$(`.nav-t[data-id="${id}"]`)).boundingBox(); await p.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 3 }); await p.waitForTimeout(400);
    const rows = await p.$$(`#dd-${id} .it`);
    for (let i = 0; i < rows.length; i++) { const bb = await rows[i].boundingBox(); await p.mouse.move(bb.x + 40, bb.y + bb.height / 2, { steps: 6 }); n++;
      const col = await (await p.$('.mega .ctr > div:first-child')).boundingBox();
      for (const [ms, tag] of [[650, '1'], [450, '2'], [900, '3']]) { await p.waitForTimeout(ms); await p.screenshot({ path: `${out}/${page}-${id}-${i}-${tag}.png`, clip: { x: col.x - 2, y: col.y - 2, width: col.width + 4, height: col.height + 4 } }); }
      const st = await p.evaluate((t) => { const isos = document.querySelectorAll('.mega .stage .iso'); const el = isos[isos.length - 1]; return el && el.dataset.phase === 'filled' && document.querySelector('.mega .cap-t').textContent === t; }, await rows[i].getAttribute('data-t'));
      if (st) ok++; }
  }
  console.log(page, `${ok}/${n} options told their story`, errs.length ? 'ERR ' + errs.join(' | ') : 'no errors'); await b.close();
})();
