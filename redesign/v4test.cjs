// Real-mouse test of the V4 pages: open each menu by hovering its trigger, move down into the panel,
// rest on each option, check state, screenshot one hovered state per menu. Reports console errors.
const { chromium } = require('playwright-core');
const path = require('path');
const BASE = 'file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-';
const OUT = path.join(__dirname, '..', 'v4shots');
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const page of (process.argv[2] || 'relief,doorstep,askfirst').split(',')) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(BASE + page + '.html'); await p.waitForTimeout(400);
    const report = [];
    for (const id of ['insurance', 'solutions', 'partners', 'resources', 'about']) {
      const t = await p.$(`.nav-t[data-id="${id}"]`); const bb = await t.boundingBox();
      await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 4 }); await p.waitForTimeout(500);
      const opts = await p.$$(`#dd-${id} [data-scene]:not(.ul-link), #dd-${id} .chip`);
      let ok = 0, n = 0;
      for (const [i, o] of opts.entries()) {
        const ob = await o.boundingBox(); if (!ob) continue; n++;
        await p.mouse.move(ob.x + Math.min(40, ob.width / 2), ob.y + ob.height / 2, { steps: 6 }); await p.waitForTimeout(page === 'relief' ? 1500 : 700);
        const st = await p.evaluate(([id, page]) => {
          const open = document.querySelector('#mega').classList.contains('open') && document.querySelector(`#dd-${id}`).classList.contains('in');
          if (page === 'relief') { const iso = document.querySelectorAll('.W .mom .iso'); const last = iso[iso.length - 1]; return open && last && last.dataset.phase === 'filled' && document.querySelector('.W .mom').classList.contains('relief'); }
          if (page === 'doorstep') { const a = document.querySelector(`#dd-${id} .fr.act`); return open && a && a.querySelector('.iso').dataset.phase === 'filled'; }
          return open && !!document.querySelector(`#dd-${id} .chip[aria-pressed="true"]`);
        }, [id, page]);
        if (st) ok++;
        if (i === Math.min(2, opts.length - 1)) await p.screenshot({ path: path.join(OUT, `${page}-${id}.png`), clip: { x: 0, y: 0, width: 1440, height: 640 } });
      }
      report.push(`${id} ${ok}/${n}`);
    }
    console.log(page, report.join(' · '), errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no errors');
    await p.close();
  }
  await b.close();
})();
